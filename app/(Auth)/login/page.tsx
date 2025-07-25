'use client';
import React, { useState } from 'react';
import { LoginForm } from './components/login-form';
import Image from 'next/image';
import image from './components/resources/login.svg';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api';
import { saveTokens } from '@/lib/auth';

const LoginPage = () => {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setIsLoading(true);

		try {
			const response = await login(email, password);
			const { access, refresh, redirect, tenant } = response;

			saveTokens(access, refresh);

			const redirectPath = redirect
				? new URL(redirect).pathname
				: `/${tenant}/dashboard`;
			router.push(redirectPath);
		} catch (err: any) {
			setError(err.message || 'Invalid credentials. Please try again.');
			setIsLoading(false);
		}
	};
	return (
		<div className='bg-white'>
			<LoginForm />
		</div>
	);
};

export default LoginPage;
