'use client';
import { Card } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import React, { useEffect, useState } from 'react';
import payRunList from '../_components/payrunList';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { EllipsisVertical, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import axios from 'axios';
import { useGlobal } from '@/app/Context/page';
import { getAccessToken, getTenant } from '@/lib/auth';
// import { Router } from 'next/router';
import { useRouter } from 'next/navigation';

interface PayRun {
	id: number;
	name: string;
	pay_period: string;

	deductions: string;
	start_date: string;
	end_date: string;
	payment_date: string;
	status: string;
}

interface Employee {
	benefits: string;
	deductions: string;
	employee_id: string;
	gross: string;
	id: number;
	name: string;
	net_salary: string;
	paygrade: string;
	status: string;
}

const page = ({ params }: { params: Promise<{ payrunId: string }> }) => {
	const router = useRouter();
	const [payRun, setPayRun] = useState<PayRun | null>(null);
	const [isLoading, setIsLoading] = useState<Boolean>(false);
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [planName, setPlanName] = useState<string>('');
	const [error, setError] = useState<string>('');
	const [token, setToken] = useState<string>('');
	const { payrunId } = React.use(params);

	useEffect(() => {
		const accessToken = localStorage.getItem('access_token');
		if (!accessToken) {
			setError('No access token found');
			return;
		}
		setToken(accessToken);
		const tenant = getTenant();

		const baseURL = `http://${tenant}.localhost:8000`;

		const fetchData = async () => {
			try {
				const [payRunRes, employeesRes, planRes] = await Promise.all([
					axios.get<PayRun>(`${baseURL}/tenant/payrun/${payrunId}`, {
						headers: { Authorization: `Bearer ${accessToken}` },
					}),
					axios.get<Employee[]>(
						`${baseURL}/tenant/payrun/${payrunId}/eligible-employees`,
						{
							headers: { Authorization: `Bearer ${accessToken}` },
						}
					),
					axios.get<{ plan_name: string }>(`${baseURL}/tenant/payrun/plan`, {
						headers: { Authorization: `Bearer ${accessToken}` },
					}),
				]);

				setPayRun(payRunRes.data);
				setEmployees(employeesRes.data);
				setPlanName(planRes.data.plan_name);
				console.log(payRunRes.data, employeesRes.data, planRes.data);
			} catch (err: any) {
				console.error('Error loading data', err);
				setError(
					Array.isArray(err.response?.data?.detail)
						? err.response.data.detail.map((e: any) => e.msg).join(', ')
						: err.response?.data?.detail || 'Failed to load data'
				);
				if (err.status === 401) {
					router.push('/login');
				}
			}
		};
		fetchData();
	}, []);
	const handleSubmit = async () => {
		const tenant = getTenant();
		const baseURL = `http://${tenant}.localhost:8000`;
		const accessToken = getAccessToken();

		try {
			setIsLoading(true);
			const res = await axios.post(
				`http://${tenant}.localhost:8000/tenant/payrun/${payrunId}/submit`,
				{}, // empty request body
				{ headers: { Authorization: `Bearer ${accessToken}` } }
			);

			if (res.status === 200) {
				console.log(res);
			}
			router.refresh();
		} catch (err: any) {
			console.log(err); // Also fixed: was logging "Error" instead of the actual error
			// Uncomment if you want to handle 401 specifically
			// if (err.response?.status === 401) {
			//     router.push('/login');
			// }
		} finally {
			setIsLoading(false); // Don't forget to reset loading state
		}
	};

	return (
		<div className='h-[1080px]'>
			<div className='m-4 flex justify-between'>
				<div>
					<h1>Pay Runs</h1>
					<p className='text-xs'>Create and Mange your Payruns</p>
				</div>
				{payRun?.status !== 'APPROVED' ? (
					<div>
						<Button
							variant={'default'}
							className='bg-blue-500'
							onClick={handleSubmit}>
							Submit for Approval
						</Button>
					</div>
				) : null}
			</div>
			<section className='flex justify-between m-2 w-[1050px]'>
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
						<h2 className='font-bold'>{employees.length}</h2>
						<p className='text-xs text-muted-foreground'>
							90% of employees are eligible for this run
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
						<h2 className='font-bold'>
							{employees.reduce((acc, emp) => acc + Number(emp.net_salary), 0)}
						</h2>
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
			</section>
			<section className='mx-2 mt-4'>
				<Card>
					<Table>
						<TableHeader>
							<TableRow className='text-[#3a56d8]'>
								<TableCell className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									EMPLOYEE NAME{' '}
								</TableCell>
								<TableCell className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									PAY GRADE
								</TableCell>
								<TableCell className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									GROSS SALARY
								</TableCell>
								<TableCell className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									DEDUCTIONS
								</TableCell>
								<TableCell className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									BENEFITS
								</TableCell>
								{/* <TableCell>DAYS WORKED</TableCell> */}
								<TableCell className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									NET SALARY
								</TableCell>
								<TableCell className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									STATUS
								</TableCell>
								<TableCell className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									MORE
								</TableCell>
							</TableRow>
						</TableHeader>
						<TableBody>
							{employees.map((payrun, index) => {
								return (
									<TableRow
										key={index}
										className='text-sm font-light align-middle content-center items-center'>
										<TableCell className='px-6 py-3 text-left text-xs font-medium b tracking-wider'>
											{payrun.name}
										</TableCell>
										<TableCell className='px-6 py-3 text-left text-xs font-medium b tracking-wider'>
											{payrun.paygrade}
										</TableCell>
										<TableCell className='px-6 py-3 text-left text-xs font-medium b tracking-wider'>
											₦{payrun.gross}.00
										</TableCell>
										<TableCell className='px-6 py-3 text-left text-xs font-medium b tracking-wider'>
											₦{payrun.deductions}.00
										</TableCell>
										<TableCell className='px-6 py-3 text-left text-xs font-medium b tracking-wider'>
											₦{payrun.benefits}.00
										</TableCell>
										{/* <TableCell>{payrun.days_worked}</TableCell> */}
										<TableCell className='px-6 py-3 text-left text-xs font-medium b tracking-wider'>
											₦{payrun.net_salary}.00
										</TableCell>
										<TableCell className='px-6 py-3 text-left text-xs font-medium b tracking-wider'>
											<span
												className={`${
													payrun.status === 'Paid'
														? 'text-green-600  bg-[#e6f6f4] border-green-200 '
														: 'text-yellow-600 bg-[#fff0de] border-yellow-200'
												} border-2 px-3 py-1 rounded-xl text-sm font-light`}>
												{payrun.status}
											</span>
										</TableCell>
										<TableCell className='px-6 py-3 text-left text-xs font-medium b tracking-wider'>
											<Popover>
												<PopoverTrigger>
													<EllipsisVertical />
												</PopoverTrigger>
												<PopoverContent className='grid grid-cols-1 !p-0 !m-0 w-fit'>
													<Link href={'./paytemps/preview'}>
														<Button
															variant={'default'}
															className='flex bg-white text-black hover:bg-secondary w-fit'>
															<Eye />{' '}
															<p className=' font-light'>Preview Payslips</p>
														</Button>
													</Link>
												</PopoverContent>
											</Popover>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</Card>
			</section>
		</div>
	);
};

export default page;
