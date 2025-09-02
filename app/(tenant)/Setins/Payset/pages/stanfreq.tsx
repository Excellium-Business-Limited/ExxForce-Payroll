'use client';
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from '@/components/ui/table';

interface StandardFrequency {
	id: string;
	name: string;
	description: string;
}

const StandardFrequencies = () => {
	const standardFrequencies: StandardFrequency[] = [
		{
			id: '1',
			name: 'Weekly',
			description: 'Payments are made once every week',
		},
		{
			id: '2',
			name: 'Bi-Weekly',
			description: 'Payments are made once every 2 weeks',
		},
		{
			id: '3',
			name: 'Monthly',
			description: 'Payments are made once every month',
		},
		{
			id: '4',
			name: 'Quarterly',
			description: 'Payments are made once every 3 months',
		},
		{
			id: '5',
			name: 'Annually',
			description: 'Payments are made once every year',
		},
	];

	return (
		<div className='p-6 max-w-6xl mx-auto'>
			<div className='mb-6'>
				<h1 className='text-2xl font-semibold mb-2'>
					Standard Pay Frequencies
				</h1>
				<p className='text-gray-600'>
					These are the predefined pay frequencies available for your
					organization.
				</p>
			</div>

			<Alert className='mb-6 bg-blue-50 border-blue-200'>
				<Info className='h-4 w-4 text-blue-600' />
				<AlertDescription className='text-blue-800'>
					<strong>Info:</strong> Standard frequencies are predefined and cannot
					be modified. Use custom frequencies if you need different pay cycles.
				</AlertDescription>
			</Alert>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Frequency Name
						</TableHead>
						<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Description
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{standardFrequencies.map((frequency) => (
						<TableRow
							key={frequency.id}
							className='hover:bg-gray-50'>
							<TableCell className='px-6 py-4 font-medium text-blue-600'>
								{frequency.name}
							</TableCell>
							<TableCell className='px-6 py-4 text-gray-600'>
								{frequency.description}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default StandardFrequencies;
