import FavoritesRecipes from '../models/FavoritesRecipes.js';
import Recipe from '../models/Recipe.js';

// Add a recipe to a favorites container
export const addRecipeToFavorites = async (req, res) => {
  try {
    const { containerId, recipeId } = req.body;
    const userId = req.user.id;

    // Validate if the recipe belongs to the user
    const recipe = await Recipe.findOne({ where: { id: recipeId, userId } });
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    const newFavorite = await FavoritesRecipes.create({
      containerId,
      recipeId,
    });

    res.status(201).json(newFavorite);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all recipes from a specific favorites container
export const getRecipesFromContainer = async (req, res) => {
  try {
    const { containerId } = req.params;
    const recipes = await FavoritesRecipes.findAll({
      where: { containerId },
      include: [
        {
          model: Recipe,
          attributes: ['id', 'title'], // Only include the id and name of the recipes
        },
      ],
    });

    // Map the response to only return the recipe id and name
    const simplifiedRecipes = recipes.map((recipe) => {
      return {
        id: recipe.Recipe.id,
        name: recipe.Recipe.title,
      };
    });

    res.status(200).json(simplifiedRecipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Remove a recipe from a favorites container
export const removeRecipeFromFavorites = async (req, res) => {
  try {
    const { containerId, recipeId } = req.params;
    const userId = req.user.id;

    const favorite = await FavoritesRecipes.findOne({ where: { containerId, recipeId } });
    if (!favorite) {
      return res.status(404).json({ message: "Favorite recipe not found" });
    }

    await favorite.destroy();
    res.status(200).json({ message: "Recipe removed from favorites" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
