import { useEffect, useState } from 'react';
import {
  getContainers,
  deleteContainer,
  removeRecipeFromFavorites,
  getRecipesFromContainer,
} from '../API/favoritesApi';
import {
  getFollowers,
  getFollowing,
  unfollowUser,
} from '../API/followApi';
import { getRecipesOfUser } from '../API/recipeApis';

export default function Profile() {
  const [containers, setContainers] = useState([]);
  const [selectedContainer, setSelectedContainer] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]); // State for user's created recipes
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    // Fetch favorite containers, followers, following, and user's created recipes when the component mounts
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
      // Refresh the containers list
      const containersData = await getContainers();
      setContainers(containersData);
      setSelectedContainer(null); // Deselect container if it was deleted
      setRecipes([]); // Clear recipes if container was deleted
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
      // Refresh the recipes list
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
      // Refresh the following list
      const followingData = await getFollowing();
      setFollowing(followingData);
    } catch (error) {
      console.error(error.message);
    }
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
              <button onClick={() => handleSelectContainer(container.id)}>
                View Recipes
              </button>
              <button onClick={() => handleDeleteContainer(container.id)}>
                Delete Container
              </button>
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
                <button onClick={() => handleRemoveRecipe(recipe.id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h2>Followers</h2>
        <ul>
          {followers.map((follower, index) => (
            <li key={index}>{follower.name}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Following</h2>
        <ul>
          {following.map((user, index) => (
            <li key={index}>
              {user.name}
              <button onClick={() => handleUnfollowUser(user.id)}>
                Unfollow
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>User's Created Recipes</h2>
        <table border="1" cellSpacing="0" cellPadding="8">
          <thead>
            <tr>
              <th>Title</th>
              <th>Cooking Time</th>
              <th>Servings</th>
              <th>Difficulty Level</th>
              <th>Average Rating</th>
              <th>Number of Feedbacks</th>
            </tr>
          </thead>
          <tbody>
            {userRecipes.map((recipe, index) => (
              <tr key={index}>
                <td>{recipe.title}</td>
                <td>{recipe.cookingTime}</td>
                <td>{recipe.servings}</td>
                <td>{recipe.difficultyLevel}</td>
                <td>{recipe.averageRating}</td>
                <td>{recipe.numberOfFeedbacks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
