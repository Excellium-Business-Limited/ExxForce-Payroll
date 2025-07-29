'use client';
import React, { useState } from 'react';
import axios from 'axios';
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
		try{
			const response = await login(email, password);
			console.log(response);
			const { access, refresh, redirect, tenant } = response;
			saveTokens(access, refresh);

			const redirectPath = redirect
				? new URL(redirect).pathname
				: `/${tenant}/Dashboard`;
			router.push(redirectPath);
		} catch (err: any) {
			setError(err.message || 'Invalid credentials. Please try again.');
			setIsLoading(false);
		}
	};
	return (
		<div className='bg-white'>
			{/* <LoginForm /> */}
			<form action="submit">
				<label htmlFor="email">Email</label>
				<input type="email" onChange={(e) => setEmail(e.target.value)} />
				<label htmlFor="password">Password</label>
				<input type="password" onChange={(e) => setPassword(e.target.value)} />
				<button onClick={handleLogin}>Login</button>
			</form>
		</div>
	);
};

export default LoginPage;
