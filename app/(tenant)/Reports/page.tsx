'use client';
import { Button } from '@/components/ui/button';
import {
	Sheet,
	SheetTrigger,
	SheetContent,
	SheetTitle,
} from '@/components/ui/sheet';
import Dialogs from '../components/dialog';
import Import from '../components/Import';
import React from 'react';
import LoanForm from '../Loan/loanForm';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

const page = () => {
	const [report, setReport] = React.useState(true);
	if (!report) {
		return (
			<div className='h-[680px] m-7 gap-4 '>
				<div className='flex flex-row items-center justify-between w-full'>
					<span>
						<h1>Reports</h1>
						<p className='text-xs'>
							Access and analyze detailed reports for your <br /> payroll data.
						</p>
					</span>
				</div>
				<div className='text-center max-w-2xl mx-auto mt-[120px]'>
					<img
						src='/notdata.png'
						alt='Team Illustration'
						className='w-32 h-32 md:w-40 md:h-40 mx-auto mb-8'
					/>
					<h2 className='text-2xl md:text-3xl  mb-4'>No Reports Yet</h2>
					<pre className='text-base text-muted-foreground mb-8'>
						Run payroll to start generating reports for employee
						<br /> payments, taxes, and more
					</pre>
				</div>
			</div>
		);
	}
	return (
		<div className='w-full'>
			<div className='self-center h-[603px] ml-4 gap-7'>
				<div className='flex flex-row items-center justify-between w-full'>
					<span className='my-3'>
						<h1>Reports</h1>
						<p className='text-xs'>
							Access and analyze detailed reports for your <br /> payroll data.
						</p>
					</span>
				</div>
				<Card className='bg-white m-4 pt-6 h-[780px]'>
					<div className='grid grid-cols-3 grid-rows-2 gap-3 content-between justify-between p-3.5'>
						<Card className='p-3 w-[300px]'>
							<article>
								<div className='rounded-full bg-[#E8F1FF] w-fit p-1'>
									<Image
										src={'/money-bag.png'}
										alt={''}
										width={20}
										height={20}
										color='#3D56A8'
									/>
								</div>
								<h3 className='my-3 font-bold'>Payroll Summary</h3>
								<p>
									Complete overview of payroll expenses and distributions across
									all employees
								</p>
							</article>
							<a
								href={`/Reports/payroll-summary/all?from_date=2025-01-01&to_date=2026-03-31`}
								className='text-[#3D56A8]'>{`View Report >`}</a>
						</Card>
						<Card className='p-3 w-[300px]'>
							<article>
								<div className='rounded-full bg-[#E8F1FF] w-fit p-1'>
									<Image
										src={'/money-bag.png'}
										alt={''}
										width={20}
										height={20}
										color='#3D56A8'
									/>
								</div>
								<h3 className='my-3 font-bold'>Tax Summary</h3>
								<p>
									Comprehensive tax calculations and withholdings for compliance
									reporting.
								</p>
							</article>
							<a
								href={`/Reports/tax-summary/all?from_date=2025-01-01&to_date=2026-12-31`}
								className='text-[#3D56A8]'>{`View Reports >`}</a>
						</Card>
						<Card className='p-3 w-[300px]'>
							<article>
								<div className='rounded-full bg-[#E8F1FF] w-fit p-1'>
									<Image
										src={'/money-bag.png'}
										alt={''}
										width={20}
										height={20}
										color='#3D56A8'
									/>
								</div>
								<h3 className='my-3 font-bold'>Payroll Journal Summary</h3>
								<p>
									Accounting journal entries for payroll transactions and
									allocations.
								</p>
							</article>
							<a
								href={`/Reports/journal-summary/14`}
								className='text-[#3D56A8]'>{`View Reports >`}</a>
						</Card>
						<Card className='p-3 w-[300px]'>
							<article>
								<div className='rounded-full bg-[#E8F1FF] w-fit p-1'>
									<Image
										src={'/money-bag.png'}
										alt={''}
										width={20}
										height={20}
										color='#3D56A8'
									/>
								</div>
								<h3 className='my-3 font-bold'>Activity Logs/ Audit Trail</h3>
								<p>
									Complete audit trail of all payroll activities and system
									changes.
								</p>
							</article>
							<a
								href={`/Reports/activity-log/all?`}
								className='text-[#3D56A8]'>{`View Reports >`}</a>
						</Card>
						<Card className='p-3 w-[300px]'>
							<article>
								<div className='rounded-full bg-[#E8F1FF] w-fit p-1'>
									<Image
										src={'/money-bag.png'}
										alt={''}
										width={20}
										height={20}
										color='#3D56A8'
									/>
								</div>
								<h3 className='my-3 font-bold'>Loan & Repayment Report</h3>
								<p>
									Employee loan balances, repayment schedules, and payment
									history.
								</p>
							</article>
							<a
								href={`/Reports/loan-report/all`}
								className='text-[#3D56A8]'>{`View Reports >`}</a>
						</Card>
						<Card className='p-3 w-[300px]'>
							<article>
								<div className='rounded-full bg-[#E8F1FF] w-fit p-1'>
									<Image
										src={'/money-bag.png'}
										alt={''}
										width={20}
										height={20}
										color='#3D56A8'
									/>
								</div>
								<h3 className='my-3 font-bold'>Employees' Pay Summary</h3>
								<p>
									Detailed breakdown of individual employee earnings and
									deductions.
								</p>
							</article>
							<a
								href={`/Reports/employee-history/all?from_date=2025-01-01&to_date=2026-03-31`}
								className='text-[#3D56A8]'>{`View Report >`}</a>
						</Card>
					</div>
				</Card>
			</div>
		</div>
	);
};

export default page;
