import { Card } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import React from 'react';
import payRunList from '../_components/payrunList';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { EllipsisVertical, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const page = () => {
	return (
		<div className='h-[1080px]'>
			<div className='m-4'>
				<h1>Pay Runs</h1>
				<p className='text-xs'>Create and Mange your Payruns</p>
			</div>
			<section className='flex justify-between m-2 w-[1050px]'>
				<Card className='m-1 p-3 w-[250px] h-fit'>
					<article className='flex gap-2 content-center items-center'>
						<span className='bg-[#dee7f6] rounded-4xl p-2 '>
							<img
								src='/icons/employee-group.png'
								alt=''
								width={20}
								height={20}
							/>
						</span>
						<h5>Total Employees </h5>
					</article>
					<hr />
					<span>
						<h2 className='font-bold'>50</h2>
						<p className='text-xs text-muted-foreground'>
							90% of employees are regular staff
						</p>
					</span>
				</Card>
				<Card className='m-1 p-3 w-[245px] h-fit'>
					<article className='flex gap-2 content-center items-center'>
						<span className='bg-[#d9f2ef] rounded-4xl p-2 '>
							<img
								src='/icons/money-bag (2).png'
								alt=''
								width={20}
								height={20}
							/>
						</span>
						<h5>Total Net Salary</h5>
					</article>
					<hr />
					<span>
						<h2 className='font-bold'>₦3,500,000.00</h2>
						<p className='text-xs text-muted-foreground'>
							Total payroll after deductions
						</p>
					</span>
				</Card>
				<Card className='m-1 p-3 w-[245px] h-fit'>
					<article className='flex gap-2 content-center items-center'>
						<span className='bg-[#f4e0da] rounded-4xl p-2 '>
							<img
								src='/icons/percentage.png'
								alt=''
								width={20}
								height={20}
							/>
						</span>
						<h5>Total Deduction</h5>
					</article>
					<hr />
					<span>
						<h2 className='font-bold'>₦3,500,000.00</h2>
						<p className='text-xs text-muted-foreground'>
							Deduction from all employees in this run
						</p>
					</span>
				</Card>
				<Card className='m-1 p-3 w-[245px] h-fit'>
					<article className='flex gap-2 content-center items-center'>
						<span className='bg-[#f8edd9] rounded-4xl p-2 '>
							<img
								src='/icons/money-hand.png'
								alt=''
								width={20}
								height={20}
							/>
						</span>
						<h5 className=''>Prorated Salaries</h5>
					</article>
					<hr />
					<span>
						<h2 className='font-bold'>15 Employees</h2>
						<p className='text-xs text-muted-foreground'>
							30% of employees had prorated pay
						</p>
					</span>
				</Card>
			</section>
			<section className='mx-2 mt-4'>
				<Card>
					<Table>
						<TableHeader>
							<TableRow className='text-[#3a56d8]'>
								<TableCell>EMPLOYEE NAME </TableCell>
								<TableCell>PAY GRADE</TableCell>
								<TableCell>GROSS SALARY</TableCell>
								<TableCell>DEDUCTIONS</TableCell>
								<TableCell>BENEFITS</TableCell>
								<TableCell>DAYS WORKED</TableCell>
								<TableCell>NET SALARY</TableCell>
								<TableCell>STATUS</TableCell>
								<TableCell>MORE</TableCell>
							</TableRow>
						</TableHeader>
						<TableBody>
							{payRunList.map((payrun, index) => {
								return (
									<TableRow
										key={index}
										className='text-sm font-light align-middle content-center items-center'>
										<TableCell>{payrun.EMPLOYEE_NAME}</TableCell>
										<TableCell>{payrun.PAY_GRADE}</TableCell>
										<TableCell>₦{payrun.GROSS_SALARY}.00</TableCell>
										<TableCell>₦{payrun.DEDUCTIONS}.00</TableCell>
										<TableCell>₦{payrun.BENEFITS}.00</TableCell>
										<TableCell>{payrun.DAYS_WORKED}</TableCell>
										<TableCell>₦{payrun.NET_SALARY}.00</TableCell>
										<TableCell>
											<span
												className={`${
													payrun.STATUS === 'Paid'
														? 'text-green-600  bg-[#e6f6f4] border-green-200 '
														: 'text-yellow-600 bg-[#fff0de] border-yellow-200'
												} border-2 px-3 py-1 rounded-xl text-sm font-light`}>
												{payrun.STATUS}
											</span>
										</TableCell>
										<TableCell>
											<Popover>
												<PopoverTrigger>
													<EllipsisVertical />
												</PopoverTrigger>
												<PopoverContent className='grid grid-cols-1 !p-0 !m-0 w-fit'>
													<Link href='/'>
														<Button
															variant={'default'}
															className='flex bg-white text-black hover:bg-secondary w-fit'>
															<Eye />{' '}
															<p className=' font-light'>Preview Payslips</p>
														</Button>
													</Link>
												</PopoverContent>
											</Popover>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</Card>
			</section>
		</div>
	);
};

export default page;
