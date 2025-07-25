import React, { useState } from 'react'
import { LoginForm } from './components/login-form';
import  Image  from 'next/image';
import image from './components/resources/login.svg';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
  return (
					<div className='bg-white'>
						<LoginForm />
					</div>
	);
}

export default LoginPage;
