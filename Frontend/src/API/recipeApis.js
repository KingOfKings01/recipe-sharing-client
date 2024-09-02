import axios from 'axios';

// Base API URL
const API_URL = `${import.meta.env.VITE_API}/recipes`;

// Function to create a new recipe
export async function createRecipe(data) {
  try {
    const response = await axios.post(API_URL, data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Pass the token
      },
    });
    return response.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message ||
      'Something went wrong while creating the recipe. Please try again later.'
    );
  }
}

// Function to get all recipes
export async function getRecipes() {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Pass the token
      },
    });
    return response.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message ||
      'Something went wrong while fetching recipes. Please try again later.'
    );
  }
}

// Function to get a single recipe by ID
export async function getRecipeById(id) {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Pass the token
      },
    });
    return response.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message ||
      `Something went wrong while fetching the recipe. Please try again later.`
    );
  }
}

// Function to browse and search recipes with filters
export async function browseAndSearchRecipes(filters) {
    try {
      const response = await axios.get(`${API_URL}/search`, {
        params: filters, // Pass the filters as query parameters
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Pass the token
        },
      });
      return response.data;
    } catch (err) {
      throw new Error(
        err?.response?.data?.message ||
        'Something went wrong while fetching recipes. Please try again later.'
      );
    }
  }

// Function to update a recipe by ID
export async function updateRecipe(id, data) {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Pass the token
      },
    });
    return response.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message ||
      'Something went wrong while updating the recipe. Please try again later.'
    );
  }
}

// Function to delete a recipe by ID
export async function deleteRecipe(id) {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Pass the token
      },
    });
    return response.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message ||
      'Something went wrong while deleting the recipe. Please try again later.'
    );
  }
}
