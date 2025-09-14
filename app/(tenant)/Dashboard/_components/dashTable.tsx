'use client';
import { Button } from '@/components/ui/button';
import { ReactNode, useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import React from 'react';
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import Image from 'next/image';
import Link from 'next/link';

import { Card } from '@/components/ui/card';
import Dialogs from '../../components/dialog';
import Import from '../../components/Import';
import { getTenant } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { CheckCircle2, EllipsisVertical } from 'lucide-react';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import FilterSort from '../../components/FilterSort';

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
interface LoanReqProps {
	loans: Loan[];
}

const dashTable = () => {
	const router = useRouter();
	const [isloan, setisLoan] = React.useState<boolean>(false);
	const [loansList, setLoansList] = useState<Loan[]>([]);
	const [loans, setLoans] = useState<Loan[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const tenant = getTenant();

	useEffect(() => {
		const baseURL = `https://${tenant}.exxforce.com`;
		const fetchLoans = async () => {
			try {
				const token = localStorage.getItem('access_token');
				if (!token) throw new Error('No access token');

				const res = await axios.get<Loan[]>(`${baseURL}/tenant/loans/list`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setLoansList(res.data);
				console.log(res.data);
				console.log(loansList);
				if (res.status !== 200) setisLoan(false);
			} catch (err: any) {
				console.error('Error fetching loans', err);
				setError(err.message || 'Failed to fetch loans');
				if (err.response?.status === 401) {
					setTimeout(() => {
						redirect('/login');
					}, 2000);
				}
			} finally {
				setLoading(false);
			}
		};

		const timeout = setTimeout(() => {
			setLoading(true);
			fetchLoans();
			setLoading(false);
		}, 2000);
	}, []);

	return loansList.length === 0 ? (
		<div className='justify-center text-center mx-auto mt-4 h-[140px]'>
			<img
				src='/notdata.png'
				className='self-center mx-auto'
				width={200}
			/>
			<h2 className='text-2xl md:text-3xl  mb-4'>No Loans Yet</h2>
			<pre className='text-base text-muted-foreground mb-8'>
				You have not created any loans yet.
			</pre>
		</div>
	) : (
		<div>
			<Card className='bg-white m-4 pt-6 shadow-lg'>
				<Table
					border={2}
					className=''>
					<TableHeader>
						<TableRow>
							<TableHead className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Loan Number
							</TableHead>
							<TableHead className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Employee Name
							</TableHead>
							<TableHead className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Loan Name
							</TableHead>
							<TableHead className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Status
							</TableHead>
							<TableHead className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								More
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{loansList.map((loan) => {
							return (
								<TableRow key={loan.id}>
									<TableCell className='px-4 py-3 text-left tracking-wider'>
										{loan.loan_number}
									</TableCell>
									<TableCell className='px-4 py-3 text-left tracking-wider'>
										{loan.employee_name}
									</TableCell>
									<TableCell className='px-4 py-3 text-left tracking-wider'>
										{loan.loan_type}
									</TableCell>
									<TableCell className='px-4 py-3 text-left tracking-wider'>
										<h4
											className={`border justify-center flex rounded-4xl bg-[#dee7f6] p-1 ${
												loan.status === 'approved'
													? 'bg-green-100 text-green-800'
													: 'bg-gray-100 text-gray-800'
											}`}>
											{loan.status}
										</h4>
									</TableCell>
									<TableCell className='px-4 py-3 text-left tracking-wider'>
										<Popover>
											<PopoverTrigger asChild>
												<EllipsisVertical />
											</PopoverTrigger>
											<PopoverContent className='w-fit'>
												<div className='flex flex-col gap-2'>
													<Link
														href={`/Loan/${loan.id}`}
														className='flex gap-2'>
														<pre className='text-xs font-extralight'>
															View Details
														</pre>
														<Image
															width={15}
															height={15}
															src='/iconamoon_eye-light.png'
															alt=''
														/>
													</Link>
												</div>
											</PopoverContent>
										</Popover>
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

export default dashTable;
