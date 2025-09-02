'use client';
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
import React, { useEffect } from 'react';
import BarChart from './_components/Barchart';
import { Bar } from 'recharts';
import Piechrt from './_components/Piechart';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { getAccessToken, getTenant } from '@/lib/auth';
import { fetchEmployees } from '@/lib/api';
import  { useGlobal } from '@/app/Context/page';
import { set } from 'date-fns';


const Dashboard = () => {
	const { globalState, updateGlobalState, tenant } = useGlobal();
	const [employees, setEmployees] = React.useState<any>([]);
	const [paid, setPaid] = React.useState<any>()
	const [net, setNet] = React.useState<any>()
	const [tnt, setTnt] = React.useState<string | null >('')
	const [deduction, setDeduction] = React.useState<any>()
	const getSalaries = () => {
		const Salaries = employees.map((employee: any) => employee.custom_salary);
		const totalSalary = Salaries.reduce(
			(acc: number, curr: number) => Number(acc) + Number(curr),
			0
		);
		const formattedSalary = totalSalary.toLocaleString('en-NG', {
			style: 'currency',
		currency: 'NGN',})	
		return formattedSalary;
	}

	useEffect(() => {
		const fetchPayrollData = async () => {
			const tenant = getTenant()
			setTnt(tenant)
			const baseURL = `http://${tenant}.localhost:8000`
			const token = getAccessToken()
			try {
				// setIsLoading(true);
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
				
				const data = await response.json()
				setPaid(data.employees_paid)
				setDeduction(data.totals.deductions)
				setNet(data.totals.net)
				console.log(data)
			 }catch (err){
					console.error('Error fetching payroll data:', err);
				}
		}
		fetchPayrollData();
	}, [])
	
	
	useEffect(() => {
		const accessToken = globalState.accessToken || getAccessToken();
		if (tenant) {
			updateGlobalState({ tenant : tenant, accessToken: accessToken });
			fetchEmployees(tenant).then((data) => {
				setEmployees(data);
				// updateGlobalState({ employees: data });
				console.log(employees, data);
			}).catch((error) => {
				console.error("Error fetching employees:", error);
			});
		}
		timeout;
	}, []);
	const timeout = setTimeout(() => {
		console.log(globalState);
	}, 2000);
	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-NG', {
			style: 'currency',
			currency: 'NGN',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount);
	};

	console.log(employees)
	return (
		<div>
			<div>
				<div className='flex gap-1.5 items-center mx-4 mt-4'>
					<section>
						<h3 className='font-semibold text-md'>Hi, Welcome Back {globalState.tenant}</h3>
						<p className='text-muted-foreground text-md'>Here's what is happening with your payroll today</p>
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
					<Card className='m-1 p-3 w-[245px] h-fit'>
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
							<h2 className='font-bold text-sm '>{employees.length}</h2>
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
							<h5>Total Salary</h5>
						</article>
						<hr />
						<span>
							<h2 className='font-bold'>{formatCurrency(net)}</h2>
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
							<h2 className='font-bold'>{formatCurrency(deduction)}</h2>
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
							<h2 className='font-bold'>{paid} Employees</h2>
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
							href='/Employee'
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
							href='/Payrun'
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
							href='/Reports'
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
							href='/Setins/CompSet'
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
