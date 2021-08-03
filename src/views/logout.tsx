import PropTypes from 'prop-types';
import { useContext, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { MediaContext } from '../contexts/mediaContext';
import { useUsers } from '../hooks/apiHooks';

interface propType {
    history: {
        push: Function,
    }
}

const Logout = ({ history }: propType) => {
    const { logout } = useUsers();
    const { user, setUser } = useContext(MediaContext);

    useEffect(() => {
        (async () => {
            try {
                console.log('USER:', user)
                const isLoggedIn = await logout();
                setUser(0);
                console.log('Logout success: ', isLoggedIn.success, user)
            } catch (e) {
                console.log(e.message);
            }
        })();
    });

    return (
        <>
            <Redirect to={'/login'} />
        </>
    );
};

Logout.propTypes = {
    history: PropTypes.object,
};

export default Logout;