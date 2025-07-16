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
import Link from 'next/link';

const Dashboard = () => {
	return (
		<div>
			<div>
				<div className='flex gap-1.5 items-center mx-4 mt-4'>
					<section>
						<h3 className='font-semibold '>Hi, Welcome Back {`User`}</h3>
						<p className='text-muted-foreground'>Here's what is happening with your payroll today</p>
					</section>
					<div className='flex gap-4 ml-auto'>
						<Button
							variant='outline'
							className='bg-white text-black'>
							<CalendarDaysIcon /> Select Date
						</Button>
						<Button
							variant='outline'
							className='bg-white text-black'>
							<ArrowDownToLineIcon />
							Export
						</Button>
					</div>
				</div>
				<div className='grid grid-cols-4 gap-6 m-8 '>
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
			<div className='grid grid-cols-3 gap-x-0 gap-y-0 m-8 w-[980px]'>
				<BarChart className='col-span-2' />
				<Piechrt className='col-span-1 w-[340px]' />
			</div>
			<div className='grid grid-cols-3 m-8  gap-4'>
				<div className='col-span-2 bg-white rounded-lg p-4 shadow h-[340px]'>
					<DTable
						data={data1}
						columns={columns}
					/>
				</div>
				<div className=' grid grid-cols-2 grid-rows-2 p-5 rounded-xl shadow gap-3 bg-white w-full'>
					<Card className='h-[123px] items-center justify-center flex flex-col'>
						<Link
							href='/main/Employee'
							className='flex flex-col items-center gap-2'>
							<article className='bg-[#e9eff9] rounded-4xl w-fit p-2'>
								<img
									src='/icons/employee-group-line.svg'
									alt=''
									width={20}
									height={20}
								/>
							</article>
							<h4>Employee</h4>
						</Link>
					</Card>
					<Card className=' h-[123px] grid place-content-center'>
						<Link
							href='/main/Payrun'
							className='flex flex-col items-center gap-2'>
							<article className='bg-[#e9eff9] w-fit rounded-4xl p-2'>
								<img
									src='/icons/material-symbol.png'
									alt=''
									width={20}
									height={20}
								/>
							</article>
							<div>Payrun</div>
						</Link>
					</Card>
					<Card className=' h-[123px] grid place-content-center'>
						<Link
							href='/main/Reports'
							className='flex flex-col items-center gap-2'>
							<article className='bg-[#e9eff9] w-fit rounded-4xl p-2'>
								<BarChartBigIcon
									color='#3a56d8'
									width={20}
									height={20}
								/>
							</article>
							<div>Reports</div>
						</Link>
					</Card>
					<Card className=' h-[123px] grid place-content-center'>
						<Link
							href='/main/Setins/CompSet'
							className='flex flex-col items-center gap-2'>
							<article className='bg-[#e9eff9] w-fit rounded-4xl p-2'>
								<Settings
									color='#3a56d8'
									width={20}
									height={20}
								/>
							</article>
							<div>Settings</div>
						</Link>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
