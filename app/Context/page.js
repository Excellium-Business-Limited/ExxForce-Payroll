 'use client';
import { getTenant } from '@/lib/auth';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchEmployees } from '@/lib/api';

export const Global = createContext()
export const GlobalProvider = ({ children }) => {
    const [employees, setEmployees] = useState([]);
    const [tenant, setTenant] = useState('');
    const [globalState, setGlobalState] = useState({
        tenant: '',
        tenantName: '',
        accessToken: '',
        refreshToken: '',
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

    useEffect(() => {
			const accessToken = localStorage.getItem('access_token');
			const refreshToken = localStorage.getItem('refresh_token');

			if (accessToken || refreshToken) {
				updateGlobalState({
					accessToken: accessToken || '',
					refreshToken: refreshToken || '',
				});
			}
		}, []);

    useEffect(() => {
        const t = getTenant();
        setTenant(t);
    }, []);

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
