'use client';
import { Card } from '@/components/ui/card';
import Dialogs from '@/app/(tenant)/components/dialog';
import DeleteMod from '@/app/(tenant)/components/deleteMod';
import React, { useEffect, useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import axios from 'axios';
import { useGlobal } from '@/app/Context/page';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';

const paygrade = () => {
	const [payGrades, setPayGrades] = useState<any[]>([]);
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(true);

	const { tenant } = useGlobal();

	useEffect(() => {
		console.log(`Fetching pay grades for tenant: ${tenant}`);
		const fetchPayGrades = async () => {
			try {
				const res = await axios.get(
					`http://${tenant}.localhost:8000/tenant/payroll-settings/pay-grades`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem('access_token')}`,
						},
					}
				);
				setPayGrades(res.data);
				console.log(res.data), payGrades;
			} catch (err) {
				console.error(err);
				setError('Failed to load pay grades');
			} finally {
				setIsLoading(false);
			}
		};

		fetchPayGrades();
	}, [tenant]);
	if (isLoading) {
		return <div>Loading...</div>;
	}
	function deleteComponent(id: any): void {
		throw new Error('Function not implemented.');
	}

	return (
		<div>
			<Card className='m-3 p-4'>
				<div className='flex justify-between items-center mb-4'>
					<h1 className='text-2xl font-medium mb-2'>Pay Grades List</h1>
					<Dialog>
						<Button
							className='font-extralight bg-blue-600 hover:bg-blue-700 text-white'
							asChild>
							<DialogTrigger className='font-extralight bg-blue-600 hover:bg-blue-700 text-white'>
								Create Pay Grade
							</DialogTrigger>
						</Button>
						<DialogContent className='bg-white '>
							<DialogTitle className='hidden '></DialogTitle>
							<form className='space-y-4 w-[450px]'>
								<div className='grid gap-4'>
									<span className='block'>
										<Label className='text-gray-700'>Pay Grade name</Label>
										<input
											type='text'
											className='mt-1 block border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500'
											required
										/>
									</span>
									<span className='block'>
										<Label className='text-gray-700'>Gross Salary</Label>
										<input
											type='text'
											className='mt-1 block border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500'
											required
										/>
									</span>
								</div>
								<div>
									<h4>PayGrade Components</h4>
									<Table className='max-w-[120px]'>
										<TableHeader>
											<TableRow>
												<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
													Component Name
												</TableHead>
												<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
													Fixed Value
												</TableHead>
												<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
													Percentage Value
												</TableHead>
												<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
													Action
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											<TableRow>
												<TableCell>
													<select
														name='component'
														id=''
														className='border rounded-md p-2'>
														<option value=''>Select Component</option>
														<option value='component1'>Car Allowance</option>
														<option value='component2'>
															Housing Allowance
														</option>
													</select>
												</TableCell>
												<TableCell>
													<Label htmlFor='fixedValue'>Fixed Value</Label>
													<Input
														type='number'
														id='fixedValue'
														className='w-full my-3'
													/>
												</TableCell>
												<TableCell>
													<Label htmlFor='percentageValue'>
														Percentage Value
													</Label>
													<Input
														type='number'
														id='percentageValue'
														className='w-full my-3'
													/>
												</TableCell>
												<TableCell>
													<Button
														variant='outline'
														className=''
														onClick={() => deleteComponent('component-id')}>
														<Trash2 className='cursor-pointer text-red-600' />
													</Button>
												</TableCell>
											</TableRow>
											<TableRow>
												<TableCell>
													<select
														name='component'
														id=''>
														<option value=''>Select Component</option>
														<option value='component1'>Car Allowance</option>
														<option value='component2'>
															Housing Allowance
														</option>
													</select>
												</TableCell>
												<TableCell>
													<Label htmlFor='fixedValue'>Fixed Value</Label>
													<Input
														type='number'
														id='fixedValue'
														className='w-full my-3'
													/>
												</TableCell>
												<TableCell>
													<Label htmlFor='percentageValue'>
														Percentage Value
													</Label>
													<Input
														type='number'
														id='percentageValue'
														className='w-full my-3'
													/>
												</TableCell>
												<TableCell>
													<Button
														variant='outline'
														className=''
														onClick={() => deleteComponent('component-id')}>
														<Trash2 className='cursor-pointer text-red-600' />
													</Button>
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</div>
								<label className='block'>
									<span className='text-gray-700'>Description</span>
									<textarea
										className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500'
										rows={3}
										required></textarea>
								</label>
								<div className='mt-4 flex justify-end'>
									<button
										type='submit'
										className='bg-[#3D56A8] text-white px-4 py-2 rounded'>
										Create
									</button>
								</div>
							</form>
						</DialogContent>
					</Dialog>
				</div>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								PAYGRADE NAME
							</TableHead>
							<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								NO OF EMPLOYEES
							</TableHead>
							<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								COMPONENTS
							</TableHead>
							<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								ACTIONS
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{payGrades.map((payGrade) => (
							<TableRow key={payGrade.id}>
								<TableCell className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									{payGrade.name}
								</TableCell>
								<TableCell className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									{payGrade.employee_count}
								</TableCell>
								<TableCell className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									{payGrade.component_count}
								</TableCell>
								<TableCell className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									<span className='grid-cols-2 grid'>
										<img
											src='/icons/mage_edit.png'
											alt='#'
										/>
										<Dialog>
											<DialogTrigger className=''>
												<img
													src='/icons/delete-icon.png'
													alt=''
												/>
											</DialogTrigger>
											<DialogContent className='bg-white'>
												<DialogTitle className='hidden '></DialogTitle>
												<DeleteMod
													emp={`This will unassign ${payGrade.employee_count} employees from this pay grade `}
													title='Pay Grade'
												/>
											</DialogContent>
										</Dialog>
									</span>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Card>
		</div>
	);
};

export default paygrade;
