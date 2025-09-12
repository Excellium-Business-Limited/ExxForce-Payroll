import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getTenant } from '@/lib/auth';
import axios from 'axios';
import { ca, se } from 'date-fns/locale';
import { redirect } from 'next/navigation';
import React, { ReactNode, useEffect, useState } from 'react';

interface Loan {
	monthly_deduction: ReactNode;
	id: number;
	loan_number: string;
	loan_type: string;
	employee_name: string;
	amount: number;
	balance: number;
	status: string;
	start_date: string;
}

const updateRepay = ({ id }: { id: string }) => {
	const [loan, setLoan] = useState<Loan>({
		monthly_deduction: <div></div>,
		id: 0,
		loan_number: '',
		loan_type: '',
		employee_name: '',
		amount: 0,
		balance: 0,
		status: '',
		start_date: '',
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		const tenant = getTenant();
		const baseURL = `https://${tenant}.exxforce.com`;
		const fetchLoans = async () => {
			try {
				const token = localStorage.getItem('access_token');
				if (!token) throw new Error('No access token');

				const res = await axios.get<Loan>(`${baseURL}/tenant/loans/${id}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setLoan(res.data);
				console.log(
					'Loan fetched successfully',
					res.data,
					'Loan Balance:',
					res.data.balance
				);
			} catch (err: any) {
				console.error('Error fetching loans', err);
				setError(err.message || 'Failed to fetch loans');
				if (err.response?.status === 401) {
					// Redirect to login if unauthorized
					setTimeout(() => {
						redirect('/login');
					}, 2000);
				}
			} finally {
				setLoading(false);
			}
		};
		fetchLoans();
	}, []);

	const handleSubmit = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		console.log('Update repayment details');
		const tenant = getTenant();
		const baseURL = `https://${tenant}.exxforce.com`;
		try {
			const token = localStorage.getItem('access_token');
			if (!token) throw new Error('No access token');

			// Collect form values
			const amount = (document.querySelector('input[type="number"]') as HTMLInputElement)?.value;
			const payment_date = (document.querySelector('input[type="date"]') as HTMLInputElement)?.value;
			const note = (document.querySelector('textarea') as HTMLTextAreaElement)?.value;

			const res = await axios.post(
				`${baseURL}/tenant/loans/${id}/repay`,
				{
					amount: Number(amount),
					payment_date,
					note,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			console.log('Repayment updated successfully', res.data);
			window.location.reload();
		} catch (err: any) {
			console.error('Error updating repayment', err);
			setError(err.message || 'Failed to update repayment');
		}
	};
	return (
		<div className='bg-white'>
			<form className='m-4'>
				<pre className='m-4'>Employee Name: {loan.employee_name}</pre>
				<div className='grid grid-rows-3 gap-6'>
					<span className='m-3'>
						<Label htmlFor='Amount'>Amount</Label>
						<Input type='number' />
					</span>
					<span className='m-3'>
						<Label htmlFor='Date'>Payment Date</Label>
						<Input type='date' />
					</span>
					<span className='m-3'>
						<Label htmlFor='method'>Note</Label>
						<Textarea className='w-full border rounded-md p-2' />
					</span>
				</div>
				<pre className='m-4'>Amount Remaining: {loan.balance}</pre>
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
						onClick={handleSubmit}>
						Update
					</Button>
				</div>
			</form>
		</div>
	);
};

export default updateRepay;
