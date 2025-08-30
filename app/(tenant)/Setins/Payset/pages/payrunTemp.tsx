'use client'
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface PayrollPeriod {
	month: string;
	payDate: string;
}

const PayScheduleDetails = () => {
	const paySchedule = {
		frequency: 'Every month',
		workingDays: 'Mon, Tue, Wed, Thu, Fri',
		payDay: 'Last day of every month',
		firstPayPeriod: 'January 2025',
	};

	const upcomingPayrolls: PayrollPeriod[] = [
		{
			month: 'February-2025',
			payDate: '28 Feb 2025',
		},
		{
			month: 'March-2025',
			payDate: '31 Mar 2025',
		},
	];

	const handleChangePayDay = () => {
		// Handle pay day change logic
		console.log('Change pay day clicked');
	};

	return (
		<div className='p-6 max-w-4xl mx-auto'>
			<h1 className='text-2xl font-semibold mb-6'>Pay Schedule</h1>

			<Alert className='mb-6 bg-orange-50 border-orange-200'>
				<Info className='h-4 w-4 text-orange-600' />
				<AlertDescription className='text-orange-800'>
					<strong>Note:</strong> Pay Schedule cannot be edited once you process
					the first pay run.
				</AlertDescription>
			</Alert>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
				<div className='lg:col-span-2'>
					<h2 className='text-lg font-medium mb-6'>
						This Organization's payroll runs on this schedule.
					</h2>

					<div className='space-y-6'>
						<div className='flex justify-between items-center py-3 border-b border-gray-200'>
							<span className='text-gray-600 font-medium'>Pay Frequency</span>
							<span className='text-gray-900'>{paySchedule.frequency}</span>
						</div>

						<div className='flex justify-between items-center py-3 border-b border-gray-200'>
							<span className='text-gray-600 font-medium'>Working Days</span>
							<span className='text-gray-900'>{paySchedule.workingDays}</span>
						</div>

						<div className='flex justify-between items-center py-3 border-b border-gray-200'>
							<span className='text-gray-600 font-medium'>Pay Day</span>
							<div className='flex items-center gap-2'>
								<span className='text-gray-900'>{paySchedule.payDay}</span>
								<Button
									variant='link'
									className='text-blue-600 p-0 h-auto font-normal'
									onClick={handleChangePayDay}>
									(Change)
								</Button>
							</div>
						</div>

						<div className='flex justify-between items-center py-3'>
							<span className='text-gray-600 font-medium'>
								First Pay Period
							</span>
							<span className='text-gray-900'>
								{paySchedule.firstPayPeriod}
							</span>
						</div>
					</div>
				</div>

				<div className='lg:col-span-1'>
					<h3 className='text-lg font-medium mb-4'>Upcoming Payrolls</h3>

					<div className='space-y-4'>
						{upcomingPayrolls.map((payroll, index) => (
							<div
								key={index}
								className='bg-gray-50 p-4 rounded-lg'>
								<div className='flex items-center gap-2 mb-2'>
									<div className='w-2 h-2 bg-gray-400 rounded-full'></div>
									<h4 className='font-medium text-gray-900'>{payroll.month}</h4>
								</div>
								<p className='text-sm text-gray-600 ml-4'>
									Pay Date : {payroll.payDate}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default PayScheduleDetails;
