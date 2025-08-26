'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface RefreshTokenResponse {
	access: string;
	refresh?: string;
}

interface TokenRefreshContextType {
	isRefreshing: boolean;
	error: string | null;
	refreshToken: () => Promise<RefreshTokenResponse | null>;
}

const TokenRefreshContext = createContext<TokenRefreshContextType | undefined>(
	undefined
);

interface TokenRefreshProviderProps {
	children: React.ReactNode;
	apiBaseUrl: string;
}

export const TokenRefreshProvider: React.FC<TokenRefreshProviderProps> = ({
	children,
	apiBaseUrl,
}) => {
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [hasInitialRefresh, setHasInitialRefresh] = useState(false);

	const refreshAccessToken = async (): Promise<RefreshTokenResponse | null> => {
		try {
			const refreshToken = localStorage.getItem('refresh_token');

			if (!refreshToken) {
				console.warn('No refresh token found');
				return null;
			}

			const response = await fetch(`${apiBaseUrl}/api/token/refresh`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					refresh: refreshToken,
				}),
			});

			if (!response.ok) {
				if (response.status === 401) {
					// Refresh token is invalid or expired
					localStorage.removeItem('refresh_token');
					localStorage.removeItem('access_token');
					throw new Error('Session expired. Please log in again.');
				}

				const errorData = await response.json().catch(() => ({}));
				const errorMessage =
					errorData.detail ||
					errorData.message ||
					`HTTP ${response.status}: ${response.statusText}`;

				throw new Error(`Failed to refresh token: ${errorMessage}`);
			}

			const data: RefreshTokenResponse = await response.json();

			// Store the new access token
			localStorage.setItem('access_token', data.access);

			// If a new refresh token is provided, update it
			if (data.refresh) {
				localStorage.setItem('refresh_token', data.refresh);
			}

			return data;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			}
			throw new Error(`Network error while refreshing token: ${error}`);
		}
	};

	const refreshToken = async (): Promise<RefreshTokenResponse | null> => {
		setIsRefreshing(true);
		setError(null);

		try {
			const result = await refreshAccessToken();
			return result;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Unknown error occurred';
			setError(errorMessage);
			console.error('Token refresh failed:', errorMessage);
			return null;
		} finally {
			setIsRefreshing(false);
		}
	};

	// Auto-refresh token on app initialization
	useEffect(() => {
		const initializeTokenRefresh = async () => {
			const refreshTokenValue = localStorage.getItem('refresh_token');
			if (refreshTokenValue && !hasInitialRefresh) {
				console.log('Auto-refreshing token on app load...');
				await refreshToken();
				setHasInitialRefresh(true);
			} else {
				setHasInitialRefresh(true);
			}
		};

		initializeTokenRefresh();
	}, []);

	// Show loading screen during initial refresh
	if (!hasInitialRefresh && isRefreshing) {
		return (
			<div className='flex items-center justify-center min-h-screen bg-white text-blue-700'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mx-auto mb-4'></div>
					<p>Refreshing authentication...</p>
				</div>
			</div>
		);
	}

	return (
		<TokenRefreshContext.Provider value={{ isRefreshing, error, refreshToken }}>
			{children}
		</TokenRefreshContext.Provider>
	);
};

export const useTokenRefresh = (): TokenRefreshContextType => {
	const context = useContext(TokenRefreshContext);
	if (!context) {
		throw new Error(
			'useTokenRefresh must be used within a TokenRefreshProvider'
		);
	}
	return context;
};


