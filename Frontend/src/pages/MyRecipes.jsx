import { useState, useEffect } from 'react';
import { getRecipesOfUser, deleteRecipe } from '../API/recipeApis';
import RecipeForm from '../components/RecipeFrom';
import "../recipe-form.css"

export default function MyRecipes() {
    const [userRecipes, setUserRecipes] = useState([]);
    const [showRecipeForm, setShowRecipeForm] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [preInitialValues, setPreInitialValues] = useState({});

    useEffect(() => {
        async function fetchRecipes() {
            try {
                const data = await getRecipesOfUser();
                setUserRecipes(data);
            } catch (error) {
                console.error(error.message);
            }
        }
        fetchRecipes();
    }, []);

    const handleUpdateRecipe = (recipe) => {
        setIsEdit(true);
        setPreInitialValues(recipe)
        setShowRecipeForm(true);
    }

    const handleDeleteRecipe = async (recipeId) => {
        try {
            await deleteRecipe(recipeId);
            setUserRecipes(userRecipes.filter(recipe => recipe.id !== recipeId));
        } catch (error) {
            console.error(error.message);
        }
    };

    const openRecipeForm = () => setShowRecipeForm(true);
    const closeRecipeForm = () => setShowRecipeForm(false);

    return (
        <div className='container'>
            {/* Table */}

            <h2>User&#39;s Posted Recipes</h2>
            <button onClick={openRecipeForm} className='add-btn'>Post New Recipe</button> {/* Button to open the popup */}

            {showRecipeForm && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={closeRecipeForm}>&times;</span>
                        <RecipeForm isEdit={isEdit} preInitialValues={preInitialValues} setPreInitialValues={setPreInitialValues} />
                    </div>
                </div>
            )}

            {userRecipes.length > 0 ? 
            <table border="1" cellSpacing="0" cellPadding="8" className='recipe-table'>
                <thead>
                    <tr>
                        <th>Title</th>
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
                                <button className='btn-edit' onClick={() => handleUpdateRecipe(recipe)}>Edit</button>

                                <button className='btn-delete' onClick={() => handleDeleteRecipe(recipe.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            : <h3>No recipes found.</h3>
            }
        </div>

        
    );
}
