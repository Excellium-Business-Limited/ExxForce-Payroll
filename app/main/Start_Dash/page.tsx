import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import React from 'react';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { CircleCheck } from 'lucide-react';
import Image from 'next/image';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import CompanyForm from '../components/companyForm';
import PayGradeForm from '../components/paygradeForm';
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import EmployeeForm from '../components/EmployeeForm';

const page = () => {
	return (
		<div className=''>
			<Card className='ml-4.5 grid-cols-3 grid-rows-2 p-4 min-w-5xl h-auto bg-[#3D56A8] flex mb-5'>
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
				<div className='absolute right-1 top-20'>
					<Image
						src='/welcome.png'
						width={150}
						height={150}
						alt='Image'
					/>
				</div>
			</Card>
			<Card className='ml-4.5 bg-[#FFFF] min-w-5xl h-[94px]'>
				<div className='flex flex-row justify-between ml-2'>
					<div className='flex flex-col justify-between justify-items-start'>
						<CardTitle>Get Started with ExxForce</CardTitle>
						<p className='text-xs w-75 mt-1'>
							Complete the following steps to have a seamless payroll experience
						</p>
					</div>
					<div className='flex justify-end items-end mb-5 h-full mr-2'>
						<Progress
							value={(1 / 5) * 100}
							className='flex self-center w-[150px]'
						/>
						<span className='flex text-[.8rem] ml-2 self-center'>
							1 of 5 Completed
						</span>
					</div>
				</div>
			</Card>
			<div className='grid grid-cols-3 grid-rows-2 gap-4 '>
				<Card className='w-500px m-4 p-[12px] w-[300px] h-[216px]'>
					<div className='flex flex-row m-3'>
						<CircleCheck className='bg-green-100 text-green-300 rounded-full w-5 h-5' />
						<CardTitle className='self-center flex flex-row w-xs p-0 pl-1'>
							Company Details
						</CardTitle>
					</div>
					<p className='text-xs w-fit'>
						Basic information about your company including address.
					</p>
					<Sheet>
						<SheetTrigger asChild>
							<Button
								variant='outline'
								className='w-[124px] h-[46px] rounded-[10px] gap-[10px] pt-[12px] pr-[24px] pb-[12px] pl-[24px] bg-green-100 text-green-600'>
								Complete
							</Button>
						</SheetTrigger>
						<SheetContent className='min-w-[500px] p-4 overflow-auto'>
							<SheetTitle className='hidden'>Company Details</SheetTitle>
							<CompanyForm />
						</SheetContent>
					</Sheet>
				</Card>
				<Card className='w-500px m-4 p-[12px] w-[300px] h-[216px]'>
					<div className='flex flex-row m-3'>
						<CircleCheck className='h-5 w-5' />
						<CardTitle className='self-center flex flex-row w-xs p-0 pl-1'>
							Add PayGrade
						</CardTitle>
					</div>
					<p className='text-xs w-fit'>
						Create pay grades to define salary levels and structure your payroll
						system.
					</p>
					<Sheet>
						<SheetTrigger asChild>
							<Button
								variant='outline'
								className='w-[124px] h-[46px] rounded-[10px] gap-[10px] pt-[12px] pr-[24px] pb-[12px] pl-[24px]  bg-[#DEE7F6] text-[#3D56A8]'>
								Start Setup
							</Button>
						</SheetTrigger>
						<SheetContent className='min-w-[500px] p-4 overflow-auto'>
							<SheetTitle className='hidden'>Add PayGrade</SheetTitle>
							<PayGradeForm />
						</SheetContent>
					</Sheet>
				</Card>
				<Card className='w-500px m-4 p-[12px] w-[300px] h-[216px]'>
					<div className='flex flex-row m-3'>
						<CircleCheck className='h-5 w-5' />
						<CardTitle className='self-center flex flex-row w-xs p-0 pl-1'>
							Add Employee
						</CardTitle>
					</div>
					<p className='text-xs w-fit'>
						Add your team members and their personal information for payroll
						processing.
					</p>
					<Sheet>
						<SheetTrigger asChild>
							<Button
								variant='outline'
								className='w-[124px] h-[46px] rounded-[10px] gap-[10px] pt-[12px] pr-[24px] pb-[12px] pl-[24px]  bg-[#DEE7F6] text-[#3D56A8]'>
								Start Setup
							</Button>
						</SheetTrigger>
						<SheetContent className='min-w-[500px] p-4 overflow-auto'>
							<SheetTitle className='hidden'>Company Details</SheetTitle>
							<EmployeeForm onClose={undefined} />
						</SheetContent>
					</Sheet>
				</Card>
				<Card className='w-500px m-4 p-[12px] w-[300px] h-[216px]'>
					<div className='flex flex-row m-3'>
						<CircleCheck className='h-5 w-5' />
						<CardTitle className='self-center flex flex-row w-xs p-0 pl-1'>
							Setup Salary Structure
						</CardTitle>
					</div>
					<p className='text-xs w-fit'>
						Define salary components, allowances, and benefits for your
						employees.
					</p>
					<Button
						variant='outline'
						className='w-[124px] h-[46px] rounded-[10px] gap-[10px] pt-[12px] pr-[24px] pb-[12px] pl-[24px]  bg-[#DEE7F6]'>
						Start Setup
					</Button>
				</Card>
				<Card className='w-500px m-4 p-[12px] w-[300px] h-[216px]'>
					<div className='flex flex-row m-3'>
						<CircleCheck className='h-5 w-5' />
						<CardTitle className='self-center flex flex-row w-xs p-0 pl-1 '>
							Configure Statutory Deductions
						</CardTitle>
					</div>
					<p className='text-xs w-fit'>
						Configure tax settings, social security and mandatory deductions.
					</p>
					<Button
						variant='outline'
						className='w-[124px] h-[46px] rounded-[10px] gap-[10px] pt-[12px] pr-[24px] pb-[12px] pl-[24px] bg-[#DEE7F6]'>
						Start Setup
					</Button>
				</Card>
				<Card className='w-500px m-4 p-[12px] w-[300px] h-[216px]'>
					<div className='flex flex-row m-3'>
						<CircleCheck className='h-5 w-5' />
						<CardTitle className='self-center flex flex-row w-xs p-0 pl-1'>
							Run First Payroll
						</CardTitle>
					</div>
					<p className='text-xs w-fit'>
						Process your first payroll and generate payment slips for your
						employees.
					</p>
					<Button
						variant='outline'
						className='w-[124px] h-[46px] rounded-[10px] gap-[10px] pt-[12px] pr-[24px] pb-[12px] pl-[24px] bg-[#DEE7F6]'>
						Start Setup
					</Button>
				</Card>
			</div>
		</div>
	);
};

export default page;
