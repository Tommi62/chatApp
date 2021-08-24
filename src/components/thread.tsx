import { Grid, List, TextField } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { IconButton } from '@material-ui/core';
import { FormEvent, useContext, useEffect, useState } from 'react';
import { MediaContext } from '../contexts/mediaContext';
import { useChats, useUsers } from '../hooks/apiHooks';
import Message from '../components/message';
import useWindowDimensions from '../hooks/windowDimensionsHook';
import { useRef } from 'react';

interface messagesArray {
    id: number,
    user_id: number,
    contents: string,
    timestamp: Date,
}

interface propType {
    messages: messagesArray[],
    id: number,
    websocket: WebSocket | undefined,
}

interface usernamesArray {
    user_id: number,
    username: string,
}


const Thread = ({ messages, id, websocket }: propType) => {
    const [message, setMessage] = useState('');
    const [messageId, setMessageId] = useState(0);
    const [usernames, setUsernames] = useState<usernamesArray[]>([])
    const { user } = useContext(MediaContext);
    const { postMessage, getUserIds } = useChats();
    const { getUsernameById } = useUsers();
    const { height } = useWindowDimensions();
    const heightCorrected = height - 64;
    const messagesEndRef = useRef<null | HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        (async () => {
            try {
                scrollToBottom();
            } catch (e) {
                console.log(e.message);
            }
        })();
    }, [messageId]);

    useEffect(() => {
        (async () => {
            try {
                const userIds = await getUserIds(id);
                let usernameArray: Array<usernamesArray> = [];
                for (let i = 0; i < userIds.length; i++) {
                    const user = await getUsernameById(userIds[i].user_id);
                    const userObject = {
                        user_id: userIds[i].user_id,
                        username: user.username
                    }
                    usernameArray.push(userObject);
                }
                setUsernames(usernameArray)

            } catch (e) {
                console.log(e.message);
            }
        })();
    }, []);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const tzoffset = (new Date()).getTimezoneOffset() * 60000;
        const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        console.log('TIMEST: ', localISOTime)
        const messageObject = JSON.stringify({
            contents: message,
            timestamp: localISOTime,
            user_id: user,
            thread_id: id,

        });
        const success = await postMessage(messageObject)
        console.log('SUCCESS: ', success)
        const webSocketUpdate = {
            type: 'message',
            thread_id: id,
            timestamp: Date.now(),
        }
        if (websocket !== undefined) {
            websocket.send(JSON.stringify(webSocketUpdate));
        }
        setMessage('');
    };

    return (
        <>
            <Grid container justify="center" direction="column" style={{ height: heightCorrected }}>
                <Grid item justify="center" style=
                    {{
                        padding: '2rem 6rem 1.5rem 6rem',
                        backgroundColor: '#E69A8DFF',
                        height: '90%',
                        overflowX: 'hidden',
                        overflowY: 'auto'
                    }}>
                    {usernames.length > 0 &&
                        <List>
                            {messages.map((item) => (
                                <Message message_id={item.id} user_id={item.user_id} contents={item.contents} timestamp={item.timestamp} setMessageId={setMessageId} usernames={usernames} />
                            ))}{' '}
                            <div ref={messagesEndRef} />
                        </List>
                    }
                </Grid>
                <Grid item container justify="center" direction="column" style={{ height: '10%', backgroundColor: 'lightgray' }}>
                    <Grid item>
                        <form
                            onSubmit={handleSubmit}
                        >

                            <TextField
                                value={message}
                                variant="outlined"
                                label="Say something!"
                                onInput={(event) => setMessage((event.target as HTMLInputElement).value)}
                                style={{ width: '70%', backgroundColor: 'white', borderRadius: '0.5rem' }}
                            />
                            <IconButton
                                type="submit"
                                color="default"
                                style={{ marginTop: '0.15rem' }}
                            >
                                <SendIcon style={{ fill: '#5F4B8BFF' }} />
                            </IconButton>

                        </form>
                    </Grid>
                </Grid>

            </Grid>

        </>
    )
}

export default Thread;