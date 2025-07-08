'use client';

import { TrendingUp } from 'lucide-react';
import { Pie, PieChart } from 'recharts';

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
const chartData = [
	{ salaryComp: 'income', percentage: 60, fill: '#3d56a8' },
	{ salaryComp: 'deductions', percentage: 20, fill: '#f95321' },
	{ salaryComp: 'others', percentage: 20, fill: '#008000' },
];

const chartConfig = {
	Percentage: {
		label: 'Salary Components',
	},
	income: {
		label: 'Income',
		color: 'hsl(var(--chart-1))',
	},
	deductions: {
		label: 'Deductions',
		color: 'hsl(var(--chart-2))',
	},
	others: {
		label: 'Others',
		color: 'hsl(var(--chart-5))',
	},
} satisfies ChartConfig;

// Custom label renderer for Pie segments
const renderCustomizedLabel = ({
	cx, cy, midAngle, innerRadius, outerRadius, percent, index,
}: any) => {
	const RADIAN = Math.PI / 180;
	const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
	const x = cx + radius * Math.cos(-midAngle * RADIAN);
	const y = cy + radius * Math.sin(-midAngle * RADIAN);

	return (
		<text
			x={x}
			y={y}
			fill="white"
			textAnchor={x > cx ? 'start' : 'end'}
			dominantBaseline="central"
			fontSize={14}
			fontWeight={600}
		>
			{`${chartData[index].percentage}%`}
		</text>
	);
};

export default function PieChrt({className}: { className?: string }) {
	return (
		<Card className={`flex flex-col w-full h-full ${className}`}>
			<CardHeader className='items-center pb-0'>
				<CardTitle className='self-center ml-16'>Salary Components Breakdown</CardTitle>
			</CardHeader>
			<CardContent className='flex-1 pb-0 w-full'>
				<ChartContainer
					config={chartConfig}
					className='mx-auto aspect-square max-h-[250px]'>
					<PieChart>
						<ChartTooltip
							cursor={true}
							content={<ChartTooltipContent />}
						/>
						<Pie
							data={chartData}
							dataKey='percentage'
							nameKey='salaryComp'
							innerRadius={60}
							label={renderCustomizedLabel}
							labelLine={false} // This removes the line
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className='flex-col gap-2 text-sm'>
				<div className='flex items-center justify-between'>
					{chartData.map((item, index) => {
						return (
							<section
								key={index}
								className='flex items-center gap-1 m-3'>
								<span
									className='w-2 h-2 rounded-2xl'
									style={{ backgroundColor: item.fill }}></span>
								<h6>
									{item.salaryComp.charAt(0).toUpperCase() +
										item.salaryComp.slice(1).toLowerCase()}
								</h6>
							</section>
						);
					})}
				</div>
			</CardFooter>
		</Card>
	);
}
