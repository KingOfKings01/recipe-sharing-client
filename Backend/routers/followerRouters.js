import express from 'express';
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} from '../controllers/followerControllers.js';
import { authorization } from '../middlewares/auth.js';

const router = express.Router();

// Follow a user
router.post('/follow', authorization, followUser);

// Unfollow a user
router.post('/unfollow', authorization, unfollowUser);

// Get followers of a user
router.get('/:userId/followers', authorization, getFollowers);

// Get users a user is following
router.get('/:userId/following', authorization, getFollowing);

export default router;
