import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button';
import React from 'react'
import { Input } from '@/components/ui/input';
import { CircleCheck } from 'lucide-react';

const page = () => {
  return (
		<div className=''>
			<Card className=' ml-2 p-4 min-w-5xl h-auto bg-[#3D56A8]'>
				<div className='bg-[#3D56A8] text-white'>
					<CardTitle>Welcome to ExxForce</CardTitle>
					<p>Watch a quick 2-mins walkthrough of your new payroll dashboard</p>
				</div>
				<div>
					<Button className='bg-[#E8F1FF] text-[#3D56A8]'>Watch</Button>
					<Button className='bg-[#3D56A8]'>
						{' '}
						Click to see <strong>Guide</strong>
					</Button>
				</div>
			</Card>
			<Card className=' ml-2 p-4 min-w-5xl h-auto bg-[#FFFF]'>
				<CardTitle>Get Started with ExxForce</CardTitle>
				<p>
					Complete the following steps to have a seamless payroll experience
				</p>
			</Card>
			<div className='flex gap-5 flex-wrap'>
				<Card className='w-500px m-6 p-[12px]'>
					<div className='flex flex-row'>
						<CircleCheck />
						<CardTitle className='self-center flex flex-row p-0'>
							Company Details
						</CardTitle>
					</div>
					<p className='text-xs w-75'>
						Basic information about your company including address
					</p>
					<span className='w-[134px] h-[46px] rounded-[10px] gap-[10px] pt-[12px] pr-[24px] pb-[12px] pl-[24px] bg-green-100 text-green-300'>
						Complete
					</span>
				</Card>
				<Card className='w-500px m-6 p-[12px]'>
					<div className='flex flex-row'>
						<CircleCheck />
						<CardTitle className='self-center flex flex-row p-0'>
							Company Details
						</CardTitle>
					</div>
					<p className='text-xs w-75'>
						Basic information about your company including address
					</p>
					<span className='w-[134px] h-[46px] rounded-[10px] gap-[10px] pt-[12px] pr-[24px] pb-[12px] pl-[24px] bg-green-100 text-green-300'>
						Complete
					</span>
				</Card>
				<Card className='w-500px m-6 p-[12px]'>
					<div className='flex flex-row'>
						<CircleCheck />
						<CardTitle className='self-center flex flex-row p-0'>
							Company Details
						</CardTitle>
					</div>
					<p className='text-xs w-75'>
						Basic information about your company including address
					</p>
					<span className='w-[134px] h-[46px] rounded-[10px] gap-[10px] pt-[12px] pr-[24px] pb-[12px] pl-[24px] bg-green-100 text-green-300'>
						Complete
					</span>
				</Card>
				<Card className='w-500px m-6 p-[12px]'>
					<div className='flex flex-row'>
						<CircleCheck />
						<CardTitle className='self-center flex flex-row p-0'>
							Company Details
						</CardTitle>
					</div>
					<p className='text-xs w-75'>
						Basic information about your company including address
					</p>
					<span className='w-[134px] h-[46px] rounded-[10px] gap-[10px] pt-[12px] pr-[24px] pb-[12px] pl-[24px] bg-green-100 text-green-300'>
						Complete
					</span>
				</Card>
				<Card className='w-500px m-6 p-[12px]'>
					<div className='flex flex-row'>
						<CircleCheck />
						<CardTitle className='self-center flex flex-row p-0'>
							Company Details
						</CardTitle>
					</div>
					<p className='text-xs w-75'>
						Basic information about your company including address
					</p>
					<span className='w-[134px] h-[46px] rounded-[10px] gap-[10px] pt-[12px] pr-[24px] pb-[12px] pl-[24px] bg-green-100 text-green-300'>
						Complete
					</span>
				</Card>
				<Card className='w-500px m-6 p-[12px]'>
					<div className='flex flex-row'>
						<CircleCheck />
						<CardTitle className='self-center flex flex-row p-0'>
							Company Details
						</CardTitle>
					</div>
					<p className='text-xs w-75'>
						Basic information about your company including address
					</p>
					<span className='w-[134px] h-[46px] rounded-[10px] gap-[10px] pt-[12px] pr-[24px] pb-[12px] pl-[24px] bg-green-100 text-green-300'>
						Complete
					</span>
				</Card>
			</div>
		</div>
	);
}

export default page