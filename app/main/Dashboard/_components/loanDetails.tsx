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

export default function LoanDetails() {
	return (
		<div className='w-full'>
			<div className=' h-[603px] w-full'>
				<div className='flex flex-row items-center justify-between w-full'>
					<span className='flex flex-row items-center'>
						<h1 className='text-muted-foreground'>Loan</h1> /{' '}
						<h1>Loan Details</h1>
					</span>
					<div className='items-center self-end justify-between flex gap-4'>
						<Dialogs>
							<UpdateRepay/>
						</Dialogs>
						<MoreHorizontalIcon className='border-2 rounded-4xl border-black h-[30px] w-[30px]' />
					</div>
				</div>
				<div className='flex justify-between gap-4 my-4'>
					<Card className='border grid-cols-1 grid-rows-3 p-4 w-1/2 mb-4 h-[256px]'>
						<div className='grid gap-9 grid-cols-2 mb-4'>
							<span>
								<h6 className='text-xs text-muted-foreground'>Full Name</h6>
								<h6>John Smith</h6>
							</span>
							<span>
								<h6 className='text-xs text-muted-foreground'>Employee ID</h6>
								<h6>EMP-1233</h6>
							</span>
						</div>
						<div className='grid gap-9 grid-cols-2 mb-4'>
							<span>
								<h6 className='text-xs text-muted-foreground'>Email Address</h6>
								<h6>johnsmith@example.com</h6>
							</span>
							<span>
								<h6 className='text-xs text-muted-foreground'>
									Monthly Salary
								</h6>
								<h6>$600,000.00</h6>
							</span>
						</div>
						<span>
							<h6 className='text-xs text-muted-foreground'>Job Position</h6>
							<h6>Software Engineer</h6>
						</span>
					</Card>
					<Card className='border w-1/2 h-[256px]'>
						<div className='px-2 flex justify-between'>
							<h6 className='text-md'>Loan Summary</h6>
							<p className='rounded-[10px] bg-[#e9eff9] w-[69px] h-[24px] text-xs p-1 border self-end'>
								Ongoing
							</p>
						</div>
						<div className='grid grid-rows-2 grid-cols-3 gap-2.5 m-2.5'>
							<span className='my-2'>
								<div className='flex'>
									<Image
										src={'/icons/solar_card-outline.png'}
										alt={''}
										width={20}
										height={20}
									/>
									<h6 className='text-xs text-muted-foreground'>Loan Amount</h6>
								</div>
								<h4>#600,000.00</h4>
							</span>
							<span className='my-2'>
								<div>
									<Image
										src={'/icons/CalendarDots.png'}
										alt={''}
										width={20}
										height={20}
									/>
									<h6 className='text-xs text-muted-foreground'>Start Date</h6>
								</div>
								<h4>May 25th 2025</h4>
							</span>
							<span className='my-2'>
								<div>
									<Image
										src={'/icons/formkit_time.png'}
										alt={''}
										width={20}
										height={20}
									/>
									<h6 className='text-xs text-muted-foreground'>Duration</h6>
								</div>
								<h4>6 Months</h4>
							</span>
							<span className='my-2'>
								<div>
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
								<h4>#60,000.00</h4>
							</span>
							<span className='my-2'>
								<div>
									<Image
										src={'/icons/Vector.png'}
										alt={''}
										width={20}
										height={20}
									/>
									<h6 className='text-xs text-muted-foreground'>End Date</h6>
								</div>
								<h4>October 29, 2025</h4>
							</span>
						</div>
					</Card>
				</div>
				<div>
					<dl className='flex justify-between w-full my-6'>
						<div className='flex'>
							<Progress
								value={(2 / 6) * 100}
								className='flex self-center w-[350px]'
							/>
							<p className='text-xs self-center ml-2'>2/6 months</p>
						</div>
						<div className='grid grid-cols-3 gap-6 justify-between divide-x-4 divide-[#E8F1FF]'>
							<span>
								<h5 className='text-muted-foreground'>Amount Paid</h5>
								<p>600,000</p>
							</span>
							<span>
								<h5 className='text-muted-foreground'>Balance Remaining</h5>
								<p>600,000</p>
							</span>
							<span>
								<h5 className='text-muted-foreground'>Next Deduction</h5>
								<p>July 2nd, 2025</p>
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
							<TableRow>
								<TableCell></TableCell>
								<TableCell></TableCell>
								<TableCell></TableCell>
								<TableCell></TableCell>
								<TableCell></TableCell>
							</TableRow>
							<TableRow>
								<TableCell></TableCell>
								<TableCell></TableCell>
								<TableCell></TableCell>
								<TableCell></TableCell>
								<TableCell></TableCell>
							</TableRow>
							<TableRow>
								<TableCell></TableCell>
								<TableCell></TableCell>
								<TableCell></TableCell>
								<TableCell></TableCell>
								<TableCell></TableCell>
							</TableRow>
							<TableRow>
								<TableCell></TableCell>
								<TableCell></TableCell>
								<TableCell></TableCell>
								<TableCell></TableCell>
								<TableCell></TableCell>
							</TableRow>
							<TableRow>
								<TableCell></TableCell>
								<TableCell></TableCell>
								<TableCell></TableCell>
								<TableCell></TableCell>
								<TableCell></TableCell>
							</TableRow>
							<TableRow>
								<TableCell></TableCell>
								<TableCell></TableCell>
								<TableCell></TableCell>
								<TableCell></TableCell>
								<TableCell></TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
}
