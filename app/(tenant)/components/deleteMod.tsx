import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import React from 'react';

const deleteMod = ({ emp, title }: { emp: string; title?: string }) => {
	return (
		<div className='flex flex-col content-center items-center px-5 bg-white'>
			<span>
				<img
					src='/icons/delete-icon.png'
					alt=''
					className='rounded-full p-4 bg-[#f7e2de] my-4'
				/>
			</span>
			<h2 className='font-bold my-4'>Delete {title}</h2>
			<p>This {emp}</p>
			<section className='flex gap-5 my-4'>
				<Button
					className='bg-[#d9d9d9]'
					variant={'default'}
					asChild>
					<DialogClose>Cancel</DialogClose>
				</Button>
				<Button
					className='bg-blue-600 text-white'
					variant={'destructive'}>
					Delete
				</Button>
			</section>
		</div>
	);
};

export default deleteMod;
