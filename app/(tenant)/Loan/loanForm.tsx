'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { DialogClose } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import { getAccessToken, getTenant } from '@/lib/auth';

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
		monthly_deduction: '',
	});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);
	const [startDate, setStartDate] = React.useState<Date | null>(null);

	useEffect(() => {
		const loadData = async () => {
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
				console.log(employees)
				setLoading(false);
			}
		};
		loadData();
	}, [tenant]);

	// Update start_date in form when startDate changes
	useEffect(() => {
		if (startDate) {
			setForm((prev) => ({
				...prev,
				start_date: startDate.toISOString().split('T')[0],
			}));
		}
	}, [startDate]);

	useEffect(() => {
		console.log('Form state:', form);
	}, [form]);


	const handleSubmit = async () => {
		const token = localStorage.getItem('access_token');

		if (
			!form.loan_type_id ||
			!form.employee_id ||
			!form.amount ||
			!form.repayment_months ||
			!form.start_date
		) {
			setError('Please fill in all required fields');
			return;
		}

		try {
			const response = await axios.post(
				`${baseURL}/tenant/loans/create`,
				{
					loan_type_id: parseInt(form.loan_type_id),
					employee_id: form.employee_id,
					amount: Number(form.amount),
					repayment_months: parseInt(form.repayment_months),
					start_date: form.start_date,
					reason: form.reason || null,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			alert('Loan created!');
			router.push(`/${tenant}/loans`);
		} catch (err: any) {
			console.error(err);
			const details = err.response?.data?.detail;
			const message = Array.isArray(details)
				? details.map((d: any) => `${d.loc?.join('.')}: ${d.msg}`).join(', ')
				: details || 'Failed to create loan';
			setError(message);
		}
	};

	return (
		<div className={`bg-white ${className}`}>
			<Card className='self-center w-full gap-4 border-none shadow-none'>
				<div>
					<h1 className='text-2xl font-bold'>Add Loan</h1>
					<p className='text-xs'>Add Loan details</p>
				</div>
				<form
					onSubmit={handleSubmit}
					className=''>
					<div className='grid grid-cols-2 gap-6 m-4'>
						<span>
							<Label
								htmlFor='LoanName'
								className='mb-2'>
								Loan Name
							</Label>
							<Select
								value={form.loan_type_id}
								onValueChange={(value) => {
									console.log('Selected loan type ID:', value);
									setForm({ ...form, loan_type_id: value });
								}}
								required>
								<SelectTrigger className='w-[200px]'>
									<SelectValue placeholder='Select Loan Name' />
								</SelectTrigger>
								<SelectContent>
									{loanTypes.map((type) => (
										<SelectItem
											key={type.id}
											value={type.id.toString()}>
											{type.name}
										</SelectItem>
									))}
									<SelectItem value='new-loan'>
										<Button type='button'>+ Add New Loan</Button>
									</SelectItem>
								</SelectContent>
							</Select>
						</span>
						<span>
							<Label
								htmlFor='SelectEmp'
								className='mb-2'>
								Select Employee
							</Label>
							<Select
								value={form.employee_id}
								onValueChange={(value) => {
									console.log('Selected employee ID:', value);
									setForm({ ...form, employee_id: value });
								}}>
								<SelectTrigger className='w-[200px]'>
									<SelectValue placeholder='Select Employee' />
								</SelectTrigger>
								<SelectContent>
									{employees.map((employee) => (
										<SelectItem
											key={employee.employee_id}
											value={String(employee.employee_id)}>
											{`${employee.first_name} ${employee.last_name}`}
										</SelectItem>
									))}
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
								type='number'
								id='LoanAmt'
								value={form.amount}
								onChange={(e) => setForm({ ...form, amount: e.target.value })}
								required
							/>
						</span>
						<span>
							<Label
								htmlFor='Repay'
								className='mb-2'>
								Repayment Duration
							</Label>
							<Select
								value={form.repayment_months}
								onValueChange={(value) => {
									console.log('Selected repayment months:', value);
									setForm({ ...form, repayment_months: value });
								}}>
								<SelectTrigger className='w-[180px]'>
									<SelectValue placeholder='Repayment Duration' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='6'>6 Months</SelectItem>
									<SelectItem value='12'>12 Months</SelectItem>
									<SelectItem value='24'>24 Months</SelectItem>
								</SelectContent>
							</Select>
						</span>
						<span>
							<Label
								htmlFor='MonthDed'
								className='mb-2'>
								Monthly Deduction
							</Label>
							<Input
								className='w-[200px]'
								type='number'
								placeholder='Enter Monthly Deduction'
								id='MonthDed'
								value={form.monthly_deduction}
								onChange={(e) =>
									setForm({ ...form, monthly_deduction: e.target.value })
								}
								required
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
								value={form.reason}
								onChange={(e) => setForm({ ...form, reason: e.target.value })}
							/>
						</span>
					</div>
				</form>
				<div className='self-end'>
					<DialogClose asChild>
						<Button
							className='m-3 text-muted-foreground'
							variant='outline'
							type='button'>
							Close
						</Button>
					</DialogClose>
					<Button
						className='m-3 bg-[#3D56A8] text-white'
						variant='outline'
						type='submit'
						onClick={handleSubmit}>
						Save
					</Button>
				</div>
			</Card>
		</div>
	);
}
