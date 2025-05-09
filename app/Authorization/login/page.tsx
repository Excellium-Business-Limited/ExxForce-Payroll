import React from 'react'
import { LoginForm } from './components/login-form';
import  Image  from 'next/image';
import image from './components/resources/login.svg';

const LoginPage = () => {
  return (
		<div className=''>
					<div className=''>
						<LoginForm />
					</div>
		</div>
	);
}

export default LoginPage;
