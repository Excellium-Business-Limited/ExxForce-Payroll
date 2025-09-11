// hooks/useAuthGuard.ts
import { useEffect, useState } from 'react';
import { getAccessToken, getTenant } from '@/lib/auth';

export const useAuthGuard = () => {
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		const checkAuth = () => {
			const token = getAccessToken();
			const tenant = getTenant();

			if (token && tenant) {
				setIsReady(true);
			} else {
				setTimeout(checkAuth, 100);
			}
		};

		checkAuth();
	}, []);

	return isReady;
};
