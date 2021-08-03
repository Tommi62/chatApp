/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import { MediaContext } from '../contexts/mediaContext';
import { useUsers } from '../hooks/apiHooks';

interface propType {
    history: {
        push: Function,
    }
}

const Home = ({ history }: propType) => {
    const { user, setUser } = useContext(MediaContext);
    const [data, setData] = useState('');
    const { getUsers, getIsLoggedIn } = useUsers();

    useEffect(() => {
        (async () => {
            try {
                console.log('USER: ', user)
                const isLoggedIn = await getIsLoggedIn();
                if (!isLoggedIn.success) {
                    history.push('/login');
                }
                setUser(isLoggedIn.id)
                console.log('Logged user: ', user, isLoggedIn.id);
                const result = await getUsers();
                let nameList: string = ''
                for (let i = 0; i < result.length; i++) {
                    nameList += result[i].username + '\n'
                }
                setData(nameList);
            } catch (e) {
                console.log(e.message);
            }
        })();
    }, []);

    return (
        <div style={{ whiteSpace: 'pre-line' }}>
            <h1>{!data ? "Loading..." : data}</h1>
        </div>
    );

}

export default Home