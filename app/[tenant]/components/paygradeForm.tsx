'use client';
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
import { DialogClose } from '@/components/ui/dialog';

export default function LoanForm() {
	return (
		<div className='bg-white'>
			<Card className='self-center w-full gap-4 border-none shadow-none bg-white'>
				<div>
					<h1 className='text-xl'>Create New PayGrade</h1>
					<p className='text-xs'>
						Fill in hte details below to create a paygrade template
					</p>
				</div>
				<form action=''>
					<div>
						<span className='m-2'>
							<Label
								htmlFor='payname'
								className='text-sm font-medium mb-2'>
								Paygrade Name
							</Label>
							<Input
								id='payname'
								type='text'
								placeholder='e.g Junior Staff, Senior Associates'
								className='w-full mb-3'
							/>
						</span>
						<span className='m-2'>
							<Label
								htmlFor='payamount'
								className='text-sm font-medium mb-2'>
								Amount (NGN)
							</Label>
							<Input
								id='payamount'
								type='text'
								placeholder='Amount'
								className='w-full mb-3'
							/>
						</span>
					</div>
					<div className='m-4 grid w-[258px]'>
						<h3 className='text-lg font-medium'>Salary Components</h3>
						<div className='grid grid-cols-2 gap-4'>
							<span className='flex items-center gap-2.5'>
								<input type='checkbox' />
								<h5 className='text-xs'>Basic Salary</h5>
							</span>
							<span className='flex items-center gap-2.5'>
								<input type='checkbox' />
								<h5 className='text-xs'>Bonuses</h5>
							</span>
							<span className='flex items-center gap-2.5'>
								<input type='checkbox' />
								<h5 className='text-xs'>Allowances</h5>
							</span>
							<span className='flex items-center gap-2.5'>
								<input type='checkbox' />
								<h5 className='text-xs'>Benefits</h5>
							</span>
						</div>
					</div>
					<div>
						<Label
							htmlFor='description'
							className='text-sm font-medium'>
							Description
						</Label>
						<Textarea
							id='description'
							placeholder='Add a note about this paygrade purpose and applicability'
							className='w-full h-[140px]'
						/>
					</div>
				</form>
				<div className='self-end'>
					<DialogClose asChild>
						<Button
							className='m-3 text-muted-foreground'
							variant='outline'>
							{' '}
							Close{' '}
						</Button>
					</DialogClose>
					<Button
						className='m-3 bg-[#3D56A8] text-white '
						variant='outline'
						type='submit'>
						{' '}
						Create Pay Grade{' '}
					</Button>
				</div>
			</Card>
		</div>
	);
}
