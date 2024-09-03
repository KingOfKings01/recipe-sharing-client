import { useState, useEffect } from "react";
import { createRecipe, updateRecipe } from '../API/recipeApis'; // Import your API functions
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";

function RecipeForm({ isEdit, preInitialValues }) {
    const navigate = useNavigate();
    
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            return navigate("/login");
        }
    }, []);

    const initialValues = {
        title: '',
        imageUrl: '',
        ingredients: '',
        instructions: '',
        dietaryPreference: '',
        cookingTime: '',
        servings: '',
        categories: '',
        preparationTime: '',
        difficultyLevel: '',
        ...preInitialValues // Use preInitialValues if provided
    };
    
    const [formData, setFormData] = useState(initialValues);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            imageUrl: e.target.files[0], // Changed from `image` to `imageUrl` to match the model
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Determine if it's an update or create operation
            const apiCall = isEdit ? updateRecipe : createRecipe;
            const data = { ...formData };
            
            if (isEdit) {
                await apiCall(preInitialValues.id, data); // Pass `id` for updates
            } else {
                await apiCall(data);
            }

            setFormData(initialValues);
            alert(isEdit ? 'Recipe updated successfully!' : 'Recipe created successfully!');
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    Title:
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>

            <div>
                <label>
                    Image:
                    <input
                        type="file"
                        name="imageUrl"
                        onChange={handleFileChange}
                        required={!isEdit} // Make required only if creating
                    />
                </label>
            </div>

            <div>
                <label>
                    Ingredients:
                    <textarea
                        name="ingredients"
                        value={formData.ingredients}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>

            <div>
                <label>
                    Instructions:
                    <textarea
                        name="instructions"
                        value={formData.instructions}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>

            <div>
                <label>
                    Dietary Preference:
                    <select
                        name="dietaryPreference"
                        value={formData.dietaryPreference}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Dietary Preference</option>
                        <option value="Vegetarian">Vegetarian</option>
                        <option value="Non-Vegetarian">Non-Vegetarian</option>
                        <option value="Vegan">Vegan</option>
                        <option value="Gluten-Free">Gluten-Free</option>
                        <option value="Keto">Keto</option>
                        <option value="Paleo">Paleo</option>
                    </select>
                </label>
            </div>

            <div>
                <label>
                    Cooking Time:
                    <input
                        type="text"
                        name="cookingTime"
                        value={formData.cookingTime}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>

            <div>
                <label>
                    Servings:
                    <input
                        type="number"
                        name="servings"
                        min="1"
                        value={formData.servings}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>

            <div>
                <label>
                    Categories:
                    <select
                        name="categories"
                        value={formData.categories}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="Sweet">Sweet</option>
                        <option value="Spicy">Spicy</option>
                        <option value="Salty">Salty</option>
                        <option value="Bitter">Bitter</option>
                        <option value="Sour">Sour</option>
                        <option value="Umami">Umami</option>
                    </select>
                </label>
            </div>

            <div>
                <label>
                    Preparation Time:
                    <input
                        type="text"
                        name="preparationTime"
                        value={formData.preparationTime}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>

            <div>
                <label>
                    Difficulty Level:
                    <select
                        name="difficultyLevel"
                        value={formData.difficultyLevel}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Difficulty Level</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </label>
            </div>

            <button type="submit">{isEdit ? 'Update Recipe' : 'Create Recipe'}</button>
        </form>
    );
}

RecipeForm.propTypes = {
    isEdit: PropTypes.bool,
    preInitialValues: PropTypes.object
}

export default RecipeForm;
