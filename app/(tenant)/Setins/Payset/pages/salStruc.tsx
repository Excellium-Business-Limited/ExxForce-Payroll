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
				<div>
					<h1>Salary Components</h1>
					<Dialog>
						<DialogTrigger asChild>
							<Button className='bg-blue-600 text-white rounded-md px-4 py-2'>
								+ Add New Component
							</Button>
						</DialogTrigger>
						<form onSubmit={handleSubmit}>
							<DialogContent className=' bg-white'>
								<DialogHeader>
									<DialogTitle>Add New Salary Component</DialogTitle>
								</DialogHeader>
								<section>
									<span>
										<Label htmlFor='componentName'>Component Name</Label>
										<Input
											type='text'
											id='componentName'
											placeholder='Enter component name'
											className='w-full my-3'
										/>
									</span>
									<span>
										<Label htmlFor='payslipName'>Name in Payslip</Label>
										<Input
											type='text'
											id='payslipName'
											placeholder='Enter name in payslip'
											className='w-full my-3'
										/>
									</span>
								</section>
								<section>
									<span>
										<Label htmlFor='calculationType'>Calculation Type</Label>
										<Select>
											<SelectTrigger className='w-full my-3'>
												<SelectValue placeholder='Select calculation type' />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='fixed'>Fixed</SelectItem>
												<SelectItem value='percentage'>
													Percentage Based
												</SelectItem>
											</SelectContent>
										</Select>
									</span>
									<span>
										<Label htmlFor='value'>Value</Label>
										<Input
											type='number'
											id='value'
											placeholder='Enter value'
											className='w-full my-3'
										/>
									</span>
								</section>
								<section>
									<span>
										<Checkbox id='isTaxable' />
										<Label htmlFor='isTaxable'>Taxable</Label>
										<p className='text-sm text-gray-500'>
											Select if this component is taxable
										</p>
									</span>
									<span>
										<Checkbox id='isPensionable' />
										<Label htmlFor='isPensionable'>Pensionable</Label>
										<p className='text-sm text-gray-500'>
											Select if this component is pensionable
										</p>
									</span>
								</section>
								<DialogFooter>
									<div>
										<DialogClose asChild>
											<Button
												type='button'
												variant='outline'
												className='m-2 bg-white text-gray-700 rounded-md px-4 py-2'
												onClick={() => setAdd(false)}>
												Cancel
											</Button>
										</DialogClose>
										<Button
											type='submit'
											className='bg-blue-600 text-white text-sm rounded-md px-4 py-2'>
											Save
										</Button>
									</div>
								</DialogFooter>
							</DialogContent>
						</form>
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
