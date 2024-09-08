import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRecipes, browseAndSearchRecipes } from '../API/recipeApis'; // Adjust API import if necessary
// import SearchPopup from '../components/SearchPopup'; // Import the updated SearchPopup component
import '../main.css'

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [dietaryPreference, setDietaryPreference] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const [minPreparationTime, setMinPreparationTime] = useState('');
  const [maxPreparationTime, setMaxPreparationTime] = useState('');

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



  async function searchByKey() {
    setLoading(true);
    const filters = {
      dietaryPreference: "",
      difficultyLevel: "",
      maxPreparationTime: "",
      searchTerm,
    };
    const data = await browseAndSearchRecipes(filters); // Make API call with filters
    setRecipes(data);
    setLoading(false);
  }

  const handleFilterSubmission = async () => {
    setLoading(true);
    const filters = {
      dietaryPreference,
      difficultyLevel,
      preparationTime: minPreparationTime + ' - ' + maxPreparationTime,
      searchTerm,
    };
    const data = await browseAndSearchRecipes(filters); // Make API call with filters
    setRecipes(data);
    setSearchTerm("")
    setLoading(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className='container'>
      {/* <button onClick={() => setShowPopup(true)}>Search Recipes</button> Button to open the search popup */}

      <div className='head-box'>
      <h1>Recipes</h1>
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by recipe title"
        />
        <button onClick={() => searchByKey()}>Search</button>
      </div>
      </div>

      <div className='filters'>
        <div className='filter-option'>
          <label>Dietary Preference:</label>
          <select
            value={dietaryPreference}
            onChange={(e) => setDietaryPreference(e.target.value)}
          >
            <option value="">Select...</option>
            <option value="Vegan">Vegan</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Gluten-Free">Gluten-Free</option>
            <option value="Dairy-Free">Dairy-Free</option>
            {/* Add more options as needed */}
          </select>
        </div>

        <div className='filter-option'>
          <label>Difficulty Level:</label>
          <select
            value={difficultyLevel}
            onChange={(e) => setDifficultyLevel(e.target.value)}
          >
            <option value="">Select...</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div className='filter-option'>

          <label>Max Preparation Time (minutes):</label>
          <div className='min-max'>
            <input
              type='number'
              value={minPreparationTime}
              placeholder='Min'
              onChange={(e) => setMinPreparationTime(e.target.value)}
            /> - <input
              type='number'
              placeholder='Max'
              min={minPreparationTime}
              value={maxPreparationTime}
              onChange={(e) => setMaxPreparationTime(e.target.value)}
            />
          </div>
        </div>
        <div className='filter-option'>
          <div>Action</div>
          <button onClick={() => handleFilterSubmission()}>Filter</button>
        </div>
      </div>

      

      {recipes?.length > 0 ? (
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id}>

              <div className='recipe-box'>

                <Link to={`/recipe/${recipe.id}`}>
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className='food-image'
                    onError={(e) => {
                      e.target.onerror = null; // Prevents looping
                      e.target.src = "../../public/Food.svg";
                    }}
                  />
                </Link>
                <div className='instruction'>
                  <h2>{recipe.title}</h2>
                  <p><strong>Cooking Time:</strong> {recipe.cookingTime}</p>
                  <p><strong>Servings:</strong> {recipe.servings}</p>
                  <p><strong>Ratings:</strong> {recipe.averageRating}</p>
                  <p><strong>Dietary Preference:</strong> {recipe.dietaryPreference}</p>
                  <p><strong>Difficulty Level:</strong> {recipe.difficultyLevel}</p>
                  <p><strong>Posted by:</strong> {recipe.User.name}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recipes found.</p>
      )}
    </div>
  );
}
