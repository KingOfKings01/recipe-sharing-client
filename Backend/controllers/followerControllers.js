import Follower from '../models/Follower.js';
import User from '../models/User.js';

// Follow a user
export const followUser = async (req, res) => {
  try {
    const { followingId } = req.body;
    const followerId = req.user.id; // Assuming `req.user` contains the authenticated user's ID

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

    await Follower.destroy({ where: { followerId, followingId } });
    res.status(200).json({ message: "Successfully unfollowed the user" });
  } catch (error) {
    res.status(500).json({ message: "Error unfollowing user", error: error.message });
  }
};

// Get followers of a user
export const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;

    const followers = await Follower.findAll({
      where: { followingId: userId },
      include: {
        model: User,
        as: 'Followers',
        attributes: ['id', 'name', 'email'],
      },
    });

    res.status(200).json(followers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching followers", error: error.message });
  }
};

// Get users a user is following
export const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;

    const following = await Follower.findAll({
      where: { followerId: userId },
      include: {
        model: User,
        as: 'Following',
        attributes: ['id', 'name', 'email'],
      },
    });

    res.status(200).json(following);
  } catch (error) {
    res.status(500).json({ message: "Error fetching following users", error: error.message });
  }
};
