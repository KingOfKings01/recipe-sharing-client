import Follower from "../models/Follower.js";
import Recipe from "../models/Recipe.js";
import User from "../models/User.js";

// Follow a user
export const followUser = async (req, res) => {
  try {
    const { followingId } = req.body;
    const followerId = req.user.id;

    if (followerId === followingId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    // Check if already following
    const alreadyFollowing = await Follower.findOne({
      where: { followerId, followingId },
    });

    if (alreadyFollowing) {
      return res
        .status(400)
        .json({ message: "You are already following this user" });
    }

    await Follower.create({ followerId, followingId });
    res.status(201).json({ message: "Successfully followed the user" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error following user", error: error.message });
  }
};

// Unfollow a user
export const unfollowUser = async (req, res) => {
  try {
    const { followingId } = req.body;
    const followerId = req.user.id;

    // Ensure the followingId is provided
    if (!followingId) {
      return res
        .status(400)
        .json({ message: "followingId is required to unfollow a user" });
    }

    // Check if the relationship exists before attempting to delete
    const followRecord = await Follower.findOne({
      where: { followerId, followingId },
    });

    if (!followRecord) {
      return res.status(404).json({ message: "Follow relationship not found" });
    }

    // If the relationship exists, delete it
    await Follower.destroy({ where: { followerId, followingId } });

    res.status(200).json({ message: "Successfully unfollowed the user" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error unfollowing user", error: error.message });
  }
};

// Get followers of a user
export const getFollowers = async (req, res) => {
  try {
    const userId = req.user.id;

    const followers = await Follower.findAll({
      where: { followingId: userId },
      attributes: ["followerId"],
    });


    // Use Promise.all to handle async operations
    const followersName = await Promise.all(
      followers.map(async (user) => {
        const followerId = user.dataValues.followerId;
        const followerUser = await User.findByPk(followerId, {
          attributes: ["name"],
        });
        return followerUser ? followerUser.name : null;
      })
    );


    res.status(200).json(followersName);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching followers" });
  }
};

// Get users a user is following
export const getFollowing = async (req, res) => {
  try {
    const userId = req.user.id;

    const followers = await Follower.findAll({
      where: { followerId: userId },
      attributes: ["followingId"],
    });
    
    // Use Promise.all to handle async operations
    const followersName = await Promise.all(
      followers.map(async (user) => {
        const followingId = user.dataValues.followingId;
        const followerUser = await User.findByPk(followingId, {
          attributes: ["id","name"],
          include: {
            model: Recipe,
            attributes: ['id', 'title'],
          }
        });
        return followerUser
      })
    );

    res.status(200).json(followersName);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching following users",
      error: error.message,
    });
  }
};
