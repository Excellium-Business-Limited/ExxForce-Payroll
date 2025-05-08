import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import image from './resources/login.svg'
import { Label } from '@/components/ui/label';
import Image from 'next/image';

export function LoginForm({
	className,
	...props
}: React.ComponentProps<'div'>) {
	return (
		<div
			className={cn(
				'flex flex-col gap-6 justify-center min-h-screen items-center self-center',
				className
			)}
			{...props}>
			<Card className='h-full overflow-hidden self-center mt-10 w-3xl'>
				<CardContent className='h-full grid p-0 md:grid-cols-2'>
					<div className='relative hidden bg-muted md:block'>
						<Image
							src={image}
							alt='Image'
							className='absolute inset-0 w-full object-cover dark:brightness-[0.2] dark:grayscale'
						/>
					</div>
					<form className='p-6 md:p-8'>
						<div className='flex flex-col gap-6'>
							<div className='flex flex-col items-center text-center'>
								<h1 className='text-2xl font-bold'>Welcome Back to ExxForce</h1>
								<p className='text-balance text-muted-foreground'>
									Login to your Acme Inc account
								</p>
							</div>
							<div className='grid gap-2'>
								<Label htmlFor='email'>Email</Label>
								<Input
									id='email'
									type='email'
									placeholder='m@example.com'
									required
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
								/>
							</div>
							<Button
								type='submit'
								className='w-full'>
								Login
							</Button>
							<div className='relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'>
								<span className='relative z-10 bg-background px-2 text-muted-foreground'>
									Or continue with
								</span>
							</div>
							<div className='grid grid-cols-3 gap-4'>
								<Button
									variant='outline'
									className='w-full'>
									<p>Apple</p>
									<span className='sr-only'>Login with Apple</span>
								</Button>
								<Button
									variant='outline'
									className='w-full'>
									<p>Google</p>
									<span className='sr-only'>Login with Google</span>
								</Button>
								<Button
									variant='outline'
									className='w-full'>
									<p>Meta</p>
									<span className='sr-only'>Login with Meta</span>
								</Button>
							</div>
							<div className='text-center text-sm'>
								Don&apos;t have an account?{' '}
								<a
									href='#'
									className='underline underline-offset-4'>
									Sign up
								</a>
							</div>
						</div>
					</form>
				</CardContent>
			</Card>
			<div className='text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary'>
				By clicking continue, you agree to our <a href='#'>Terms of Service</a>{' '}
				and <a href='#'>Privacy Policy</a>.
			</div>
		</div>
	);
}
