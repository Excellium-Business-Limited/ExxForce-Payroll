import React from 'react'
import { LoginForm } from './components/login-form';

const LoginPage = () => {
  return (
		<div>
			{/* <div className='w-full max-w-sm md:max-w-3xl'> */}
			<div className='ml-7 w-full max-w-sm md:max-w-full'>
				<LoginForm /> 
			</div>
		</div>
	);
}

export default LoginPage;
