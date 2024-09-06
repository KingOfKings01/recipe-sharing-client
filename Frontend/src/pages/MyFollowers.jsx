import { useState, useEffect } from 'react';
import { getFollowers } from '../API/followApi';

export default function MyFollowers() {
    const [followers, setFollowers] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const followersData = await getFollowers();
                setFollowers(followersData);
            } catch (error) {
                console.error(error.message);
            }
        }
        fetchData();
    }, []);

    return (
        <div className='container'>
            <h2>Followers</h2>
            <table>
                <thead>
                    <td>Followers</td>
                </thead>
                <tbody>
                    {followers.map((follower, index) => (
                        <td key={index}>
                            <tr >{follower}</tr>
                        </td>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
