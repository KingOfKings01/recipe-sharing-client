import { useState, useEffect } from 'react';
import { getFollowing, unfollowUser } from '../API/followApi';
import { Link } from 'react-router-dom';

export default function MyFollowing() {
    const [following, setFollowing] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedRecipes, setSelectedRecipes] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                const followingData = await getFollowing();
                setFollowing(followingData);
            } catch (error) {
                console.error(error.message);
            }
        }
        fetchData();
    }, []);

    const handleUnfollowUser = async (userId) => {
        try {
            await unfollowUser(userId);
            setFollowing(following.filter(user => user.id !== userId));
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleUserClick = (user) => {
        setSelectedUser(user.name);
        setSelectedRecipes(user.Recipes);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedRecipes([]);
        setSelectedUser('');
    };

    return (
        <div className='container'>
            <h2>Following</h2>
            {
                following.length > 0 ?
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {following.map((user) => (
                                <tr key={user.id} >
                                    <td>
                                        <p className="username" >
                                            {user.name}
                                        </p>
                                    </td>
                                    <td>
                                        <button className='btn-view-recipes' onClick={() => handleUserClick(user)}>View Recipes</button> |
                                        <button className='btn-unfollow' onClick={() => handleUnfollowUser(user.id)}>Unfollow</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    :
                    <h3>No Following Yet!</h3>
            }

            {/* Modal */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h3>{selectedUser}&#39;s Recipes</h3>
                        <ul className="modal-recipes">
                            {selectedRecipes.map((recipe) => (
                                <li key={recipe.id}>
                                    <Link to={`/recipe/${recipe.id}`} onClick={closeModal}>{recipe.title}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    )
}
