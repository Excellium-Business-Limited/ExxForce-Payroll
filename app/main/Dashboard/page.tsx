import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import React from 'react';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { CircleCheck } from 'lucide-react';
import Image from 'next/image';

const page = () => {
	return (
		<div className=''>
			<Card className='ml-2 grid-cols-3 grid-rows-2 p-4 min-w-5xl h-auto bg-[#3D56A8] relative flex'>
				<div className='bg-[#3D56A8] text-white flex-1'>
					<CardTitle>Welcome to ExxForce</CardTitle>
					<p>Watch a quick 2-mins walkthrough of your new payroll dashboard</p>
				</div>
				<div className='flex-1'>
					<Button className='bg-[#E8F1FF] text-[#3D56A8]'>Watch</Button>
					<Button className='bg-[#3D56A8]'>
						{' '}
						Click to see <strong>Guide</strong>
					</Button>
				</div>
				<div className='absolute right-1 top-0'>
					<Image
						src='/welcome.png'
						width={150}
						height={150}
						alt='Image'
					/>
				</div>
			</Card>
			<Card className=' ml-2 p-4 min-w-5xl h-auto bg-[#FFFF]'>
				<CardTitle>Get Started with ExxForce</CardTitle>
				<p>
					Complete the following steps to have a seamless payroll experience
				</p>
				<div>
					<Progress value={50} className='w-[150px] h-2' />
				</div>
			</Card>
			<div className='grid grid-cols-3 grid-rows-2 gap-4 '>
				<Card className='w-500px m-6 p-[12px] w-[300px] h-[216px]'>
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
				<Card className='w-500px m-6 p-[12px] w-[300px] h-[216px]'>
					<div className='flex flex-row'>
						<CircleCheck />
						<CardTitle className='self-center flex flex-row p-0'>
							Company Details
						</CardTitle>
					</div>
					<p className='text-xs w-75'>
						Basic information about your company including address
					</p>
					<span className='w-[134px] h-[46px] rounded-[10px] gap-[10px] pt-[12px] pr-[24px] pb-[12px] pl-[24px]  text-green-300'>
						Start Setup
					</span>
				</Card>
				<Card className='w-500px m-6 p-[12px] w-[300px] h-[216px]'>
					<div className='flex flex-row'>
						<CircleCheck />
						<CardTitle className='self-center flex flex-row p-0'>
							Company Details
						</CardTitle>
					</div>
					<p className='text-xs w-75'>
						Basic information about your company including address
					</p>
					<span className='w-[134px] h-[46px] rounded-[10px] gap-[10px] pt-[12px] pr-[24px] pb-[12px] pl-[24px]  text-green-300'>
						Start Setup
					</span>
				</Card>
				<Card className='w-500px m-6 p-[12px] w-[300px] h-[216px]'>
					<div className='flex flex-row'>
						<CircleCheck />
						<CardTitle className='self-center flex flex-row p-0'>
							Company Details
						</CardTitle>
					</div>
					<p className='text-xs w-75'>
						Basic information about your company including address
					</p>
					<span className='w-[134px] h-[46px] rounded-[10px] gap-[10px] pt-[12px] pr-[24px] pb-[12px] pl-[24px]  text-green-300'>
						Start Setup
					</span>
				</Card>
				<Card className='w-500px m-6 p-[12px] w-[300px] h-[216px]'>
					<div className='flex flex-row'>
						<CircleCheck />
						<CardTitle className='self-center flex flex-row p-0'>
							Company Details
						</CardTitle>
					</div>
					<p className='text-xs w-75'>
						Basic information about your company including address
					</p>
					<span className='w-[134px] h-[46px] rounded-[10px] gap-[10px] pt-[12px] pr-[24px] pb-[12px] pl-[24px]  text-green-300'>
						Start Setup
					</span>
				</Card>
				<Card className='w-500px m-6 p-[12px] w-[300px] h-[216px]'>
					<div className='flex flex-row'>
						<CircleCheck />
						<CardTitle className='self-center flex flex-row p-0'>
							Company Details
						</CardTitle>
					</div>
					<p className='text-xs w-75'>
						Basic information about your company including address
					</p>
					<span className='w-[134px] h-[46px] rounded-[10px] gap-[10px] pt-[12px] pr-[24px] pb-[12px] pl-[24px]  text-green-300'>
						Start Setup
					</span>
				</Card>
			</div>
		</div>
	);
};

export default page;
