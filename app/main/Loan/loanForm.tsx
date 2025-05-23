"use client";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { SelectItem } from '@radix-ui/react-select';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

export default function LoanForm() {
	const [startDate, setStartDate] = React.useState<Date | null>(null);
	return (
		<div className=''>
			<Card className='self-center w-full gap-4 border-none shadow-none'>
				<div>
					<h1 className='text-2xl font-bold'>Add Loan</h1>
					<p className='text-xs'>Add Loan details</p>
				</div>
				<form action=''>
					<div className='grid grid-cols-2 gap-6 m-4'>
						<span>
							<Label
								htmlFor='loanNum'
								className='mb-2'>
								Loan Number
							</Label>
							<Input
								className='w-[200px]'
								type='text'
								id='loanNum'
								required
							/>
						</span>
						<span>
							<Label
								htmlFor='LoanName'
								className='mb-2'>
								Loan Name
							</Label>
							<Select required>
								<SelectTrigger className='w-[200px]'>
									<SelectValue placeholder='Select Loan Name' />
								</SelectTrigger>
								<SelectContent position='popper'>
									<SelectItem value='Loan1'>Car Loan</SelectItem>
									<SelectItem value='Loan2'>House Loan</SelectItem>
									<SelectItem value='Loan3'>Loan3</SelectItem>
								</SelectContent>
							</Select>
						</span>
					</div>
					<div className='grid grid-cols-2 gap-6 m-4'>
						<span>
							<Label
								htmlFor='SelectEmp'
								className='mb-2'>
								Select Employee
							</Label>
							<Select>
								<SelectTrigger className='w-[200px]'>
									<SelectValue placeholder='Select Employee' />
								</SelectTrigger>
								<SelectContent position='popper'>
									<SelectItem value='Emp1'>Employee 1</SelectItem>
									<SelectItem value='Emp2'>Employee 2</SelectItem>
									<SelectItem value='Emp3'>Employee 3</SelectItem>
								</SelectContent>
							</Select>
						</span>
						<span>
							<Label
								htmlFor='Loanamt'
								className='mb-2'>
								Loan Amount
							</Label>
							<Input
								className='w-[200px]'
								placeholder='Enter Loan Amount'
								type='text'
								id='LoanAmt'
								required
							/>
						</span>
					</div>
					<div className='grid grid-cols-2 gap-6 m-4'>
						<span>
							<Label htmlFor='Repay' className='mb-2'>Repayment Duration</Label>
							<Select>
								<SelectTrigger className='w-[180px]'>
									<SelectValue placeholder='Repayment Duration' />
								</SelectTrigger>
								<SelectContent position='popper'>
									<SelectItem value='1 Month'>6 Month</SelectItem>
									<SelectItem value='2 Months'>12 Months</SelectItem>
									<SelectItem value='3 Months'>2 Months</SelectItem>
								</SelectContent>
							</Select>
						</span>
						<span>
							<Label
								htmlFor='MonthDed'
								className='mb-2'>
								Monthly Deductiond
							</Label>
							<Input
								className='w-[200px]'
								type='text'
								placeholder='Enter Monthly Deduction'
								id='MonthDed'
								required
							/>
						</span>
					</div>
					<div className='grid grid-cols-2 gap-6 m-4'>
						<span>
							<Label htmlFor='Start'>Start Date of Repayment</Label>
							<DatePicker
								id='Start'
								required
								selected={startDate}
								onChange={(date) => setStartDate(date)}
								dateFormat='dd/MM/yyyy'
								placeholderText='25/5/2025'
								className='h-8 mb-4 w-[200px] pl-3 pr-8 border rounded'
							/>
						</span>
					</div>
					<div> 
						<span>
							<Label htmlFor='Reason'>Reason</Label>
							<Textarea
								className='h-24 mb-4 pl-3 pr-8 border'
								id='Reason'
							/>
						</span>
					</div>
				</form>
				<div className='self-end'>
									<Button
										className='m-3 text-muted-foreground'
										variant='outline'>
										{' '}
										Close{' '}
									</Button>
									<Button
										className='m-3 bg-[#3D56A8] text-white '
										variant='outline'>
										{' '}
										Save{' '}
									</Button>
								</div>
			</Card>
		</div>
	);
}
