'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, Edit, Info, Plus, Trash2 } from 'lucide-react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Dialogs from '@/app/(tenant)/components/dialog';
import HolidayForm from '@/app/(tenant)/components/HolidayForm';

interface Holiday {
	id: string;
	name: string;
	date: string;
	type: string;
	recurring: string;
}

const WorkSchedule = () => {
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [customPayDate, setCustomPayDate] = useState<Date | null>(null);
	const [workDays, setWorkDays] = useState<string[]>([
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
	]);
	const [useLastDay, setUseLastDay] = useState(true);
	const [useCustomDate, setUseCustomDate] = useState(false);
	const [excludeHolidays, setExcludeHolidays] = useState(true);
	const [showHolidayForm, setShowHolidayForm] = useState(false);

	const [holidays, setHolidays] = useState<Holiday[]>([
		{
			id: '1',
			name: 'New Year',
			date: '2024-01-01',
			type: 'Public',
			recurring: 'Yearly',
		},
		{
			id: '2',
			name: 'Independence Day',
			date: '2024-07-04',
			type: 'Public',
			recurring: 'Yearly',
		},
		{
			id: '3',
			name: 'Christmas',
			date: '2024-12-25',
			type: 'Public',
			recurring: 'Yearly',
		},
	]);

	const handleSave = () => {
		// Handle save logic here
		console.log('Saving work schedule...');
	};

	const handleCancel = () => {
		// Handle cancel logic here
		console.log('Cancelling changes...');
	};

	const handleDeleteHoliday = (id: string) => {
		setHolidays((prev) => prev.filter((holiday) => holiday.id !== id));
	};

	return (
		<div className='p-6 max-w-6xl mx-auto'>
			<div className='mb-6'>
				<h1 className='text-2xl font-semibold mb-2'>Work Schedule</h1>
				<p className='text-gray-600'>
					Set the standard working days for your organization. This schedule
					will be used to calculate payroll and proration unless overridden for
					individual employees.
				</p>
			</div>

			<Alert className='mb-6 bg-orange-50 border-orange-200'>
				<Info className='h-4 w-4 text-orange-600' />
				<AlertDescription className='text-orange-800'>
					<strong>Note:</strong> Changes to work schedule will affect payroll
					calculations for all employees using the standard schedule.
				</AlertDescription>
			</Alert>

			<Card className='mb-6'>
				<CardContent className='p-6'>
					<div className='space-y-6'>
						{/* Work Week Selection */}
						<div>
							<Label className='text-base font-medium mb-3 block'>
								Select Work Week Days
							</Label>
							<ToggleGroup
								type='multiple'
								size='sm'
								variant='outline'
								value={workDays}
								onValueChange={setWorkDays}
								className='flex flex-wrap gap-2'>
								{[
									'Sunday',
									'Monday',
									'Tuesday',
									'Wednesday',
									'Thursday',
									'Friday',
									'Saturday',
								].map((day) => (
									<ToggleGroupItem
										key={day}
										value={day}
										className='flex items-center gap-2 px-4 py-2 text-sm'>
										{workDays.includes(day) && <Check className='w-3 h-3' />}
										{day}
									</ToggleGroupItem>
								))}
							</ToggleGroup>
						</div>

						{/* Payroll Settings */}
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div>
								<Label
									htmlFor='start-date'
									className='text-base font-medium mb-3 block'>
									Payroll Start Date
								</Label>
								<DatePicker
									id='start-date'
									selected={selectedDate}
									onChange={(date) => setSelectedDate(date)}
									className='w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none'
									placeholderText='Select start date'
								/>
							</div>

							<div>
								<Label className='text-base font-medium mb-3 block'>
									Pay Employees On
								</Label>
								<div className='space-y-3'>
									<div className='flex items-center space-x-3'>
										<Checkbox
											id='last-day'
											checked={useLastDay}
											onCheckedChange={(checked) => {
												setUseLastDay(!!checked);
												if (checked) setUseCustomDate(false);
											}}
										/>
										<Label
											htmlFor='last-day'
											className='text-sm'>
											Last Day of the Month
										</Label>
									</div>
									<div className='flex items-center space-x-3'>
										<Checkbox
											id='custom-date'
											checked={useCustomDate}
											onCheckedChange={(checked) => {
												setUseCustomDate(!!checked);
												if (checked) setUseLastDay(false);
											}}
										/>
										<Label
											htmlFor='custom-date'
											className='text-sm flex items-center gap-2'>
											Custom Date
											{useCustomDate && (
												<DatePicker
													selected={customPayDate}
													onChange={(date) => setCustomPayDate(date)}
													className='w-24 border border-gray-300 rounded px-2 py-1 text-sm'
													placeholderText='DD'
													dateFormat='dd'
												/>
											)}
										</Label>
									</div>
								</div>
							</div>
						</div>

						{/* Holiday Inclusion Rule */}
						<Card className='border'>
							<div className='bg-gray-50 px-4 py-3 border-b'>
								<CardTitle className='text-base'>
									Holiday Inclusion Rule
								</CardTitle>
							</div>
							<CardContent className='p-4'>
								<div className='flex items-center justify-between'>
									<Label
										htmlFor='exclude-holidays'
										className='text-sm'>
										Exclude public holidays from working day calculation
									</Label>
									<Switch
										id='exclude-holidays'
										checked={excludeHolidays}
										onCheckedChange={setExcludeHolidays}
									/>
								</div>
							</CardContent>
						</Card>
					</div>
				</CardContent>
			</Card>

			{/* Holiday Management */}
			<Card>
				<CardContent className='p-6'>
					<div className='flex justify-between items-center mb-4'>
						<h2 className='text-xl font-semibold'>Holiday Management</h2>
						<Dialog
							open={showHolidayForm}
							onOpenChange={setShowHolidayForm}>
							<DialogTrigger asChild>
								<Button className='flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700'>
									<Plus className='h-4 w-4' />
									Add Holiday
								</Button>
							</DialogTrigger>
							<DialogContent className='bg-white max-w-2xl'>
								<DialogTitle>Add Holiday</DialogTitle>
								<HolidayForm />
							</DialogContent>
						</Dialog>
					</div>

					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Holiday Name
								</TableHead>
								<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Date
								</TableHead>
								<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Type
								</TableHead>
								<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Recurring
								</TableHead>
								<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{holidays.map((holiday) => (
								<TableRow
									key={holiday.id}
									className='hover:bg-gray-50'>
									<TableCell className='px-6 py-4 font-medium'>
										{holiday.name}
									</TableCell>
									<TableCell className='px-6 py-4'>
										{new Date(holiday.date).toLocaleDateString()}
									</TableCell>
									<TableCell className='px-6 py-4'>
										<span className='px-2 py-1 rounded text-sm bg-blue-100 text-blue-800'>
											{holiday.type}
										</span>
									</TableCell>
									<TableCell className='px-6 py-4'>
										{holiday.recurring}
									</TableCell>
									<TableCell className='px-6 py-4'>
										<div className='flex items-center gap-2'>
											<Button
												variant='outline'
												size='sm'
												className='flex items-center gap-1'>
												<Edit className='h-3 w-3' />
												Edit
											</Button>
											<Button
												variant='outline'
												size='sm'
												onClick={() => handleDeleteHoliday(holiday.id)}
												className='flex items-center gap-1 text-red-600 hover:text-red-800'>
												<Trash2 className='h-3 w-3' />
												Delete
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{/* Action Buttons */}
			<div className='flex justify-end gap-3 mt-6'>
				<Button
					onClick={handleCancel}
					variant='outline'
					className='px-6 py-2'>
					Cancel
				</Button>
				<Button
					onClick={handleSave}
					className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2'>
					Save Changes
				</Button>
			</div>
		</div>
	);
};

export default WorkSchedule;
