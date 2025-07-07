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
	{ month: 'January', desktop: 186, mobile: 80 },
	{ month: 'February', desktop: 305, mobile: 200 },
	{ month: 'March', desktop: 237, mobile: 120 },
	{ month: 'April', desktop: 73, mobile: 190 },
	{ month: 'May', desktop: 209, mobile: 130 },
	{ month: 'June', desktop: 214, mobile: 140 },
	{ month: 'June', desktop: 214, mobile: 140 },
	{ month: 'June', desktop: 214, mobile: 140 },
	{ month: 'June', desktop: 214, mobile: 140 },
	{ month: 'June', desktop: 214, mobile: 140 },
	{ month: 'June', desktop: 214, mobile: 140 },
	{ month: 'June', desktop: 214, mobile: 140 },
];

const chartConfig = {
	desktop: {
		label: 'Desktop',
		color: 'hsl(var(--chart-1))',
	},
	mobile: {
		label: 'Mobile',
		color: 'hsl(var(--chart-2))',
	},
} satisfies ChartConfig;

export function Component({className}: { className?: string }) {
	return (
		<Card className={`w-fit h-fit ${className}`}>
			<CardHeader>
				<CardTitle>Bar Chart - Stacked + Legend</CardTitle>
				<CardDescription>January - June 2024</CardDescription>
			</CardHeader>
			<CardContent className='w-full h-[300px]'>
				<ChartContainer config={chartConfig} className='h-full'>
					<BarChart
						accessibilityLayer
						data={chartData}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey='month'
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							// tickFormatter={(value) => value.slice(0, 3)}
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							tickMargin={20}
							ticks={[0, 100, 200, 300,400, 500, 600, 700, 800, 900, 1000]} // Custom spacing
							tick={{ fontSize: 12, fill: '#3D56A8' }}
						/>
						<ChartTooltip content={<ChartTooltipContent hideLabel />} />
						<ChartLegend content={<ChartLegendContent />} />
						<Bar
							dataKey='desktop'
							stackId='a'
							fill='var(--color-desktop)'
							radius={[0, 0, 4, 4]}
						/>
						<Bar
							dataKey='mobile'
							stackId='a'
							fill='var(--color-mobile)'
							radius={[4, 4, 0, 0]}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className='flex-col items-start gap-2 text-sm'>
				<div className='flex gap-2 font-medium leading-none'>
					Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
				</div>
				<div className='leading-none text-muted-foreground'>
					Showing total visitors for the last 6 months
				</div>
			</CardFooter>
		</Card>
	);
}

export default Component;
