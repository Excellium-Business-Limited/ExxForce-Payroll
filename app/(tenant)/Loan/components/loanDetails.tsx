import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { MoreHorizontalIcon } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import UpdateRepay from '../../components/updateRepay';
import Dialogs from '../../components/dialog';
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { SelectTrigger } from '@radix-ui/react-select';

export default function LoanDetails( item: any) {
	const details = {
		employeeDetails: {
			fullName: 'John Smith',
			employeeId: 'EMP-1233',
			emailAddress: 'johnsmith@example.com',
			monthlySalary: '600,000.00',
			jobPosition: 'Software Engineer',
		},
		loan: {
			loanSummary: {
				status: 'Ongoing',
				loanAmount: '600,000.00',
				startDate: 'May 25th 2025',
				duration: '6 Months',
				monthlyDeductions: '60,000.00',
				endDate: 'October 29, 2025',
			},
			paymentDetails: {
				amountPaid: '600,000',
				balanceRemaining: '600,000',
				nextDeduction: 'July 2nd, 2025',
			},
			previousPayments: [
				{
					month: 'May',
					amountDeducted: '₦60,000.00',
					balanceRemaining: '₦540,000.00',
					dateOfDeduction: 'May 29, 2025',
					status: 'Paid',
				},
				{
					month: 'June',
					amountDeducted: '₦60,000.00',
					balanceRemaining: '₦480,000.00',
					dateOfDeduction: 'June 29, 2025',
					status: 'Paid',
				},
				{
					month: 'July',
					amountDeducted: '₦60,000.00',
					balanceRemaining: '₦420,000.00',
					dateOfDeduction: 'July 29, 2025',
					status: 'Paid',
				},
			],
		},
	};
	const { employeeDetails, loan ,} = details;
	const { fullName, employeeId, emailAddress, monthlySalary, jobPosition } = employeeDetails;
	const { loanSummary, paymentDetails, previousPayments } = loan;
	const progressValue = previousPayments.length/(loanSummary.duration ? parseInt(loanSummary.duration) : 1) * 100;

	return (
		<div className='w-full'>
			<div className=' h-[603px] w-full p-3'>
				<div className='flex flex-row items-center justify-between w-full'>
					<span className='flex flex-row items-center'>
						<h1 className='text-muted-foreground'>Loan</h1> /{' '}
						<h1>Loan Details</h1>
					</span>
					<div className='items-center self-end justify-between flex gap-4'>
						<Dialogs
							title={'Update Repayment'}
							className='bg-[#3D56A8] text-white'>
							<pre className='rounded-md p-2'>
								<UpdateRepay />
							</pre>
						</Dialogs>
						<Select>
							<SelectTrigger className=''>
								<SelectValue></SelectValue>
								<MoreHorizontalIcon className='border-2 rounded-4xl border-black h-[30px] w-[30px]' />
							</SelectTrigger>
							<SelectContent position='popper'>
								<SelectItem value='edit'>Edit Loan</SelectItem>
								<SelectItem value='pause'>Pause Loan</SelectItem>
								<SelectItem value='reschedule'>Reschedule Loan</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
				<div className='flex justify-between gap-4 my-4'>
					<Card className='border grid-cols-1 grid-rows-3 p-4 w-1/2 mb-4 h-[256px]'>
						<div className='grid gap-9 grid-cols-2 mb-4'>
							<span>
								<h6 className='text-xs text-muted-foreground'>Full Name</h6>
								<h6>{fullName}</h6>
							</span>
							<span>
								<h6 className='text-xs text-muted-foreground'>Employee ID</h6>
								<h6>{employeeId}</h6>
							</span>
						</div>
						<div className='grid gap-9 grid-cols-2 mb-4'>
							<span>
								<h6 className='text-xs text-muted-foreground'>Email Address</h6>
								<h6>{emailAddress}</h6>
							</span>
							<span>
								<h6 className='text-xs text-muted-foreground'>
									Monthly Salary
								</h6>
								<h6>₦{monthlySalary}</h6>
							</span>
						</div>
						<span>
							<h6 className='text-xs text-muted-foreground'>Job Position</h6>
							<h6>{jobPosition}</h6>
						</span>
					</Card>
					<Card className='border w-1/2 h-[256px] p-4'>
						<div className='px-2 flex justify-between'>
							<h6 className='text-md'>Loan Summary</h6>
							<p className='rounded-[10px] bg-[#e9eff9] w-[69px] h-[24px] text-xs p-1 border self-end'>
								{loanSummary.status}
							</p>
						</div>
						<div className='grid grid-rows-2 grid-cols-3 gap-2.5 m-2.5'>
							<span className='my-2'>
								<div className='flex gap-1.5'>
									<Image
										src={'/icons/solar_card-outline.png'}
										alt={''}
										width={20}
										height={20}
									/>
									<h6 className='text-xs text-muted-foreground'>Loan Amount</h6>
								</div>
								<h4>₦{loanSummary.loanAmount}</h4>
							</span>
							<span className='my-2'>
								<div className='flex gap-1.5'>
									<Image
										src={'/icons/CalendarDots.png'}
										alt={''}
										width={20}
										height={20}
									/>
									<h6 className='text-xs text-muted-foreground'>Start Date</h6>
								</div>
								<h4>{loanSummary.startDate}</h4>
							</span>
							<span className='my-2'>
								<div className='flex gap-1.5'>
									<Image
										src={'/icons/formkit_time.png'}
										alt={''}
										width={20}
										height={20}
									/>
									<h6 className='text-xs text-muted-foreground'>Duration</h6>
								</div>
								<h4>{loanSummary.duration}</h4>
							</span>
							<span className='my-2'>
								<div className='flex gap-1.5'>
									<Image
										src={'/icons/iconoir_percentage.png'}
										alt={''}
										width={20}
										height={20}
									/>
									<h6 className='text-xs text-muted-foreground'>
										Monthly Deductions
									</h6>
								</div>
								<h4>₦{loanSummary.monthlyDeductions}</h4>
							</span>
							<span className='my-2'>
								<div className='flex gap-1.5'>
									<Image
										src={'/icons/Vector.png'}
										alt={''}
										width={20}
										height={20}
									/>
									<h6 className='text-xs text-muted-foreground'>End Date</h6>
								</div>
								<h4>{loanSummary.endDate}</h4>
							</span>
						</div>
					</Card>
				</div>
				<div>
					<dl className='flex justify-between w-full my-6'>
						<div className='flex'>
							<Progress
								value={progressValue}
								className='flex self-center w-[350px]'
							/>
							<p className='text-xs self-center ml-2'>{`${progressValue} Percent`}</p>
						</div>
						<div className='grid grid-cols-3 gap-6 justify-between divide-x-4 divide-[#E8F1FF]'>
							<span>
								<h5 className='text-muted-foreground'>Amount Paid</h5>
								<p>₦{paymentDetails.amountPaid}</p>
							</span>
							<span>
								<h5 className='text-muted-foreground'>Balance Remaining</h5>
								<p>₦{paymentDetails.balanceRemaining}</p>
							</span>
							<span>
								<h5 className='text-muted-foreground'>Next Deduction</h5>
								<p>{paymentDetails.nextDeduction}</p>
							</span>
						</div>
					</dl>

					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Month</TableHead>
								<TableHead>Amount Deducted</TableHead>
								<TableHead>Balance Remaining</TableHead>
								<TableHead>Date of Deduction</TableHead>
								<TableHead>Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{previousPayments.map((payment, index) => (
								<TableRow key={index}>
									<TableCell>{payment.month}</TableCell>
									<TableCell>{payment.amountDeducted}</TableCell>
									<TableCell>{payment.balanceRemaining}</TableCell>
									<TableCell>{payment.dateOfDeduction}</TableCell>
									<TableCell>
										<h6 className='text-xs border border-[#0ac743] px-2 py-1 rounded-lg bg-[#c2eccd] text-[#0ac743] w-fit'>
										{payment.status}
										</h6>
										</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
}
