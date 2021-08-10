import React, { useState } from 'react';
import PropTypes from 'prop-types';

interface propType {
    children: any
}

type userContextState = {
    user: number;
    setUser: (id: number) => void;
};

const contextDefaultValues: userContextState = {
    user: 0,
    setUser: () => { }
};

const MediaContext = React.createContext<userContextState>(contextDefaultValues)

const MediaProvider = ({ children }: propType) => {
    const [user, setUser] = useState<number>(contextDefaultValues.user);
    return (
        <MediaContext.Provider value={{ user, setUser }}>
            {children}
        </MediaContext.Provider>
    );
};

MediaProvider.propTypes = {
    children: PropTypes.node,
};

export { MediaContext, MediaProvider };