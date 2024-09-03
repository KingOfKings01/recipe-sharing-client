import React, { useState } from 'react';

export default function SearchPopup({ onSearch, onClose }) {
  const [dietaryPreference, setDietaryPreference] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const [maxPreparationTime, setMaxPreparationTime] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const filters = {
      dietaryPreference,
      difficultyLevel,
      maxPreparationTime,
      searchTerm,
    };
    onSearch(filters); // Call the parent component's search handler
  };

  return (
    <div className="search-popup">
      <button className="close-button" onClick={onClose}>X</button> {/* Close button */}
      <form onSubmit={handleSubmit}>
        <h2>Search Recipes</h2>
        
        <div>
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

        <div>
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

        <div>
          <label>Max Preparation Time (minutes):</label>
          <input
            value={maxPreparationTime}
            onChange={(e) => setMaxPreparationTime(e.target.value)}
          />
        </div>

        <div>
          <label>Search Term:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by recipe title"
          />
        </div>

        <button type="submit">Search</button>
      </form>
    </div>
  );
}
