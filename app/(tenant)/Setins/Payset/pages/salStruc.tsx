'use client';
import { useGlobal } from '@/app/Context/page';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
	DialogClose,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { set } from 'date-fns';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import AddSs from '../components/addSalaryStruc';

const salStruc = () => {
	const [isEmpty, setIsEmpty] = React.useState(true);
	const [add, setAdd] = React.useState(false);
	const [value, setValue] = React.useState('');
	const [components, setComponents] = useState<any[]>([]);
	const [error, setError] = useState('');
	const { tenant } = useGlobal();

	useEffect(() => {
		const fetchComponents = async () => {
			try {
				const res = await fetch(
					`http://${tenant}.localhost:8000/tenant/payroll-settings/salary-components`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem('access_token')}`,
						},
					}
				);

				if (!res.ok) throw new Error('Failed to load salary components');

				const data = await res.json();
				setComponents(data);
				setIsEmpty(false);
			} catch (err: any) {
				console.error(err);
				setError(err.message || 'Something went wrong');
			}
		};

		fetchComponents();
	}, [tenant]);

	const ShowAdd = (e: React.FormEvent) => {
		e.preventDefault();
		setAdd(true);
		if (add) {
			return (
				<div className='flex flex-col items-center justify-center h-full'>
					<h1 className='text-2xl font-bold mb-4'>Add Salary Structure</h1>
					{/* Add your form or content for adding salary structure here */}
				</div>
			);
		}
		setIsEmpty(false);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
	};
	if (isEmpty) {
		return (
			<div>
				<div className='flex flex-row items-center justify-between h-full'>
					<h1 className='text-2xl font-bold mb-4'>Salary Structure</h1>
					<Button
						onClick={() => {
							setIsEmpty(false);
							setAdd(true);
						}}
						variant={'outline'}
						className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2'>
						+ Create Salary Structure
					</Button>
				</div>
				<div className='text-center max-w-2xl mx-auto mt-[120px]'>
					<img
						src='/Salary-img.jpg'
						alt='Team Illustration'
						className='w-32 h-32 md:w-40 md:h-40 mx-auto mb-8'
					/>
					<h2 className='text-2xl md:text-3xl  mb-4'>
						No Salary Structure Yet
					</h2>
					<pre className='text-base text-muted-foreground mb-8'>
						Create and Manage reusable salary structure <br /> templates.
					</pre>
					<Button
						onClick={() => {
							setIsEmpty(false);
							setAdd(true);
						}}
						variant={'outline'}
						className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2'>
						+ Create Salary Structure
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div>
			<Card className='border-none shadow-none m-3 p-4'>
				<div className='flex justify-between w-full'>
					<h1>Salary Components</h1>
					<Dialog>
						<DialogTrigger asChild>
							<Button className='bg-blue-600 text-white rounded-md px-4 py-2'>
								+ Add New Component
							</Button>
						</DialogTrigger>
						<DialogContent className='bg-white'>
							<AddSs/>
						</DialogContent>
					</Dialog>
				</div>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								NAME
							</TableHead>
							<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								CALCULATION TYPE
							</TableHead>
							<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								TAXABLE
							</TableHead>
							<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								PENSIONABLE
							</TableHead>
							<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								STATUS
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{components.map((component) => {
							return (
								<TableRow key={component.id}>
									<TableCell className='uppercase font-extralight px-6 py-3 text-left text-gray-600 tracking-wider'>
										{component.name}
									</TableCell>
									<TableCell className='uppercase font-extralight px-6 py-3 text-left text-gray-600 tracking-wider'>
										{component.calculation_type}
									</TableCell>
									<TableCell className='uppercase font-extralight px-6 py-3 text-left text-gray-600 tracking-wider'>
										{component.is_taxable ? 'Taxable' : 'Not Taxable'}
									</TableCell>
									<TableCell className='uppercase font-extralight px-6 py-3 text-left text-gray-600 tracking-wider'>
										{component.is_pensionable
											? 'Pensionable'
											: 'Not Pensionable'}
									</TableCell>
									<TableCell className={`text-center text-[#47aa9c]`}>
										<p className='bg-[#e6f6f4] rounded-2xl p-1'>Active</p>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</Card>
		</div>
	);
};

export default salStruc;
