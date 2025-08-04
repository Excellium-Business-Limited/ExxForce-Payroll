import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import React from 'react';

const updateRepay = () => {
	const handleSubmit = () => {
		console.log('Update repayment details');
	}
	return (
		<div className='bg-white'>
			<form action=''>
				<div className='grid grid-rows-3 gap-6'>
					<span className='m-3'>
						<Label htmlFor='Amount'>Amount</Label>
						<Input type='number' />
					</span>
					<span className='m-3'>
						<Label htmlFor='Date'>Payment Date</Label>
						<Input type='date' />
					</span>
					<span className='m-3'>
						<Label htmlFor='method'>Payment Method</Label>
						<Select>
							<SelectTrigger className='h-8 mb-0.5 w-full'>
								<SelectValue placeholder='Bank Transfer' />
							</SelectTrigger>
							<SelectContent position='popper'>
								<SelectItem value={'Bank Transfer'}>Bank Transfer</SelectItem>
								<SelectItem value={'Card'}>Card Payment</SelectItem>
								<SelectItem value={'Remita'}>Remita</SelectItem>
							</SelectContent>
						</Select>
					</span>
				</div>
				<pre className='m-4'>Amount Remaining: 600,000</pre>
				<div className='self-end'>
					<DialogClose asChild>
						<Button
							className='m-3 text-muted-foreground'
							variant='outline'>
							{' '}
							Close{' '}
						</Button>
					</DialogClose>
					<Button
						className='m-3 bg-[#3D56A8] text-white '
						variant='outline' onSubmit={handleSubmit}>
						{' '}
						Update{' '}
					</Button>
				</div>
			</form>
		</div>
	);
};

export default updateRepay;
