'use client';
import { useRouter } from 'next/router';
import axios from 'axios';
import React, { ReactNode, useEffect, useState } from 'react';
import Loans from '../components/loanDetails';
import { fetchEmployees } from '@/lib/api';
import { getTenant } from '@/lib/auth';
import { redirect } from 'next/navigation';

// Remove the mock items if you're fetching from API
const items = [
	{ id: '1', name: 'Item One', description: 'Details for item one' },
	{ id: '2', name: 'Item Two', description: 'Details for item two' },
	{ id: '3', name: 'Item Three', description: 'Details for item three' },
];

// Add missing properties to match your component usage
interface Loan {
	monthly_deduction: ReactNode;
	id: number;
	loan_number: string;
	loan_type: string;
	employee_name: string;
	amount: number;
	balance: number;
	amount_paid?: number;
	status: string;
	start_date: string;
	completed_at?: string;
	repayment_months: number;
	paymentDetails: {
		nextDeduction: string;
	};
	previousPayments?: Array<{
		month: string;
		amountDeducted: string;
		balanceRemaining: string;
		dateOfDeduction: string;
		status: string;
	}>;
}

export default function LoanDetails({
	params,
}: {
	params: Promise<{ loanId: string }>;
}) {
	const { loanId } = React.use(params);

	// Change to single loan object instead of array
	const [loan, setLoan] = useState<Loan | null>(null);
	const [loading, setLoading] = useState(true); // Start with loading true
	const [error, setError] = useState('');

	useEffect(() => {
		const tenant = getTenant();
		const baseURL = `https://${tenant}.exxforce.com`;

		const fetchLoan = async () => {
			try {
				setLoading(true);
				const token = localStorage.getItem('access_token');
				if (!token) throw new Error('No access token');

				console.log(`Fetching loan with ID: ${loanId}`);

				// Expect single loan object, not array
				const res = await axios.get<Loan>(`${baseURL}/tenant/loans/${loanId}`, {
					headers: { Authorization: `Bearer ${token}` },
				});

				console.log('Loan API response:', res.data);
				setLoan(res.data);
				setError(''); // Clear any previous errors
			} catch (err: any) {
				console.error('Error fetching loan:', err);
				console.error('Error details:', {
					message: err.message,
					status: err.response?.status,
					data: err.response?.data,
					url: `${baseURL}/tenant/loans/${loanId}`,
				});

				setError(
					err.response?.data?.message || err.message || 'Failed to fetch loan'
				);

				if (err.response?.status === 401) {
					setTimeout(() => {
						redirect('/login');
					}, 2000);
				}
			} finally {
				setLoading(false);
			}
		};

		if (loanId) {
			fetchLoan();
		}
	}, [loanId]);

	// Add loading state
	if (loading) {
		return (
			<div className='ml-[470px] flex self-center items-center text-2xl font-bold'>
				Loading loan details...
			</div>
		);
	}

	if (error) {
		return (
			<div className='ml-[470px] flex self-center items-center text-2xl font-bold text-red-500'>
				{error}
			</div>
		);
	}

	// Check if loan exists
	if (!loan) {
		return (
			<div className='ml-[470px] flex self-center items-center text-2xl font-bold text-red-500'>
				Loan not found
			</div>
		);
	}

	return (
		<div>
			<Loans
				item={loan}
				id={loanId}
			/>
		</div>
	);
}
