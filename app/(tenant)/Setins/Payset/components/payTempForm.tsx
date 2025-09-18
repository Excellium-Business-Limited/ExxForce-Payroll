import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import React, { useState, useEffect } from 'react';

interface PayScheduleData {
	created_at: string;
	id: number;
	updated_at: string;
	test: string;
	name: string;
	pay_period: string;
	start_day: number;
	payment_rule: string;
	payment_day: number;
	week_start_day: number;
	is_active: boolean;
}

interface PayTempFormProps {
	initialData?: {
		name: string;
		pay_period: string;
		start_day: number;
		payment_rule: string;
		payment_day: number;
		week_start_day: number;
		is_active: boolean;
	};
	onSubmit: (data: any) => void;
		isEditing: boolean;
}

const PayTempForm: React.FC<PayTempFormProps> = ({
	initialData,
	onSubmit,
	isEditing,
}) => {
	const [formData, setFormData] = useState({
		name: '',
		pay_period: '',
		start_day: 1,
		payment_rule: '',
		payment_day: 1,
		week_start_day: 0,
		is_active: false,
	});

	// Initialize form data with initialData or defaults
	useEffect(() => {
		if (initialData) {
			setFormData(initialData);
		}
	}, [initialData]);

	const handleInputChange = (field: string, value: any) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(formData);
	};

	return (
		<div className='p-6 max-w-2xl mx-auto'>
			<h1 className='text-2xl font-semibold mb-6'>
				{isEditing ? 'Edit Pay Schedule' : 'Create Pay Schedule'}
			</h1>

			<form
				onSubmit={handleSubmit}
				className='space-y-6'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div>
						<Label
							htmlFor='name'
							className='mb-2'>
							Schedule Name
						</Label>
						<Input
							id='name'
							type='text'
							value={formData.name}
							onChange={(e) => handleInputChange('name', e.target.value)}
							placeholder='e.g., Monthly Payroll'
							required
						/>
					</div>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div>
						<Label
							htmlFor='pay_period'
							className='mb-2'>
							Pay Period
						</Label>
						<Select
							value={formData.pay_period}
							disabled>
							<SelectValue>{formData.pay_period}</SelectValue>
						</Select>
					</div>
					<div>
						<Label
							htmlFor='payment_rule'
							className='mb-2'>
							Payment Rule
						</Label>
						<Select
							value={formData.payment_rule}
							onValueChange={(value) =>
								handleInputChange('payment_rule', value)
							}>
							<SelectTrigger>
								<SelectValue placeholder={`${formData.payment_rule}`} >{formData.payment_rule}</SelectValue>
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='FIXED_DAY'>Fixed Day</SelectItem>
								<SelectItem value='LAST_WORKING_DAY'>
									Last Working Day
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
					<div>
						<Label
							htmlFor='start_day'
							className='mb-2'>
							Start Day
						</Label>
						<Input
							id='start_day'
							type='number'
							min='1'
							max='31'
							value={formData.start_day}
							onChange={(e) =>
								handleInputChange('start_day', parseInt(e.target.value) || 1)
							}
						/>
					</div>

					<div>
						<Label
							htmlFor='payment_day'
							className='mb-2'>
							Payment Day
						</Label>
						<Input
							id='payment_day'
							type='number'
							min='0'
							max='31'
							value={formData.payment_day}
							onChange={(e) =>
								handleInputChange('payment_day', parseInt(e.target.value) || 0)
							}
							disabled={formData.payment_rule === 'LAST_WORKING_DAY'}
						/>
					</div>

					<div>
						<Label
							htmlFor='week_start_day'
							className='mb-2'>
							Week Start Day
						</Label>
						<Select
							value={formData.week_start_day.toString()}
							onValueChange={(value) =>
								handleInputChange('week_start_day', parseInt(value))
							}>
							<SelectTrigger>
								<SelectValue placeholder={`${
									formData.week_start_day
								}`}/>
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='0'>Monday</SelectItem>
								<SelectItem value='1'>Tuesday</SelectItem>
								<SelectItem value='2'>Wednesday</SelectItem>
								<SelectItem value='3'>Thursday</SelectItem>
								<SelectItem value='4'>Friday</SelectItem>
								<SelectItem value='5'>Saturday</SelectItem>
								<SelectItem value='6'>Sunday</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className='flex items-center gap-2'>
					<Checkbox
						id='is_active'
						checked={formData.is_active}
						onCheckedChange={(checked) =>
							handleInputChange('is_active', checked)
						}
					/>
					<Label htmlFor='is_active' className='ml-2'>Active Schedule</Label>
				</div>

				<div className='flex gap-3 pt-4'>
					<Button
						type='submit'
						className='bg-blue-600 text-white hover:bg-blue-700'>
						{isEditing ? 'Update Schedule' : 'Save Schedule'}
					</Button>
					<DialogClose asChild>
						<Button
							type='button'
							variant='outline'>
							Cancel
						</Button>
					</DialogClose>
				</div>
			</form>
		</div>
	);
};

export default PayTempForm;
