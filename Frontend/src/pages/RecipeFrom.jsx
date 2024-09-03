import { createRecipe } from '../API/recipeApis'; // Your API file
import { useState } from "react";

function RecipeForm() {
const values = {
    title: '',
    image: null,
    ingredients: '',
    instructions: '',
    dietaryPreference: '',
    cookingTime: '',
    servings: '',
    categories: '',
    preparationTime: '',
    difficultyLevel: '',
}
    const [formData, setFormData] = useState(values);

    // Handle change for text fields
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle change for file input
    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            image: e.target.files[0],
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Call API with form data
            const data = { ...formData };
            const response = await createRecipe(data);

            setFormData(values)

            alert('Recipe created successfully!');
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
                        name="image"
                        onChange={handleFileChange}
                        required
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

            <button type="submit">Create Recipe</button>
        </form>
    );
}

export default RecipeForm;
