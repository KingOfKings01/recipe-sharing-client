import { Op } from "sequelize";
import AWSService from "../services/awsService.js";
import User from '../models/User.js';
import Recipe from "../models/Recipe.js";
import Follower from '../models/Follower.js';

export const getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    const data = {name: user.name,email: user.email}
    res.status(201).json(data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const getUserRecipes = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have the user ID from authentication middleware

    // Fetch all recipes created by the specific user
    const recipes = await Recipe.findAll({
      where: {
        userId: userId, // Filter recipes by the userId
      },
    });

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
