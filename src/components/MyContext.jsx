import React, { createContext, useState } from 'react';

export const MyContext = createContext();

export const MyProvider = ({ children }) => {
    const [empidNumber, setEmpidNumber] = useState(null);

    return (
        <MyContext.Provider value={{ empidNumber, setEmpidNumber }}>
            {children}
        </MyContext.Provider>
    );
};

