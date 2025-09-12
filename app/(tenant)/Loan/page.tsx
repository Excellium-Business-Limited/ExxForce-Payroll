'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useGlobal } from '@/app/Context/context';
import FilterSort, { FilterOption, SortOption } from '../components/FilterSort';
import Loading from '@/components/ui/Loading';

interface Loan {
	id: number;
	loan_number: string;
	loan_type?: string;
	employee_name?: string;
	amount?: string | number;
	balance?: string | number;
	monthly_deduction?: string | number;
	status?: string;
	start_date?: string;
	end_date?: string;
	interest_rate?: string | number;
}

interface PaginationInfo {
	currentPage: number;
	itemsPerPage: number;
	totalItems: number;
	totalPages: number;
}

export default function LoanPage() {
	const pathname = usePathname();
	const router = useRouter();
	const { tenant, globalState } = useGlobal();
	
	const [isloan, setisLoan] = useState<boolean>(false);
	const [loans, setLoans] = useState<Loan[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	// FilterSort state
	const [searchValue, setSearchValue] = useState<string>('');
	const [sortBy, setSortBy] = useState<string>('loan_number');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
	const [filters, setFilters] = useState<Record<string, string>>({
		status: 'All',
		loan_type: 'All',
	});

	// Pagination state
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [itemsPerPage, setItemsPerPage] = useState<number>(10);

	// Filter and Sort options
	const filterOptions: Record<string, FilterOption[]> = {
		status: [
			{ value: 'active', label: 'Active' },
			{ value: 'completed', label: 'Completed' },
			{ value: 'pending', label: 'Pending' },
		],
		loan_type: [
			{ value: 'Personal Loan', label: 'Personal Loan' },
			{ value: 'Salary Advance', label: 'Salary Advance' },
			{ value: 'Emergency Loan', label: 'Emergency Loan' },
			{ value: 'Housing Loan', label: 'Housing Loan' },
		],
	};

	const sortOptions: SortOption[] = [
		{ value: 'loan_number', label: 'Loan Number' },
		{ value: 'amount', label: 'Loan Amount' },
		{ value: 'balance', label: 'Outstanding Balance' },
		{ value: 'start_date', label: 'Start Date' },
		{ value: 'end_date', label: 'End Date' },
		{ value: 'monthly_deduction', label: 'Monthly Deduction' },
	];

	// FilterSort handlers
	const handleSearchChange = (value: string) => {
		setSearchValue(value);
		setCurrentPage(1);
	};

	const handleFilterChange = (filterKey: string, value: string) => {
		setFilters(prev => ({
			...prev,
			[filterKey]: value,
		}));
		setCurrentPage(1);
	};

	const handleSortChange = (newSortBy: string) => {
		setSortBy(newSortBy);
		setCurrentPage(1);
	};

	const handleSortOrderChange = (order: 'asc' | 'desc') => {
		setSortOrder(order);
		setCurrentPage(1);
	};

	// Format currency
	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-NG', {
			style: 'currency',
			currency: 'NGN',
			minimumFractionDigits: 2,
		}).format(amount).replace('NGN', '₦');
	};

	// Safe number parsing
	const parseAmount = (value?: string | number): number => {
		if (typeof value === 'number') return value;
		return parseFloat(value?.toString() || '0') || 0;
	};

	// Filter and sort loans
	const filteredAndSortedLoans = useMemo(() => {
		let filtered = loans.filter(loan => {
			// Search filter
			const searchLower = searchValue.toLowerCase();
			const matchesSearch = !searchValue ||
				loan.loan_number.toLowerCase().includes(searchLower) ||
				loan.loan_type?.toLowerCase().includes(searchLower) ||
				loan.employee_name?.toLowerCase().includes(searchLower);

			// Status filter
			const matchesStatus = filters.status === 'All' ||
				loan.status?.toLowerCase() === filters.status.toLowerCase();

			// Loan type filter
			const matchesLoanType = filters.loan_type === 'All' ||
				loan.loan_type === filters.loan_type;

			return matchesSearch && matchesStatus && matchesLoanType;
		});

		// Sort loans
		filtered.sort((a, b) => {
			let aValue: any = a[sortBy as keyof Loan];
			let bValue: any = b[sortBy as keyof Loan];

			// Handle different data types
			if (['amount', 'balance', 'monthly_deduction'].includes(sortBy)) {
				aValue = parseAmount(aValue);
				bValue = parseAmount(bValue);
			} else if (['start_date', 'end_date'].includes(sortBy)) {
				aValue = new Date(aValue || '').getTime();
				bValue = new Date(bValue || '').getTime();
			} else {
				aValue = String(aValue || '').toLowerCase();
				bValue = String(bValue || '').toLowerCase();
			}

			if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
			if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
			return 0;
		});

		return filtered;
	}, [loans, searchValue, filters, sortBy, sortOrder]);

	// Pagination calculations
	const paginationInfo: PaginationInfo = useMemo(() => {
		const totalItems = filteredAndSortedLoans.length;
		const totalPages = Math.ceil(totalItems / itemsPerPage);

		return {
			currentPage,
			itemsPerPage,
			totalItems,
			totalPages,
		};
	}, [filteredAndSortedLoans.length, currentPage, itemsPerPage]);

	// Get current page data
	const currentLoans = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		return filteredAndSortedLoans.slice(startIndex, endIndex);
	}, [filteredAndSortedLoans, currentPage, itemsPerPage]);

	// Pagination handlers
	const handlePageChange = (page: number): void => {
		if (page >= 1 && page <= paginationInfo.totalPages) {
			setCurrentPage(page);
		}
	};

	const handleItemsPerPageChange = (newItemsPerPage: number): void => {
		setItemsPerPage(newItemsPerPage);
		setCurrentPage(1);
	};

	const handleNextPage = (): void => {
		if (currentPage < paginationInfo.totalPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	const handlePreviousPage = (): void => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	// Generate page numbers for pagination
	const getPageNumbers = (): (number | string)[] => {
		const { totalPages } = paginationInfo;
		const pages: (number | string)[] = [];

		if (totalPages <= 7) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			pages.push(1);

			if (currentPage > 3) {
				pages.push('...');
			}

			const start = Math.max(2, currentPage - 1);
			const end = Math.min(totalPages - 1, currentPage + 1);

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}

			if (currentPage < totalPages - 2) {
				pages.push('...');
			}

			pages.push(totalPages);
		}

		return pages;
	};

	useEffect(() => {
		const fetchLoans = async () => {
			try {
				const baseURL = `${tenant}.exxforce.com`;
				const token = globalState.accessToken;
				if (!token) throw new Error('No access token');

				const res = await axios.get<Loan[]>(`https://${baseURL}/tenant/loans/list`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setLoans(res.data);
				setisLoan(res.data.length > 0);
			} catch (err: any) {
				console.error('Error fetching loans', err);
				setError(err.message || 'Failed to fetch loans');
				if (err.response?.status === 401) {
					setTimeout(() => {
						router.push('/login');
					}, 2000);
				}
			} finally {
				setLoading(false);
			}
		};

		if (tenant && globalState.accessToken) {
			fetchLoans();
		}
	}, [tenant, globalState.accessToken]);

	if (loading) {
		return (
			<Loading
				message='Loading Loans...'
				size='medium'
				variant='spinner'
				overlay={false}
			/>
		);
	}

	if (error) {
		return <p style={{ color: 'red' }}>{error}</p>;
	}

	if (!isloan) {
		return (
			<div className='h-[680px] m-7 gap-4'>
				<div className='flex flex-row items-center justify-between w-full'>
					<span>
						<h1>Loans</h1>
						<p className='text-xs'>
							Manage employee loans and advances
						</p>
					</span>
				</div>
				<div className='text-center max-w-2xl mx-auto mt-[120px]'>
					<img
						src='/empty.jpg'
						alt='No Loans'
						className='w-32 h-32 md:w-40 md:h-40 mx-auto mb-8'
					/>
					<h2 className='text-2xl md:text-3xl mb-4'>No Loans Yet</h2>
					<pre className='text-base text-muted-foreground mb-8'>
						You haven't added any employee loans. Manage staff
						<br />
						loans easily by adding new loan records or importing
						<br />
						from a file.
					</pre>
				</div>
			</div>
		);
	}

	return (
		<div className='w-full'>
			<div className='self-center h-[603px] ml-7 gap-4'>
				<div className='flex flex-row items-center justify-between w-full'>
					<span>
						<h1>Loans</h1>
						<p className='text-xs'>
							Manage employee loans and advances
						</p>
					</span>
				</div>

				<Card className='mt-12 ml-auto w-full min-h-[750px] p-6'>
					{/* FilterSort Component */}
					<FilterSort
						searchValue={searchValue}
						onSearchChange={handleSearchChange}
						searchPlaceholder="Search loans..."
						filters={filters}
						filterOptions={filterOptions}
						onFilterChange={handleFilterChange}
						sortBy={sortBy}
						sortOrder={sortOrder}
						sortOptions={sortOptions}
						onSortChange={handleSortChange}
						onSortOrderChange={handleSortOrderChange}
						className="mb-6"
					/>

					{/* Loans Grid */}
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6'>
						{currentLoans.map((loan) => (
							<div
								key={loan.id}
								className='bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow'
							>
								<div className='flex items-center justify-between mb-4'>
									<span className='font-medium text-gray-900'>
										{loan.loan_type || 'Loan'}
									</span>
									<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
										{loan.status || 'Active'}
									</span>
								</div>

								<div className='space-y-3'>
									<div className='flex justify-between items-center'>
										<span className='text-sm text-gray-600'>Loan Number:</span>
										<span className='font-medium text-gray-900 text-xs'>
											{loan.loan_number}
										</span>
									</div>

									<div className='flex justify-between items-center'>
										<span className='text-sm text-gray-600'>Employee:</span>
										<span className='font-medium text-gray-900 text-xs'>
											{loan.employee_name || '--'}
										</span>
									</div>

									<div className='flex justify-between items-center'>
										<span className='text-sm text-gray-600'>Amount:</span>
										<span className='font-semibold text-gray-900'>
											{formatCurrency(parseAmount(loan.amount))}
										</span>
									</div>

									<div className='flex justify-between items-center'>
										<span className='text-sm text-gray-600'>Balance:</span>
										<span className='font-semibold text-blue-600'>
											{formatCurrency(parseAmount(loan.balance))}
										</span>
									</div>

									{loan.monthly_deduction && (
										<div className='flex justify-between items-center'>
											<span className='text-sm text-gray-600'>Monthly:</span>
											<span className='font-medium text-gray-900'>
												{formatCurrency(parseAmount(loan.monthly_deduction))}
											</span>
										</div>
									)}
								</div>
							</div>
						))}
					</div>

					{/* Loan Summary */}
					{filteredAndSortedLoans.length > 0 && (
						<div className='bg-blue-50 rounded-lg p-6 border border-blue-200 mb-6'>
							<h4 className='text-lg font-semibold text-blue-900 mb-4'>
								Loan Summary ({filteredAndSortedLoans.length} loans)
							</h4>
							<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
								<div className='text-center'>
									<div className='text-2xl font-bold text-blue-900'>
										{formatCurrency(
											filteredAndSortedLoans.reduce(
												(sum, loan) => sum + parseAmount(loan.amount),
												0
											)
										)}
									</div>
									<div className='text-sm text-blue-700'>Total Loans</div>
								</div>
								<div className='text-center'>
									<div className='text-2xl font-bold text-blue-900'>
										{formatCurrency(
											filteredAndSortedLoans.reduce(
												(sum, loan) => sum + parseAmount(loan.balance),
												0
											)
										)}
									</div>
									<div className='text-sm text-blue-700'>Outstanding Balance</div>
								</div>
								<div className='text-center'>
									<div className='text-2xl font-bold text-blue-900'>
										{formatCurrency(
											filteredAndSortedLoans.reduce(
												(sum, loan) => sum + parseAmount(loan.monthly_deduction),
												0
											)
										)}
									</div>
									<div className='text-sm text-blue-700'>Monthly Deductions</div>
								</div>
							</div>
						</div>
					)}

					{/* Pagination Controls */}
					{filteredAndSortedLoans.length > 0 && (
						<div className="flex flex-col sm:flex-row justify-between items-center px-4 py-2 bg-white border border-gray-200 rounded-lg">
							<div className="text-sm text-gray-600 mb-3 sm:mb-0">
								Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredAndSortedLoans.length)} to{' '}
								{Math.min(currentPage * itemsPerPage, filteredAndSortedLoans.length)} of{' '}
								{filteredAndSortedLoans.length} loans
							</div>
							<div className="flex items-center space-x-1">
								<button
									onClick={handlePreviousPage}
									disabled={currentPage === 1}
									className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Previous
								</button>
								{getPageNumbers().map((page, index) => (
									<button
										key={index}
										onClick={() => (typeof page === 'number' ? handlePageChange(page) : null)}
										className={`px-3 py-1 border rounded-md text-sm font-medium ${
											page === currentPage
												? 'bg-blue-600 text-white border-blue-600'
												: 'text-gray-700 border-gray-300'
										} ${typeof page !== 'number' ? 'cursor-default' : ''}`}
									>
										{page}
									</button>
								))}
								<button
									onClick={handleNextPage}
									disabled={currentPage === paginationInfo.totalPages || paginationInfo.totalPages === 0}
									className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Next
								</button>
								<select
									value={itemsPerPage}
									onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
									className="ml-2 p-1 border border-gray-300 rounded text-sm text-gray-700"
								>
									{[10, 20, 50].map((size) => (
										<option key={size} value={size}>
											{size} per page
										</option>
									))}
								</select>
							</div>
						</div>
					)}
				</Card>
			</div>
		</div>
	);
}
