import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import DatePicker from '../../components/datepicker';
import React, { use, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	Check,
	CheckIcon,
	CircleCheck,
	CircleX,
	Edit,
	EllipsisVertical,
	Eye,
} from 'lucide-react';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import Link from 'next/link';
// import {payruns} from './payrunData'

interface payrun {
	id: number;
	PAY_PERIOD: string;
	NAME: string;
	TOTAL_EMPLOYEES: number;
	PAYMENT_DATE: string;
	START_DATE: string;
	STATUS: string;
}

interface MonthlyProps {
	payruns: payrun[];
}

const monthly = ({ payruns, nexts }: MonthlyProps & { nexts: string }) => {
	useEffect(() => {
		const tenant = localStorage.getItem('tenant');
		const accessToken = localStorage.getItem('access_token');

	},[])
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
							className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2'>
							Filter
						</Button>
					</article>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									PAY FREQUENCY
								</TableHead>
								<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Name
								</TableHead>
								<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									TOTAL EMPLOYEES
								</TableHead>
								<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									PAYMENT DATE
								</TableHead>
								<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									START DATE
								</TableHead>
								<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									STATUS
								</TableHead>
								<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									MORE
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{payruns.map((payrun) => {
								return (
									<TableRow key={payrun.id}>
										<TableCell className='px-6 py-3 text-left text-xs font-medium b tracking-wider'>{payrun.PAY_PERIOD}</TableCell>
										<TableCell className='px-6 py-3 text-left text-xs font-medium b tracking-wider'>{payrun.NAME}</TableCell>
										<TableCell className='px-6 py-3 text-left text-xs font-medium b tracking-wider'>{payrun.TOTAL_EMPLOYEES}</TableCell>
										<TableCell className='px-6 py-3 text-left text-xs font-medium b tracking-wider'>{payrun.PAYMENT_DATE}</TableCell>
										<TableCell className='px-6 py-3 text-left text-xs font-medium b tracking-wider'>{payrun.START_DATE}</TableCell>
										<TableCell className='px-6 py-3 text-left text-xs font-medium b tracking-wider'>{payrun.STATUS}</TableCell>
										<TableCell className='px-6 py-3 text-left text-xs font-medium bg-white tracking-wider'>
											<Popover>
												<PopoverTrigger>
													<EllipsisVertical />
												</PopoverTrigger>
												<PopoverContent
													className={`grid grid-cols-1  !m-0 w-fit  bg-white ${
														// payrun.STATUS === 'Approved'
														// 	? 'bg-green-100 text-green-800'
														// 	: 'bg-gray-100 text-gray-800'
														payrun.id ===1 ? 'text-black' : 'text-grey'
													}
													`}>
													{payrun.STATUS !== 'APPROVED' ? (
														<Button
															variant={'default'}
															className='flex bg-white text-black hover:bg-secondary w-fit p-0.5  justify-start'
															asChild>
															<Dialog>
																<DialogTrigger className='flex bg-white text-black hover:bg-secondary w-fit !text-sm  p-0.5 justify-start'>
																	<Check
																		size={18}
																		color='#20b49f'
																	/>{' '}
																	<p className=' font-light text-[#20b49f] text-sm '>
																		Approve Payrun
																	</p>
																</DialogTrigger>
																<DialogContent className='w-[500px] bg-white'>
																	<DialogTitle className='text-center text-lg font-semibold '>
																		Approve Payrun
																	</DialogTitle>
																	<div>
																		<p>
																			You are about to approve the payrun “
																			{`${payrun.NAME} ${payrun.PAY_PERIOD}`}
																			”. This action cannot be undone
																		</p>
																	</div>
																	<div>
																		<section className='flex justify-between my-4'>
																			<p>Pay Date:</p>
																			<p>{payrun.PAYMENT_DATE}</p>
																		</section>
																		<section className='flex justify-between my-4'>
																			<p>Total Employees</p>
																			<p>{payrun.TOTAL_EMPLOYEES}</p>
																		</section>
																		<section className='flex justify-between my-4'>
																			<p>Total Net Pay</p>
																			<p>₦147,000.00</p>
																		</section>
																	</div>
																	<div className='flex gap-3 right-0 bottom-0 self-end justify-end'>
																		<Button
																			variant={'default'}
																			className='bg-white border border-2-[#969393] text-[#969393]'
																			asChild>
																			<DialogClose className='text-[#969393] hover:text-black'>
																				Close
																			</DialogClose>
																		</Button>
																		<Button
																			variant={'default'}
																			className='bg-blue-600 text-white hover:bg-[#20b49f]'>
																			<Check className='text-white' />
																			Approve Payrun
																		</Button>
																	</div>
																</DialogContent>
															</Dialog>
														</Button>
													) : null}
													<Button
														variant={'default'}
														className='flex bg-white text-black hover:bg-secondary w-fit p-0.5  justify-start'
														asChild>
														<Link href={`./Payrun/${payrun.id}`}>
															<Eye />{' '}
															<p className=' font-light'>View Details</p>
														</Link>
													</Button>
													<Button
														variant={'default'}
														className='flex bg-white text-black hover:bg-secondary w-fit p-0.5  justify-start'>
														<Edit /> <p className='font-light'>Edit Schedule</p>
													</Button>
													<Button
														variant={'default'}
														className='flex bg-white text-black hover:bg-secondary w-fit p-0.5  justify-start'>
														<CircleX className='text-[#bf2821]' />{' '}
														<p className='font-light text-[#bf2821]'>
															Reject Payrun
														</p>
													</Button>
												</PopoverContent>
											</Popover>
										</TableCell>
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
3;

export default monthly;
