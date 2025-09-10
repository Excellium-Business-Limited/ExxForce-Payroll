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
import LoanForm from './loanForm';
import Link from 'next/link';
import LoanDetails from './components/loanDetails';
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogTitle,
} from '@/components/ui/dialog';
import Dialogs from '../components/dialog';
import Import from '../components/Import';
import UpdateRepay from '../components/updateRepay';
import { Card } from '@/components/ui/card';
import { getTenant } from '@/lib/auth';
import { set } from 'date-fns';
import { redirect } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoanReq from './components/loanReq';
import LoanType from './components/loanType';
import Loading from '@/components/ui/Loading';

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



export default function Home() {
	const pathname = usePathname();
	const router = useRouter();
	
	const [isloan, setisLoan] = React.useState<boolean>(false);
	const [loans, setLoans] = useState<Loan[]>([]);
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
				setLoans(res.data);
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
		setisLoan(true);
		return () => clearTimeout(timeout);
	}, []);

	// const handleCreate = () => {
	// 	router.push(`/${tenant}/loans/create`);
	// };

	
	  if (loading) return (
			<Loading
				message='Loading Loans...'
				size='medium'
				variant='spinner'
				overlay={false}
			/>
		);
	if (error) return <p style={{ color: 'red' }}>{error}</p>;

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
		<div className='w-full'>
			<div className='self-center h-[603px] ml-7 gap-4'>
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
							<SheetContent className='min-w-[500px] p-4 overflow-auto'>
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
				<Card className='mt-12 ml-auto w-full h-[750px] p-3'>
					<Tabs
						className='w-full'
						defaultValue='LRequest'>
						<TabsList className='w-full justify-start border-b bg-transparent h-auto p-0 rounded-none'>
							<div className='flex gap-8 px-6 py-4'>
								<TabsTrigger
									className='data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:bg-transparent text-gray-600 hover:text-gray-900 border-b-2 border-transparent pb-4 pt-2 px-0 rounded-none font-medium'
									value='LType'>
									Loan Type
								</TabsTrigger>
								<TabsTrigger
									className='data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:bg-transparent text-gray-600 hover:text-gray-900 border-b-2 border-transparent pb-4 pt-2 px-0 rounded-none font-medium'
									value='LRequest'>
									Loan Request
								</TabsTrigger>
							</div>
						</TabsList>
						<TabsContent value='LType'>
							<LoanType />
						</TabsContent>
						<TabsContent value='LRequest'>
							<LoanReq loans={loans} />
						</TabsContent>
					</Tabs>
				</Card>
			</div>
		</div>
	);
}
