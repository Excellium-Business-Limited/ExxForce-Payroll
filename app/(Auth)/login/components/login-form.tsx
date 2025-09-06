'use client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import image from './resources/login.jpg';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import React, { useState } from 'react';
import { useGlobal } from '@/app/Context/context';
import { login } from '@/lib/api';
import { setTenant, saveTokens } from '@/lib/auth';

export function LoginForm({ className }: { className?: string }) {
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isSuccess, setIsSuccess] = useState(false);
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const { updateGlobalState } = useGlobal();

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
		console.log('Email changed:', e.target.value);
	};
	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
		console.log('Password changed:', e.target.value);
	};
	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setIsLoading(true);
		setIsSuccess(false);

		try {
			console.log('Attempting login to server...');
			const response = await login(email, password);
			console.log('Login successful:', response);

			const { access, refresh, redirect, tenant } = response;

			setIsSuccess(true);
			setError('');

			saveTokens(access, refresh);
			setTenant(tenant);
			updateGlobalState({
				tenant: tenant,
				access: access,
				refresh: refresh,
			});

			setTimeout(() => {
				const redirectPath = new URL(redirect).pathname;
				router.push(redirectPath);
			}, 500);
		} catch (err: any) {
			console.error('Login failed:', err);
			setError(err.message || 'Invalid credentials. Please try again.');
			setIsSuccess(false);
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<div className={cn('flex flex-col gap-4', className)}>
			<div className='h-auto p-0 overflow-hidden mt-0 self-center sm:w-[50%] w-full md:w-[80%] lg:w-[90%] xl:w-[90%] 2xl:w-[90%]'>
				<CardContent className='grid min-h-svh p-0 lg:grid-cols-2'>
					<div className='relative h-full xl:h-[100%] bg-muted md:block'>
						<Image
							src={image}
							alt='Image'
							className='absolute inset-0 w-full h-full object-cover dark:brightness-[0.2] dark:grayscale'
						/>
					</div>
					<form
						className='p-6 md:p-8'
						onSubmit={handleLogin}>
						<div className='flex flex-col gap-6'>
							<div className='flex flex-col items-center text-center'>
								<h1 className='text-2xl font-bold'>Welcome Back to ExxForce</h1>
								<p className='text-balance text-muted-foreground'>
									Login to your account
								</p>
							</div>
							<div className='grid gap-2'>
								<Label htmlFor='email'>Email</Label>
								<Input
									id='email'
									type='email'
									placeholder='m@example.com'
									required
									onChange={handleEmailChange}
								/>
							</div>
							<div className='grid gap-2'>
								<div className='flex items-center'>
									<Label htmlFor='password'>Password</Label>
									<a
										href='#'
										className='ml-auto text-sm underline-offset-2 hover:underline'>
										Forgot your password?
									</a>
								</div>
								<Input
									id='password'
									type='password'
									required
									onChange={handlePasswordChange}
								/>
							</div>
							{error && (
								<div className='text-red-500 text-sm mt-2 text-center'>
									{error}
								</div>
							)}
							{isSuccess && (
								<div className='text-green-500 text-sm mt-2 text-center'>
									Login successful! Redirecting...
								</div>
							)}
							<Button
								type='submit'
								className='w-full bg-[#3D56A8]'
								disabled={isLoading}>
								{isLoading ? 'Logging in...' : 'Login'}
							</Button>
							<div className='relative flex items-center py-4'>
								<Input
									id='remember-me'
									type='checkbox'
									className='h-4 w-4 rounded border-gray-300 text-[#3D56A8] focus:ring-[#3D56A8]'
								/>
								<Label
									htmlFor='remember-me'
									className=' ml-1.5'>
									Remember me{' '}
								</Label>
							</div>
							<div className='text-center text-sm'>
								You are new here?{' '}
								<a
									href='./signup'
									className='underline underline-offset-4 text-blue-400 hover:text-blue-600'>
									Create an account
								</a>
							</div>
						</div>
					</form>
				</CardContent>
			</div>
		</div>
	);
}
