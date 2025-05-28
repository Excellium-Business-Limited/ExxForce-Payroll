import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import React from 'react'
import UpdateRepay from './updateRepay';

function dialog({children}: {children: React.ReactNode}) {
  return (
		<div>
			<Dialog>
				<DialogTrigger asChild>
					<Button
						variant={'outline'}
						className='bg-[#3D56A8] text-white'>
						Update Repayment
					</Button>
				</DialogTrigger>
				<DialogContent className='bg-white'>
					<DialogTitle className='text-lg font-semibold'>
						Update Repayment{' '}
					</DialogTitle>
					{children}
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default dialog