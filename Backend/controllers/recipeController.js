import { Op } from "sequelize";
import Recipe from "../models/Recipe.js";

// Create a new recipe
export const createRecipe = async (req, res) => {
  try {
    const userId = req.user.id
    const data = req.body
    // const recipe = await Recipe.create(data);
    // res.status(201).json(recipe);
    res.status(201).json({...data, id : userId});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all recipes
export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.findAll();
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single recipe by ID
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);

    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a recipe
export const updateRecipe = async (req, res) => {
  try {
    const [updated] = await Recipe.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) return res.status(404).json({ message: "Recipe not found" });

    res.status(200).json({ message: "Recipe updated" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a recipe
export const deleteRecipe = async (req, res) => {
  try {
    const deleted = await Recipe.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) return res.status(404).json({ message: "Recipe not found" });

    res.status(204).json({ message: "Recipe deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Browse and Search Recipes with Filters
export const browseAndSearchRecipes = async (req, res) => {
  try {
    const { dietaryPreference, difficultyLevel, maxPreparationTime, searchTerm } = req.query;

    // Build the query filters dynamically based on the request parameters
    let filters = {};

    if (dietaryPreference) {
      filters.dietaryPreference = dietaryPreference;
    }

    if (difficultyLevel) {
      filters.difficultyLevel = difficultyLevel;
    }

    if (maxPreparationTime) {
      filters.preparationTime = {
        [Op.lte]: parseInt(maxPreparationTime, 10), // Less than or equal to maxPreparationTime
      };
    }

    if (searchTerm) {
      filters.title = {
        [Op.like]: `%${searchTerm}%`, // Search for the term in the title
      };
    }

    // Fetch the recipes based on the filters
    const recipes = await Recipe.findAll({
      where: filters,
    });

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipes', error: error.message });
  }
};