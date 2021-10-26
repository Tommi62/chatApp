/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Grid, List, Typography } from '@material-ui/core';
import { useContext, useEffect, useState } from 'react';
import Thread from '../components/thread';
import ThreadButton from '../components/threadButton';
import ThreadForm from '../components/threadForm';
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
    const [updateState, setUpdateState] = useState(Date.now());
    const [updateThreadButtons, setUpdateThreadButtons] = useState(Date.now());
    const [updateThreadButtonInfos, setUpdateThreadButtonInfos] = useState(Date.now());
    const [createNewChatThread, setCreateNewChatThread] = useState(false);
    const [wsMessage, setWsMessage] = useState({
        type: '',
        contents: '',
        timestamp: new Date(),
        user_id: 0,
        thread_id: 0
    });

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
    }, [user, updateThreadButtons]);

    useEffect(() => {
        (async () => {
            try {
                if (threadId !== 0) {
                    const threadMessages = await getMessages(threadId);
                    const reversedArray = threadMessages.reverse();
                    setMessages(reversedArray);
                }
            } catch (e) {
                console.log(e.message);
            }
        })();
    }, [threadId, updateState]);

    useEffect(() => {
        try {
            if (wsMessage.type !== '' && wsMessage.thread_id === threadId) {
                const newMessageObject = {
                    id: Date.now(),
                    user_id: wsMessage.user_id,
                    contents: wsMessage.contents,
                    timestamp: wsMessage.timestamp,
                }
                setMessages(messages => [...messages, newMessageObject]);
            }
        } catch (e) {
            console.log(e.message);
        }
    }, [wsMessage]);

    useEffect(() => {
        try {
            if (threads.length !== 0) {
                if (websocket === undefined || websocket.readyState === 2 || websocket.readyState === 3) {
                    console.log('READYSTATE ', websocket?.readyState)
                    const socket = new WebSocket('ws://localhost:3001');

                    socket.addEventListener('open', function (event) {
                        console.log('Server is opened.');
                        const client = {
                            type: 'client',
                            user_id: user,
                            threads: threads,
                        }
                        socket.send(JSON.stringify(client));
                    });

                    socket.addEventListener('message', function (event) {
                        if (event.data !== 'ping') {
                            console.log('Message from server ', JSON.parse(event.data).thread_id);
                            const message = JSON.parse(event.data);
                            if (message.type === 'message') {
                                setWsMessage(message);
                                setUpdateThreadButtonInfos(Date.now());
                            } else {
                                setTimeout(() => socket.send('pong'), 1000);
                            }
                        }
                    });

                    socket.addEventListener('close', function (event) {
                        console.log('Websocket connection closed.');
                        setUpdateState(Date.now());
                    });

                    setWebsocket(socket);
                    console.log('NEW SOCKET');
                }
            }
        } catch (e) {
            console.log(e.message);
        };
    }, [updateState, threads]);

    const setCreateNewChatThreadOpen = () => {
        setCreateNewChatThread(true);
    }


    return (
        <>
            {createNewChatThread ? (
                <ThreadForm setCreateNewChatThread={setCreateNewChatThread} setUpdateThreadButtons={setUpdateThreadButtons} />
            ) : (
                <>
                    {threadOpen ? (
                        <Grid container direction="row">
                            <Grid item style={{ width: '30%' }}>
                                <Grid container style={{ borderTop: '1px solid #5F4B8BFF', marginTop: '1rem' }} >
                                    <List style={{ padding: 0, width: '100%' }}>
                                        {threads.map((item) => (
                                            <ThreadButton
                                                id={item.thread_id}
                                                setThreadOpen={setThreadOpen}
                                                setThreadId={setThreadId}
                                                threadOpen={threadOpen}
                                                threadId={threadId}
                                                updateThreadButtonInfos={updateThreadButtonInfos}
                                            />
                                        ))}{' '}
                                    </List>
                                </Grid>
                            </Grid>
                            <Grid item style={{ width: '70%' }}>
                                <Thread messages={messages} id={threadId} websocket={websocket} />
                            </Grid>
                        </Grid>
                    ) : (
                        <Grid container justify="center" direction="column">
                            <Typography component="h1" variant="h2">Welcome</Typography>
                            <Grid container item justifyContent="center">
                                <Button
                                    onClick={setCreateNewChatThreadOpen}
                                    color="primary"
                                    variant="contained"
                                    style={{ marginTop: '1rem', marginBottom: '1rem' }}
                                >
                                    Create a new chat thread
                                </Button>
                            </Grid>
                            <List style={{
                                width: '20vw',
                                padding: 0,
                                margin: 'auto',
                                borderStyle: 'solid',
                                borderWidth: '1px 1px 0 1px',
                                borderColor: '#5F4B8BFF'
                            }}>
                                {threads.map((item) => (
                                    <ThreadButton
                                        id={item.thread_id}
                                        setThreadOpen={setThreadOpen}
                                        setThreadId={setThreadId}
                                        threadOpen={threadOpen}
                                        threadId={threadId}
                                        updateThreadButtonInfos={updateThreadButtonInfos}
                                    />
                                ))}{' '}
                            </List>
                        </Grid>
                    )}
                </>
            )}
        </>
    );

}

export default Home