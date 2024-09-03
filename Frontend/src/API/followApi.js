import axios from 'axios';

// Base API URL for followers
const API_URL = `${import.meta.env.VITE_API}/followers`;

// Follow a user
export async function followUser(followingId) {
  try {
    const response = await axios.post(`${API_URL}/follow`, { followingId }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Pass the token
      },
    });
    return response.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message ||
      'Something went wrong while following the user. Please try again later.'
    );
  }
}

// Unfollow a user
export async function unfollowUser(followingId) {
  try {
    const response = await axios.post(`${API_URL}/unfollow`, { followingId }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Pass the token
      },
    });
    return response.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message ||
      'Something went wrong while unfollowing the user. Please try again later.'
    );
  }
}

// Get followers of a user
export async function getFollowers() {
  try {
    const response = await axios.get(`${API_URL}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Pass the token
      },
    });
    return response.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message ||
      'Something went wrong while fetching followers. Please try again later.'
    );
  }
}

// Get users a user is following
export async function getFollowing() {
  try {
    const response = await axios.get(`${API_URL}/following`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Pass the token
      },
    });
    return response.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message ||
      'Something went wrong while fetching following users. Please try again later.'
    );
  }
}