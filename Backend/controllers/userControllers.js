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
