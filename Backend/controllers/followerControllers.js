import Follower from '../models/Follower.js';
import User from '../models/User.js';

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
      return res.status(400).json({ message: "You are already following this user" });
    }

    await Follower.create({ followerId, followingId });
    res.status(201).json({ message: "Successfully followed the user" });
  } catch (error) {
    res.status(500).json({ message: "Error following user", error: error.message });
  }
};

// Unfollow a user
export const unfollowUser = async (req, res) => {
  try {
    const { followingId } = req.body;
    const followerId = req.user.id;

    // Ensure the followingId is provided
    if (!followingId) {
      return res.status(400).json({ message: "followingId is required to unfollow a user" });
    }

    // Check if the relationship exists before attempting to delete
    const followRecord = await Follower.findOne({ where: { followerId, followingId } });

    if (!followRecord) {
      return res.status(404).json({ message: "Follow relationship not found" });
    }

    // If the relationship exists, delete it
    await Follower.destroy({ where: { followerId, followingId } });
    
    res.status(200).json({ message: "Successfully unfollowed the user" });
  } catch (error) {
    res.status(500).json({ message: "Error unfollowing user", error: error.message });
  }
};


// Get followers of a user
export const getFollowers = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch the users who are following the current user
    const followers = await User.findAll({
      include: [{
        model: User,
        as: 'Following',
        through: {
          attributes: [], // Don't include junction table data in the response
          where: { followingId: userId },
        },
        attributes: ['id', 'name', 'email'],
      }],
    });

    res.status(200).json(followers);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching followers" });
  }
};


// Get users a user is following
export const getFollowing = async (req, res) => {
  try {
    const userId = req.user.id;

    const following = await User.findAll({
      include: [{
        model: User,
        as: 'Following',
        through: {
          where: { followerId: userId },
        },
        attributes: ['id', 'name', 'email'],
      }],
    });

    res.status(200).json(following);
  } catch (error) {
    res.status(500).json({ message: "Error fetching following users", error: error.message });
  }
};
