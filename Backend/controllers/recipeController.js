import { Op } from "sequelize";
import AWSService from "../services/awsService.js";
import Recipe from "../models/Recipe.js";
import User from '../models/User.js';
import Follower from '../models/Follower.js';

export const createRecipe = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      title,
      imageUrl,
      ingredients,
      instructions,
      dietaryPreference,
      cookingTime,
      servings,
      categories,
      preparationTime,
      difficultyLevel,
    } = req.body;

    // Include the image URL in the recipe data if it exists in req
    const recipeData = {
      title,
      imageUrl,
      ingredients,
      instructions,
      dietaryPreference,
      cookingTime,
      servings,
      categories,
      preparationTime,
      difficultyLevel,
      averageRating:0,
      userId, // Set user ID
    };

    console.log(recipeData);

    // Create the recipe in the database
    const recipe = await Recipe.create(recipeData);

    // Respond with the created recipe
    res.status(201).json(recipe);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const uploadImage = async (req, res) => {
  try {
    const userId = req.user.id;

    // Ensure file is present in req.file
    if (!req.file) {
      return res.status(404).json({ message: "No file uploaded." });
    }

    const { originalname, mimetype, buffer } = req.file;
    const key = `${userId}${Date.now()}-${originalname}`;
    console.log(key, buffer, mimetype);

    const awsService = new AWSService();
    const uploadResult = await awsService.uploadToS3(key, buffer, mimetype);
    return res.status(200).json({ url: uploadResult.Location });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Internal Server Error - Error uploading file" });
  }
};

export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.findAll({
      include: {
        model: User,
        attributes: ['name'],
      }
    });


    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single recipe by ID
export const getRecipeById = async (req, res) => {
  try {
    const userId = req.user.id; // Current user ID

    // Fetch the recipe along with the associated user
    const recipe = await Recipe.findByPk(req.params.id, {
      include: {
        model: User,
        attributes: ['id', 'name'],
      }
    });

    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    let isFollowing = null;

    // Check if the current user is following the user associated with the recipe, only if they are different users
    if (recipe.userId !== userId) {
      const followingRecord = await Follower.findOne({
        where: {
          followingId: recipe.userId,
          followerId: userId
        }
      });
      isFollowing = !!followingRecord; // Convert result to boolean
    }

    const responseData = {
      ...recipe.toJSON(),
      isFollowing // Include the following status in the response
    };

    res.status(200).json(responseData);
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
    const {
      dietaryPreference,
      difficultyLevel,
      maxPreparationTime,
      searchTerm,
    } = req.query;

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
    res
      .status(500)
      .json({ message: "Error fetching recipes", error: error.message });
  }
};
