import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React from 'react'

const updateRepay = () => {
  return (
		<div>
			<h3>Update Repayment</h3>
			<form action=''>
				<div className='grid grid-rows-3 gap-6'>
					<span>
						<Label htmlFor='Amount'>Amount</Label>
						<Input type='number' />
					</span>
					<span>
						<Label htmlFor='Date'>Payment Date</Label>
						<Input type='date' />
					</span>
					<span>
						<Label htmlFor='method'>Payment Method</Label>
						<Select>
							<SelectTrigger className='h-8 mb-0.5 w-full'>
								<SelectValue placeholder='Bank Transfer' />
							</SelectTrigger>
							<SelectContent position='popper'>
								<SelectItem value={'Bank Transfer'}>Bank Transfer</SelectItem>
								<SelectItem value={'Card'}>Card Payment</SelectItem>
								<SelectItem value={'Remita'}>Remita</SelectItem>
							</SelectContent>
						</Select>
					</span>
				</div>
				<pre>Amount Remaining: 600,000</pre>
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
						Update{' '}
					</Button>
				</div>
			</form>
		</div>
	);
}

export default updateRepay
