'use client';
import { Card } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import React, { useEffect, useMemo, useState } from 'react';
import payRunList from '../_components/payrunList';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { EllipsisVertical, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import axios from 'axios';
import { useGlobal } from '@/app/Context/context';
import { getAccessToken, getTenant } from '@/lib/auth';
// import { Router } from 'next/router';
import { useRouter } from 'next/navigation';
import FilterSort, {
	FilterOption,
	SortOption,
} from '../../components/FilterSort';
import { Pagination, PageSizeSelector } from '../../components/pagination';
interface PayRun {
	id: number;
	name: string;
	pay_period: string;
	next_payrun_date: string;
	deductions: string;
	start_date: string;
	end_date: string;
	payment_date: string;
	status: string;
}

interface Summary {
	payrun_id: number;
	total_employees: number;
	total_net_salary: string;
	total_deductions: string;
	prorated_employees: number;
}

interface Employee {
	benefits: string;
	deductions: string;
	employee_id: string;
	gross: string;
	id: number;
	name: string;
	net_salary: string;
	paygrade: string;
	status: string;
}

const page = ({ params }: { params: Promise<{ payrunId: string }> }) => {
	const router = useRouter();
	const [payRun, setPayRun] = useState<PayRun | null>(null);
	const [isLoading, setIsLoading] = useState<Boolean>(false);
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [planName, setPlanName] = useState<string>('');
	const [paySummary, setPaySummary] = useState<Summary>();
	const [error, setError] = useState<string>('');
	const [token, setToken] = useState<string>('');
	const { payrunId } = React.use(params);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [searchValue, setSearchValue] = useState('');
	const [filters, setFilters] = useState<Record<string, string>>({
		status: 'All',
		paygrade: 'All',
	});
	const [sortBy, setSortBy] = useState('name');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

	const filterOptions: Record<string, FilterOption[]> = useMemo(() => {
		const uniqueStatuses = [...new Set(employees.map((emp) => emp.status))];
		const uniquePaygrades = [...new Set(employees.map((emp) => emp.paygrade))];

		return {
			status: uniqueStatuses.map((status) => ({
				value: status,
				label: status,
			})),
			paygrade: uniquePaygrades.map((paygrade) => ({
				value: paygrade,
				label: paygrade,
			})),
		};
	}, [employees]);
	const sortOptions: SortOption[] = [
		{ value: 'name', label: 'Employee Name' },
		{ value: 'paygrade', label: 'Pay Grade' },
		{ value: 'gross', label: 'Gross Salary' },
		{ value: 'deductions', label: 'Deductions' },
		{ value: 'benefits', label: 'Benefits' },
		{ value: 'net_salary', label: 'Net Salary' },
		{ value: 'status', label: 'Status' },
	];
	const filteredAndSortedEmployees = useMemo(() => {
		let filtered = employees.filter((employee) => {
			// Search filter
			const searchMatch =
				searchValue === '' ||
				employee.name.toLowerCase().includes(searchValue.toLowerCase()) ||
				employee.paygrade.toLowerCase().includes(searchValue.toLowerCase()) ||
				employee.status.toLowerCase().includes(searchValue.toLowerCase()) ||
				employee.employee_id.toLowerCase().includes(searchValue.toLowerCase());

			// Status filter
			const statusMatch =
				filters.status === 'All' || employee.status === filters.status;

			// Paygrade filter
			const paygradeMatch =
				filters.paygrade === 'All' || employee.paygrade === filters.paygrade;

			return searchMatch && statusMatch && paygradeMatch;
		});

		// Sort
		filtered.sort((a, b) => {
			let aValue = a[sortBy as keyof Employee];
			let bValue = b[sortBy as keyof Employee];

			// Handle numeric sorting for salary fields
			if (['gross', 'deductions', 'benefits', 'net_salary'].includes(sortBy)) {
				aValue = Number(aValue) || 0;
				bValue = Number(bValue) || 0;
			}

			// Handle string sorting
			if (typeof aValue === 'string' && typeof bValue === 'string') {
				aValue = aValue.toLowerCase();
				bValue = bValue.toLowerCase();
			}

			if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
			if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
			return 0;
		});

		return filtered;
	}, [employees, searchValue, filters, sortBy, sortOrder]);

	// Pagination logic
	const paginatedEmployees = useMemo(() => {
		const startIndex = (currentPage - 1) * pageSize;
		return filteredAndSortedEmployees.slice(startIndex, startIndex + pageSize);
	}, [filteredAndSortedEmployees, currentPage, pageSize]);

	// Reset page when filters change
	useEffect(() => {
		setCurrentPage(1);
	}, [searchValue, filters, sortBy, sortOrder]);

	const handleFilterChange = (filterKey: string, value: string) => {
		setFilters((prev) => ({
			...prev,
			[filterKey]: value,
		}));
	};

	useEffect(() => {
		const accessToken = localStorage.getItem('access_token');
		if (!accessToken) {
			setError('No access token found');
			return;
		}
		setToken(accessToken);
		const tenant = getTenant();

		const baseURL = `https://${tenant}.exxforce.com`;

		const fetchData = async () => {
			try {
				const [payRunRes, employeesRes, planRes, paySum] = await Promise.all([
					axios.get<PayRun>(`${baseURL}/tenant/payrun/${payrunId}`, {
						headers: { Authorization: `Bearer ${accessToken}` },
					}),
					axios.get<Employee[]>(
						`${baseURL}/tenant/payrun/${payrunId}/eligible-employees`,
						{
							headers: { Authorization: `Bearer ${accessToken}` },
						}
					),
					axios.get<{ plan_name: string }>(`${baseURL}/tenant/payrun/plan`, {
						headers: { Authorization: `Bearer ${accessToken}` },
					}),
					axios.get<Summary>(`${baseURL}/tenant/payrun/${payrunId}/summary`, {
						headers: { Authorization: `Bearer ${accessToken}` },
					}),
				]);

				setPayRun(payRunRes.data);
				setEmployees(employeesRes.data);
				setPlanName(planRes.data.plan_name);
				setPaySummary(paySum.data);
				console.log(
					payRunRes.data,
					employeesRes.data,
					planRes.data,
					paySum.data
				);
			} catch (err: any) {
				console.error('Error loading data', err);
				setError(
					Array.isArray(err.response?.data?.detail)
						? err.response.data.detail.map((e: any) => e.msg).join(', ')
						: err.response?.data?.detail || 'Failed to load data'
				);
				if (err.status === 401) {
					router.push('/login');
				}
			}
		};
		fetchData();
	}, []);

	const formatCurrency = (amount: number): string => {
		if (amount === null || amount === undefined || isNaN(amount)) {
			return '₦0.00';
		}
		return new Intl.NumberFormat('en-NG', {
			style: 'currency',
			currency: 'NGN',
			minimumFractionDigits: 2,
		}).format(amount);
	};
	const handleSubmit = async () => {
		const tenant = getTenant();
		const baseURL = `https://${tenant}.exxforce.com`;
		const accessToken = getAccessToken();

		try {
			setIsLoading(true);
			const res = await axios.post(
				`${baseURL}/tenant/payrun/${payrunId}/submit`,
				{}, // empty request body
				{ headers: { Authorization: `Bearer ${accessToken}` } }
			);

			if (res.status === 200) {
				console.log(res);
			}
			router.refresh();
		} catch (err: any) {
			console.log(err); // Also fixed: was logging "Error" instead of the actual error
			// Uncomment if you want to handle 401 specifically
			if (err.response?.status === 401) {
			    router.push('/login');
			}
		} finally {
			setIsLoading(false); // Don't forget to reset loading state
		}
	};

	return (
		<div className='h-[1080px]'>
			<div className='m-4 flex justify-between'>
				<div>
					<h1>Pay Runs</h1>
					<p className='text-xs'>Create and Mange your Payruns</p>
				</div>
				{payRun?.status === 'DRAFT' ? (
					<div>
						<Button
							variant={'default'}
							className='bg-blue-500'
							onClick={handleSubmit}>
							Submit for Approval
						</Button>
					</div>
				) : null}
			</div>
			<section className='flex justify-between m-2 w-[1050px]'>
				<Card className='m-1 p-3 w-[250px] h-fit'>
					<article className='flex gap-2 content-center items-center'>
						<span className='bg-[#dee7f6] rounded-4xl p-2 '>
							<img
								src='/icons/employee-group.png'
								alt=''
								width={20}
								height={20}
							/>
						</span>
						<h5>Total Employees </h5>
					</article>
					<hr />
					<span>
						<h2 className='font-bold'>{employees.length}</h2>
						<p className='text-xs text-muted-foreground'>
							Employees are eligible for this run
						</p>
					</span>
				</Card>
				<Card className='m-1 p-3 w-[245px] h-fit'>
					<article className='flex gap-2 content-center items-center'>
						<span className='bg-[#d9f2ef] rounded-4xl p-2 '>
							<img
								src='/icons/money-bag (2).png'
								alt=''
								width={20}
								height={20}
							/>
						</span>
						<h5>Total Net Salary</h5>
					</article>
					<hr />
					<span>
						<h2 className='font-bold'>
							{formatCurrency(Number(paySummary?.total_net_salary)) ||
								formatCurrency(
									employees.reduce(
										(acc, emp) => acc + Number(emp.net_salary),
										0
									)
								)}
						</h2>
						<p className='text-xs text-muted-foreground'>
							Total payroll after deductions
						</p>
					</span>
				</Card>
				<Card className='m-1 p-3 w-[245px] h-fit'>
					<article className='flex gap-2 content-center items-center'>
						<span className='bg-[#f4e0da] rounded-4xl p-2 '>
							<img
								src='/icons/percentage.png'
								alt=''
								width={20}
								height={20}
							/>
						</span>
						<h5>Total Deduction</h5>
					</article>
					<hr />
					<span>
						<h2 className='font-bold'>
							{formatCurrency(Number(paySummary?.total_deductions)) ||
								employees.reduce((acc, emp) => acc + Number(emp.deductions), 0)}
						</h2>
						<p className='text-xs text-muted-foreground'>
							Deduction from all employees in this run
						</p>
					</span>
				</Card>
				{/* <Card className='m-1 p-3 w-[245px] h-fit'>
					<article className='flex gap-2 content-center items-center'>
						<span className='bg-[#f8edd9] rounded-4xl p-2 '>
							<img
								src='/icons/money-hand.png'
								alt=''
								width={20}
								height={20}
							/>
						</span>
						<h5 className=''>Prorated Salaries</h5>
					</article>
					<hr />
					<span>
						<h2 className='font-bold'>
							{`${paySummary?.prorated_employees || 0}
							 Employees`}
						</h2>
						<p className='text-xs text-muted-foreground'>
							Had prorated pay
						</p>
					</span>
				</Card> */}
				<Card className='m-1 p-3 w-[245px] h-fit'>
					<article className='flex gap-2 content-center items-center'>
						<span className='bg-[#f8edd9] rounded-4xl p-2 '>
							<img
								src='/icons/CalendarDots.png'
								alt=''
								width={20}
								height={20}
							/>
						</span>
						<h4 className=''>Next Payroll Date</h4>
					</article>
					<hr />
					<span>
						<h2 className='font-bold'>{payRun?.next_payrun_date}</h2>
						<p className='text-xs text-muted-foreground'>
							Scheduled next payroll run
						</p>
					</span>
				</Card>
			</section>
			<section className='mx-2 mt-4'>
				<FilterSort
					searchValue={searchValue}
					onSearchChange={setSearchValue}
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
				<Card>
					<Table>
						<TableHeader>
							<TableRow className='text-[#3a56d8]'>
								<TableCell className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									EMPLOYEE NAME{' '}
								</TableCell>
								<TableCell className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									PAY GRADE
								</TableCell>
								<TableCell className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									GROSS SALARY
								</TableCell>
								<TableCell className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									DEDUCTIONS
								</TableCell>
								<TableCell className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									BENEFITS
								</TableCell>
								{/* <TableCell>DAYS WORKED</TableCell> */}
								<TableCell className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									NET SALARY
								</TableCell>
								<TableCell className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									STATUS
								</TableCell>
								<TableCell className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									MORE
								</TableCell>
							</TableRow>
						</TableHeader>
						<TableBody>
							{paginatedEmployees.map((payrun, index) => {
								return (
									<TableRow
										key={index}
										className='text-sm font-light align-middle content-center items-center'>
										<TableCell className='px-6 py-3 text-left text-xs font-medium b tracking-wider'>
											{payrun.name}
										</TableCell>
										<TableCell className='px-6 py-3 text-left text-xs font-medium b tracking-wider'>
											{payrun.paygrade}
										</TableCell>
										<TableCell className='px-6 py-3 text-left text-xs font-medium b tracking-wider'>
											₦{payrun.gross}
										</TableCell>
										<TableCell className='px-6 py-3 text-left text-xs font-medium b tracking-wider'>
											₦{payrun.deductions}
										</TableCell>
										<TableCell className='px-6 py-3 text-left text-xs font-medium b tracking-wider'>
											₦{payrun.benefits}
										</TableCell>
										{/* <TableCell>{payrun.days_worked}</TableCell> */}
										<TableCell className='px-6 py-3 text-left text-xs font-medium b tracking-wider'>
											₦{payrun.net_salary}
										</TableCell>
										<TableCell className='px-6 py-3 text-left text-xs font-medium b tracking-wider'>
											<span
												className={`${
													payrun.status === 'PAID'
														? 'text-green-600  bg-[#e6f6f4] border-green-200 '
														: 'text-yellow-600 bg-[#fff0de] border-yellow-200'
												} border-2 px-3 py-1 rounded-xl text-sm font-light`}>
												{payrun.status}
											</span>
										</TableCell>
										<TableCell className='px-6 py-3 text-left text-xs font-medium b tracking-wider'>
											<Popover>
												<PopoverTrigger>
													<EllipsisVertical />
												</PopoverTrigger>
												<PopoverContent className='grid grid-cols-1 !p-0 !m-0 w-fit'>
													<Link href={'./paytemps/preview'}>
														<Button
															variant={'default'}
															className='flex bg-white text-black hover:bg-secondary w-fit'>
															<Eye />{' '}
															<p className=' font-light'>Preview Payslips</p>
														</Button>
													</Link>
												</PopoverContent>
											</Popover>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</Card>
				<div className='flex justify-between items-center mt-4'>
					<PageSizeSelector
						pageSize={pageSize}
						onChange={setPageSize}
					/>
					<Pagination
						currentPage={currentPage}
						pageSize={pageSize}
						totalItems={filteredAndSortedEmployees.length}
						onPageChange={setCurrentPage}
					/>
				</div>
			</section>
		</div>
	);
};

export default page;
