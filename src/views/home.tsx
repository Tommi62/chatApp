import { useEffect, useState } from 'react';
import { useUsers } from '../hooks/apiHooks';

const Home = () => {
    const [data, setData] = useState('');
    const { getUsers } = useUsers();

    useEffect(() => {
        (async () => {
            try {
                const result = await getUsers();
                console.log('Result: ', result);
                let nameList: string = ''
                for (let i = 0; i < result.length; i++) {
                    nameList += result[i].username + '\n'
                }
                setData(nameList);
            } catch (e) {
                console.log(e.message);
            }
        })();
    });

    return (
        <div style={{ whiteSpace: 'pre-line' }}>
            <h1>{!data ? "Loading..." : data}</h1>
        </div>
    );

}

export default Home