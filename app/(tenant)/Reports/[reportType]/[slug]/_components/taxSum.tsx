'use client';
import React, { useMemo, useState, useEffect } from 'react';
import { Users, TrendingUp, Calculator, Building } from 'lucide-react';
import FilterSort, {
	FilterOption,
	SortOption,
} from '../../../../components/FilterSort';
import { Pagination, PageSizeSelector } from '../../../../components/pagination';
import clsx from 'clsx';
// Interface definitions
interface TaxTotals {
	gross: number;
	paye: number;
}

interface DepartmentTaxData {
	gross: number;
	paye: number;
}

interface EmployeeTaxData {
	employee: string;
	department: string;
	payrun: string;
	gross: number;
	taxable_income: number;
	paye: number;
}

interface TaxSummaryData {
	period: string;
	payruns_count: number;
	employees_paid: number;
	totals: TaxTotals;
	by_department: Record<string, DepartmentTaxData>;
	employees: EmployeeTaxData[];
}

interface TaxSummaryReportProps {
	data: TaxSummaryData;
}

const TaxSummaryReport: React.FC<TaxSummaryReportProps> = ({ data }) => {
	// Add state for filtering, sorting, and pagination
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [searchValue, setSearchValue] = useState('');
	const [filters, setFilters] = useState<Record<string, string>>({
		department: 'All',
	});
	const [sortBy, setSortBy] = useState('employee');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

	// Add null/undefined checks
	if (!data) {
		return (
			<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
				<p className='text-lg text-gray-600'>No data available</p>
			</div>
		);
	}

	// Format currency function
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

	// Format number with commas
	const formatNumber = (num: number): string => {
		if (num === null || num === undefined || isNaN(num)) {
			return '0';
		}
		return new Intl.NumberFormat().format(num);
	};

	// Calculate tax rate
	const calculateTaxRate = (paye: number, gross: number): string => {
		if (gross === 0) return '0.0';
		return ((paye / gross) * 100).toFixed(1);
	};

	// Safe access to nested properties
	const totals = data.totals || { gross: 0, paye: 0 };
	const departments = data.by_department || {};
	const employees = data.employees || [];

	// Calculate average tax rate
	const averageTaxRate = calculateTaxRate(totals.paye, totals.gross);

	// Define filter and sort options
	const filterOptions: Record<string, FilterOption[]> = useMemo(() => {
		const uniqueDepartments = [
			...new Set(employees.map((emp) => emp.department).filter(Boolean)),
		];
		return {
			department: uniqueDepartments.map((dept) => ({
				value: dept,
				label: dept,
			})),
		};
	}, [employees]);

	const sortOptions: SortOption[] = [
		{ value: 'employee', label: 'Employee Name' },
		{ value: 'department', label: 'Department' },
		{ value: 'gross', label: 'Gross Pay' },
		{ value: 'paye', label: 'PAYE Tax' },
	];

	// Filtering and sorting logic
	const filteredAndSortedEmployees = useMemo(() => {
		let filtered = employees.filter((emp) => {
			const searchMatch =
				searchValue === '' ||
				emp.employee.toLowerCase().includes(searchValue.toLowerCase()) ||
				emp.department.toLowerCase().includes(searchValue.toLowerCase()) ||
				emp.payrun.toLowerCase().includes(searchValue.toLowerCase());

			const deptMatch =
				filters.department === 'All' || emp.department === filters.department;

			return searchMatch && deptMatch;
		});

		filtered.sort((a, b) => {
			let aValue = a[sortBy as keyof EmployeeTaxData];
			let bValue = b[sortBy as keyof EmployeeTaxData];

			if (['gross', 'taxable_income', 'paye'].includes(sortBy)) {
				aValue = Number(aValue) || 0;
				bValue = Number(bValue) || 0;
			}

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

	const handleFilterChange = (filterKey: string, value: string) => {
		setFilters((prev) => ({
			...prev,
			[filterKey]: value,
		}));
	};

	useEffect(() => {
		setCurrentPage(1);
	}, [searchValue, filters, sortBy, sortOrder]);

	return (
		<div className='min-h-screen bg-gray-50 p-6'>
			<div className='max-w-7xl mx-auto'>
				{/* Header */}
				<div className='mb-8'>
					<h1 className='text-3xl font-bold text-gray-900 mb-2'>
						Tax Summary Report
					</h1>
					<p className='text-lg text-gray-600'>
						Period: {data.period || 'N/A'}
					</p>
				</div>

				{/* Summary Cards */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
					{/* Total Gross Pay Card */}
					<div className='bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm font-medium text-gray-600 mb-1'>
									Total Gross Pay
								</p>
								<p className='text-2xl font-bold text-blue-600'>
									{formatCurrency(totals.gross)}
								</p>
							</div>
							<div className='p-3 bg-blue-100 rounded-full'>
								<TrendingUp className='h-6 w-6 text-blue-600' />
							</div>
						</div>
					</div>

					{/* Total PAYE Card */}
					<div className='bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm font-medium text-gray-600 mb-1'>
									Total PAYE Tax
								</p>
								<p className='text-2xl font-bold text-red-600'>
									{formatCurrency(totals.paye)}
								</p>
							</div>
							<div className='p-3 bg-red-100 rounded-full'>
								<Calculator className='h-6 w-6 text-red-600' />
							</div>
						</div>
					</div>

					{/* Average Tax Rate Card */}
					<div className='bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm font-medium text-gray-600 mb-1'>
									Average Tax Rate
								</p>
								<p className='text-2xl font-bold text-yellow-600'>
									{averageTaxRate}%
								</p>
							</div>
							<div className='p-3 bg-yellow-100 rounded-full'>
								<Calculator className='h-6 w-6 text-yellow-600' />
							</div>
						</div>
					</div>

					{/* Employees & Payruns Card */}
					<div className='bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm font-medium text-gray-600 mb-1'>
									Employees Paid
								</p>
								<p className='text-2xl font-bold text-purple-600'>
									{formatNumber(data.employees_paid || 0)}
								</p>
								<p className='text-sm text-gray-500 mt-1'>
									{formatNumber(data.payruns_count || 0)} payruns
								</p>
							</div>
							<div className='p-3 bg-purple-100 rounded-full'>
								<Users className='h-6 w-6 text-purple-600' />
							</div>
						</div>
					</div>
				</div>

				{/* Department Tax Summary Table */}
				<div className='bg-white rounded-lg shadow-md overflow-hidden mb-8'>
					<div className='px-6 py-4 bg-gray-50 border-b'>
						<h3 className='text-xl font-semibold text-gray-900 flex items-center gap-2'>
							<Building className='h-5 w-5' />
							Department Tax Summary
						</h3>
					</div>
					<div className='overflow-x-auto'>
						{Object.keys(departments).length === 0 ? (
							<p className='text-gray-500 text-center py-8'>
								No department data available
							</p>
						) : (
							<table className='min-w-full divide-y divide-gray-200'>
								<thead className='bg-gray-50'>
									<tr>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Department
										</th>
										<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Gross Pay
										</th>
										<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
											PAYE Tax
										</th>
										<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Tax Rate
										</th>
										<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Net Pay
										</th>
									</tr>
								</thead>
								<tbody className='bg-white divide-y divide-gray-200'>
									{Object.entries(departments).map(([department, deptData]) => {
										const taxRate = calculateTaxRate(
											deptData.paye,
											deptData.gross
										);
										const netPay = deptData.gross - deptData.paye;
										return (
											<tr
												key={department}
												className='hover:bg-gray-50 transition-colors'>
												<td className='px-6 py-4 whitespace-nowrap'>
													<div className='text-sm font-medium text-gray-900'>
														{department}
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-right'>
													<div className='text-sm font-bold text-blue-600'>
														{formatCurrency(deptData.gross)}
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-right'>
													<div className='text-sm font-bold text-red-600'>
														{formatCurrency(deptData.paye)}
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-right'>
													<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
														{taxRate}%
													</span>
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-right'>
													<div className='text-sm font-bold text-green-600'>
														{formatCurrency(netPay)}
													</div>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						)}
					</div>
				</div>

				{/* Employee Tax Details */}
				<div className='bg-white rounded-lg shadow-md overflow-hidden'>
					<div className='px-6 py-4 bg-gray-50 border-b'>
						<h3 className='text-xl font-semibold text-gray-900 flex items-center gap-2'>
							<Users className='h-5 w-5' />
							Employee Tax Details
						</h3>
					</div>
					<div className='p-4 border-b border-gray-200'>
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
						/>
					</div>
					<div className='overflow-x-auto'>
						{employees.length === 0 ? (
							<p className='text-gray-500 text-center py-8'>
								No employee data available
							</p>
						) : (
							<table className='min-w-full divide-y divide-gray-200'>
								<thead className='bg-gray-50'>
									<tr>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Employee
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Department
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Payrun
										</th>
										<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Gross Pay
										</th>
										<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Taxable Income
										</th>
										<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
											PAYE Tax
										</th>
										<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Tax Rate
										</th>
									</tr>
								</thead>
								<tbody className='bg-white divide-y divide-gray-200'>
									{paginatedEmployees.map((emp, index) => {
										const taxRate = calculateTaxRate(
											emp.paye,
											emp.taxable_income
										);
										return (
											<tr
												key={index}
												className='hover:bg-gray-50 transition-colors'>
												<td className='px-6 py-4 whitespace-nowrap'>
													<div className='text-sm font-medium text-gray-900'>
														{emp.employee}
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap'>
													<div className='text-sm text-gray-600'>
														{emp.department}
													</div>
												</td>
												<td className='px-6 py-4'>
													<div
														className='text-sm text-gray-600 max-w-xs truncate'
														title={emp.payrun}>
														{emp.payrun}
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-right'>
													<div className='text-sm font-bold text-blue-600'>
														{formatCurrency(emp.gross)}
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-right'>
													<div className='text-sm text-gray-600'>
														{formatCurrency(emp.taxable_income)}
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-right'>
													<div className='text-sm font-bold text-red-600'>
														{formatCurrency(emp.paye)}
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-right'>
													<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
														{taxRate}%
													</span>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						)}
					</div>
					<div className='flex justify-between items-center mt-4 p-4'>
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
				</div>

				{/* Summary Footer */}
				<div className='mt-8 text-center text-sm text-gray-500'>
					<p>
						Generated on{' '}
						{new Date().toLocaleDateString('en-NG', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
							hour: '2-digit',
							minute: '2-digit',
						})}
					</p>
				</div>
			</div>
		</div>
	);
};

export default TaxSummaryReport;
