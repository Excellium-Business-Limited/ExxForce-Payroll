import { Button } from '@/components/ui/button';
import {
	ArrowDownToLineIcon,
	BarChartBigIcon,
	CalendarDaysIcon,
	Settings,
	Users2Icon,
} from 'lucide-react';
import { DTable } from './_components/Table';
import data1 from './_components/data1.json';
import { Payrun, columns } from './_components/TableSchema';
import React from 'react';
import BarChart from './_components/Barchart';
import { Bar } from 'recharts';
import Piechrt from './_components/Piechart';
import { Card } from '@/components/ui/card';

const Dashboard = () => {
	return (
		<div>
			<div>
				<div>
					<h3>Hi, Welcome Back User</h3>
					<p>Here's what is happening with your payroll today</p>
				</div>
				<div>
					<Button variant='outline'>
						<CalendarDaysIcon /> Select Date
					</Button>
					<Button variant='outline'>
						<ArrowDownToLineIcon />
						Export
					</Button>
				</div>
				<div className='grid grid-cols-4 gap-4 m-8'>
					<Card></Card>
					<Card></Card>
					<Card></Card>
					<Card></Card>
				</div>
			</div>
			<div className='grid grid-cols-2 m-8 gap-7'>
				<BarChart />
				<Piechrt />
			</div>
			<div className='flex gap-4'>
				<div className='basis-[60%] w-[718px]'>
					<DTable
						data={data1}
						columns={columns}
					/>
				</div>
				<div className='basis-[40%] grid grid-flow-col grid-cols-2 grid-rows-2 m-0 gap-3'>
					<Card className='w-[158px] h-[123px]'>
						<Users2Icon />
						<div>Employees</div>
					</Card>
					<Card className='w-[158px] h-[123px]'>
						<img
							src='/money-bag.png'
							alt=''
							className='w-7 h-8'
						/>
						<div>Payrun</div>
					</Card>
					<Card className='w-[158px] h-[123px]'>
						<BarChartBigIcon />
						<div>Reports</div>
					</Card>
					<Card className='w-[158px] h-[123px]'>
						<Settings />
						<div>Settings</div>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
