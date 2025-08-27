'use client';

import { TrendingUp } from 'lucide-react';
import { Pie, PieChart } from 'recharts';
import { useState, useEffect } from 'react';

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { getAccessToken, getTenant } from '@/lib/auth';

interface PayrollSummary {
	period: string;
	payruns_count: number;
	employees_paid: number;
	totals: {
		gross: number;
		deductions: number;
		net: number;
	};
	earnings_breakdown: Record<string, number>;
	deductions_breakdown: {
		Pension: number;
		NHF: number;
		NSITF: number;
		PAYE: number;
	};
	group_by_department: Record<
		string,
		{
			gross: number;
			deductions: number;
			net: number;
		}
	>;
}

const chartConfig = {
	Percentage: {
		label: 'Payroll Components',
	},
	netSalary: {
		label: 'Net Salary',
		color: 'hsl(var(--chart-1))',
	},
	paye: {
		label: 'PAYE',
		color: 'hsl(var(--chart-2))',
	},
	otherDeductions: {
		label: 'Other Deductions',
		color: 'hsl(var(--chart-5))',
	},
} satisfies ChartConfig;

// Custom label renderer for Pie segments
const renderCustomizedLabel = ({
	cx,
	cy,
	midAngle,
	innerRadius,
	outerRadius,
	percent,
	index,
	data,
}: any) => {
	const RADIAN = Math.PI / 180;
	const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
	const x = cx + radius * Math.cos(-midAngle * RADIAN);
	const y = cy + radius * Math.sin(-midAngle * RADIAN);

	return (
		<text
			x={x}
			y={y}
			fill='white'
			textAnchor={x > cx ? 'start' : 'end'}
			dominantBaseline='hanging'
			fontSize={10}
			fontWeight={600}>
			{`${data[index]?.percentage?.toFixed(1)}%`}
		</text>
	);
};

export default function PieChrt({ className }: { className?: string }) {
	const [chartData, setChartData] = useState([
		{ component: 'netSalary', percentage: 0, amount: 0, fill: '#3d56a8' },
		{ component: 'paye', percentage: 0, amount: 0, fill: '#f95321' },
		{ component: 'otherDeductions', percentage: 0, amount: 0, fill: '#008000' },
	]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [payrollSummary, setPayrollSummary] = useState<PayrollSummary | null>(
		null
	);

	useEffect(() => {
		const fetchPayrollData = async () => {
			const tenant = getTenant()
			const baseURL = `http://${tenant}.localhost:8000`
			const token = getAccessToken()
			try {
				setIsLoading(true);
				const response = await fetch(
					`${baseURL}/tenant/reports/payroll-summary/all?from_date=2025-01-01&to_date=2026-03-31`,
					{
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}`,
						},
					}
				);
				console.log(response)
				if (!response.ok) {
					throw new Error('Failed to fetch payroll data');
				}

				const data: PayrollSummary = await response.json();
				setPayrollSummary(data);

				// Calculate other deductions (total deductions - PAYE)
				const paye = data.deductions_breakdown.PAYE;
				const otherDeductions = data.totals.deductions - paye;
				const netSalary = data.totals.net;
				const gross = data.totals.gross;

				// Calculate percentages based on gross salary
				const payePercentage = (paye / gross) * 100;
				const otherDeductionsPercentage = (otherDeductions / gross) * 100;
				const netSalaryPercentage = (netSalary / gross) * 100;

				const newChartData = [
					{
						component: 'netSalary',
						percentage: netSalaryPercentage,
						amount: netSalary,
						fill: '#3d56a8',
					},
					{
						component: 'paye',
						percentage: payePercentage,
						amount: paye,
						fill: '#f95321',
					},
					{
						component: 'otherDeductions',
						percentage: otherDeductionsPercentage,
						amount: otherDeductions,
						fill: '#008000',
					},
				];

				setChartData(newChartData);
				setError(null);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'An error occurred');
				console.error('Error fetching payroll data:', err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchPayrollData();
	}, []);

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-NG', {
			style: 'currency',
			currency: 'NGN',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount);
	};

	const getComponentLabel = (component: string) => {
		switch (component) {
			case 'netSalary':
				return 'Net Salary';
			case 'paye':
				return 'PAYE';
			case 'otherDeductions':
				return 'Other Deductions';
			default:
				return component;
		}
	};

	if (isLoading) {
		return (
			<Card className={`flex flex-col w-full h-[420px] ${className}`}>
				<CardHeader className='items-center pb-0'>
					<CardTitle className='self-center ml-16'>
						Payroll Summary Breakdown
					</CardTitle>
				</CardHeader>
				<CardContent className='flex-1 pb-0 w-full flex items-center justify-center'>
					<div className='text-center'>
						<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto'></div>
						<p className='mt-2 text-sm text-gray-600'>
							Loading payroll data...
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (error) {
		return (
			<Card className={`flex flex-col w-full h-[420px] ${className}`}>
				<CardHeader className='items-center pb-0'>
					<CardTitle className='self-center ml-16'>
						Payroll Summary Breakdown
					</CardTitle>
				</CardHeader>
				<CardContent className='flex-1 pb-0 w-full flex items-center justify-center'>
					<div className='text-center text-red-600'>
						<p>Error loading payroll data</p>
						<p className='text-sm'>{error}</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className={`flex flex-col w-full h-[420px] ${className}`}>
			<CardHeader className='items-center pb-0'>
				<CardTitle className='self-center ml-16'>
					Payroll Summary Breakdown
				</CardTitle>
				{payrollSummary && (
					<CardDescription className='text-center'>
						Period: {payrollSummary.period} 
					</CardDescription>
				)}
			</CardHeader>
			<CardContent className='flex-1 pb-0 w-full'>
				<ChartContainer
					config={chartConfig}
					className='mx-auto aspect-square max-h-[250px]'>
					<PieChart>
						<ChartTooltip
							cursor={true}
							content={({ active, payload }) => {
								if (active && payload && payload.length) {
									const data = payload[0].payload;
									return (
										<div className='bg-white p-2 border rounded shadow'>
											<p className='font-medium'>
												{getComponentLabel(data.component)}
											</p>
											<p className='text-sm'>
												{formatCurrency(data.amount)} (
												{data.percentage.toFixed(1)}%)
											</p>
										</div>
									);
								}
								return null;
							}}
						/>
						<Pie
							data={chartData}
							dataKey='percentage'
							nameKey='component'
							innerRadius={50}
							label={(props) =>
								renderCustomizedLabel({ ...props, data: chartData })
							}
							labelLine={false}
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className='flex-col gap-2 text-sm'>
				<div className='flex items-center justify-between w-full'>
					{chartData.map((item, index) => (
						<section
							key={index}
							className='flex flex-col items-center gap-1 m-0.5'>
							<div className='flex items-center gap-1'>
								<span
									className='w-3 h-3 rounded-full'
									style={{ backgroundColor: item.fill }}></span>
								<h6 className='font-light flex w-fit'>
									{getComponentLabel(item.component)}
								</h6>
							</div>
							
						</section>
					))}
				</div>

			</CardFooter>
		</Card>
	);
}
