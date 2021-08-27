/* eslint-disable react-hooks/exhaustive-deps */
import { Grid, List, Typography } from '@material-ui/core';
import { useContext, useEffect, useState } from 'react';
import Thread from '../components/thread';
import ThreadButton from '../components/threadButton';
import { MediaContext } from '../contexts/mediaContext';
import { WebsocketContext } from '../contexts/websocketContext';
import { useUsers, useChats } from '../hooks/apiHooks';

interface propType {
    history: {
        push: Function,
    }
}

interface threadsArray {
    thread_id: number
}

interface messagesArray {
    id: number,
    user_id: number,
    contents: string,
    timestamp: Date,
}

const Home = ({ history }: propType) => {
    const { user, setUser } = useContext(MediaContext);
    const { websocket, setWebsocket } = useContext(WebsocketContext);
    const { getIsLoggedIn } = useUsers();
    const { getThreadIds, getMessages } = useChats();
    const [threads, setThreads] = useState<threadsArray[]>([]);
    const [threadOpen, setThreadOpen] = useState(false)
    const [threadId, setThreadId] = useState(0)
    const [messages, setMessages] = useState<messagesArray[]>([]);
    const [webSocketUpdate, setWebSocketUpdate] = useState('');
    const [socketThreadId, setSocketThreadId] = useState(0);
    const [updateState, setUpdateState] = useState(Date.now());

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
                if (user !== 0) {
                    const chatThreads = await getThreadIds(isLoggedIn.id)
                    setThreads(chatThreads)
                }
            } catch (e) {
                console.log(e.message);
            }
        })();
    }, [user]);

    useEffect(() => {
        (async () => {
            try {
                if (threadId !== 0) {
                    const threadMessages = await getMessages(threadId);
                    setMessages(threadMessages);
                    console.log('USEEFFECT');
                }
            } catch (e) {
                console.log(e.message);
            }
        })();
    }, [threadId, webSocketUpdate]);

    useEffect(() => {
        try {
            if (threadOpen) {
                if (websocket === undefined || websocket.readyState === 2 || websocket.readyState === 3 || threadId !== socketThreadId) {
                    console.log('READYSTATE ', websocket?.readyState)
                    const socket = new WebSocket('ws://localhost:3001');

                    socket.addEventListener('open', function (event) {
                        console.log('Server is opened.');
                        const client = {
                            type: 'client',
                            thread_id: threadId,
                            user_id: user,
                        }
                        socket.send(JSON.stringify(client));
                    });

                    socket.addEventListener('message', function (event) {
                        if (event.data !== 'ping') {
                            console.log('Message from server ', JSON.parse(event.data).thread_id);
                            const message = JSON.parse(event.data);
                            if (message.thread_id === threadId) {
                                setWebSocketUpdate(message.timestamp);
                            }
                        } else {
                            setTimeout(() => socket.send('pong'), 1000);
                        }
                    });

                    socket.addEventListener('close', function (event) {
                        console.log('Websocket connection closed.');
                        setUpdateState(Date.now());
                    });

                    setWebsocket(socket);
                    setSocketThreadId(threadId);
                    console.log('NEW SOCKET');
                }
            }
        } catch (e) {
            console.log(e.message);
        };
    }, [threadOpen, threadId, updateState]);


    return (
        <>
            {threadOpen ? (
                <Grid container direction="row">
                    <Grid item style={{ width: '30%' }}>
                        <List>
                            {threads.map((item) => (
                                <ThreadButton id={item.thread_id} setThreadOpen={setThreadOpen} setThreadId={setThreadId} threadOpen={threadOpen} />
                            ))}{' '}
                        </List>
                    </Grid>
                    <Grid item style={{ width: '70%' }}>
                        <Thread messages={messages} id={threadId} websocket={websocket} />
                    </Grid>
                </Grid>
            ) : (
                <Grid container justify="center" direction="column">
                    <Typography component="h1" variant="h2">Welcome</Typography>
                    <List>
                        {threads.map((item) => (
                            <ThreadButton id={item.thread_id} setThreadOpen={setThreadOpen} setThreadId={setThreadId} threadOpen={threadOpen} />
                        ))}{' '}
                    </List>
                </Grid>
            )}
        </>
    );

}

export default Home