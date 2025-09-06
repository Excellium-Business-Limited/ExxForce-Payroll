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
import { useGlobal } from '@/app/Context/context';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import CreatePayGrade from '../components/createPayGrade';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { getTenant, getAccessToken } from '@/lib/auth';
import PayGradeEdit from '../components/payGradeEdit';
import { redirect } from 'next/navigation';
import Loading from '@/components/ui/Loading';

interface ComponentDetail {
	id: string;
	component_name: string;
	fixed_value?: number;
	percentage_value?: number;
}

interface DeductionDetail {
	id: string;
	deduction_name: string;
	fixed_value?: number;
	percentage_value?: number;
}

interface FormData {
	name: string;
	gross_salary: number;
	component_details: ComponentDetail[];
	deduction_details: DeductionDetail[];
	description: string;
}

const paygrade = () => {
	const [payGrades, setPayGrades] = useState<any[]>([]);
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [tenant, setTenant] = useState('');
	const { setPayGradeId } = useGlobal();

	
	useEffect(() => {
		const tenant = getTenant();
		const token = getAccessToken();
		console.log(`Fetching pay grades for tenant: ${tenant}`);
		const baseURL = `${tenant}.exxforce.com`
		const fetchPayGrades = async () => {
			try {
				const res = await axios.get(
					`https://${baseURL}/tenant/payroll-settings/pay-grades`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				setPayGrades(res.data);
				console.log(res.data), payGrades;
			} catch (err:any) {
				console.error(err);
				setError('Failed to load pay grades');
				if (err.response?.status === 401) {
					// Redirect to login if unauthorized
					setTimeout(() => {
						redirect('/login');
					}, 2000);
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchPayGrades();
	}, []);
	if (isLoading) {
		return (
			<div>
				{' '}
				<Loading
					message='Loading Paygrades...'
					size='medium'
					variant='spinner'
					overlay={false}
				/>
			</div>
		);
	}
	function deleteComponent(id: any): void {
		throw new Error('Function not implemented.');
	}

	const createPayGrade = (data: FormData) => {
		console.log('Creating Pay Grade:', data);

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
						<DialogContent className='bg-white w-full'>
							<CreatePayGrade />
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
									<div className='grid-cols-2 grid'>
										<Dialog>
											<DialogTrigger
												className='cursor-pointer text-blue-600 hover:text-blue-800'>
												<img
													src='/icons/mage_edit.png'
													alt='#'
												/>
											</DialogTrigger>
											<DialogContent className='bg-white'>
												<DialogTitle className='hidden '></DialogTitle>
												<PayGradeEdit id={payGrade.id} name={payGrade.name} />
											</DialogContent>
										</Dialog>
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
									</div>
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
