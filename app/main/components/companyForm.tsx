import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DialogClose } from '@/components/ui/dialog';
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

const companyForm = () => {
	return (
		<div className=' h-screen bg-white'>
			<Card className=' w-full border-transparent border-none shadow-none'>
				<div className=' absolute top-2 mt-0 mb-4 '>
					<h4 className='font-bold'> Company Details</h4>
					<p className='text-muted-foreground'> Add company details</p>
				</div>
				<form className='m-4 h-[603px]'>
					<span className='p-6 items-start'>
						<Label
							className='mb-3'
							htmlFor='Industry'>
							Industry
						</Label>
						<Select>
							<SelectTrigger className='h-8 mb-0.5 w-full'>
								<SelectValue placeholder='Industry' />
							</SelectTrigger>
							<SelectContent position='popper'>
								<SelectItem value={'Technology'}>Technology</SelectItem>
								<SelectItem value={' Healthcare'}>Healthcare</SelectItem>
								<SelectItem value={'Finance'}>Finance</SelectItem>
								<SelectItem value={' Education'}>Education</SelectItem>
								<SelectItem value={' Manufacturing'}>Manufacturing</SelectItem>
								<SelectItem value={'Retail '}>Retail</SelectItem>
								<SelectItem value={' Hospitality'}>Hospitality</SelectItem>
								<SelectItem value={'Energy '}>Energy</SelectItem>
								<SelectItem value={' Government'}>Government</SelectItem>
								<SelectItem value={'Media & Entertainment'}>
									Media & Entertainment
								</SelectItem>
							</SelectContent>
						</Select>
					</span>
					<div className='grid grid-cols-2 gap-6 '>
						<span className=' items-start'>
							<Label
								className='mb-3'
								htmlFor='CompanyEmail'>
								Company Email
							</Label>
							<Input
								className='h-8 mb-4'
								type='text'
								id='CompanyEmail'
								required
							/>
						</span>
						<span className=' items-start'>
							<Label
								className='mb-3'
								htmlFor='Companyphone'>
								Company phone number
							</Label>
							<Input
								className='h-8 '
								type='text'
								id='Companyphone'
								required
							/>
						</span>
					</div>

					<span className='p-6 items-start mb-3'>
						<Label
							className='mb-3'
							htmlFor='Address1'>
							{' '}
							Address1
						</Label>
						<Input
							className='h-8 mb-4'
							type='text'
							id='Address1'
							required
						/>
					</span>
					<span className=' items-start'>
						<Label
							className='mb-3'
							htmlFor='Address2'>
							{' '}
							Address2
						</Label>
						<Input
							className='h-8 mb-4'
							type='text'
							id='Address2'
							required
						/>
					</span>
					<div className='grid grid-cols-2 gap-6 p-0 items-start'>
						<span className=' items-start'>
							<Label
								className='mb-3'
								htmlFor='City'>
								City
							</Label>
							<Input
								className='h-8 mb-4'
								type='text'
								id='City'
								required
							/>
						</span>
						<span className=' items-start'>
							<Label
								className='mb-3'
								htmlFor='State'>
								State
							</Label>
							<Input
								className='h-8 mb-4'
								type='text'
								id='State'
								required
							/>
						</span>
					</div>
					<div className='grid grid-cols-2 gap-6'>
						<span className='items-start'>
							<Label
								className='mb-3'
								htmlFor='Country'>
								Country
							</Label>
							<Input
								className='h-8 '
								type='text'
								id='Country'
								required
							/>
						</span>
						<span className='items-start'>
							<Label
								className='mb-3'
								htmlFor='TIN'>
								Tax Identification Number(TIN)
							</Label>
							<Input
								className='h-8 '
								type='text'
								id='TIN'
								required
							/>
						</span>
					</div>
					<span>
						<Label
							className='m-3'
							htmlFor='Website'>
							Company Website
						</Label>
						<Input
							className='h-8 '
							type='text'
							id='Website'
							required
						/>
					</span>
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
						variant='outline' type='submit'>
						{' '}
						Save{' '}
					</Button>
				</div>
			</Card>
		</div>
	);
};

export default companyForm;
