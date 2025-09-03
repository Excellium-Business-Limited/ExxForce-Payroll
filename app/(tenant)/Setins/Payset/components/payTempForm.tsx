interface PayScheduleData {
	name: string;
	pay_period: string;
	start_day: number;
	payment_rule: string;
	payment_day: number;
	week_start_day: number;
	is_active: boolean;
}


 const PayTempForm = ({
		initialData,
		onSubmit,
		onCancel,
		isEditing = false,
 }: {
		initialData?: Partial<PayScheduleData>;
		onSubmit: (data: PayScheduleData) => void;
		onCancel: () => void;
		isEditing?: boolean;
 }) => {
		const [payScheduleData, setPayScheduleData] = useState<PayScheduleData>({
			name: initialData?.name || '',
			pay_period: initialData?.pay_period || 'Monthly',
			start_day: initialData?.start_day || 1,
			payment_rule: initialData?.payment_rule || 'LAST_DAY',
			payment_day: initialData?.payment_day || 0,
			week_start_day: initialData?.week_start_day || 1,
			is_active: initialData?.is_active || false,
		});

		const handleInputChange = (
			field: string,
			value: string | number | boolean
		) => {
			setPayScheduleData((prev) => ({
				...prev,
				[field]: value,
			}));
		};

		const handleSubmit = () => {
			onSubmit(payScheduleData);
		};

		return (
			<div className='p-6 max-w-2xl mx-auto bg-white'>
				<h1 className='text-2xl font-semibold mb-6'>
					{isEditing ? 'Edit Pay Schedule' : 'Create Pay Schedule'}
				</h1>

				<div className='space-y-6'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div>
							<Label htmlFor='name'>Schedule Name</Label>
							<Input
								id='name'
								type='text'
								value={payScheduleData.name}
								onChange={(e) => handleInputChange('name', e.target.value)}
								placeholder='e.g., Monthly Payroll'
								required
							/>
						</div>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div>
							<Label htmlFor='pay_period'>Pay Period</Label>
							<select
								id='pay_period'
								value={payScheduleData.pay_period}
								onChange={(e) =>
									handleInputChange('pay_period', e.target.value)
								}
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'>
								<option value='Monthly'>Monthly</option>
								<option value='Weekly'>Weekly</option>
								<option value='Bi-Weekly'>Bi-Weekly</option>
							</select>
						</div>

						<div>
							<Label htmlFor='payment_rule'>Payment Rule</Label>
							<select
								id='payment_rule'
								value={payScheduleData.payment_rule}
								onChange={(e) =>
									handleInputChange('payment_rule', e.target.value)
								}
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'>
								<option value='LAST_DAY'>Last Day of Period</option>
								<option value='FIXED_DAY'>Fixed Day</option>
							</select>
						</div>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
						<div>
							<Label htmlFor='start_day'>Start Day</Label>
							<Input
								id='start_day'
								type='number'
								min='1'
								max='31'
								value={payScheduleData.start_day}
								onChange={(e) =>
									handleInputChange('start_day', parseInt(e.target.value) || 1)
								}
							/>
						</div>

						<div>
							<Label htmlFor='payment_day'>Payment Day</Label>
							<Input
								id='payment_day'
								type='number'
								min='0'
								max='31'
								value={payScheduleData.payment_day}
								onChange={(e) =>
									handleInputChange(
										'payment_day',
										parseInt(e.target.value) || 0
									)
								}
								disabled={payScheduleData.payment_rule === 'LAST_DAY'}
							/>
						</div>

						<div>
							<Label htmlFor='week_start_day'>Week Start Day</Label>
							<select
								id='week_start_day'
								value={payScheduleData.week_start_day}
								onChange={(e) =>
									handleInputChange('week_start_day', parseInt(e.target.value))
								}
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'>
								<option value={1}>Monday</option>
								<option value={2}>Tuesday</option>
								<option value={3}>Wednesday</option>
								<option value={4}>Thursday</option>
								<option value={5}>Friday</option>
								<option value={6}>Saturday</option>
								<option value={0}>Sunday</option>
							</select>
						</div>
					</div>

					<div className='flex items-center gap-2'>
						<Checkbox
							id='is_active'
							checked={payScheduleData.is_active}
							onCheckedChange={(checked) =>
								handleInputChange('is_active', checked as boolean)
							}
						/>
						<Label htmlFor='is_active'>Active Schedule</Label>
					</div>

					<div className='flex gap-3 pt-4'>
						<Button
							onClick={handleSubmit}
							className='bg-blue-600 text-white hover:bg-blue-700'>
							{isEditing ? 'Update Schedule' : 'Save Schedule'}
						</Button>
						<Button
							variant='outline'
							onClick={onCancel}>
							Cancel
						</Button>
					</div>
				</div>
			</div>
		);
 };


import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react'
interface PayScheduleData {
	name: string;
	pay_period: string;
	start_day: number;
	payment_rule: string;
	payment_day: number;
	week_start_day: number;
	is_active: boolean;
}


const payTempForm = () => {
    function setShowForm(arg0: boolean) {
        throw new Error('Function not implemented.');
    }

    function handleSubmit(e:any): void {
        throw new Error('Function not implemented.');
    }

    function handleInputChange(p0: string, value: string) {
        throw new Error('Function not implemented.');
    }

    const [payScheduleData, setPayScheduleData] = useState<PayScheduleData>({
        name:'',
        pay_period: '',
        start_day: 0,
        payment_rule: '',
        payment_day: 0,
        week_start_day: 0,
        is_active: false,
        
    })

  return (
		<div className='p-6 max-w-2xl mx-auto'>
			<h1 className='text-2xl font-semibold mb-6'>Create Pay Schedule</h1>

			<div className='space-y-6'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div>
						<Label htmlFor='name'>Schedule Name</Label>
						<Input
							id='name'
							type='text'
							value={payScheduleData.name}
							onChange={(e) => handleInputChange('name', e.target.value)}
							placeholder='e.g., Monthly Payroll'
						/>
					</div>

					{/* <div>
						<Label htmlFor='test'>Test Field</Label>
						<Input
							id='test'
							type='text'
							value={payScheduleData.test}
							onChange={(e) => handleInputChange('test', e.target.value)}
							placeholder='Test value'
						/>
					</div> */}
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div>
						<Label htmlFor='pay_period'>Pay Period</Label>
						<select
							id='pay_period'
							value={payScheduleData.pay_period}
							onChange={(e) => handleInputChange('pay_period', e.target.value)}
							className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'>
							<option value="opt1">Opt1</option>
						</select>
					</div>

					<div>
						<Label htmlFor='payment_rule'>Payment Rule</Label>
						<select
							id='payment_rule'
							value={payScheduleData.payment_rule}
							onChange={(e) =>
								handleInputChange('payment_rule', e.target.value)
							}
							className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'>
							<option value="opt1">Opt1</option>
						</select>
					</div>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
					<div>
						<Label htmlFor='start_day'>Start Day</Label>
						<Input
							id='start_day'
							type='number'
							min='1'
							max='31'
							value={payScheduleData.start_day}
							// onChange={(e) =>
							// 	handleInputChange('start_day', )
							// }
						/>
					</div>

					<div>
						<Label htmlFor='payment_day'>Payment Day</Label>
						<Input
							id='payment_day'
							type='number'
							min='0'
							max='31'
							value={payScheduleData.payment_day}
							// onChange={(e) =>
							// 	handleInputChange('payment_day', parseInt(e.target.value) || 0)
							// }
							disabled={payScheduleData.payment_rule === 'LAST_DAY'}
						/>
					</div>

					<div>
						<Label htmlFor='week_start_day'>Week Start Day</Label>
						<select
							id='week_start_day'
							value={payScheduleData.week_start_day}
							// onChange={(e) =>
							// 	handleInputChange('week_start_day', parseInt(e.target.value))
							// }
							className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'>
							<option value="opt1">opt1</option>
						</select>
					</div>
				</div>

				<div className='flex items-center gap-2'>
					<Checkbox
						id='is_active'
						// checked={}
						// onCheckedChange={(checked) =>
						// 	handleInputChange('is_active', checked as boolean)
						// }
					/>
					<Label htmlFor='is_active'>Active Schedule</Label>
				</div>

				<div className='flex gap-3 pt-4'>
					<Button
						onClick={handleSubmit}
						className='bg-blue-600 text-white hover:bg-blue-700'>
						Save Schedule
					</Button>
					<Button
						variant='outline'
						onClick={() => setShowForm(false)}>
						Cancel
					</Button>
				</div>
			</div>
		</div>
	);
}

export default payTempForm
