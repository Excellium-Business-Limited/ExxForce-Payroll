import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import React from 'react'

interface AddProps {
  title: string;
}

const add = ({ title }: AddProps) => {
return (
	<div>
		<h3>Add {title}</h3>
		<form action=''>
			<span>
				<Label htmlFor='name'>{title} name</Label>
				<Input
					type='text'
					id='name'
					required
				/>
			</span>
			<span>
				<Label htmlFor='description'>Description</Label>
				<Textarea
					id='description'
					required
				/>
			</span>
		</form>
		<span className='self-end gap-4 flex justify-between'>
			<Button className='rounded-lg p-2 text-[#3D56A8] w-[80px] border h-[38px] bg-white'>
				<DialogClose>Close</DialogClose>
			</Button>
			<Button
				formAction={() => {}}
				className='bg-[#3D56A8] text-white'>
				Submit
			</Button>
		</span>
	</div>
);
}

export default add
