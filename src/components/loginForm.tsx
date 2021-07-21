import { withRouter } from 'react-router-dom';
import { Button, Grid, TextField, Typography } from '@material-ui/core';

const LoginForm = () => {

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
                <form >
                    <Grid container direction="column">
                        <Grid container item>
                            <TextField
                                type="text"
                                name="username"
                                label="Username"
                            />
                        </Grid>
                        <Grid container item>
                            <TextField
                                type="password"
                                name="password"
                                label="Password"
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