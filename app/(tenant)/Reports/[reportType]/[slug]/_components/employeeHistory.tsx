// _components/employeeHistory.tsx
import React, { useEffect, useState } from 'react';
import {
	Users,
	TrendingUp,
	TrendingDown,
	UserPlus,
	UserMinus,
	Search,
	Calendar,
	AlertCircle,
} from 'lucide-react';
import { da } from 'date-fns/locale';

// Interface definitions for Employee History
interface History {
	deductions: number;
	deductions_breakdown: { [key: string]: number };
	earnings_breakdown: { [key: string]: number };
	gross: number;
	net:number;
	payrun: string;
	period: string;
}


interface EmployeeChange {
	employee: string;
	employee_id: string; 
	department: string;
	history: History[];
	payruns_count: number;
	totals: {gross: number; net: number; deductions: number; };
}



interface EmployeeHistoryData {
	period: string;
	employees_count: number;
	employees: EmployeeChange[];
}

interface EmployeeHistoryReportProps {
	data: EmployeeHistoryData;
}

const EmployeeHistoryReport: React.FC<EmployeeHistoryReportProps> = ({
	data,
}) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [filterChangeType, setFilterChangeType] = useState('all');
	const [filterDepartment, setFilterDepartment] = useState('all');
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 15;

	// Format date function
	const formatDate = (dateString: string): string => {
		return new Date(dateString).toLocaleDateString('en-NG', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	useEffect(()=>{
		const employeeTotals = data.employees.map((emp) => emp.totals);
		console.log(employeeTotals);
	}, [data])

	// Format number with commas
	const formatNumber = (num: number): string => {
		return new Intl.NumberFormat().format(num);
	};

	// Format currency
	const formatCurrency = (amount: string): string => {
		const numAmount = parseFloat(amount);
		if (isNaN(numAmount)) return amount;
		return new Intl.NumberFormat('en-NG', {
			style: 'currency',
			currency: 'NGN',
			minimumFractionDigits: 0,
		}).format(numAmount);
	};


	// Calculate stats if not provided
	const getStats = (): EmployeeChange => {
		// if (data.employees) return [...data.employees];

		const stats = {
			employee: '--',
			employee_id: '--',
			department: '--',
			history: [],
			payruns_count: data.employees.length > 0 ? data.employees[0].payruns_count : 0,
			totals: { gross: data.employees.reduce((sum, emp) => sum + emp.history.reduce((hSum, h) => hSum + h.gross, 0), 0), net: data.employees.reduce((sum, emp) => sum + emp.history.reduce((hSum, h) => hSum + h.net, 0), 0), deductions: data.employees.reduce((sum, emp) => sum + emp.history.reduce((hSum, h) => hSum + h.deductions, 0), 0) },
		};

		return stats;
	};

	const stats = getStats();

	// Filter changes
	const filteredChanges = data.employees.filter((change) => {
		const matchesSearch =
			change.employee?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			change.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
			change.department.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesChangeType =
			filterChangeType === 'all' ||
			(change.history && change.history.some(h => h.payrun === filterChangeType));
		const matchesDepartment =
			filterDepartment === 'all' || change.department === filterDepartment;

		return matchesSearch && matchesChangeType && matchesDepartment;
	});

	// Paginate changes
	const totalPages = Math.ceil(filteredChanges.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const paginatedChanges = filteredChanges.slice(
		startIndex,
		startIndex + itemsPerPage
	);

	// Get unique departments and change types for filter dropdowns
	const uniqueDepartments = Array.from(
		new Set(data.employees.map((c) => c.department))
	);
	const uniqueChangeTypes = Array.from(
		new Set(
			data.employees
				.flatMap((employee) => employee.history.map((h) => h.payrun))
		)
	);

	

	return (
		<div className='min-h-screen bg-gray-50 p-6'>
			<div className='max-w-7xl mx-auto'>
				{/* Header */}
				<div className='mb-8'>
					<h1 className='text-3xl font-bold text-gray-900 mb-2'>
						Employee Pay History Report
					</h1>
					<p className='text-lg text-gray-600'>Period: {data.period}</p>
				</div>

				{/* Summary Cards */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
					{/* Total Employees Card */}
					<div className='bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm font-medium text-gray-600 mb-1'>
									Total Employees
								</p>
								<p className='text-2xl font-bold text-blue-600'>
									{formatNumber(data.employees_count)}
								</p>
							</div>
							<div className='p-3 bg-blue-100 rounded-full'>
								<Users className='h-6 w-6 text-blue-600' />
							</div>
						</div>
					</div>

					{/* New Hires Card */}
					<div className='bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm font-medium text-gray-600 mb-1'>Net</p>
								<p className='text-2xl font-bold text-blue-600'>
									{formatNumber(
										data.employees.reduce((total, emp) => {
											const empNet = emp.history.reduce(
												(sum, h) => sum + h.net,
												0
											);
											return total + empNet;
										}, 0)
									)}
								</p>
							</div>
							<div className='p-3 bg-blue-100 rounded-full'>
								<UserPlus className='h-6 w-6 text-blue-600' />
							</div>
						</div>
					</div>
				</div>

					{/* Main Content */}
					{data.employees.length === 0 ? (
						/* Empty State */
						<div className='bg-white rounded-lg shadow-md p-12'>
							<div className='text-center'>
								<div className='mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gray-100 mb-6'>
									<Users className='h-12 w-12 text-gray-400' />
								</div>
								<h3 className='text-xl font-semibold text-gray-900 mb-4'>
									No Employee History Data
								</h3>
								<p className='text-gray-600 mb-6 max-w-md mx-auto'>
									There are no employee history records available for the
									selected period. This could mean:
								</p>
								<div className='text-left max-w-md mx-auto space-y-2 mb-8'>
									<div className='flex items-start gap-3'>
										<div className='w-2 h-2 bg-blue-500 rounded-full mt-2'></div>
										<p className='text-gray-600'>
											No employee changes occurred during this period
										</p>
									</div>
									<div className='flex items-start gap-3'>
										<div className='w-2 h-2 bg-blue-500 rounded-full mt-2'></div>
										<p className='text-gray-600'>
											Employee history tracking is not yet active
										</p>
									</div>
									<div className='flex items-start gap-3'>
										<div className='w-2 h-2 bg-blue-500 rounded-full mt-2'></div>
										<p className='text-gray-600'>
											The selected date range may need adjustment
										</p>
									</div>
								</div>
								<div className='bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto'>
									<p className='text-blue-800 text-sm'>
										<strong>Tip:</strong> Employee history will start tracking
										changes from when employees are hired, terminated, promoted,
										or have salary adjustments.
									</p>
								</div>
							</div>
						</div>
					) : (
						<>
							{/* Change Type Summary */}
							<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
								{/* Change Types Breakdown */}
								<div className='bg-white rounded-lg shadow-md overflow-hidden'>
									<div className='px-6 py-4 bg-gray-50 border-b'>
										<h3 className='text-lg font-semibold text-gray-900'>
											Data Summary
										</h3>
									</div>
									<div className='p-6'>
										<div className='space-y-4'>
											<div className='flex justify-between items-center py-2 border-b border-gray-100'>
												<span className='font-medium text-gray-700'>
													Deductions
												</span>
												<span className='font-bold text-blue-600'>
													{formatNumber(stats.totals.deductions)}
												</span>
											</div>
											<div className='flex justify-between items-center py-2 border-b border-gray-100'>
												<span className='font-medium text-gray-700'>
													PayRuns
												</span>
												<span className='font-bold text-blue-600'>
													{formatNumber(stats.payruns_count)}
												</span>
											</div>

											<div className='flex justify-between items-center py-2 border-b border-gray-100'>
												<span className='font-medium text-gray-700'>
													Gross
												</span>
												<span className='font-bold text-blue-600'>
													{formatNumber(
														data.employees.reduce((total, emp) => {
															const empNet = emp.history.reduce(
																(sum, h) => sum + h.gross,
																0
															);
															return total + empNet;
														}, 0)
													)}
												</span>
											</div>
										</div>
									</div>
								</div>

								{/* Department Summary */}
								<div className='bg-white rounded-lg shadow-md overflow-hidden'>
									<div className='px-6 py-4 bg-gray-50 border-b'>
										<h3 className='text-lg font-semibold text-gray-900'>
											Department Activity
										</h3>
									</div>
									<div className='p-6'>
										<div className='space-y-4'>
											{uniqueDepartments.map((dept) => {
												const deptChanges = data.employees.filter(
													(e) => e.department === dept
												).length;
												return (
													<div
														key={dept}
														className='flex justify-between items-center py-2 border-b border-gray-100 last:border-0'>
														<span className='font-medium text-gray-700 capitalize'>
															{dept}
														</span>
														<span className='font-bold text-blue-600'>
															{formatNumber(deptChanges)}
														</span>
													</div>
												);
											})}
										</div>
									</div>
								</div>
							</div>

							{/* Filters and Search */}
							<div className='bg-white rounded-lg shadow-md p-6 mb-8'>
								<div className='flex flex-col lg:flex-row gap-4 items-center'>
									<div className='flex items-center gap-2 text-gray-700'>
										<Search className='h-5 w-5' />
										<span className='font-medium'>Search & Filter:</span>
									</div>

									<div className='flex flex-col sm:flex-row gap-4 flex-1'>
										{/* Search */}
										<div className='relative flex-1'>
											<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
											<input
												type='text'
												placeholder='Search employees...'
												value={searchTerm}
												onChange={(e) => setSearchTerm(e.target.value)}
												className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
											/>
										</div>

										{/* Change Type Filter */}
										<select
											value={filterChangeType}
											onChange={(e) => setFilterChangeType(e.target.value)}
											className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'>
											<option value='all'>All Changes</option>
											{uniqueChangeTypes.map((changeType) => (
												<option
													key={changeType}
													value={changeType}>
													{changeType}
												</option>
											))}
										</select>

										{/* Department Filter */}
										<select
											value={filterDepartment}
											onChange={(e) => setFilterDepartment(e.target.value)}
											className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'>
											<option value='all'>All Departments</option>
											{uniqueDepartments.map((dept) => (
												<option
													key={dept}
													value={dept}>
													{dept}
												</option>
											))}
										</select>
									</div>

									<div className='text-sm text-gray-500'>
										Showing {paginatedChanges.length} of{' '}
										{filteredChanges.length} changes
									</div>
								</div>
							</div>

							{/* Employee Changes Table */}
							<div className='bg-white rounded-lg shadow-md overflow-hidden'>
								<div className='px-6 py-4 bg-gray-50 border-b'>
									<h3 className='text-xl font-semibold text-gray-900'>
										Employee History Details
									</h3>
								</div>
								<div className='overflow-x-auto'>
									<table className='min-w-full divide-y divide-gray-200'>
										<thead className='bg-gray-50'>
											<tr>
												<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
													Date
												</th>
												<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
													Employee
												</th>
												<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
													Department
												</th>
												<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
													Details
												</th>
											</tr>
										</thead>
										<tbody className='bg-white divide-y divide-gray-200'>
											{paginatedChanges.map((change, index) => {
												const changeDetails = (
													change.history[index-1]?.payrun || 'UNKNOWN'
												);
												let Icon = AlertCircle;

												return (
													<tr
														key={change.employee_id}
														className='hover:bg-gray-50 transition-colors'>
														<td className='px-6 py-4 whitespace-nowrap'>
															<div className='text-sm text-gray-900'>
																{change.history[0]?.period}
															</div>
														</td>
														<td className='px-6 py-4 whitespace-nowrap'>
															<div className='flex items-center'>
																<div className='flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center'>
																	<Users className='h-4 w-4 text-gray-600' />
																</div>
																<div className='ml-3'>
																	<div className='text-sm font-medium text-gray-900'>
																		{change.employee}
																	</div>
																	<div className='text-sm text-gray-500'>
																		ID: {change.employee_id}
																	</div>
																</div>
															</div>
														</td>
														
														<td className='px-6 py-4 whitespace-nowrap'>
															<div className='text-sm text-gray-900 capitalize'>
																{change.department}
															</div>
														</td>
														<td className='px-6 py-4 whitespace-nowrap'>
															<div className='text-sm text-gray-500'>
																{change.payruns_count} Payruns
															</div>
															<div className='text-sm text-gray-500'></div>
														</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</div>

								{/* Pagination */}
								{totalPages > 1 && (
									<div className='bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200'>
										<div className='text-sm text-gray-500'>
											Showing {startIndex + 1} to{' '}
											{Math.min(
												startIndex + itemsPerPage,
												filteredChanges.length
											)}{' '}
											of {filteredChanges.length} results
										</div>
										<div className='flex items-center gap-2'>
											<button
												onClick={() =>
													setCurrentPage(Math.max(1, currentPage - 1))
												}
												disabled={currentPage === 1}
												className='px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100'>
												Previous
											</button>
											<span className='text-sm text-gray-600'>
												Page {currentPage} of {totalPages}
											</span>
											<button
												onClick={() =>
													setCurrentPage(Math.min(totalPages, currentPage + 1))
												}
												disabled={currentPage === totalPages}
												className='px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100'>
												Next
											</button>
										</div>
									</div>
								)}
							</div>
						</>
					)}

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

export default EmployeeHistoryReport;
