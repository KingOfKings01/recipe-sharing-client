import axios from 'axios';

// Base API URLs
const FAVORITES_CONTAINER_API_URL = `${import.meta.env.VITE_API}/favorites/containers`;
const FAVORITES_RECIPES_API_URL = `${import.meta.env.VITE_API}/favorites/recipes`;

// Function to create a new favorites container
export async function createContainer(data) {
  try {
    const response = await axios.post(`${FAVORITES_CONTAINER_API_URL}/create`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Pass the token
      },
    });
    return response.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message ||
      'Something went wrong while creating the container. Please try again later.'
    );
  }
}

// Function to get all containers for the current user
export async function getContainers() {
  try {
    const response = await axios.get(FAVORITES_CONTAINER_API_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Pass the token
      },
    });
    return response.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message ||
      'Something went wrong while fetching containers. Please try again later.'
    );
  }
}

// Function to delete a container
export async function deleteContainer(containerId) {
  try {
    const response = await axios.delete(`${FAVORITES_CONTAINER_API_URL}/${containerId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Pass the token
      },
    });
    return response.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message ||
      'Something went wrong while deleting the container. Please try again later.'
    );
  }
}

// Function to add a recipe to a favorites container
export async function addRecipeToFavorites(data) {
  try {
    const response = await axios.post(`${FAVORITES_RECIPES_API_URL}/add`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Pass the token
      },
    });
    return response.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message ||
      'Something went wrong while adding the recipe to favorites. Please try again later.'
    );
  }
}

// Function to get all recipes from a specific container
export async function getRecipesFromContainer(containerId) {
  try {
    const response = await axios.get(`${FAVORITES_RECIPES_API_URL}/${containerId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Pass the token
      },
    });
    return response.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message ||
      'Something went wrong while fetching the recipes. Please try again later.'
    );
  }
}

// Function to remove a recipe from a favorites container
export async function removeRecipeFromFavorites(containerId, recipeId) {
  try {
    const response = await axios.delete(`${FAVORITES_RECIPES_API_URL}/${containerId}/${recipeId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Pass the token
      },
    });
    return response.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message ||
      'Something went wrong while removing the recipe from favorites. Please try again later.'
    );
  }
}
