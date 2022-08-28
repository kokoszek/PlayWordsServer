import React from 'react';
import {createContext, useReducer, useState} from "react";

export const AuthContext = createContext({});

export const AuthContextProvider = ({children}) => {

    const [state, setState] = useState({
        user: undefined
    });
    return (
        <AuthContext.Provider value={{state, setState}}>
            {
                children
            }
        </AuthContext.Provider>
    );
}