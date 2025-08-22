// context/AuthContext.tsx
'use client';

import React, {
	createContext,
	useContext,
	useState,
	useMemo,
	ReactNode,
} from 'react';

// 1. Define the type for the context value
interface AuthContextType {
	isLoggedIn: boolean;
	tenantId: string | null;
	logIn: (tenantId: string) => void;
	logOut: () => void;
}

// 2. Create the Context with an initial value of 'undefined'
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Define the props for the Provider component
interface AuthProviderProps {
	children: ReactNode;
}

// 4. Create a Provider component to manage the state
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
	const [tenantId, setTenantId] = useState<string | null>(null);

	const logIn = (id: string) => {
		// In a real application, you'd perform a login API call here
		setIsLoggedIn(true);
		setTenantId(id);
		console.log(`User logged in with tenant ID: ${id}`);
	};

	const logOut = () => {
		// In a real application, you'd perform a logout API call here
		setIsLoggedIn(false);
		setTenantId(null);
		console.log('User logged out');
	};

	// Memoize the context value to prevent unnecessary re-renders
	const contextValue = useMemo(
		() => ({
			isLoggedIn,
			tenantId,
			logIn,
			logOut,
		}),
		[isLoggedIn, tenantId]
	);

	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	);
};

// 5. Create a custom hook for easy and type-safe consumption
export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
