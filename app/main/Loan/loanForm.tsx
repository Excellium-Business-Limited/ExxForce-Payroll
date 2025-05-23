import Image from 'next/image';
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
import React from 'react';

export default function LoanForm() {
	return (
		<div className=''>
			<div className='self-center w-[688px] h-[603px] ml-7 gap-4'>
				<div>
					<h1 className='text-2xl font-bold'>Add Loan</h1>
					<p className='text-xs'>Add Loan details</p>
				</div>
				<form action=''>
					<div>
						<span>
							<Label htmlFor='loanNum'>Loan Number</Label>
							<Input
								className=''
								type='text'
								id='loanNum'
								required
							/>
						</span>
						<span>
							<Label htmlFor='LoanName'>Loan Name</Label>
							<Select required>
								<SelectTrigger className='w-[180px]'>
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
					<div>
						<span>
							<Label htmlFor='SelectEmp'>Select Employee</Label>
							<Select>
								<SelectTrigger className='w-[180px]'>
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
							<Label htmlFor='Loanamt'>Loan Amount</Label>
							<Input
								className=''
								type='text'
								id='LoanAmt'
								required
							/>
						</span>
					</div>
					<div>
						<span>
							<Label htmlFor='Repay'>Repayment Duration</Label>
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
							<Label htmlFor='MonthDed'>Monthly Deductiond</Label>
							<Input
								type='text'
								id='MonthDed'
								required
							/>
						</span>
					</div>
					<div>
						<span>
							<Label htmlFor='Start'>Start Date of Repayment</Label>
							<Input
								type='date'
								id='Start'
								required
								placeholder='25/5/2025'
							/>
						</span>
					</div>
					<div>
						<span>
							<Label htmlFor='Reason'>Reason</Label>
							<Input
								type='textarea'
								id='Reason'
							/>
						</span>
					</div>
				</form>
			</div>
		</div>
	);
}
