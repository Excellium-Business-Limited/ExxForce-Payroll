import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import DatePicker from '../../components/datepicker';
import React from 'react'
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import {payruns} from './payrunData'

interface payrun {
	id: number;
	PAY_FREQUENCY: string;
	CREATED_BY: string;
	TOTAL_EMPLOYEES: number;
	LAST_UPDATED: string;
	PAY_PERIOD: string;
	STATUS: string;
}

interface MonthlyProps {
	payruns: payrun[];
}


const monthly = ({ payruns, nexts }: MonthlyProps & { nexts: string }) => {
	return (
		<div>
			<Card className='w-[250px] p-4 my-4'>
				<div className='flex gap-4 '>
					<img
						src='/icons/CalendarDots.png'
						alt=''
						width={20}
						height={20}
					/>
					<h4 className='text-muted-foreground'>Next Payroll Date</h4>
				</div>
				<hr />
				<h2 className='font-bold'>{nexts}</h2>
				<p className='text-sm text-muted-foreground'>
					Scheduled next payroll run
				</p>
			</Card>

			<Card>
				<CardHeader className='flex justify-between content-center align-middle '>
					<h3>PAYRUN OVERVIEW</h3>
					<article className='self-end flex justify-evenly gap-3 text-[10px]/6 content-center align-middle items-center '>
						<span>
							<Input
								id='status'
								list='statuses'
								placeholder='Status:All'
								type='text'
							/>
							<datalist
								id='statuses'
								className='bg-white text-black shadow border rounded-lg '>
								<option value={'All'} />
								<option value={'Approved'} />
								<option value={'Pending Approval'} />
								<option value={'Scheduled'} />
							</datalist>
						</span>
						<DatePicker
							title={''}
							cla='flex !gap-0'
							className='!left-2'
							place=' placeholder:flex  placeholder:pl-[80px]'
							placeholder='Select Date'
						/>
						<Button
							variant={'secondary'}
							className='p-4 bg-[#3d56a8] text-white  w-[90px]'>
							Filter
						</Button>
					</article>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className='text-[#3d56a8] font-semibold'>
									PAY FREQUENCY
								</TableHead>
								<TableHead className='text-[#3d56a8] font-semibold'>
									CREATED BY
								</TableHead>
								<TableHead className='text-[#3d56a8] font-semibold'>
									TOTAL EMPLOYEES
								</TableHead>
								<TableHead className='text-[#3d56a8] font-semibold'>
									LAST UPDATED
								</TableHead>
								<TableHead className='text-[#3d56a8] font-semibold'>
									PAY PERIOD
								</TableHead>
								<TableHead className='text-[#3d56a8] font-semibold'>
									STATUS
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{payruns.map((payrun) => {
								return (
									<TableRow key={payrun.id}>
										<TableCell>{payrun.PAY_FREQUENCY}</TableCell>
										<TableCell>{payrun.CREATED_BY}</TableCell>
										<TableCell>{payrun.TOTAL_EMPLOYEES}</TableCell>
										<TableCell>{payrun.LAST_UPDATED}</TableCell>
										<TableCell>{payrun.PAY_PERIOD}</TableCell>
										<TableCell>{payrun.STATUS}</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
};

export default monthly
