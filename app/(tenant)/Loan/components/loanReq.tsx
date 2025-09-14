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
import LoanForm from '../loanForm';
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

const loanReq = ({ loans }: LoanReqProps) => {
	const router = useRouter();
	const [isloan, setisLoan] = React.useState<boolean>(false);
	const [loansList, setLoansList] = useState<Loan[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	// Filter and sort states
	const [searchValue, setSearchValue] = useState('');
	const [filters, setFilters] = useState<Record<string, string>>({
		status: 'All',
		loan_type: 'All',
	});
	const [sortBy, setSortBy] = useState('loan_number');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

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
		if (loans.length > 0) {
			setisLoan(true);
		} else {
			setisLoan(false);
		}
		return () => clearTimeout(timeout);
	}, []);

	// Filtered and sorted loans
	const filteredAndSortedLoans = useMemo(() => {
		let result = [...loans];

		// Apply search filter
		if (searchValue) {
			result = result.filter(
				(loan) =>
					loan.employee_name
						.toLowerCase()
						.includes(searchValue.toLowerCase()) ||
					loan.loan_number.toLowerCase().includes(searchValue.toLowerCase()) ||
					loan.loan_type.toLowerCase().includes(searchValue.toLowerCase())
			);
		}

		// Apply filters
		Object.entries(filters).forEach(([key, value]) => {
			if (value !== 'All') {
				result = result.filter(
					(loan) =>
						loan[key as keyof Loan]?.toString().toLowerCase() ===
						value.toLowerCase()
				);
			}
		});

		// Apply sorting
		result.sort((a, b) => {
			let aValue: any = a[sortBy as keyof Loan];
			let bValue: any = b[sortBy as keyof Loan];

			// Handle different data types
			if (typeof aValue === 'string') {
				aValue = aValue.toLowerCase();
				bValue = bValue.toLowerCase();
			}

			if (typeof aValue === 'number' && typeof bValue === 'number') {
				return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
			}

			// String comparison
			if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
			if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
			return 0;
		});

		return result;
	}, [loans, searchValue, filters, sortBy, sortOrder]);

	// Filter options
	const filterOptions = {
		status: [
			{ value: 'approved', label: 'Approved' },
			{ value: 'pending', label: 'Pending' },
			{ value: 'rejected', label: 'Rejected' },
		],
		loan_type: [...new Set(loans.map((loan) => loan.loan_type))].map(
			(type) => ({ value: type, label: type })
		),
	};

	// Sort options
	const sortOptions = [
		{ value: 'loan_number', label: 'Loan Number' },
		{ value: 'employee_name', label: 'Employee Name' },
		{ value: 'loan_type', label: 'Loan Type' },
		{ value: 'amount', label: 'Amount' },
		{ value: 'balance', label: 'Balance' },
		{ value: 'start_date', label: 'Start Date' },
	];

	const handleFilterChange = (filterKey: string, value: string) => {
		setFilters((prev) => ({ ...prev, [filterKey]: value }));
	};

	const handleApprove = async (id:any) => {
		const tenant = getTenant();
		const baseURL = `https://${tenant}.exxforce.com`;
		try {
			const token = localStorage.getItem('access_token');
			if (!token) throw new Error('No access token');
			const res = await axios.post(`${baseURL}/tenant/loans/${id}/approve`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			console.log('Loan approved', res.data);
			alert('Loan Approved Successfully');
			router.refresh();
		} catch (err: any) {
			console.error('Error approving loan', err);
			alert(
				'Error approving loan: ' +
					(err.response?.data?.message ||
						err.message ||
						'Failed to approve loan')
			);
		}
	};

	const goToDetail = (loanId: number) => {
		router.push(`/Loan/${loanId}`);
	};

	if (isloan === false) {
		return (
			<div className='h-[680px] w-full m-7 gap-4 '>
				<div className='text-center max-w-2xl mx-auto mt-[120px]'>
					<img
						src='/empty.jpg'
						alt='Team Illustration'
						className='w-32 h-32 md:w-40 md:h-40 mx-auto mb-8'
					/>
					<h2 className='text-2xl md:text-3xl  mb-4'>No Loans Yet</h2>
					<pre className='text-base text-muted-foreground mb-8'>
						You havenâ€™t added any employee loans.Manage staff
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
										<li>â€¢ Loan Type (required)</li>
										<li>â€¢ Employee Name (required)</li>
										<li>â€¢ Amount (required)</li>
										<li>â€¢ Start Date (required)</li>
										<li>â€¢ Interest Rate (optional)</li>
										<li>â€¢ Repayment Terms (optional)</li>
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
		<div className='mx-2'>
			<div className='flex flex-row items-center justify-between w-full mb-4 mx-4'>
				<span>
					<h1 className='text-xl font-semibold'>Loan List</h1>
				</span>
				{/* <span className='items-end self-end justify-between flex gap-4'>
					<Button
						variant={'outline'}
						className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2'>
						Export
					</Button>
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
				</span> */}
			</div>

			{/* Filter and Sort Component */}
			<FilterSort
				searchValue={searchValue}
				onSearchChange={setSearchValue}
				searchPlaceholder='Search loans, employees, or loan types...'
				filters={filters}
				filterOptions={filterOptions}
				onFilterChange={handleFilterChange}
				sortBy={sortBy}
				sortOrder={sortOrder}
				sortOptions={sortOptions}
				onSortChange={setSortBy}
				onSortOrderChange={setSortOrder}
				className='mb-4'
			/>

			<Table border={2}>
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
							Loan Amount
						</TableHead>
						<TableHead className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Deduction
						</TableHead>
						<TableHead className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Balance Remaining
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
					{filteredAndSortedLoans.map((loan) => {
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
									{loan.amount}
								</TableCell>
								<TableCell className='px-4 py-3 text-left tracking-wider'>
									{loan.monthly_deduction}
								</TableCell>
								<TableCell className='px-4 py-3 text-left tracking-wider'>
									{loan.balance}
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
												{loan.status !== 'approved' ? (
													<Button
														onClick={()=>handleApprove(loan.id)}
														className='text-green-600'>
														<CheckCircle2 size={15} />
														Approve Loan
													</Button>
												) : null}
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
														onClick={() => goToDetail(loan.id)}
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
		</div>
	);
};

export default loanReq;
