/* eslint-disable react-hooks/exhaustive-deps */
import useForm from '../hooks/formHooks';
import { useUsers } from '../hooks/apiHooks';
import { Grid, Typography, Button } from '@material-ui/core';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { useEffect } from 'react';
import PropTypes from 'prop-types';

interface propType {
    setToggle: Function
}

const RegisterForm = ({ setToggle }: propType) => {
    const { register, getUserAvailable } = useUsers();
    const validators = {
        username: ['required', 'minStringLength: 3', 'isAvailable'],
        password: ['required', 'minStringLength:5'],
        confirm: ['required', 'isPasswordMatch'],
    };

    const errorMessages = {
        username: [
            'Required field',
            'Minimum of 3 characters',
            'Username is not available',
        ],
        password: ['Required field', 'Minimum of 5 characters'],
        confirm: ['Required field', 'Passwords do not match'],
    };

    const doRegister = async () => {
        try {
            const available = await getUserAvailable(inputs.username);
            if (available) {
                delete inputs.confirm;
                const result = await register(inputs);
                if (result.length > 0) {
                    alert(result);
                    setToggle(true);
                }
            }
        } catch (e) {
            console.log(e.message);
        }
    };

    const { inputs, handleInputChange, handleSubmit } = useForm(doRegister, {
        username: '',
        password: '',
        confirm: '',
    });

    useEffect(() => {
        ValidatorForm.addValidationRule('isAvailable', async (value) => {
            if (value.length > 2) {
                try {
                    const available = await getUserAvailable(value);
                    return available;
                } catch (e) {
                    console.log(e.message);
                    return true;
                }
            }
        });

        ValidatorForm.addValidationRule(
            'isPasswordMatch',
            (value) => value === inputs.password
        );
    }, [inputs]);

    return (
        <Grid container alignItems="center">
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
            >
                <Typography component="h1" variant="h2" gutterBottom>
                    Register
                </Typography>
            </Grid>
            <Grid item xs={12} container direction="column" alignItems="center">
                <ValidatorForm onSubmit={handleSubmit}>
                    <Grid container direction="column">
                        <Grid container item>
                            <TextValidator
                                fullWidth
                                type="text"
                                name="username"
                                label="Username"
                                onChange={handleInputChange}
                                value={inputs.username}
                                validators={validators.username}
                                errorMessages={errorMessages.username}
                            />
                        </Grid>

                        <Grid container item>
                            <TextValidator
                                fullWidth
                                type="password"
                                name="password"
                                label="Password"
                                onChange={handleInputChange}
                                value={inputs.password}
                                validators={validators.password}
                                errorMessages={errorMessages.password}
                            />
                        </Grid>

                        <Grid container item>
                            <TextValidator
                                fullWidth
                                type="password"
                                name="confirm"
                                label="Confirm password"
                                onChange={handleInputChange}
                                value={inputs.confirm}
                                validators={validators.confirm}
                                errorMessages={errorMessages.confirm}
                            />
                        </Grid>

                        <Grid container item>
                            <Button
                                style={{ marginTop: '2rem', marginBottom: '0.5rem' }}
                                fullWidth
                                color="primary"
                                type="submit"
                                variant="contained"
                            >
                                Register
                            </Button>
                        </Grid>
                    </Grid>
                </ValidatorForm>
            </Grid>
        </Grid>
    );
};

RegisterForm.propTypes = {
    setToggle: PropTypes.func,
};

export default RegisterForm;