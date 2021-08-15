import { Grid, ListItem, ListItemText, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useContext } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { MediaContext } from '../contexts/mediaContext';
import { useChats, useUsers } from '../hooks/apiHooks';

interface propType {
    user_id: number,
    contents: string,
    timestamp: Date,
}

const useStyles = makeStyles(() => ({
    message: {
        width: '100%',
        maxWidth: '36ch',
        backgroundColor: 'lightGrey',
        marginBottom: '1rem',
        borderRadius: '1rem',
        padding: '0.5rem',
    },
    ownMessage: {
        width: '100%',
        maxWidth: '36ch',
        backgroundColor: '#a252f7',
        color: 'white',
        marginBottom: '1rem',
        borderRadius: '1rem',
        padding: '0.5rem',
    },
    inline: {
        display: 'inline',
    },
    inlineOwn: {
        display: 'inline',
        color: 'white',
    },
    timestamp: {
        fontSize: '0.7rem'
    }
}));

const Message = ({ user_id, contents, timestamp }: propType) => {
    const classes = useStyles();
    const [username, setUsername] = useState('');
    const [time, setTime] = useState('');
    const [ownMessage, setOwnMessage] = useState(false);
    const { user } = useContext(MediaContext);
    const { getUsernameById } = useUsers();

    useEffect(() => {
        (async () => {
            try {
                const messageOwner = await getUsernameById(user_id);
                setUsername(messageOwner.username);
                const d = new Date(timestamp);
                const formatedTime = d.getHours() + '.' + d.getMinutes();
                setTime(formatedTime);
                if (user_id === user) {
                    setOwnMessage(true)
                }
            } catch (e) {
                console.log(e.message);
            }
        })();
    }, []);


    return (
        <>
            <ListItem style={{ width: '100%' }}>
                {ownMessage ? (
                    <Grid container justify="flex-end" >
                        <Grid item className={classes.ownMessage}>
                            <ListItemText
                                primary={
                                    <>
                                        <Grid container justify="space-between">
                                            <Typography
                                                component="h2"
                                            >
                                                {username}
                                            </Typography>
                                            <Typography
                                                component="span"
                                                variant="subtitle1"
                                                className={classes.timestamp}
                                            >
                                                {time}
                                            </Typography>
                                        </Grid>
                                    </>
                                }
                                secondary={
                                    <>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            className={classes.inlineOwn}
                                        >
                                            {contents}
                                        </Typography>
                                    </>
                                }
                            />
                        </Grid>
                    </Grid>
                ) : (
                    <Grid container justify="flex-start" >
                        <Grid item className={classes.message}>
                            <ListItemText
                                primary={
                                    <>
                                        <Grid container justify="space-between">
                                            <Typography
                                                component="h2"
                                            >
                                                {username}
                                            </Typography>
                                            <Typography
                                                component="span"
                                                variant="subtitle1"
                                                className={classes.timestamp}
                                            >
                                                {time}
                                            </Typography>
                                        </Grid>
                                    </>
                                }
                                secondary={
                                    <>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            className={classes.inline}
                                            color="textPrimary"
                                        >
                                            {contents}
                                        </Typography>
                                    </>
                                }
                            />
                        </Grid>
                    </Grid>
                )
                }

            </ListItem >
        </>
    )
}

export default Message;