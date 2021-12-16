import { Button, FormControl, Grid, InputLabel, makeStyles, MenuItem, Select, Typography } from "@material-ui/core"
import { useState } from "react";
import { useContext, useEffect } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator"
import { MediaContext } from "../contexts/mediaContext";
import { useUsers, useChats } from "../hooks/apiHooks";
import useForm from "../hooks/formHooks";

interface propTypes {
    setCreateNewChatThread: Function,
    setUpdateThreadButtons: Function,
    websocket: WebSocket,
}

interface usersArrayType {
    id: number,
    username: string,
}

const useStyles = makeStyles(() => ({
    select: {
        minWidth: '5rem',
    },
    formControl: {
        marginTop: '0.5rem',
    }
}));

const ThreadForm = ({ setCreateNewChatThread, setUpdateThreadButtons, websocket }: propTypes) => {
    const classes = useStyles();
    const { user } = useContext(MediaContext);
    const { createNewChatThread } = useChats();
    const { getUsers } = useUsers();
    const [usersArray, setUsersArray] = useState<usersArrayType[]>([]);
    const [newThreadId, setNewThreadId] = useState(0);

    const validators = {
        threadName: ['required', 'minStringLength: 3'],
    };

    const errorMessages = {
        threadName: [
            'Required field',
            'Minimum of 3 characters'
        ]
    };

    const createNewThread = async () => {
        try {
            if (inputs.user2 !== '') {
                const chatThreadObject = JSON.stringify({
                    name: inputs.threadName,
                    user_id: user,
                    user2_id: inputs.user2

                });
                const success = await createNewChatThread(chatThreadObject);
                console.log('SUCCESS: ', success.success)
                setNewThreadId(success.id);

                setCreateNewChatThread(false);
            } else {
                alert('Choose a user with whom you want to chat!');
            }
        } catch (e) {
            console.log(e.message);
        }
    }

    const { inputs, handleInputChange, handleSubmit } = useForm(createNewThread, {
        threadName: '',
        user2: '',
    });

    useEffect(() => {
        try {
            if (newThreadId !== 0) {
                console.log('NEWTHREADID', newThreadId);
                const webSocketUpdate = {
                    type: 'newThread',
                    user_id: user,
                    user2_id: inputs.user2,
                    thread_id: newThreadId,
                }
                if (websocket !== undefined) {
                    websocket.send(JSON.stringify(webSocketUpdate));
                }
            }
        } catch (e) {
            console.log(e.message);
        }
    }, [newThreadId]);

    useEffect(() => {
        (async () => {
            try {
                const users = await getUsers();
                let arrayForUsers = [];
                for (let i = 0; i < users.length; i++) {
                    if (users[i].id !== user) {
                        arrayForUsers.push(users[i]);
                    }
                }
                setUsersArray(arrayForUsers);
            } catch (e) {
                console.log(e.message);
            }
        })();
    }, []);

    return (
        <>
            <Grid container justifyContent="center" direction="column">
                <Typography variant="h3">Create a new chat thread</Typography>
                <ValidatorForm onSubmit={handleSubmit}>
                    <Grid container item justifyContent="center">
                        <TextValidator
                            type="text"
                            name="threadName"
                            label="Thread name"
                            onChange={handleInputChange}
                            value={inputs.threadName}
                            validators={validators.threadName}
                            errorMessages={errorMessages.threadName}
                        />
                    </Grid>
                    <Grid container item justifyContent="center">
                        <FormControl className={classes.formControl}>
                            <InputLabel>User</InputLabel>
                            <Select
                                name="user2"
                                value={inputs.user2}
                                label="User"
                                onChange={handleInputChange}
                                autoWidth
                                className={classes.select}
                            >
                                {usersArray.map((item) => (
                                    <MenuItem value={item.id}>{item.username}</MenuItem>
                                ))}{' '}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid container item justifyContent="center">
                        <Button
                            style={{ marginTop: '2rem', marginBottom: '0.5rem' }}
                            color="primary"
                            type="submit"
                            variant="contained"
                        >
                            Create
                        </Button>
                    </Grid>
                </ValidatorForm>
            </Grid>
        </>
    )
}

export default ThreadForm;