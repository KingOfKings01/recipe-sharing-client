import { useEffect, useState } from 'react';
import {
  getContainers,
  deleteContainer,
  removeRecipeFromFavorites,
  getRecipesFromContainer
} from '../API/favoritesApi';

export default function Profile() {
  const [containers, setContainers] = useState([]);
  const [selectedContainer, setSelectedContainer] = useState(null);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    // Fetch the favorite containers when the component mounts
    async function fetchContainers() {
      try {
        const data = await getContainers();
        setContainers(data);
      } catch (error) {
        console.error(error.message);
      }
    }
    fetchContainers();
  }, []);

  const handleDeleteContainer = async (containerId) => {
    try {
      await deleteContainer(containerId);
      // Refresh the containers list
      const data = await getContainers();
      setContainers(data);
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
      console.log(selectedContainer)
      
      await removeRecipeFromFavorites(selectedContainer, recipeId);
      alert("Recipe removed successfully")
      // Refresh the recipes list
      const data = await getRecipesFromContainer(selectedContainer);
      console.log(data);
      setRecipes(data);
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
            {recipes.map((recipe,index) => (
              <>
              
              <li key={index}><span> {recipe.name} </span> <button onClick={() => handleRemoveRecipe(recipe.id)}>Remove</button></li> 
              </>
            ))}
          </ul>
         
          
        </div>
      )}
    </div>
  );
}
