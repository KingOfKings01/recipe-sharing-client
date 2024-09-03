import { useEffect, useState } from 'react';
import { getRecipes } from '../API/recipeApis';

export default function Home() {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await getRecipes();
                setRecipes(response);
            } catch (err) {
                console.error('Error fetching recipes:', err);
            }
        };

        fetchRecipes();
    }, []);

    return (
        <div>
            <h1>Recipes</h1>
            {recipes?.length > 0 ? (
                <ul>
                    {recipes.map((recipe) => (
                        <li key={recipe.id}>
                            <h2>{recipe.title}</h2>
                            <img src={recipe.imageUrl} alt={recipe.title} style={{ width: '100px', height: '100px' }} />
                            <p><strong>Ingredients:</strong> {recipe.ingredients.split('\n').slice(0, 2).join(', ')}...</p>
                            <p><strong>Cooking Time:</strong> {recipe.cookingTime}</p>
                            <p><strong>Servings:</strong> {recipe.servings}</p>
                            <p><strong>Difficulty Level:</strong> {recipe.difficultyLevel}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No recipes found.</p>
            )}
        </div>
    );
}
