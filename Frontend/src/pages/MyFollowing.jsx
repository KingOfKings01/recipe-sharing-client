import { useState, useEffect } from 'react';
import { getFollowing, unfollowUser } from '../API/followApi';

export default function MyFollowing() {
    const [following, setFollowing] = useState([]);

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
                                        <p>{user.name}</p>
                                    </td>
                                    <td>
                                        <button className='btn-unfollow' onClick={() => handleUnfollowUser(user.id)}>Unfollow</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    :

                    <h3>No Following Yet!</h3>
            }
        </div>
    )
}
