
'use client'
import React from 'react';
import axios from 'axios';
import { LoginForm } from './components/login-form';
import Image from 'next/image';
import image from './components/resources/login.svg';
import { useRouter } from 'next/navigation';
import { useGlobal } from '@/app/Context/page';
import { login } from '@/lib/api';
import { setTenant, saveTokens } from '@/lib/auth';

const LoginPage = () => {

	return (
		<div className='bg-white'>
			<LoginForm/>
			{/* <form action="submit">
				<label htmlFor="email">Email</label>
				<input type="email" onChange={(e) => setEmail(e.target.value)} />
				<label htmlFor="password">Password</label>
				<input type="password" onChange={(e) => setPassword(e.target.value)} />
				<button onClick={handleLogin}>Login</button>
				{error ? <p className="text-red-500">{error}</p> : null}
			</form> */}
		</div>
	);
};

export default LoginPage;
