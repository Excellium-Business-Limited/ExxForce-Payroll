'use client';
import { Button } from '@/components/ui/button';
import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import React from 'react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
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

import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogTitle,
} from '@/components/ui/dialog';

import { Card } from '@/components/ui/card';
import Dialogs from '../../components/dialog';
import Import from '../../components/Import';
import { getTenant } from '@/lib/auth';
import { set } from 'date-fns';
import { redirect } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoanForm from '../loanForm';

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

const loanReq = ({ loans }: LoanReqProps) => {
	const router = useRouter();
	const [isloan, setisLoan] = React.useState<boolean>(false);
	const [loansList, setLoansList] = useState<Loan[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	useEffect(() => {
		const tenant = getTenant();
		const baseURL = `https://${tenant}.exxforce.com`;
		const fetchLoans = async () => {
			try {
				const token = localStorage.getItem('access_token');
				if (!token) throw new Error('No access token');

				const res = await axios.get<Loan[]>(`${baseURL}/tenant/loans/list`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setLoansList(res.data);
				setLoading(false);
				if (res.status !== 200) setisLoan(false);
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
				console.log(loans);
			}
		};

		const timeout = setTimeout(() => {
			setLoading(true);
			fetchLoans();
			setLoading(false);
		}, 2000);
		fetchLoans();
		console.log(loans);
		console.log(loans[0]);
		if (loans.length > 0){
			setisLoan(true);
		}else{
			setisLoan(false);
		}
		return () => clearTimeout(timeout);
	}, []);

	const goToDetail = (loanId: number) => {
		router.push(`/Loan/${loanId}`);
	};

	if (isloan === false) {
			return (
				<div className='h-[680px] m-7 gap-4 '>
					<div className='flex flex-row items-center justify-between w-full'>
						<span>
							<h1>Loan</h1>
							<p className='text-xs'>Create and Manage Loans</p>
						</span>
						<span className='items-end self-end justify-between flex gap-4'>
							<Sheet>
								<SheetTrigger asChild>
									<Button
										variant={'outline'}
										className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2'>
										Add Loan
									</Button>
								</SheetTrigger>
								<SheetContent className='min-w-[500px] p-4 overflow-auto bg-white'>
									<SheetTitle className='hidden'></SheetTitle>
									<LoanForm />
								</SheetContent>
							</Sheet>
							<Dialogs title={'Import'}>
								<Import
									title='Loans'
									isOpen={false}
									onClose={function (): void {
										throw new Error('Function not implemented.');
									}}
									onSubmit={function (importData: any): Promise<void> {
										throw new Error('Function not implemented.');
									}}
									children={
										<div>
											<li>• Loan Type (required)</li>
											<li>• Employee Name (required)</li>
											<li>• Amount (required)</li>
											<li>• Start Date (required)</li>
											<li>• Interest Rate (optional)</li>
											<li>• Repayment Terms (optional)</li>
										</div>
									}
								/>
							</Dialogs>
						</span>
					</div>
					<div className='text-center max-w-2xl mx-auto mt-[120px]'>
						<img
							src='/empty.jpg'
							alt='Team Illustration'
							className='w-32 h-32 md:w-40 md:h-40 mx-auto mb-8'
						/>
						<h2 className='text-2xl md:text-3xl  mb-4'>No Loans Yet</h2>
						<pre className='text-base text-muted-foreground mb-8'>
							You haven’t added any employee loans.Manage staff
							<br />
							loans easily by adding new loan records or importing
							<br />
							from a file.
						</pre>
						<div className='flex flex-col sm:flex-row gap-4 justify-center'>
							<Sheet>
								<SheetTrigger asChild>
									<Button
										variant={'outline'}
										className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2'>
										Add Loan
									</Button>
								</SheetTrigger>
								<SheetContent className='min-w-[500px] p-4 '>
									<SheetTitle className='hidden'></SheetTitle>
									<LoanForm />
								</SheetContent>
							</Sheet>
							<Dialogs title={'Import'}>
								<Import
									title='Loans'
									isOpen={false}
									onClose={function (): void {
										throw new Error('Function not implemented.');
									}}
									onSubmit={function (importData: any): Promise<void> {
										throw new Error('Function not implemented.');
									}}
									children={
										<div>
											<li>• Loan Type (required)</li>
											<li>• Employee Name (required)</li>
											<li>• Amount (required)</li>
											<li>• Start Date (required)</li>
											<li>• Interest Rate (optional)</li>
											<li>• Repayment Terms (optional)</li>
										</div>
									}
								/>
							</Dialogs>
						</div>
					</div>
				</div>
			);
		}

	return (
		<div>
			<div className='flex flex-row items-center justify-between w-full'>
				<span>
					<h1>Loan List</h1>
				</span>
				<span className='items-end self-end justify-between flex gap-4'>
					<Button
						variant={'outline'}
						className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2'>
						Export
					</Button>
					<Select>
						<SelectTrigger className=''>
							Status:
							<SelectValue placeholder='All' />
						</SelectTrigger>
						<SelectContent position='popper'>
							<SelectItem value={'All'}>All</SelectItem>
							<SelectItem value={'Ongoing'}>Ongoing</SelectItem>
							<SelectItem value={'Paid'}>Paid</SelectItem>
						</SelectContent>
					</Select>
					<Button
						variant={'outline'}
						className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2'>
						Filter
					</Button>
				</span>
			</div>
			<Table border={4}>
				<TableHeader>
					<TableRow>
						<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Loan Number
						</TableHead>
						<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Employee Name
						</TableHead>
						<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Loan Name
						</TableHead>
						<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Loan Amount
						</TableHead>
						<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Deduction
						</TableHead>
						<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Balance Remaining
						</TableHead>
						<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Status
						</TableHead>
						<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							View
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{loans.map((loan) => {
						return (
							<TableRow key={loan.id}>
								<TableCell>{loan.loan_number}</TableCell>
								<TableCell>{loan.employee_name}</TableCell>
								<TableCell>{loan.loan_type}</TableCell>
								<TableCell>{loan.amount}</TableCell>
								<TableCell>{loan.monthly_deduction}</TableCell>
								<TableCell>{loan.balance}</TableCell>
								<TableCell>
									<h4
										className={`border justify-center flex rounded-4xl bg-[#dee7f6] p-1 ${
											loan.status === 'approved'
												? 'bg-green-100 text-green-800'
												: 'bg-gray-100 text-gray-800'
										}`}>
										{loan.status}
									</h4>
								</TableCell>
								<TableCell>
									<Link href={`/Loan/${loan.id}`}>
										<Image
											width={25}
											height={25}
											src='/iconamoon_eye-light.png'
											alt=''
											onClick={() => goToDetail(loan.id)}
										/>
									</Link>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
};

export default loanReq;
