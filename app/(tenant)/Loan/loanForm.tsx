'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { SelectItem } from '@radix-ui/react-select';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { DialogClose } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import { getAccessToken, getTenant } from '@/lib/auth';
import { get } from 'http';

interface LoanType {
	id: number;
	name: string;
	is_interest_applied: boolean;
	interest_rate: string | null;
	interest_method: string | null;
}

interface Employee {
	id: number;
	employee_id: string;
	first_name: string;
	last_name: string;
}

export default function LoanForm({ className }: { className?: string }) {
	const pathname = usePathname();
	const router = useRouter();
	const tenant = getTenant();
	const baseURL = `http://${tenant}.localhost:8000`;
	const [loanTypes, setLoanTypes] = useState<LoanType[]>([]);
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [form, setForm] = useState({
		loan_type_id: '',
		employee_id: '',
		amount: '',
		repayment_months: '',
		start_date: '',
		reason: '',
	});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);
	const [startDate, setStartDate] = React.useState<Date | null>(null);

	useEffect(() => {
		const loadData = async () => {
			const access = getAccessToken();
			try {
				const token = getAccessToken();
				if (!token) throw new Error('No access token');

				const [typesRes, empRes] = await Promise.all([
					axios.get<LoanType[]>(`${baseURL}/tenant/loans/loan-types`, {
						headers: { Authorization: `Bearer ${token}` },
					}),
					axios.get<Employee[]>(`${baseURL}/tenant/employee/list`, {
						headers: { Authorization: `Bearer ${token}` },
					}),
				]);

				setLoanTypes(typesRes.data);
				setEmployees(empRes.data);
			} catch (err: any) {
				console.error(err);
				setError('Failed loading loan types or employees.');
			} finally {
				setLoading(false);
			}
		};
		loadData();
	}, [tenant]);
	console.log(loanTypes, employees);
	useEffect(() =>{

		console.log(form);
	}, [form]);

	return (
		<div className={`bg-white ${className}`}>
			<Card className='self-center w-full gap-4 border-none shadow-none'>
				<div>
					<h1 className='text-2xl font-bold'>Add Loan</h1>
					<p className='text-xs'>Add Loan details</p>
				</div>
				<form
					action=''
					className=''>
					<div className='grid grid-cols-2 gap-6 m-4'>
						{/* <span>
							<Label
								htmlFor='loanNum'
								className='mb-2'>
								Loan Number
							</Label>
							<Input
								className='w-[200px]'
								type='text'
								id='loanNum'
								required
							/>
						</span> */}
						<span>
							<Label
								htmlFor='LoanName'
								className='mb-2'>
								Loan Name
							</Label>
							<Select required>
								<SelectTrigger className='w-[200px]'>
									<SelectValue placeholder='Select Loan Name'>
										{form.loan_type_id}
									</SelectValue>
								</SelectTrigger>
								<SelectContent
									position='popper'
									className=''>
									{loanTypes.map((type) => {
										return (
											<SelectItem
												key={type.id}
												value={type.id.toString()}
												onClick={() =>
													setForm({ ...form, loan_type_id: type.id.toString() })
												}>
												{type.name}
											</SelectItem>
										);
									})}
									<SelectItem value='Loan-9'>
										<Button>+ Add New Loan</Button>
									</SelectItem>
								</SelectContent>
							</Select>
						</span>
					</div>
					<div className='grid grid-cols-2 gap-6 m-4'>
						<span>
							<Label
								htmlFor='SelectEmp'
								className='mb-2'>
								Select Employee
							</Label>
							<Select>
								<SelectTrigger className='w-[200px]'>
									<SelectValue placeholder='Select Employee' />
								</SelectTrigger>
								<SelectContent position='popper'>
									{employees.map((employee) => {
										return (
											<SelectItem
												key={employee.id}
												value={employee.id.toString()}
												onClick={() =>
													setForm({
														...form,
														employee_id: employee.id.toString(),
													})
												}>
												{`${employee.first_name} ${employee.last_name}`}
											</SelectItem>
										);
									})}
								</SelectContent>
							</Select>
						</span>
						<span>
							<Label
								htmlFor='Loanamt'
								className='mb-2'>
								Loan Amount
							</Label>
							<Input
								className='w-[200px]'
								placeholder='Enter Loan Amount'
								type='text'
								id='LoanAmt'
								required
							/>
						</span>
					</div>
					<div className='grid grid-cols-2 gap-6 m-4'>
						<span>
							<Label
								htmlFor='Repay'
								className='mb-2'>
								Repayment Duration
							</Label>
							<Select>
								<SelectTrigger className='w-[180px]'>
									<SelectValue placeholder='Repayment Duration' />
								</SelectTrigger>
								<SelectContent position='popper'>
									<SelectItem value='1 Month'>6 Month</SelectItem>
									<SelectItem value='2 Months'>12 Months</SelectItem>
									<SelectItem value='3 Months'>2 Months</SelectItem>
								</SelectContent>
							</Select>
						</span>
						<span>
							<Label
								htmlFor='MonthDed'
								className='mb-2'>
								Monthly Deductiond
							</Label>
							<Input
								className='w-[200px]'
								type='text'
								placeholder='Enter Monthly Deduction'
								id='MonthDed'
								required
								onChange={(e) =>
									setForm({
										...form,
										employee_id: e.target.value.toString(),
									})
								}
							/>
						</span>
					</div>
					<div className='grid grid-cols-2 gap-6 m-4'>
						<span>
							<Label htmlFor='Start'>Start Date of Repayment</Label>
							<DatePicker
								id='Start'
								required
								selected={startDate}
								onChange={(date) => setStartDate(date)}
								dateFormat='dd/MM/yyyy'
								placeholderText='25/5/2025'
								className='h-8 mb-4 w-[200px] pl-3 pr-8 border rounded'
							/>
						</span>
					</div>
					<div>
						<span>
							<Label htmlFor='Reason'>Reason</Label>
							<Textarea
								className='h-24 mb-4 pl-3 pr-8 border'
								id='Reason'
							/>
						</span>
					</div>
				</form>
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
						variant='outline'
						type='submit'>
						{' '}
						Save{' '}
					</Button>
				</div>
			</Card>
		</div>
	);
}
