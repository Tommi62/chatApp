/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Grid, ListItem, ListItemText, makeStyles, Typography } from "@material-ui/core";
import { useContext, useState } from "react";
import { useEffect } from "react";
import { WebsocketContext } from "../contexts/websocketContext";
import { useChats, useUsers } from '../hooks/apiHooks';

interface propType {
    id: number,
    setThreadOpen: Function,
    setThreadId: Function,
    threadOpen: Boolean,
    threadId: number,
}

interface lastMessageObject {
    username: string,
    contents: string,
    timestamp: any,
}

const useStyles = makeStyles(() => ({
    text: {
        color: 'white',
        width: '100%',
        padding: '1rem',
    },
    inline: {
        display: 'inline',
    },
    lastMessage: {
        display: 'inline',
        fontSize: '0.7rem'
    },
    timestamp: {
        fontSize: '0.5rem',
        marginLeft: '2rem'
    },
    button: {
        width: '100%',
        maxWidth: '30vw',
        padding: '0 0.7rem',
        borderBottom: '1px solid #5F4B8BFF',
        cursor: 'pointer',
        '&:hover': {
            background: "#f0f0f0",
        },
    }
}));

const ThreadButton = ({ id, setThreadOpen, setThreadId, threadOpen, threadId }: propType) => {
    const { getThreadName, getLastMessage } = useChats();
    const { getUsernameById } = useUsers();
    const [name, setName] = useState('');
    const [lastMessage, setLastMessage] = useState<lastMessageObject>({
        username: '',
        contents: '',
        timestamp: ''
    });
    const { websocket } = useContext(WebsocketContext);
    const classes = useStyles();

    useEffect(() => {
        (async () => {
            try {
                const threadName = await getThreadName(id)
                setName(threadName)
                const lastMessageData = await getLastMessage(id)
                if (lastMessageData.length !== 0) {
                    const username = await getUsernameById(lastMessageData[0].user_id);

                    const d = new Date(lastMessageData[0].timestamp);
                    let hours = d.getHours().toString();
                    let minutes = d.getMinutes().toString();
                    if (d.getHours() < 10) {
                        hours = '0' + hours;
                    }
                    if (d.getMinutes() < 10) {
                        minutes = '0' + minutes;
                    }
                    const formatedTime = hours + '.' + minutes;

                    const lastMessageObject = {
                        username: username.username + ':',
                        contents: lastMessageData[0].contents,
                        timestamp: formatedTime,
                    }
                    setLastMessage(lastMessageObject);
                } else {
                    const noLastMessageObject = {
                        username: 'No messages yet.',
                        contents: '',
                        timestamp: '',
                    }
                    setLastMessage(noLastMessageObject);
                }
            } catch (e) {
                console.log(e.message);
            }
        })();
    }, []);

    const openThread = () => {
        if (!threadOpen) {
            setThreadOpen(true)
            setThreadId(id)
        } else {
            if (threadId === id) {
                setThreadOpen(false)
                setThreadId(0)
            } else {
                setThreadId(id)
            }
            if (websocket !== undefined) {
                websocket.close();
            }
        }
    }

    return (
        <>
            <ListItem onClick={openThread} className={classes.button} >
                <ListItemText
                    primary={
                        <>
                            <Grid container justify="space-between">
                                <Typography
                                    component="h1"
                                >
                                    {name}
                                </Typography>
                                <Typography
                                    component="span"
                                    variant="subtitle1"
                                    className={classes.timestamp}
                                >
                                    {lastMessage.timestamp}
                                </Typography>
                            </Grid>
                        </>
                    }
                    secondary={
                        <>
                            <Typography
                                component="span"
                                variant="body2"
                                className={classes.lastMessage}
                            >
                                {lastMessage.username} {lastMessage.contents}
                            </Typography>
                        </>
                    }
                />
            </ListItem>
        </>
    )
}

export default ThreadButton