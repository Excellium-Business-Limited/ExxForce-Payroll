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
					<h3>Hi, Welcome Back {`User`}</h3>
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
				<div className='grid grid-cols-4 gap-16 m-8'>
					<Card className='m-1 p-3 w-[250px] h-fit'>
						<article className='flex gap-2 content-center items-center'>
							<span className='bg-[#dee7f6] rounded-4xl p-2 '>
								<img
									src='/icons/employee-group.png'
									alt=''
									width={20}
									height={20}
								/>
							</span>
							<h5>Total Employees </h5>
						</article>
						<hr />
						<span>
							<h2 className='font-bold text-sm '>50</h2>
							<p className='text-xs text-muted-foreground'>
								90% of employees are regular staff
							</p>
						</span>
					</Card>
					<Card className='m-1 p-3 w-[245px] h-fit'>
						<article className='flex gap-2 content-center items-center'>
							<span className='bg-[#d9f2ef] rounded-4xl p-2 '>
								<img
									src='/icons/money-bag (2).png'
									alt=''
									width={20}
									height={20}
								/>
							</span>
							<h5>Total Net Salary</h5>
						</article>
						<hr />
						<span>
							<h2 className='font-bold'>₦3,500,000.00</h2>
							<p className='text-xs text-muted-foreground'>
								Total payroll after deductions
							</p>
						</span>
					</Card>
					<Card className='m-1 p-3 w-[245px] h-fit'>
						<article className='flex gap-2 content-center items-center'>
							<span className='bg-[#f4e0da] rounded-4xl p-2 '>
								<img
									src='/icons/percentage.png'
									alt=''
									width={20}
									height={20}
								/>
							</span>
							<h5>Total Deduction</h5>
						</article>
						<hr />
						<span>
							<h2 className='font-bold'>₦3,500,000.00</h2>
							<p className='text-xs text-muted-foreground'>
								Deduction from all employees in this run
							</p>
						</span>
					</Card>
					<Card className='m-1 p-3 w-[245px] h-fit'>
						<article className='flex gap-2 content-center items-center'>
							<span className='bg-[#f8edd9] rounded-4xl p-2 '>
								<img
									src='/icons/money-hand.png'
									alt=''
									width={20}
									height={20}
								/>
							</span>
							<h5 className=''>Prorated Salaries</h5>
						</article>
						<hr />
						<span>
							<h2 className='font-bold'>15 Employees</h2>
							<p className='text-xs text-muted-foreground'>
								30% of employees had prorated pay
							</p>
						</span>
					</Card>
				</div>
			</div>
			<div className='grid grid-cols-10 grid-rows-1 gap-x-0 gap-y-0 m-8 w-[920px]'>
				<BarChart className='col-span-7' />
				<Piechrt className='col-span-3 w-[390px]' />
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
