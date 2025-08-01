// app/providers.tsx
'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from './Context/AuthContext'; // Import the new AuthProvider

interface ProvidersProps {
	children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
	return (
		// We now wrap our app with the AuthProvider
		<AuthProvider>{children}</AuthProvider>
	);
}
