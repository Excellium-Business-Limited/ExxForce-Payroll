// _components/loanReport.tsx
import React, { useState } from 'react';
import {
	CreditCard,
	DollarSign,
	TrendingUp,
	TrendingDown,
	Search,
	Calendar,
	AlertCircle,
	CheckCircle,
	Clock,
	XCircle,
	User,
} from 'lucide-react';

// Interface definitions for Loan Report
interface LoanData {
	id: number;
	loan_number: string;
	loan_type: string;
	employee_name: string;
	amount: string;
	balance: string;
	repayment_months: number;
	monthly_deduction: string;
	total_payable: string;
	status: 'approved' | 'pending' | 'rejected' | 'completed' | 'cancelled';
	start_date: string;
	interest_rate: string;
	interest_method: string;
	is_interest_applied: boolean;
	approved_at: string | null;
	completed_at: string | null;
}

interface LoanReportProps {
	data: LoanData[];
}

const LoanReport: React.FC<LoanReportProps> = ({ data }) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [filterStatus, setFilterStatus] = useState('all');
	const [filterLoanType, setFilterLoanType] = useState('all');
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 15;

	// Format date function
	const formatDate = (dateString: string): string => {
		if (!dateString) return 'N/A';
		return new Date(dateString).toLocaleDateString('en-NG', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

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
			minimumFractionDigits: 2,
		}).format(numAmount);
	};

	// Get status details
	const getStatusDetails = (status: string) => {
		switch (status.toLowerCase()) {
			case 'approved':
				return {
					label: 'Approved',
					color: 'text-green-600 bg-green-100',
					icon: CheckCircle,
				};
			case 'pending':
				return {
					label: 'Pending',
					color: 'text-yellow-600 bg-yellow-100',
					icon: Clock,
				};
			case 'rejected':
				return {
					label: 'Rejected',
					color: 'text-red-600 bg-red-100',
					icon: XCircle,
				};
			case 'completed':
				return {
					label: 'Completed',
					color: 'text-blue-600 bg-blue-100',
					icon: CheckCircle,
				};
			case 'cancelled':
				return {
					label: 'Cancelled',
					color: 'text-gray-600 bg-gray-100',
					icon: XCircle,
				};
			default:
				return {
					label: status,
					color: 'text-gray-600 bg-gray-100',
					icon: Clock,
				};
		}
	};

	// Calculate loan statistics
	const getStats = () => {
		const totalLoans = data.length;
		const totalAmount = data.reduce(
			(sum, loan) => sum + parseFloat(loan.amount),
			0
		);
		const totalBalance = data.reduce(
			(sum, loan) => sum + parseFloat(loan.balance),
			0
		);
		const totalPayable = data.reduce(
			(sum, loan) => sum + parseFloat(loan.total_payable),
			0
		);

		const statusCounts = data.reduce((acc, loan) => {
			const status = loan.status.toLowerCase();
			acc[status] = (acc[status] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		const loanTypeCounts = data.reduce((acc, loan) => {
			acc[loan.loan_type] = (acc[loan.loan_type] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		const averageAmount = totalAmount / totalLoans || 0;
		const averageInterestRate =
			data.reduce((sum, loan) => sum + parseFloat(loan.interest_rate), 0) /
				totalLoans || 0;

		return {
			totalLoans,
			totalAmount,
			totalBalance,
			totalPayable,
			statusCounts,
			loanTypeCounts,
			averageAmount,
			averageInterestRate,
			totalInterest: totalPayable - totalAmount,
		};
	};

	const stats = getStats();

	// Filter loans
	const filteredLoans = data.filter((loan) => {
		const matchesSearch =
			loan.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			loan.loan_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
			loan.loan_type.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesStatus =
			filterStatus === 'all' || loan.status === filterStatus;
		const matchesLoanType =
			filterLoanType === 'all' || loan.loan_type === filterLoanType;

		return matchesSearch && matchesStatus && matchesLoanType;
	});

	// Paginate loans
	const totalPages = Math.ceil(filteredLoans.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const paginatedLoans = filteredLoans.slice(
		startIndex,
		startIndex + itemsPerPage
	);

	// Get unique statuses and loan types for filter dropdowns
	const uniqueStatuses = Array.from(new Set(data.map((loan) => loan.status)));
	const uniqueLoanTypes = Array.from(
		new Set(data.map((loan) => loan.loan_type))
	);

	// Calculate repayment progress
	const calculateProgress = (amount: string, balance: string) => {
		const amountNum = parseFloat(amount);
		const balanceNum = parseFloat(balance);
		if (amountNum === 0) return 0;
		return Math.max(
			0,
			Math.min(100, ((amountNum - balanceNum) / amountNum) * 100)
		);
	};

	return (
		<div className='min-h-screen bg-gray-50 p-6'>
			<div className='max-w-7xl mx-auto'>
				{/* Header */}
				<div className='mb-8'>
					<h1 className='text-3xl font-bold text-gray-900 mb-2'>Loan Report</h1>
					<p className='text-lg text-gray-600'>
						Comprehensive overview of all employee loans
					</p>
				</div>

				{/* Summary Cards */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
					{/* Total Loans Card */}
					<div className='bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm font-medium text-gray-600 mb-1'>
									Total Loans
								</p>
								<p className='text-2xl font-bold text-blue-600'>
									{formatNumber(stats.totalLoans)}
								</p>
								<p className='text-sm text-gray-500'>Active loans</p>
							</div>
							<div className='p-3 bg-blue-100 rounded-full'>
								<CreditCard className='h-6 w-6 text-blue-600' />
							</div>
						</div>
					</div>

					{/* Total Amount Card */}
					<div className='bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm font-medium text-gray-600 mb-1'>
									Total Amount
								</p>
								<p className='text-2xl font-bold text-blue-600'>
									{formatCurrency(stats.totalAmount.toString())}
								</p>
								<p className='text-sm text-gray-500'>Disbursed</p>
							</div>
							<div className='p-3 bg-blue-100 rounded-full'>
								<DollarSign className='h-6 w-6 text-blue-600' />
							</div>
						</div>
					</div>

					{/* Outstanding Balance Card */}
					<div className='bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm font-medium text-gray-600 mb-1'>
									Outstanding Balance
								</p>
								<p className='text-2xl font-bold text-blue-600'>
									{formatCurrency(stats.totalBalance.toString())}
								</p>
								<p className='text-sm text-gray-500'>Remaining</p>
							</div>
							<div className='p-3 bg-blue-100 rounded-full'>
								<TrendingDown className='h-6 w-6 text-blue-600' />
							</div>
						</div>
					</div>

					{/* Average Interest Card */}
					<div className='bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm font-medium text-gray-600 mb-1'>
									Avg Interest Rate
								</p>
								<p className='text-2xl font-bold text-blue-600'>
									{stats.averageInterestRate.toFixed(1)}%
								</p>
								<p className='text-sm text-gray-500'>Per annum</p>
							</div>
							<div className='p-3 bg-blue-100 rounded-full'>
								<TrendingUp className='h-6 w-6 text-blue-600' />
							</div>
						</div>
					</div>
				</div>

				{/* Main Content */}
				{data.length === 0 ? (
					/* Empty State */
					<div className='bg-white rounded-lg shadow-md p-12'>
						<div className='text-center'>
							<div className='mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gray-100 mb-6'>
								<CreditCard className='h-12 w-12 text-gray-400' />
							</div>
							<h3 className='text-xl font-semibold text-gray-900 mb-4'>
								No Loan Data Available
							</h3>
							<p className='text-gray-600 mb-6 max-w-md mx-auto'>
								There are no loan records available. This could mean:
							</p>
							<div className='text-left max-w-md mx-auto space-y-2 mb-8'>
								<div className='flex items-start gap-3'>
									<div className='w-2 h-2 bg-blue-500 rounded-full mt-2'></div>
									<p className='text-gray-600'>
										No loans have been issued to employees yet
									</p>
								</div>
								<div className='flex items-start gap-3'>
									<div className='w-2 h-2 bg-blue-500 rounded-full mt-2'></div>
									<p className='text-gray-600'>
										Loan module is not yet configured
									</p>
								</div>
								<div className='flex items-start gap-3'>
									<div className='w-2 h-2 bg-blue-500 rounded-full mt-2'></div>
									<p className='text-gray-600'>System is still being set up</p>
								</div>
							</div>
							<div className='bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto'>
								<p className='text-blue-800 text-sm'>
									<strong>Tip:</strong> Employee loans will appear here once
									they are created and approved in the system.
								</p>
							</div>
						</div>
					</div>
				) : (
					<>
						{/* Status and Type Summary */}
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
							{/* Status Breakdown */}
							<div className='bg-white rounded-lg shadow-md overflow-hidden'>
								<div className='px-6 py-4 bg-gray-50 border-b'>
									<h3 className='text-lg font-semibold text-gray-900'>
										Loan Status Summary
									</h3>
								</div>
								<div className='p-6'>
									<div className='space-y-4'>
										{Object.entries(stats.statusCounts).map(
											([status, count]) => {
												const statusDetails = getStatusDetails(status);
												const StatusIcon = statusDetails.icon;
												return (
													<div
														key={status}
														className='flex justify-between items-center py-2 border-b border-gray-100 last:border-0'>
														<div className='flex items-center gap-2'>
															<StatusIcon className='h-4 w-4 text-gray-500' />
															<span className='font-medium text-gray-700 capitalize'>
																{statusDetails.label}
															</span>
														</div>
														<span className='font-bold text-blue-600'>
															{formatNumber(count)}
														</span>
													</div>
												);
											}
										)}
									</div>
								</div>
							</div>

							{/* Loan Type Breakdown */}
							<div className='bg-white rounded-lg shadow-md overflow-hidden'>
								<div className='px-6 py-4 bg-gray-50 border-b'>
									<h3 className='text-lg font-semibold text-gray-900'>
										Loan Type Distribution
									</h3>
								</div>
								<div className='p-6'>
									<div className='space-y-4'>
										{Object.entries(stats.loanTypeCounts).map(
											([type, count]) => (
												<div
													key={type}
													className='flex justify-between items-center py-2 border-b border-gray-100 last:border-0'>
													<span className='font-medium text-gray-700'>
														{type}
													</span>
													<span className='font-bold text-blue-600'>
														{formatNumber(count)}
													</span>
												</div>
											)
										)}
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
											placeholder='Search employees, loan numbers, types...'
											value={searchTerm}
											onChange={(e) => setSearchTerm(e.target.value)}
											className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
										/>
									</div>

									{/* Status Filter */}
									<select
										value={filterStatus}
										onChange={(e) => setFilterStatus(e.target.value)}
										className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'>
										<option value='all'>All Statuses</option>
										{uniqueStatuses.map((status) => (
											<option
												key={status}
												value={status}>
												{getStatusDetails(status).label}
											</option>
										))}
									</select>

									{/* Loan Type Filter */}
									<select
										value={filterLoanType}
										onChange={(e) => setFilterLoanType(e.target.value)}
										className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'>
										<option value='all'>All Loan Types</option>
										{uniqueLoanTypes.map((type) => (
											<option
												key={type}
												value={type}>
												{type}
											</option>
										))}
									</select>
								</div>

								<div className='text-sm text-gray-500'>
									Showing {paginatedLoans.length} of {filteredLoans.length}{' '}
									loans
								</div>
							</div>
						</div>

						{/* Loans Table */}
						<div className='bg-white rounded-lg shadow-md overflow-hidden'>
							<div className='px-6 py-4 bg-gray-50 border-b'>
								<h3 className='text-xl font-semibold text-gray-900'>
									Loan Details
								</h3>
							</div>
							<div className='overflow-x-auto'>
								<table className='min-w-full divide-y divide-gray-200'>
									<thead className='bg-gray-50'>
										<tr>
											<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
												Loan Info
											</th>
											<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
												Employee
											</th>
											<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
												Amount
											</th>
											<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
												Balance
											</th>
											<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
												Progress
											</th>
											<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
												Monthly Payment
											</th>
											<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
												Status
											</th>
											<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
												Details
											</th>
										</tr>
									</thead>
									<tbody className='bg-white divide-y divide-gray-200'>
										{paginatedLoans.map((loan) => {
											const statusDetails = getStatusDetails(loan.status);
											const StatusIcon = statusDetails.icon;
											const progress = calculateProgress(
												loan.amount,
												loan.balance
											);

											return (
												<tr
													key={loan.id}
													className='hover:bg-gray-50 transition-colors'>
													<td className='px-6 py-4 whitespace-nowrap'>
														<div>
															<div className='text-sm font-medium text-gray-900'>
																{loan.loan_number}
															</div>
															<div className='text-sm text-gray-500'>
																{loan.loan_type}
															</div>
														</div>
													</td>
													<td className='px-6 py-4 whitespace-nowrap'>
														<div className='flex items-center'>
															<div className='flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center'>
																<User className='h-4 w-4 text-gray-600' />
															</div>
															<div className='ml-3'>
																<div className='text-sm font-medium text-gray-900'>
																	{loan.employee_name}
																</div>
															</div>
														</div>
													</td>
													<td className='px-6 py-4 whitespace-nowrap text-right'>
														<div className='text-sm font-medium text-gray-900'>
															{formatCurrency(loan.amount)}
														</div>
													</td>
													<td className='px-6 py-4 whitespace-nowrap text-right'>
														<div className='text-sm font-medium text-blue-600'>
															{formatCurrency(loan.balance)}
														</div>
													</td>
													<td className='px-6 py-4 whitespace-nowrap'>
														<div className='flex items-center'>
															<div className='w-full bg-gray-200 rounded-full h-2'>
																<div
																	className='bg-blue-600 h-2 rounded-full transition-all duration-300'
																	style={{ width: `${progress}%` }}></div>
															</div>
															<span className='ml-2 text-xs text-gray-500'>
																{progress.toFixed(0)}%
															</span>
														</div>
													</td>
													<td className='px-6 py-4 whitespace-nowrap text-right'>
														<div className='text-sm font-medium text-blue-600'>
															{formatCurrency(loan.monthly_deduction)}
														</div>
													</td>
													<td className='px-6 py-4 whitespace-nowrap'>
														<span
															className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${statusDetails.color}`}>
															<StatusIcon className='h-3 w-3 mr-1' />
															{statusDetails.label}
														</span>
													</td>
													<td className='px-6 py-4 whitespace-nowrap'>
														<div className='text-xs text-gray-500'>
															<div>
																<strong>Rate:</strong> {loan.interest_rate}%
															</div>
															<div>
																<strong>Term:</strong> {loan.repayment_months}{' '}
																months
															</div>
															<div>
																<strong>Start:</strong>{' '}
																{formatDate(loan.start_date)}
															</div>
														</div>
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
										{Math.min(startIndex + itemsPerPage, filteredLoans.length)}{' '}
										of {filteredLoans.length} results
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

export default LoanReport;
