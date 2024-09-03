import { useState, useEffect } from 'react';
import { getContainers, createContainer, addRecipeToFavorites } from '../API/favoritesApi'; // Assuming you have these API functions

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
            const values = {containerId, recipeId}
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
                        <h2>Create a New Container</h2>
                        <input
                            type="text"
                            value={newContainerName}
                            onChange={(e) => setNewContainerName(e.target.value)}
                            placeholder="Enter container name"
                        />
                        <button onClick={handleCreateContainer} disabled={!newContainerName}>
                            Create Container
                        </button>
                        <button onClick={() => setShowCreateForm(false)}>
                            Back to Container List
                        </button>
                    </div>
                ) : (
                    <div>
                        <h2>Select a Container</h2>
                        {loading ? (
                            <p>Loading containers...</p>
                        ) : error ? (
                            <p>Error: {error}</p>
                        ) : containers.length > 0 ? (
                            containers.map(container => (
                                <div
                                    key={container.id}
                                    onClick={() => handleAddRecipe(container.id)}
                                    style={{ cursor: 'pointer', margin: '10px 0', padding: '5px', border: '1px solid #ccc', color: 'black' }}
                                >
                                    {container.name}
                                </div>
                            ))
                        ) : (
                            <p>No containers found.</p>
                        )}
                        <button onClick={() => setShowCreateForm(true)}>
                            Create New Container
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PopupBox;