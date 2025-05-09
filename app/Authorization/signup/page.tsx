import { GalleryVerticalEnd } from 'lucide-react';

import { LoginForm } from '../login/components/login-form';

export default function LoginPage() {
	return (
		<div className='grid min-h-svh lg:grid-cols-2'>
					<div className='w-full max-w-xs'>
						<LoginForm />
					</div>
		</div>
	);
}
