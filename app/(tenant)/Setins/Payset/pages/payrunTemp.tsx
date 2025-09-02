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

			
		</div>
	);
};

export default PayScheduleDetails;
