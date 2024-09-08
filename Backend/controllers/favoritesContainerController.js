import FavoritesContainer from "../models/FavoritesContainer.js";
import FavoritesRecipes from '../models/FavoritesRecipes.js';
import Recipe from '../models/Recipe.js';

// Create a new favorites container
export const createContainer = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id; // Assuming user info is extracted from the token

    const newContainer = await FavoritesContainer.create({
      name,
      userId,
    });

    res.status(201).json(newContainer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all containers for the current user
export const getContainers = async (req, res) => {
  try {
    const userId = req.user.id;
    const containers = await FavoritesContainer.findAll({
      where: { userId },
      attributes: ["id", "name"],
      include: [
        {
          model: FavoritesRecipes,
          as: 'recipes', // Alias used in hasMany association
          attributes: ["id"], // Exclude all columns from FavoritesRecipes itself
          include: [
            {
              model: Recipe,
              attributes: ['id', 'title'], // Specify the columns to be retrieved from Recipe
            },
          ],
        },
      ],
    });
    res.status(200).json(containers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a container
export const deleteContainer = async (req, res) => {
  try {
    const { containerId } = req.params;
    const userId = req.user.id;

    const container = await FavoritesContainer.findOne({
      where: { id: containerId, userId },
    });
    if (!container) {
      return res.status(404).json({ message: "Container not found" });
    }

    await container.destroy();
    res.status(200).json({ message: "Container deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
