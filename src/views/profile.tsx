/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useUsers } from '../hooks/apiHooks';

const Profile = () => {
    const [user, setUser] = useState({ id: '', username: '' })
    const { getProfile } = useUsers();

    useEffect(() => {
        (async () => {
            try {
                const result = await getProfile();
                console.log('Profile: ', result);
                setUser(result);
            } catch (e) {
                console.log(e.message);
            }
        })();
    }, []);

    return (
        <div style={{ whiteSpace: 'pre-line' }}>
            <h1>{!user ? "Loading..." : user.username + '\n' + user.id}</h1>
        </div>
    );
}

export default Profile