// _components/journalSum.tsx
import React, { useState } from 'react';
import {
	BookOpen,
	TrendingUp,
	TrendingDown,
	Search,
	Calendar,
	AlertCircle,
	FileText,
} from 'lucide-react';

// Interface definitions for Journal Summary
interface JournalTotals {
	debit: number;
	credit: number;
	unmapped: number;
}

interface JournalLine {
	id: string;
	account_code: string;
	account_name: string;
	debit_amount: number;
	credit_amount: number;
	description?: string;
	reference?: string;
	date: string;
	payrun_id?: string;
	employee_id?: string;
	employee_name?: string;
}

interface JournalSummaryData {
	period: string;
	payruns_count: number;
	totals: JournalTotals;
	lines: JournalLine[];
}

interface JournalSummaryReportProps {
	data: JournalSummaryData;
}

const JournalSummaryReport: React.FC<JournalSummaryReportProps> = ({
	data,
}) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [filterAccountType, setFilterAccountType] = useState('all');
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

	// Format number with commas
	const formatNumber = (num: number): string => {
		return new Intl.NumberFormat().format(num);
	};

	// Format currency
	const formatCurrency = (amount: number): string => {
		return new Intl.NumberFormat('en-NG', {
			style: 'currency',
			currency: 'NGN',
			minimumFractionDigits: 2,
		}).format(amount);
	};

	// Calculate additional stats
	const getStats = () => {
		const totalDebit = data.totals.debit;
		const totalCredit = data.totals.credit;
		const difference = totalDebit - totalCredit;
		const totalEntries = data.lines.length;
		const debitEntries = data.lines.filter(
			(line) => line.debit_amount > 0
		).length;
		const creditEntries = data.lines.filter(
			(line) => line.credit_amount > 0
		).length;

		return {
			totalDebit,
			totalCredit,
			difference,
			totalEntries,
			debitEntries,
			creditEntries,
			unmapped: data.totals.unmapped,
		};
	};

	const stats = getStats();

	// Filter journal lines
	const filteredLines = data.lines.filter((line) => {
		const matchesSearch =
			line.account_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			line.account_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			line.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			line.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			line.reference?.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesAccountType =
			filterAccountType === 'all' ||
			(filterAccountType === 'debit' && line.debit_amount > 0) ||
			(filterAccountType === 'credit' && line.credit_amount > 0);

		return matchesSearch && matchesAccountType;
	});

	// Paginate lines
	const totalPages = Math.ceil(filteredLines.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const paginatedLines = filteredLines.slice(
		startIndex,
		startIndex + itemsPerPage
	);

	// Get unique account types for filtering
	const accountTypes = [
		{ value: 'all', label: 'All Entries' },
		{ value: 'debit', label: 'Debit Entries' },
		{ value: 'credit', label: 'Credit Entries' },
	];

	const isBalanced = Math.abs(stats.difference) < 0.01; // Account for floating point precision

	return (
		<div className='min-h-screen bg-gray-50 p-6'>
			<div className='max-w-7xl mx-auto'>
				{/* Header */}
				<div className='mb-8'>
					<h1 className='text-3xl font-bold text-gray-900 mb-2'>
						Journal Summary Report
					</h1>
					<p className='text-lg text-gray-600'>Period: {data.period}</p>
				</div>

				{/* Summary Cards */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
					{/* Total Debit Card */}
					<div className='bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm font-medium text-gray-600 mb-1'>
									Total Debit
								</p>
								<p className='text-2xl font-bold text-blue-600'>
									{formatCurrency(stats.totalDebit)}
								</p>
								<p className='text-sm text-gray-500'>
									{stats.debitEntries} entries
								</p>
							</div>
							<div className='p-3 bg-blue-100 rounded-full'>
								<TrendingUp className='h-6 w-6 text-blue-600' />
							</div>
						</div>
					</div>

					{/* Total Credit Card */}
					<div className='bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm font-medium text-gray-600 mb-1'>
									Total Credit
								</p>
								<p className='text-2xl font-bold text-blue-600'>
									{formatCurrency(stats.totalCredit)}
								</p>
								<p className='text-sm text-gray-500'>
									{stats.creditEntries} entries
								</p>
							</div>
							<div className='p-3 bg-blue-100 rounded-full'>
								<TrendingDown className='h-6 w-6 text-blue-600' />
							</div>
						</div>
					</div>

					{/* Total Entries Card */}
					<div className='bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm font-medium text-gray-600 mb-1'>
									Total Entries
								</p>
								<p className='text-2xl font-bold text-blue-600'>
									{formatNumber(stats.totalEntries)}
								</p>
								<p className='text-sm text-gray-500'>
									From {data.payruns_count} payruns
								</p>
							</div>
							<div className='p-3 bg-blue-100 rounded-full'>
								<FileText className='h-6 w-6 text-blue-600' />
							</div>
						</div>
					</div>

					{/* Balance Status Card */}
					<div
						className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500`}>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm font-medium text-gray-600 mb-1'>
									Balance Status
								</p>
								<p
									className={`text-2xl font-bold text-blue-600`}>
									{isBalanced ? 'Balanced' : 'Unbalanced'}
								</p>
								{!isBalanced && (
									<p className='text-sm text-gray-500'>
										Diff: {formatCurrency(Math.abs(stats.difference))}
									</p>
								)}
							</div>
							<div
								className={`p-3 rounded-full bg-blue-100`}>
								{isBalanced ? (
									<BookOpen className={`h-6 w-6 text-blue-600`} />
								) : (
									<AlertCircle className={`h-6 w-6 text-blue-600`} />
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Main Content */}
				{data.lines.length === 0 ? (
					/* Empty State */
					<div className='bg-white rounded-lg shadow-md p-12'>
						<div className='text-center'>
							<div className='mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gray-100 mb-6'>
								<BookOpen className='h-12 w-12 text-gray-400' />
							</div>
							<h3 className='text-xl font-semibold text-gray-900 mb-4'>
								No Journal Entries Found
							</h3>
							<p className='text-gray-600 mb-6 max-w-md mx-auto'>
								There are no journal entries available for the selected period.
								This could mean:
							</p>
							<div className='text-left max-w-md mx-auto space-y-2 mb-8'>
								<div className='flex items-start gap-3'>
									<div className='w-2 h-2 bg-blue-500 rounded-full mt-2'></div>
									<p className='text-gray-600'>
										No payroll was processed during this period
									</p>
								</div>
								<div className='flex items-start gap-3'>
									<div className='w-2 h-2 bg-blue-500 rounded-full mt-2'></div>
									<p className='text-gray-600'>
										Journal integration is not yet configured
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
									<strong>Tip:</strong> Journal entries are automatically
									generated when payroll is processed and accounting integration
									is enabled.
								</p>
							</div>
						</div>
					</div>
				) : (
					<>
						{/* Balance Summary */}
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
							{/* Debit/Credit Breakdown */}
							<div className='bg-white rounded-lg shadow-md overflow-hidden'>
								<div className='px-6 py-4 bg-gray-50 border-b'>
									<h3 className='text-lg font-semibold text-gray-900'>
										Account Summary
									</h3>
								</div>
								<div className='p-6'>
									<div className='space-y-4'>
										<div className='flex justify-between items-center py-3 border-b border-gray-100'>
											<span className='font-medium text-gray-700'>
												Total Debits
											</span>
											<span className='font-bold text-green-600'>
												{formatCurrency(stats.totalDebit)}
											</span>
										</div>
										<div className='flex justify-between items-center py-3 border-b border-gray-100'>
											<span className='font-medium text-gray-700'>
												Total Credits
											</span>
											<span className='font-bold text-blue-600'>
												{formatCurrency(stats.totalCredit)}
											</span>
										</div>
										<div className='flex justify-between items-center py-3 border-b border-gray-100'>
											<span className='font-medium text-gray-700'>
												Difference
											</span>
											<span
												className={`font-bold ${
													isBalanced ? 'text-green-600' : 'text-yellow-600'
												}`}>
												{formatCurrency(Math.abs(stats.difference))}
											</span>
										</div>
										<div className='flex justify-between items-center py-3'>
											<span className='font-medium text-gray-700'>
												Unmapped Entries
											</span>
											<span className='font-bold text-gray-600'>
												{formatCurrency(stats.unmapped)}
											</span>
										</div>
									</div>
								</div>
							</div>

							{/* Entry Statistics */}
							<div className='bg-white rounded-lg shadow-md overflow-hidden'>
								<div className='px-6 py-4 bg-gray-50 border-b'>
									<h3 className='text-lg font-semibold text-gray-900'>
										Entry Statistics
									</h3>
								</div>
								<div className='p-6'>
									<div className='space-y-4'>
										<div className='flex justify-between items-center py-3 border-b border-gray-100'>
											<span className='font-medium text-gray-700'>
												Total Journal Lines
											</span>
											<span className='font-bold text-blue-600'>
												{formatNumber(stats.totalEntries)}
											</span>
										</div>
										<div className='flex justify-between items-center py-3 border-b border-gray-100'>
											<span className='font-medium text-gray-700'>
												Debit Entries
											</span>
											<span className='font-bold text-blue-600'>
												{formatNumber(stats.debitEntries)}
											</span>
										</div>
										<div className='flex justify-between items-center py-3 border-b border-gray-100'>
											<span className='font-medium text-gray-700'>
												Credit Entries
											</span>
											<span className='font-bold text-blue-600'>
												{formatNumber(stats.creditEntries)}
											</span>
										</div>
										<div className='flex justify-between items-center py-3'>
											<span className='font-medium text-gray-700'>
												Payruns Processed
											</span>
											<span className='font-bold text-blue-600'>
												{formatNumber(data.payruns_count)}
											</span>
										</div>
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
											placeholder='Search accounts, descriptions, references...'
											value={searchTerm}
											onChange={(e) => setSearchTerm(e.target.value)}
											className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
										/>
									</div>

									{/* Account Type Filter */}
									<select
										value={filterAccountType}
										onChange={(e) => setFilterAccountType(e.target.value)}
										className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'>
										{accountTypes.map((type) => (
											<option
												key={type.value}
												value={type.value}>
												{type.label}
											</option>
										))}
									</select>
								</div>

								<div className='text-sm text-gray-500'>
									Showing {paginatedLines.length} of {filteredLines.length}{' '}
									entries
								</div>
							</div>
						</div>

						{/* Journal Entries Table */}
						<div className='bg-white rounded-lg shadow-md overflow-hidden'>
							<div className='px-6 py-4 bg-gray-50 border-b'>
								<h3 className='text-xl font-semibold text-gray-900'>
									Journal Entry Details
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
												Account
											</th>
											<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
												Description
											</th>
											<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
												Debit
											</th>
											<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
												Credit
											</th>
											<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
												Employee
											</th>
											<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
												Reference
											</th>
										</tr>
									</thead>
									<tbody className='bg-white divide-y divide-gray-200'>
										{paginatedLines.map((line, index) => (
											<tr
												key={line.id || index}
												className='hover:bg-gray-50 transition-colors'>
												<td className='px-6 py-4 whitespace-nowrap'>
													<div className='text-sm text-gray-900'>
														{line.date ? formatDate(line.date) : 'N/A'}
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap'>
													<div className='text-sm font-medium text-gray-900'>
														{line.account_code || 'N/A'}
													</div>
													<div className='text-sm text-gray-500'>
														{line.account_name || 'Unnamed Account'}
													</div>
												</td>
												<td className='px-6 py-4'>
													<div className='text-sm text-gray-900 max-w-xs truncate'>
														{line.description || 'No description'}
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-right'>
													<div className='text-sm font-medium text-green-600'>
														{line.debit_amount > 0
															? formatCurrency(line.debit_amount)
															: '-'}
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-right'>
													<div className='text-sm font-medium text-red-600'>
														{line.credit_amount > 0
															? formatCurrency(line.credit_amount)
															: '-'}
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap'>
													<div className='text-sm text-gray-900'>
														{line.employee_name || 'N/A'}
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap'>
													<div className='text-sm text-gray-500'>
														{line.reference || 'N/A'}
													</div>
												</td>
											</tr>
										))}
									</tbody>
									{/* Table Footer with Totals */}
									<tfoot className='bg-gray-50'>
										<tr>
											<th
												className='px-6 py-3 text-left text-sm font-semibold text-gray-900'
												colSpan={3}>
												Total
											</th>
											<th className='px-6 py-3 text-right text-sm font-semibold text-green-600'>
												{formatCurrency(
													paginatedLines.reduce(
														(sum, line) => sum + line.debit_amount,
														0
													)
												)}
											</th>
											<th className='px-6 py-3 text-right text-sm font-semibold text-red-600'>
												{formatCurrency(
													paginatedLines.reduce(
														(sum, line) => sum + line.credit_amount,
														0
													)
												)}
											</th>
											<th
												className='px-6 py-3'
												colSpan={2}></th>
										</tr>
									</tfoot>
								</table>
							</div>

							{/* Pagination */}
							{totalPages > 1 && (
								<div className='bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200'>
									<div className='text-sm text-gray-500'>
										Showing {startIndex + 1} to{' '}
										{Math.min(startIndex + itemsPerPage, filteredLines.length)}{' '}
										of {filteredLines.length} results
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

export default JournalSummaryReport;
