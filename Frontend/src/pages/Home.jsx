import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { getRecipes } from '../API/recipeApis';

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getRecipes();
        setRecipes(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Recipes</h1>
            {recipes?.length > 0 ? (
                <ul>
                    {recipes.map((recipe) => (
                        <li key={recipe.id}>
                            <Link to={`/recipe/${recipe.id}`}>
                            <h2>{recipe.title}</h2>
                            <img src={recipe.imageUrl} alt={recipe.title} style={{ width: '100px', height: '100px' }} />
                            <p><strong>Ingredients:</strong> {recipe.ingredients.split('\n').slice(0, 2).join(', ')}...</p>
                            <p><strong>Cooking Time:</strong> {recipe.cookingTime}</p>
                            <p><strong>Servings:</strong> {recipe.servings}</p>
                            <p><strong>Ratings:</strong> {recipe?.averageRating}</p>
                            <p><strong>Difficulty Level:</strong> {recipe.difficultyLevel}</p>
                            <p>Posted by: {recipe.User.name}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No recipes found.</p>
            )}
        </div>
    );
}
