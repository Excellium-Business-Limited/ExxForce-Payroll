 'use client';
import { getTenant } from '@/lib/auth';
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
    const getEmployees = () =>{
        if (tenant) {
                    updateGlobalState({ tenant : tenant });
                  const emps =   fetchEmployees(tenant).then((data) => {
                        setEmployees(data);
                        // updateGlobalState({ employees: data });
                        console.log(employees);
                    }).catch((error) => {
                        console.error("Error fetching employees:", error);
                    });
                }
    }
    const tenant = getTenant()

    return (
        <Global.Provider value={{ Global, globalState, updateGlobalState, getEmployees, tenant }}>
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
