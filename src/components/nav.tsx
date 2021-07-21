import { Link as RouterLink } from 'react-router-dom';
import {
    AppBar,
    makeStyles,
    Toolbar,
    Link,
    Button,
} from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const useStyles = makeStyles((theme) => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        paddingRight: '24px',
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    itemPack: {
        display: 'flex',
        alignItems: 'center',
    },
    logo: {
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        left: '130px',
        transform: 'translate(-50%)',
    },
}));

const Nav = () => {
    const classes = useStyles();

    return (
        <>
            <AppBar className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <Link
                        component={RouterLink}
                        to="/"
                        className={classes.logo}
                        color="inherit"
                        style={{ textDecoration: 'none' }}
                    >
                        <h2>ChatApp</h2>
                    </Link>
                    <div className={classes.itemPack}>
                        <Button
                            color="inherit"
                            startIcon={<ExitToAppIcon />}
                            component={RouterLink}
                            to="/login"
                        >
                            Login
                        </Button>
                    </div>
                </Toolbar>
            </AppBar>
        </>
    );
};

export default Nav;