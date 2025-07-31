 'use client';
import { createContext, useContext, useState, } from 'react';

export const Global = createContext()
export const GlobalProvider = ({ children }) => {
    const [globalState, setGlobalState] = useState({
        tenant: '',
        tenantName: '',
        tenantLogo: '',
    });

    const updateGlobalState = (newState) => {
        setGlobalState((prevState) => ({ ...prevState, ...newState }));
    };

    return (
        <Global.Provider value={{ Global, globalState, updateGlobalState }}>
            {children}
        </Global.Provider>
    );
}

export const useGlobal = () =>{
    const context = useContext(Global);
    if (!context) {
        throw new Error('useGlobal must be used within a GlobalProvider');
    }
    return context;
}
