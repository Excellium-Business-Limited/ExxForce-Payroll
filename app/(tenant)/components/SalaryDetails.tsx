'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectTrigger,
	SelectValue,
	SelectItem,
} from '@/components/ui/select';

export default function SalarySetupForm() {
	return (
		<div className='ml-auto h-full w-full max-w-2xl bg-white p-6 overflow-y-auto'>
			<div className='mb-8'>
				<h1 className='text-2xl font-bold'>Salary Set up</h1>
			</div>

			<form className='space-y-8'>
				<div className='space-y-4'>
					<Label htmlFor='payGrade'>Pay grade</Label>
					<Input id='payGrade' defaultValue='Entry Level Staffs' />
					<p className='text-xs text-muted-foreground'>
						Pay grade are templates for employees with the same pay components. Default ones exist by pay frequency, but you can also create custom grade.
					</p>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<div className='space-y-2'>
						<Label htmlFor='payFrequency'>Pay Frequency</Label>
						<Select defaultValue='monthly'>
							<SelectTrigger>
								<SelectValue placeholder='Select pay frequency' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='monthly'>Monthly</SelectItem>
								<SelectItem value='bi-weekly'>Bi-weekly</SelectItem>
								<SelectItem value='weekly'>Weekly</SelectItem>
							</SelectContent>
						</Select>
						<p className='text-xs text-muted-foreground'>
							Pay Frequency determines how the salary is split and paid out.
						</p>
					</div>
					<div className='space-y-2'>
						<Label htmlFor='salaryAmount'>Salary amount</Label>
						<Input id='salaryAmount' defaultValue='200,000 (NGN)' />
					</div>
				</div>

				<div className='space-y-4'>
					<h2 className='text-lg font-semibold'>Bank Details</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div className='space-y-2'>
							<Label htmlFor='bankName'>Bank name</Label>
							<Input id='bankName' defaultValue='Zenith Bank' required />
						</div>
						<div className='space-y-2'>
							<Label htmlFor='accountNumber'>Account number</Label>
							<Input id='accountNumber' defaultValue='2346699657' required />
						</div>
						<div className='space-y-2 md:col-span-2'>
							<Label htmlFor='accountName'>Account name</Label>
							<Input id='accountName' defaultValue='John Smith' required />
						</div>
					</div>
				</div>

				<div className='rounded-md bg-blue-50 p-4 space-y-1 text-sm'>
					<h3 className='font-semibold text-blue-700'>Summary</h3>
					<p><span className='font-medium'>Employee</span> : John Smith</p>
					<p><span className='font-medium'>Position</span> : Software Developer</p>
					<p><span className='font-medium'>Employment Type</span> : Full Time</p>
					<p><span className='font-medium'>Salary</span> : 200,000 (NGN)</p>
					<p><span className='font-medium'>Pay Frequency</span> : Monthly</p>
					<p><span className='font-medium'>Deductions</span> : NHF, PAYE, NHSIF</p>
					<p><span className='font-medium'>Benefits</span> : NHIS, Transport Allowance</p>
				</div>

				<div className='flex justify-end gap-4 pt-4'>
					<Button variant='outline' type='button' className='text-muted-foreground'>
						Close
					</Button>
					<Button type='submit' className='bg-[#3D56A8] hover:bg-[#2E4299]'>
						Save
					</Button>
				</div>
			</form>
		</div>
	);
}
