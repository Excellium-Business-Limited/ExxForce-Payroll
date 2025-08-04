'use client';
import { useRouter } from 'next/router';
import axios from 'axios';
import React, { ReactNode, useEffect, useState } from 'react';
import Loans from '../components/loanDetails';
import { getTenant } from '@/lib/auth';
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

export default function LoanDetails({ params }: { params: Promise<{ loanId: string }> }) {
	const {loanId} = React.use(params);
	const [loans, setLoans] = useState<Loan[]>([]);
	const [loan, setLoan] = useState<Loan[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

		const item = items.find((item) => item.id === loanId); // Use params.loanId


	const tenant = getTenant();
	const baseURL = `http://${tenant}.localhost:8000`;

		useEffect(() => {
	const fetchLoans = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No access token");

        const res = await axios.get<Loan[]>(`${baseURL}/tenant/loans/${loanId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLoans(res.data);
		console.log("Loans fetched successfully", loans);
      } catch (err: any) {
        console.error("Error fetching loans", err);
        setError(err.message || "Failed to fetch loans");
      } finally {
        setLoading(false);
      }
    };
	  fetchLoans();
		}, [tenant]);
		const getLoanDetails = async (loanId: string) => {
			setLoan(loans.filter((loan) => loan.loan_number === loanId))
			console.log(loan)
		}
		useEffect(() => {
			if (loanId) {
				getLoanDetails(loanId);
			}
		}, [loanId, loans]);

		const timeout = setTimeout (() => {
			console.log(loans)
			console.log(loan)
			
		}, 3000)

		if (error) {
			return <div className=' ml-[470px] flex self-center items-center text-2xl font-bold text-red-500'>{error}</div>;
		}

		return (
		<div>
			{/* <h1>{item.name}</h1>
			<p>ID: {item.id}</p>
			<p>{item.description}</p>
			<Loans item ={null}/> //item will become the details of the loan instead of null */}
		</div>
	);
}
