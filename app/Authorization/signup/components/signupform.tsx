import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import image from './resources/login.svg';
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
			<Card className='h-full p-0 overflow-hidden self-center sm:w-[50%] mt-10 w-full md:w-[80%] lg:w-[90%] xl:w-[90%] 2xl:w-[90%]'>
				<CardContent className='grid min-h-svh p-0 lg:grid-cols-2'>
					<div className='relative h-full xl:h-[100%] bg-muted md:block'>
						<Image
							src={image}
							alt='Image'
							className='absolute inset-0 w-full h-full object-cover dark:brightness-[0.2] dark:grayscale'
						/>
					</div>
					<form className='p-6 md:p-8'>
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
