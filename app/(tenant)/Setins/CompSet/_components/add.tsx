import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getTenant, setTenant } from '@/lib/auth';
import React, { useEffect } from 'react';

interface AddProps {
	title: string;
}

const add = ({ title }: AddProps) => {
	const [add, setAdd] = React.useState(false);
	const [tenant, setTenant] = React.useState<string>('');
	const [dept, setDept] = React.useState<string>('');
	const baseUrl = `http://${tenant}.localhost:8000`;
	const handleDeptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setDept(e.target.value);
		console.log('Department name:', e.target.value);
	};
	const handleAdd = async () => {
		const action = title === 'Department' ? 'departments' : 'designations';
		try {
			const res = await fetch(`${baseUrl}/tenant/employee/${action}/create`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
				},
				body: JSON.stringify({ name: dept }),
			});
			if (res.ok) {
				console.log('Added successfully');
				setAdd(false);
			}
			if (!res.ok) throw new Error('Failed to add');
			const data = await res.json();
			console.log(data);
		} catch (error) {
			console.error(error);
		}
	};
	useEffect(() => {
		const t = getTenant();
		setTenant(t ?? '');
	}, []);
	return (
		<div>
			<h3>Add {title}</h3>
			<form action=''>
				<span>
					<Label htmlFor='name'>{title} name</Label>
					<Input
						type='text'
						id='name'
						onChange={handleDeptChange}
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
				<Button
					className='rounded-lg p-2 text-[#3D56A8] w-[80px] border h-[38px] bg-white'
					asChild>
					<DialogClose>Close</DialogClose>
				</Button>
				<Button
					onClick={handleAdd}
					type='submit'
					className='bg-[#3D56A8] text-white'>
					Submit
				</Button>
			</span>
		</div>
	);
};

export default add;
