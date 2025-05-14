import { Button } from '@/components/ui/button';
import { ArrowDownToLineIcon, CalendarDaysIcon } from 'lucide-react';
import { DataTable } from './_components/Datatable';
import data from './_components/data.json';
import React from 'react';
import  BarChart  from './_components/Barchart';
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
				<div className='grid grid-cols-4 gap-4'>
					<Card></Card>
					<Card></Card>
					<Card></Card>
					<Card></Card>
				</div>
			</div>
			<div className='grid grid-cols-2'>
				<BarChart />
				<Piechrt />
			</div>
			<div className='grid grid-cols-2 gap-4'>
				<div>
					<DataTable data={data} />
				</div>
				<div className='grid grid-cols-2 gap-4'>
					<Card></Card>
					<Card></Card>
					<Card></Card>
					<Card></Card>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
