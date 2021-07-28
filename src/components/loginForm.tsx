import { withRouter } from 'react-router-dom';
import { Button, Grid, TextField, Typography } from '@material-ui/core';
import useForm from '../hooks/formHooks';
import { useUsers } from '../hooks/apiHooks';

interface propType {
    history: {
        push: Function,
    }
}

const LoginForm = ({ history }: propType) => {

    const { postLogin } = useUsers();
    const doLogin = async () => {
        try {
            const userdata = await postLogin(inputs);
            localStorage.setItem('id', userdata.id);
            history.push('/');
        } catch (e) {
            console.log('doLogin', e.message);
        }
    };

    const { inputs, handleInputChange, handleSubmit } = useForm(doLogin, {
        username: '',
        password: '',
    });

    return (
        <Grid container>
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
            >
                <Typography component="h1" variant="h2" gutterBottom>
                    Login
                </Typography>
            </Grid>
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
            >
                <form onSubmit={handleSubmit}>
                    <Grid container direction="column">
                        <Grid container item>
                            <TextField
                                type="text"
                                name="username"
                                label="Username"
                                onChange={handleInputChange}
                                value={inputs.username}
                            />
                        </Grid>
                        <Grid container item>
                            <TextField
                                type="password"
                                name="password"
                                label="Password"
                                onChange={handleInputChange}
                                value={inputs.password}
                            />
                        </Grid>

                        <Grid container item>
                            <Button
                                fullWidth
                                style={{ marginTop: '2rem', marginBottom: '0.5rem' }}
                                color="primary"
                                type="submit"
                                variant="contained"
                            >
                                Login
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
        </Grid>
    );
};


export default withRouter(LoginForm);