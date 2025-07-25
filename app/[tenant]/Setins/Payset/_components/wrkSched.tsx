'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { ArrowDown, Check } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import React from 'react';
import Dialogs from '@/app/[tenant]/components/dialog';
import HolidayForm from '@/app/[tenant]/components/HolidayForm';

const wrkSched = () => {
	const data = [
		{
			name: 'New Year',
			date: '2024-01-01',
			type: 'Public',
			recurring: 'Yearly',
		},
		{
			name: 'Independence Day',
			date: '2024-07-04',
			type: 'Public',
			recurring: 'Yearly',
		},
		{
			name: 'Christmas',
			date: '2024-12-25',
			type: 'Public',
			recurring: 'Yearly',
		},
	];
	const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
	const [currday, setCurrday] = React.useState<Date | null>(null);
	return (
		<div className='h-full'>
			<Card className='border-none h-full shadow-none'>
				<section className='flex flex-col gap-4  w-[600px]'>
					<div className='flex flex-col gap-4 m-4'>
						<h4>Work Schedule</h4>
						<p>
							Set the standard working days for your organization. This schedule
							will be used to calculate payroll and proration unless overridden
							for individual employees.
						</p>
					</div>
					<div className='flex flex-col gap-4 m-4'>
						<h4>Select work week</h4>
						<ToggleGroup
							type='multiple'
							size={'sm'}
							variant={'outline'}
							className='flex items-center gap-1  align-middle '>
							{[
								'Sunday',
								'Monday',
								'Tuesday',
								'Wednesday',
								'Thursday',
								'Friday',
								'Saturday',
							].map((day, index) => {
								return (
									<ToggleGroupItem
										value={day}
										key={index}
										className={`flex rounded-xl text-xs !px-5
											`}>
										<Check className='w-[12px] h-[12px] self-center' />
										{day}
									</ToggleGroupItem>
								);
							})}
						</ToggleGroup>
					</div>
				</section>
				<hr className=' h-[2px]' />
				<section className='ml-4'>
					<div className='flex flex-row gap-12'>
						<span>
							<Label htmlFor='start'>Payroll Start Date</Label>
							<DatePicker
								selected={selectedDate}
								onChange={(date) => setSelectedDate(date)}
								className='border-2 border-[#e5e5e5] rounded-lg h-8 mt-2'
								placeholderText=' '
							/>
						</span>
						<article className='text-xs'>
							<h3 className='text-lg'>Pay employee on</h3>
							<span className='flex my-2'>
								<Checkbox
									id='payday'
									className='w-4 h-4'
								/>
								<Label
									htmlFor='payday'
									className='ml-2'>
									Last Day of the Month
								</Label>
							</span>
							<span className='flex my-2'>
								<Checkbox
									id='custom'
									className='w-4 h-4'
								/>
								<Label
									htmlFor='custom'
									className='ml-2'>
									Custom date{' '}
									<DatePicker
										className='w-[50px] h-6 rounded border shadow border-[#e5e5e5] '
										selected={currday}
										placeholderText={`⇩`}
										onChange={(date) => setCurrday(date)}
									/>
								</Label>
							</span>
						</article>
					</div>

					<article className='w-[600px] my-3 shadow border-solid border-1 rounded-md'>
						<div className='bg-[#f3f4f5] content-center h-10 m-0 w-full'>
							<CardTitle className='ml-4'> Holiday Inclusion Rule</CardTitle>
						</div>
						<CardContent className='bg-white flex  justify-between content-center align-middle h-full p-5'>
							<Label htmlFor='switch'>
								Exclude public holidays from working day calculation
							</Label>
							<Switch
								id='switch'
								className='self-end'
							/>
						</CardContent>
					</article>
				</section>
				<section className='mx-4'>
					<Card>
						<article className='flex justify-between mx-4'>
							<h2 className='font-bold'>Holiday Management</h2>

							<Dialogs
								title={' Add Holiday'}
								sim='+'
								className='bg-[#3d56a8] text-white'>
								<HolidayForm />
							</Dialogs>
						</article>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className='text-[#3d56a8] text-lg'>
										Holiday Name
									</TableHead>
									<TableHead className='text-[#3d56a8] text-lg'>Date</TableHead>
									<TableHead className='text-[#3d56a8] text-lg'>Type</TableHead>
									<TableHead className='text-[#3d56a8] text-lg'>
										Recuring
									</TableHead>
									<TableHead className='text-[#3d56a8] text-lg'>
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data.map((holiday, index) => (
									<TableRow
										key={index}
										className='hover:bg-[#f3f4f5]'>
										<TableCell>{holiday.name}</TableCell>
										<TableCell>{holiday.date}</TableCell>
										<TableCell>{holiday.type}</TableCell>
										<TableCell>{holiday.recurring}</TableCell>
										<TableCell>
											<span className='grid-cols-2 w-14 grid'>
												<img
													src='/icons/mage_edit.png'
													alt='#'
												/>
												<img
													src='/icons/delete-icon.png'
													alt='#'
												/>
											</span>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Card>
				</section>
				<section className='flex justify-end m-4'>
					<Button className='bg-[#3b56a8] text-white px-4 py-2 rounded-md hover:bg-white hover:text-[#3b56a8] border border-[#3b56a8]'>
						Save
					</Button>
					<Button className='bg-white border hover:bg-[#3b56a8] text-[#3b56a8] px-4 py-2 rounded-md ml-2 hover:text-white'>
						Cancel
					</Button>
				</section>
			</Card>
		</div>
	);
};

export default wrkSched;
