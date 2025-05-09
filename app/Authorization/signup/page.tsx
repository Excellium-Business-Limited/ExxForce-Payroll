import { GalleryVerticalEnd } from 'lucide-react';

import { SignupForm } from './components/signupform';

export default function LoginPage() {
	return (
		<div className='grid min-h-svh lg:grid-cols-2'>
					<div className='w-full max-w-xs'>
						<SignupForm />
					</div>
		</div>
	);
}
