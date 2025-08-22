'use client';

import * as React from 'react';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';

function formatDate(date: Date | undefined) {
	if (!date) {
		return '';
	}

	return date.toLocaleDateString('en-US', {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
	});
}

function isValidDate(date: Date | undefined) {
	if (!date) {
		return false;
	}
	return !isNaN(date.getTime());
}

interface Calendar28Props {
	title: string;
	className?: string;
	placeholder?: string;
	cla?: string;
	place?: string;
	value?: Date;
	onChange?: (date: Date | undefined) => void;
}

export default function Calendar28({
	title,
	className,
	placeholder,
	cla,
	place,
	value: propValue,
	onChange,
}: Calendar28Props) {
	const [open, setOpen] = React.useState(false);
	const [date, setDate] = React.useState<Date | undefined>(propValue);
	const [month, setMonth] = React.useState<Date | undefined>(date);
	const [value, setValue] = React.useState(formatDate(date));

	// Sync with propValue if it changes
	React.useEffect(() => {
		if (propValue !== undefined) {
			setDate(propValue);
			setMonth(propValue);
			setValue(formatDate(propValue));
		}
	}, [propValue]);

	const handleDateChange = (newDate: Date | undefined) => {
		setDate(newDate);
		setValue(formatDate(newDate));
		setMonth(newDate);
		if (onChange) {
			onChange(newDate);
		}
	};

	return (
		<div className={`flex flex-col gap-3 ${cla}`}>
			<Label htmlFor='date' className='px-1'>
				{title}
			</Label>
			<div className='relative flex gap-2'>
				<Input
					id='date'
					value={value}
					placeholder={placeholder}
					className={`pr-10 ${place}`}
					onChange={(e) => {
						const inputDate = new Date(e.target.value);
						setValue(e.target.value);
						if (isValidDate(inputDate)) {
							handleDateChange(inputDate);
						}
					}}
					onKeyDown={(e) => {
						if (e.key === 'ArrowDown') {
							e.preventDefault();
							setOpen(true);
						}
					}}
				/>
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							id='date-picker'
							variant='ghost'
							className={`absolute top-1/2 right-2 size-6 -translate-y-1/2 ${className}`}>
							<CalendarIcon className='size-3.5' />
						</Button>
					</PopoverTrigger>
					<PopoverContent
						className='w-auto overflow-hidden p-0'
						align='end'
						alignOffset={-8}
						sideOffset={10}>
						<Calendar
							mode='single'
							selected={date}
							captionLayout='dropdown'
							month={month}
							onMonthChange={setMonth}
							onSelect={(selectedDate) => {
								handleDateChange(selectedDate);
								setOpen(false);
							}}
						/>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
}
