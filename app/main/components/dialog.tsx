import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import React from 'react';
import UpdateRepay from './updateRepay';

function dialog({
	children,
	title,
	sim,
	className,
}: {
	children: React.ReactNode;
	title: string | React.ReactNode;
	className?: string;
	sim?: string;
}) {
	return (
		<div>
			<Dialog>
				<DialogTrigger asChild>
					<Button
						variant={'outline'}
						className={className ? className : ' bg-white'}>
						{sim ? `${sim}${title}` : title}
					</Button>
				</DialogTrigger>
				<DialogContent className='bg-white'>
					<DialogTitle className='text-lg font-semibold'>{title}</DialogTitle>
					{children}
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default dialog;
