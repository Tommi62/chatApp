/* eslint-disable react-hooks/exhaustive-deps */
import { Grid, List, Typography } from '@material-ui/core';
import { useContext, useEffect, useState } from 'react';
import Thread from '../components/thread';
import ThreadButton from '../components/threadButton';
import { MediaContext } from '../contexts/mediaContext';
import { useUsers, useChats } from '../hooks/apiHooks';

interface propType {
    history: {
        push: Function,
    }
}

interface threadsArray {
    thread_id: number
}

const Home = ({ history }: propType) => {
    const { user, setUser } = useContext(MediaContext);
    const { getIsLoggedIn } = useUsers();
    const { getThreadIds } = useChats();
    const [threads, setThreads] = useState<threadsArray[]>([]);
    const [threadOpen, setThreadOpen] = useState(false)
    const [threadId, setThreadId] = useState(0)

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
                const chatThreads = await getThreadIds(isLoggedIn.id)
                setThreads(chatThreads)
                console.log('THREADS: ', chatThreads[0].thread_id, threads)
            } catch (e) {
                console.log(e.message);
            }
        })();
    }, [user]);

    return (
        <>
            {threadOpen ? (
                <Thread id={threadId} />
            ) : (
                <Grid container justify="center" direction="column">
                    <Typography component="h1" variant="h2">Welcome</Typography>
                    <List>
                        {threads.map((item) => (
                            <ThreadButton id={item.thread_id} setThreadOpen={setThreadOpen} setThreadId={setThreadId} />
                        ))}{' '}
                    </List>
                </Grid>
            )}
        </>
    );

}

export default Home