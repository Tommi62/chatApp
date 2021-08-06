import config from '../config'

const doFetch = async (url: string, options = {}) => {
    const response = await fetch(config.backendUrl + url, options);
    const json = await response.json();
    if (json.error) {
        // if API response contains error message (use Postman to get further details)
        throw new Error(json.message + ': ' + json.error);
    } else if (!response.ok) {
        // if API response does not contain error message, but there is some other error
        throw new Error('doFetch failed');
    } else {
        // if all goes well
        return json;
    }
};

const useUsers = () => {

    const getUsers = async () => {
        const fetchOptions = {
            method: 'GET',
            credentials: 'include',
        };
        try {
            return await doFetch('/users', fetchOptions);
        } catch (e) {
            throw new Error(e.message);
        }
    };

    const getUserAvailable = async (username: String) => {
        try {
            return await doFetch('/users/username/' + username);
        } catch (e) {
            alert(e.message);
        }
    };

    const register = async (inputs: Object) => {
        const fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inputs),
            credentials: 'include',
        };
        try {
            const result = await doFetch('/user', fetchOptions);
            console.log('RegisterResult', result.message)
            return result.message
        } catch (e) {
            alert(e.message);
        }
    };

    const getIsLoggedIn = async () => {
        const fetchOptions = {
            method: 'GET',
            credentials: 'include',
        };
        try {
            return await doFetch('/isloggedin', fetchOptions);
        } catch (e) {
            throw new Error(e.message);
        }
    };

    const postLogin = async (inputs: Object) => {
        const fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inputs),
            credentials: 'include',
        };
        try {
            const result = await doFetch('/login', fetchOptions);
            return result
        } catch (e) {
            alert(e.message);
        }
    };

    const logout = async () => {
        const fetchOptions = {
            method: 'DELETE',
            credentials: 'include',
        };
        try {
            return await doFetch('/logout', fetchOptions);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    const getProfile = async () => {
        const fetchOptions = {
            method: 'GET',
            credentials: 'include',
        };
        try {
            return await doFetch('/profile', fetchOptions);
        } catch (e) {
            throw new Error(e.message);
        }
    };

    return { getUsers, getUserAvailable, register, getIsLoggedIn, postLogin, logout, getProfile };
};

const useChats = () => {

    const getThreadIds = async (userId: number) => {
        try {
            return await doFetch('/threads/' + userId);
        } catch (e) {
            alert(e.message);
        }
    };

    const getThreadName = async (threadId: number) => {
        try {
            const thread = await doFetch('/thread/' + threadId);
            return thread.name;
        } catch (e) {
            alert(e.message);
        }
    };

    return { getThreadIds, getThreadName }
}

export { useUsers, useChats };