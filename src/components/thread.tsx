import { Grid, List, TextField } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { IconButton } from '@material-ui/core';
import { FormEvent, useContext, useEffect, useState } from 'react';
import { MediaContext } from '../contexts/mediaContext';
import { useChats } from '../hooks/apiHooks';
import Message from '../components/message';

interface propType {
    id: number
}

interface messagesArray {
    contents: string,
    timestamp: Date,
    user_id: number
}


const Thread = ({ id }: propType) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<messagesArray[]>([]);
    const { user } = useContext(MediaContext);
    const { postMessage, getMessages } = useChats();
    console.log('YYSER: ', user)

    useEffect(() => {
        (async () => {
            try {
                const threadMessages = await getMessages(id);
                setMessages(threadMessages);

            } catch (e) {
                console.log(e.message);
            }
        })();
    }, []);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const timestamp = new Date(Date.now()).toISOString();
        const messageObject = JSON.stringify({
            contents: message,
            timestamp: timestamp,
            user_id: user,
            thread_id: id,

        });
        const success = await postMessage(messageObject)
        console.log('SUCCESS: ', success)
        setMessage('');
    };

    return (
        <>
            <Grid container justify="center" direction="column">
                <Grid item justify="center">
                    <List>
                        {messages.map((item) => (
                            <Message user_id={item.user_id} contents={item.contents} timestamp={item.timestamp} />
                        ))}{' '}
                    </List>
                </Grid>
                <Grid item justify="center">
                    <form
                        onSubmit={handleSubmit}
                    >

                        <TextField
                            id="input-with-icon-grid"
                            value={message}
                            onInput={(event) => setMessage((event.target as HTMLInputElement).value)}
                            style={{ width: '20rem' }}
                        />
                        <IconButton
                            aria-label="delete"
                            type="submit"
                            color="default"
                        >
                            <SendIcon />
                        </IconButton>

                    </form>
                </Grid>

            </Grid>

        </>
    )
}

export default Thread;