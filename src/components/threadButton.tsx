/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Grid, ListItemText, makeStyles, Typography } from "@material-ui/core";
import { useContext, useState } from "react";
import { useEffect } from "react";
import { WebsocketContext } from "../contexts/websocketContext";
import { useChats } from '../hooks/apiHooks';

interface propType {
    id: number,
    setThreadOpen: Function,
    setThreadId: Function,
    threadOpen: Boolean,
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
        fontSize: '0.6rem'
    },
    timestamp: {
        fontSize: '0.5rem',
        marginLeft: '2rem'
    },
    button: {
        background: 'fff',
        width: '100%',
        maxWidth: '30vw',
        display: 'inline-block',
        padding: '0 1rem',
        minHeight: 0,
        minWidth: 0,
        borderBottom: '1px solid #5F4B8BFF',
        borderRadius: 0,
    }
}));

const ThreadButton = ({ id, setThreadOpen, setThreadId, threadOpen }: propType) => {
    const { getThreadName } = useChats();
    const [name, setName] = useState('');
    const { websocket } = useContext(WebsocketContext);
    const classes = useStyles();

    useEffect(() => {
        (async () => {
            try {
                console.log('THREADBUTTON: ', id)
                const threadName = await getThreadName(id)
                console.log('THREADNAME: ', threadName)
                setName(threadName)
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
            setThreadOpen(false)
            if (websocket !== undefined) {
                websocket.close();
            }
            setThreadId(0)
        }
    }

    return (
        <>
            <Button className={classes.button} onClick={openThread}>
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
                                    hello
                                </Typography>
                            </Grid>
                        </>
                    }
                    secondary={
                        <>
                            <Grid container justify="flex-start">
                                <Typography
                                    component="span"
                                    variant="body2"
                                    className={classes.lastMessage}
                                >
                                    Chätti
                                </Typography>
                            </Grid>
                        </>
                    }
                />
            </Button>
        </>
    )
}

export default ThreadButton