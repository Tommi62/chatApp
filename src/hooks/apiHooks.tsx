import config from '../config'


const doFetch = async (url: string, options = {}) => {
    console.log('smthng');
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
        };
        try {
            const result = await doFetch('/user', fetchOptions);
            console.log('RegisterResult', result.message)
            return result.message
        } catch (e) {
            alert(e.message);
        }
    };

    const postLogin = async (inputs: Object) => {
        const fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inputs),
        };
        try {
            const result = await doFetch('/login', fetchOptions);
            console.log('RegisterResult', result)
            return result
        } catch (e) {
            alert(e.message);
        }
    };

    return { getUsers, getUserAvailable, register, postLogin };
};

export { useUsers };