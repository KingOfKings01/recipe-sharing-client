import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { deleteContainer, getContainers, removeRecipeFromFavorites } from "../API/favoritesApi";
import "../favList.css"

export default function MyFavoritesRecipes() {
    const [containers, setContainers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Function to fetch containers
    const fetchContainers = async () => {
        try {
            setLoading(true);
            const data = await getContainers(); // Fetch all containers
            setContainers(data);
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch all containers on component mount
        fetchContainers();
    }, []);

    async function handleDeleteContainer(containerId) {
        try {
            await deleteContainer(containerId);
            alert('Container Deleted Successfully');
            fetchContainers(); // Refresh containers after deletion
        } catch (err) {
            console.log(err.message);
            alert('Failed to delete container');
        }
    }

    async function handleRemove(containerId, recipeId) {
        try {
            await removeRecipeFromFavorites(containerId, recipeId);
            alert('Recipe Removed Successfully');
            fetchContainers(); // Refresh containers after removing a recipe
        } catch (err) {
            console.log(err.message);
            alert('Failed to remove recipe');
        }
    }

    return (
        <div className="container">
            <h2>MyFavoritesRecipes</h2>
            {loading && <p>Loading...</p>}
            {containers.length > 0 && (
                <div>
                    {containers.map((container, index) => (
                        <div key={container.id}>
                            <div className="fav-containers">
                                <p>{index + 1}. {container.name}</p>
                                <button className="delete-btn" onClick={() => handleDeleteContainer(container.id)}>
                                    Delete
                                </button>
                            </div>
                            <div>
                                {container.recipes.length > 0 ? container.recipes.map((recipe, index) => (
                                    <div className="fav-list" key={recipe.Recipe.id}>
                                        <p>{index+1}. <Link to={`/recipe/${recipe.Recipe.id}`}>{recipe.Recipe.title}</Link></p>
                                        <button className="remove-btn" onClick={() => handleRemove(container.id, recipe.Recipe.id)}>
                                            Remove
                                        </button>
                                    </div>
                                )) : (
                                    <div>No recipes</div>
                                )}
                            </div>
                            <hr />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
