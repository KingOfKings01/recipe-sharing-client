import { useEffect, useState } from 'react';
import {
  getContainers,
  deleteContainer,
  removeRecipeFromFavorites,
  getRecipesFromContainer
} from '../API/favoritesApi';

import { getFollowers, getFollowing, unfollowUser } from '../API/followApi';
import { getRecipesOfUser, deleteRecipe } from '../API/recipeApis';
import RecipeForm from '../components/RecipeFrom'; // Import RecipeForm component

export default function Profile() {
  const [containers, setContainers] = useState([]);
  const [selectedContainer, setSelectedContainer] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]); // State for user's created recipes
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showRecipeForm, setShowRecipeForm] = useState(false); // State for controlling popup
  const [isEdit, setIsEdit] = useState(false); // State for editing a recipe
  const [preInitialValues, setPreInitialValues] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const containersData = await getContainers();
        setContainers(containersData);

        const followersData = await getFollowers();
        setFollowers(followersData);

        const followingData = await getFollowing();
        setFollowing(followingData);

        const userRecipesData = await getRecipesOfUser(); // Fetch user's created recipes
        setUserRecipes(userRecipesData);
      } catch (error) {
        console.error(error.message);
      }
    }
    fetchData();
  }, []);

  const handleDeleteContainer = async (containerId) => {
    try {
      await deleteContainer(containerId);
      const containersData = await getContainers();
      setContainers(containersData);
      setSelectedContainer(null);
      setRecipes([]);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSelectContainer = async (containerId) => {
    setSelectedContainer(containerId);
    try {
      const data = await getRecipesFromContainer(containerId);
      setRecipes(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleRemoveRecipe = async (recipeId) => {
    if (!selectedContainer) return;
    try {
      await removeRecipeFromFavorites(selectedContainer, recipeId);
      alert('Recipe removed successfully');
      const data = await getRecipesFromContainer(selectedContainer);
      setRecipes(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleUnfollowUser = async (userId) => {
    try {
      await unfollowUser(userId);
      alert('User unfollowed successfully');
      const followingData = await getFollowing();
      setFollowing(followingData);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      await deleteRecipe(recipeId);
      alert('Recipe deleted successfully');
      // Filter out the deleted recipe from the state
      const updatedRecipes = userRecipes.filter(recipe => recipe.id !== recipeId);
      setUserRecipes(updatedRecipes);
    } catch (error) {
      console.error(error.message);
    }
  };
  

  const openRecipeForm = () => {
    setIsEdit(null); // Reset edit recipe ID if any
    setShowRecipeForm(true); // Show the popup
  };

  const closeRecipeForm = () => {
    setShowRecipeForm(false); // Hide the popup
  };

  return (
    <div>
      <h1>Profile</h1>

      <div>
        <h2>Favorites Containers</h2>
        <ul>
          {containers.map((container, index) => (
            <li key={index}>
              {container.name}
              <button onClick={() => handleSelectContainer(container.id)}>View Recipes</button>
              <button onClick={() => handleDeleteContainer(container.id)}>Delete Container</button>
            </li>
          ))}
        </ul>
      </div>

      {selectedContainer && (
        <div>
          <h2>Recipes in Container</h2>
          <ul>
            {recipes.map((recipe, index) => (
              <li key={index}>
                <span>{recipe.name}</span>
                <button onClick={() => handleRemoveRecipe(recipe.id)}>Remove</button>
                {/* Optional: Add Edit button if you want to edit recipes */}
                <button onClick={() => {
                  setIsEdit();
                  setShowRecipeForm(true);
                }}>Edit</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h2>Followers</h2>
        <ul>
          {followers.map((follower, index) => (
            <li key={index}>
              {follower.name}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Following</h2>
        <ul>
          {following.map((user, index) => (
            <li key={index}>
              {user.name}
              <button onClick={() => handleUnfollowUser(user.id)}>Unfollow</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Table */}
      <div>
        <h2>User's Posted Recipes</h2>
        <button onClick={openRecipeForm}>Post new Recipe</button> {/* Button to open the popup */}

        {showRecipeForm && (
          <div className="modal">
            <div className="modal-content">
              <span className="close-button" onClick={closeRecipeForm}>&times;</span>
              <RecipeForm isEdit={isEdit} preInitialValues={preInitialValues} setPreInitialValues={setPreInitialValues} /> {/* Pass `recipeId` if editing */}
            </div>
          </div>
        )}
        <table border="1" cellSpacing="0" cellPadding="8">
          <thead>
            <tr>
              <th>Title</th>
              {/* <th>Image URL</th>
              <th>Ingredients</th>
              <th>Instructions</th> */}
              <th>Dietary Preference</th>
              <th>Cooking Time</th>
              <th>Servings</th>
              <th>Categories</th>
              <th>Difficulty Level</th>
              <th>Average Rating</th>
              <th>Number of Feedbacks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userRecipes.map((recipe, index) => (
              <tr key={index}>
                <td>{recipe.title}</td>
                <td>{recipe.dietaryPreference}</td>
                <td>{recipe.cookingTime}</td>
                <td>{recipe.servings}</td>
                <td>{recipe.categories}</td>
                <td>{recipe.difficultyLevel}</td>
                <td>{recipe.averageRating}</td>
                <td>{recipe.numberOfFeedbacks}</td>
                <td>
                  <button onClick={() => {
                    setIsEdit(true);
                    setPreInitialValues(recipe)
                    setShowRecipeForm(true);
                  }}>Edit</button>
                  <button onClick={() => handleDeleteRecipe(recipe.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add some CSS for modal popup */}
      <style jsx>{`
        .modal {
          display: flex;
          justify-content: center;
          align-items: center;
          position: fixed;
          z-index: 1;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          overflow: auto;
          background-color: rgba(0, 0, 0, 0.4);
        }
        .modal-content {
          background-color: #fff;
          color: #000;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          width: 80%;
          max-width: 500px;
        }
        .close-button {
          color: #aaa;
          float: right;
          font-size: 28px;
          font-weight: bold;
          cursor: pointer;
        }
        .close-button:hover,
        .close-button:focus {
          color: black;
          text-decoration: none;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
