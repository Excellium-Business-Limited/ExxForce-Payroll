'use client';
import { useRouter } from 'next/router';
import axios from 'axios';
import React, { ReactNode, useEffect, useState } from 'react';
import Loans from '../components/loanDetails';
import { fetchEmployees } from '@/lib/api';
import { getTenant } from '@/lib/auth';
import { redirect } from 'next/navigation';
const items = [
	{ id: '1', name: 'Item One', description: 'Details for item one' },
	{ id: '2', name: 'Item Two', description: 'Details for item two' },
	{ id: '3', name: 'Item Three', description: 'Details for item three' },
];

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

export default function LoanDetails({
	params,
}: {
	params: Promise<{ loanId: string }>;
}) {
	const { loanId } = React.use(params);
	const [loans, setLoans] = useState<Loan[]>([]);
	const [loan, setLoan] = useState<Loan[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const item = items.find((item) => item.id === loanId); // Use params.loanId

	useEffect(() => {
		const tenant = getTenant();
		const baseURL = `http://${tenant}.localhost:8000`;
		const fetchLoans = async () => {
			try {
				const token = localStorage.getItem('access_token');
				if (!token) throw new Error('No access token');

				const res = await axios.get<Loan[]>(
					`${baseURL}/tenant/loans/${loanId}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setLoans(res.data);
				console.log('Loans fetched successfully', loans);
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
		timeout;
	}, []);

	useEffect(() => {
		const tenant = getTenant();
		// if (loans) 
	}, []);

	const timeout = setTimeout(() => {
		console.log(loans);
	}, 3000);

	if (error) {
		return (
			<div className=' ml-[470px] flex self-center items-center text-2xl font-bold text-red-500'>
				{error}
			</div>
		);
	}

	return (
		<div>
			<Loans item={loans} id={loanId} /> //item will become the details of the loan instead
			of null
		</div>
	);
}
