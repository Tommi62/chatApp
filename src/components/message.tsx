import { Grid, ListItem, ListItemText, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useContext } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { MediaContext } from '../contexts/mediaContext';

interface usernamesArray {
    user_id: number,
    username: string,
}

interface propType {
    message_id: number,
    user_id: number,
    contents: string,
    timestamp: Date,
    setMessageId: Function,
    usernames: usernamesArray[],
}

const useStyles = makeStyles(() => ({
    message: {
        backgroundColor: 'lightGrey',
        marginBottom: '0.5rem',
        borderRadius: '1rem',
        padding: '0.5rem',
        maxWidth: '50%',
    },
    ownMessage: {
        backgroundColor: '#5F4B8BFF',
        color: 'white',
        marginBottom: '0.5rem',
        borderRadius: '1rem',
        padding: '0.5rem',
        maxWidth: '50%',
    },
    inline: {
        display: 'inline',
    },
    inlineOwn: {
        display: 'inline',
        color: 'white',
    },
    timestamp: {
        fontSize: '0.7rem',
        marginLeft: '2rem'
    }
}));

const Message = ({ message_id, user_id, contents, timestamp, setMessageId, usernames }: propType) => {
    const classes = useStyles();
    const [username, setUsername] = useState('');
    const [time, setTime] = useState('');
    const [ownMessage, setOwnMessage] = useState(false);
    const { user } = useContext(MediaContext);

    useEffect(() => {
        try {
            for (let i = 0; i < usernames.length; i++) {
                if (usernames[i].user_id === user_id) {
                    setUsername(usernames[i].username);
                }
            }

            const d = new Date(timestamp);
            let hours = d.getHours().toString();
            let minutes = d.getMinutes().toString();
            if (d.getHours() < 10) {
                hours = '0' + hours;
            }
            if (d.getMinutes() < 10) {
                minutes = '0' + minutes;
            }
            const formatedTime = hours + '.' + minutes;
            setTime(formatedTime);

            if (user_id === user) {
                setOwnMessage(true)
            } else {
                setOwnMessage(false);
            }
            setMessageId(message_id);
            console.log('GIT PUSH PRoblem');
        } catch (e) {
            console.log(e.message);
        }
    }, [message_id]);


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