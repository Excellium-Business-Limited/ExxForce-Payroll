'use client';

import { TrendingUp } from 'lucide-react';
import './Style.module.css';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

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
const chartData = [
	{ month: 'January', incomes: 186, deductions: 80, others: 120 },
	{ month: 'February', incomes: 305, deductions: 200, others: 180 },
	{ month: 'March', incomes: 237, deductions: 120, others: 110 },
	{ month: 'April', incomes: 73, deductions: 190, others: 90 },
	{ month: 'May', incomes: 209, deductions: 130, others: 140 },
	{ month: 'June', incomes: 214, deductions: 140, others: 130 },
	{ month: 'July', incomes: 214, deductions: 140, others: 130 },
	{ month: 'August', incomes: 314, deductions: 120, others: 100 },
	{ month: 'Sept.', incomes: 262, deductions: 115, others: 70 },
	{ month: 'Oct.', incomes: 304, deductions: 156, others: 130 },
	{ month: 'Nov.', incomes: 201, deductions: 50, others: 110 },
	{ month: 'Dec.', incomes: 90, deductions: 80, others: 122 },
];

const chartConfig = {
	incomes: {
		label: 'Incomes',
		color: '#3d56a8',
	},
	deductions: {
		label: 'Deductions',
		color: '#255ec3',
	},
	others: {
		label: 'Others',
		color: '#dee7f6',
	}
} satisfies ChartConfig;

export function Component({className}: { className?: string }) {
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
							ticks={[0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]} // Custom spacing
							tickFormatter={(value) => `₦${value / 100}M`}
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
