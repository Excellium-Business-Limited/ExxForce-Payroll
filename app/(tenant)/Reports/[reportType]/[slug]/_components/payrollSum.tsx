import React from 'react';
import { Users, Calendar, TrendingUp, TrendingDown } from 'lucide-react';

// Interface definitions
interface PayrollTotals {
	gross: number;
	deductions: number;
	net: number;
}

interface DepartmentData {
	gross: number;
	deductions: number;
	net: number;
}

interface PayrollData {
	period: string;
	payruns_count: number;
	employees_paid: number;
	totals: PayrollTotals;
	earnings_breakdown: Record<string, number>;
	deductions_breakdown: Record<string, number>;
	group_by_department: Record<string, DepartmentData>;
}

interface PayrollSummaryReportProps {
	data: PayrollData;
}

const PayrollSummaryReport: React.FC<PayrollSummaryReportProps> = ({
	data,
}) => {
	// Format currency function
	const formatCurrency = (amount: number): string => {
		return new Intl.NumberFormat('en-NG', {
			style: 'currency',
			currency: 'NGN',
			minimumFractionDigits: 2,
		}).format(amount);
	};

	// Format number with commas
	const formatNumber = (num: number): string => {
		return new Intl.NumberFormat().format(num);
	};

	return (
		<div className='min-h-screen bg-gray-50 p-6'>
			<div className='max-w-7xl mx-auto'>
				{/* Header */}
				<div className='mb-8'>
					<h1 className='text-3xl font-bold text-gray-900 mb-2'>
						Payroll Summary Report
					</h1>
					<p className='text-lg text-gray-600'>Period: {data.period}</p>
				</div>

				{/* Summary Cards */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
					{/* Total Gross Pay Card */}
					<div className='bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm font-medium text-gray-600 mb-1'>
									Total Gross Pay
								</p>
								<p className='text-2xl font-bold text-green-600'>
									{formatCurrency(data.totals.gross)}
								</p>
							</div>
							<div className='p-3 bg-green-100 rounded-full'>
								<TrendingUp className='h-6 w-6 text-green-600' />
							</div>
						</div>
					</div>

					{/* Total Deductions Card */}
					<div className='bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm font-medium text-gray-600 mb-1'>
									Total Deductions
								</p>
								<p className='text-2xl font-bold text-red-600'>
									{formatCurrency(data.totals.deductions)}
								</p>
							</div>
							<div className='p-3 bg-red-100 rounded-full'>
								<TrendingDown className='h-6 w-6 text-red-600' />
							</div>
						</div>
					</div>

					{/* Net Pay Card */}
					<div className='bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm font-medium text-gray-600 mb-1'>
									Total Net Pay
								</p>
								<p className='text-2xl font-bold text-blue-600'>
									{formatCurrency(data.totals.net)}
								</p>
							</div>
							<div className='p-3 bg-blue-100 rounded-full'>
								<TrendingUp className='h-6 w-6 text-blue-600' />
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
									{formatNumber(data.employees_paid)}
								</p>
								<p className='text-sm text-gray-500 mt-1'>
									{formatNumber(data.payruns_count)} payruns
								</p>
							</div>
							<div className='p-3 bg-purple-100 rounded-full'>
								<Users className='h-6 w-6 text-purple-600' />
							</div>
						</div>
					</div>
				</div>

				{/* Breakdown Tables */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
					{/* Earnings Breakdown */}
					<div className='bg-white rounded-lg shadow-md overflow-hidden'>
						<div className='px-6 py-4 bg-gray-50 border-b'>
							<h3 className='text-lg font-semibold text-gray-900'>
								Earnings Breakdown
							</h3>
						</div>
						<div className='p-6'>
							<div className='space-y-4'>
								{Object.entries(data.earnings_breakdown).map(
									([category, amount]) => (
										<div
											key={category}
											className='flex justify-between items-center py-2 border-b border-gray-100 last:border-0'>
											<span className='font-medium text-gray-700'>
												{category}
											</span>
											<span className='font-bold text-green-600'>
												{formatCurrency(amount)}
											</span>
										</div>
									)
								)}
							</div>
						</div>
					</div>

					{/* Deductions Breakdown */}
					<div className='bg-white rounded-lg shadow-md overflow-hidden'>
						<div className='px-6 py-4 bg-gray-50 border-b'>
							<h3 className='text-lg font-semibold text-gray-900'>
								Deductions Breakdown
							</h3>
						</div>
						<div className='p-6'>
							<div className='space-y-4'>
								{Object.entries(data.deductions_breakdown).map(
									([category, amount]) => (
										<div
											key={category}
											className='flex justify-between items-center py-2 border-b border-gray-100 last:border-0'>
											<span className='font-medium text-gray-700'>
												{category}
											</span>
											<span className='font-bold text-red-600'>
												{formatCurrency(amount)}
											</span>
										</div>
									)
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Department Summary Table */}
				<div className='bg-white rounded-lg shadow-md overflow-hidden'>
					<div className='px-6 py-4 bg-gray-50 border-b'>
						<h3 className='text-xl font-semibold text-gray-900'>
							Department Summary
						</h3>
					</div>
					<div className='overflow-x-auto'>
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
										Deductions
									</th>
									<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Net Pay
									</th>
									<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Deduction %
									</th>
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{Object.entries(data.group_by_department).map(
									([department, departmentData]) => {
										const deductionPercentage = (
											(departmentData.deductions / departmentData.gross) *
											100
										).toFixed(1);
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
													<div className='text-sm font-bold text-green-600'>
														{formatCurrency(departmentData.gross)}
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-right'>
													<div className='text-sm font-bold text-red-600'>
														{formatCurrency(departmentData.deductions)}
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-right'>
													<div className='text-sm font-bold text-blue-600'>
														{formatCurrency(departmentData.net)}
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-right'>
													<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
														{deductionPercentage}%
													</span>
												</td>
											</tr>
										);
									}
								)}
							</tbody>
						</table>
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

export default PayrollSummaryReport;