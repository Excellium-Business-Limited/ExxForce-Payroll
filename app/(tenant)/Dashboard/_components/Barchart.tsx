'use client';

import { TrendingUp } from 'lucide-react';
import './Style.module.css';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { useEffect, useState } from 'react';

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
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { getAccessToken, getTenant } from '@/lib/auth';

interface ApiDataItem {
	payrun_id: number;
	month: string;
	period: string;
	net: number;
	paye: number;
	other_deductions: number;
}

interface ChartDataItem {
	month: string;
	incomes: number;
	deductions: number;
	others: number;
}

const chartConfig = {
	incomes: {
		label: 'Net Pay',
		color: '#3d56a8',
	},
	deductions: {
		label: 'PAYE Tax',
		color: '#255ec3',
	},
	others: {
		label: 'Other Deductions',
		color: '#dee7f6',
	},
} satisfies ChartConfig;

export function Component({ className }: { className?: string }) {
	const [chartData, setChartData] = useState<ChartDataItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			const token = getAccessToken();
			const tenant = getTenant();
			try {
				setLoading(true);
				setError(null);

				const response = await fetch(
					`http://${tenant}.localhost:8000/tenant/reports/payroll-summary/stacked`,
					{
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}`,
						},
					}
				);

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const apiData = await response.json();

				// Transform API data to chart format
				const transformedData: ChartDataItem[] = apiData.results.map(
					(item: ApiDataItem) => ({
						month: item.month,
						incomes: item.net, // Net pay as incomes
						deductions: item.paye, // PAYE tax as deductions
						others: item.other_deductions, // Other deductions
					})
				);

				setChartData(transformedData);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to fetch data');
				console.error('Error fetching payroll data:', err);
			} finally {
				setLoading(false);
			}
		};

		
		fetchData();
	}, []);

	if (loading) {
		return (
			<Card className={`w-[630px] h-fit ${className}`}>
				<CardHeader>
					<CardTitle>Payroll Summary</CardTitle>
				</CardHeader>
				<CardContent className='w-full h-[300px] flex items-center justify-center'>
					<div className='text-gray-500'>Loading...</div>
				</CardContent>
			</Card>
		);
	}

	if (error) {
		return (
			<Card className={`w-[630px] h-fit ${className}`}>
				<CardHeader>
					<CardTitle>Payroll Summary</CardTitle>
				</CardHeader>
				<CardContent className='w-full h-[300px] flex items-center justify-center'>
					<div className='text-red-500'>Error: {error}</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className={`w-[630px] h-fit ${className}`}>
			<CardHeader>
				<CardTitle>Payroll Summary</CardTitle>
			</CardHeader>
			<CardContent className='w-full h-[300px]'>
				<ChartContainer
					config={chartConfig}
					className='w-full h-full'>
					<BarChart
						accessibilityLayer
						data={chartData}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey='month'
							tickLine={false}
							tickMargin={10}
							axisLine={false}
						/>
						<YAxis
							tickLine={true}
							axisLine={false}
							tickMargin={20}
							tickFormatter={(value) => `₦${(value / 1000000).toFixed(1)}M`}
							tick={{ fontSize: 12, fill: '#3D56A8' }}
						/>
						<ChartTooltip content={<ChartTooltipContent hideLabel />} />
						<ChartLegend content={<ChartLegendContent />} />
						<Bar
							dataKey='incomes'
							stackId='a'
							fill='var(--color-incomes)'
							radius={[0, 0, 4, 4]}
						/>
						<Bar
							dataKey='deductions'
							stackId='a'
							fill='var(--color-deductions)'
							radius={[4, 4, 0, 0]}
						/>
						<Bar
							dataKey='others'
							stackId='a'
							fill='var(--color-others)'
							radius={[4, 4, 0, 0]}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className='flex-col items-start gap-2 text-sm'></CardFooter>
		</Card>
	);
}

export default Component;
