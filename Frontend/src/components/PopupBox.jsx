import { useState, useEffect } from 'react';
import { getContainers, createContainer, addRecipeToFavorites } from '../API/favoritesApi'; // Assuming you have these API functions
import PropTypes from 'prop-types';

function PopupBox({ recipeId, onClose }) {
    const [containers, setContainers] = useState([]);
    const [newContainerName, setNewContainerName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false); // Control form visibility

    useEffect(() => {
        // Fetch all containers on component mount
        const fetchContainers = async () => {
            try {
                const data = await getContainers(); // Fetch all containers
                setContainers(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchContainers();
    }, []);

    const handleCreateContainer = async () => {
        try {
            const newContainer = await createContainer({ name: newContainerName }); // Create new container
            setContainers([...containers, newContainer]); // Add new container to the list
            setNewContainerName(''); // Reset input field
            setShowCreateForm(false); // Hide form after creation
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAddRecipe = async (containerId) => {
        try {
            const values = { containerId, recipeId }
            console.log(values);
            const response = await addRecipeToFavorites(values); // Add recipe to the selected container
            console.log(response);
            alert(`Recipe added`); // Display success message
            onClose(); // Close the popup box after adding the recipe
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <button onClick={onClose} className="close-button">X</button>

                {showCreateForm ? (
                    <div>
                        <h2>Create a New List</h2>
                        <div className='list-form'>
                            <input
                                type="text"
                                value={newContainerName}
                                onChange={(e) => setNewContainerName(e.target.value)}
                                placeholder="Enter list name"
                            />

                            <div className='options'>
                                <button onClick={handleCreateContainer} disabled={!newContainerName}>
                                    create list
                                </button>
                                <button className='cancel-btn' onClick={() => setShowCreateForm(false)}>
                                    cancel
                                </button>
                            </div>

                        </div>

                    </div>
                ) : (
                    <div>
                        <h2>Select a List</h2>
                        {loading ? (
                            <p>Loading lists...</p>
                        ) : error ? (
                            <p>Error: {error}</p>
                        ) : containers.length > 0 ? (
                            containers.map(container => (
                                <div
                                    key={container.id}
                                    onClick={() => handleAddRecipe(container.id)}
                                    className='list'
                                >
                                    {container.name}
                                </div>
                            ))
                        ) : (
                            <p>No list found.</p>
                        )}
                        <button className='add-btn' onClick={() => setShowCreateForm(true)}>
                            New List
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

PopupBox.propTypes = {
    recipeId: PropTypes.string,
    onClose: PropTypes.func,
}

export default PopupBox;