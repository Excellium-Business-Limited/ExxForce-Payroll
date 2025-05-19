'use client';

import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { CheckCircle2Icon, LoaderIcon } from 'lucide-react';

export type Payrun = {
	PayFrequency: string;
	CreatedBy: string;
	TotalEmployees: number;
	LastUpdated: string;
	PayPeriod: string;
	Status: 'Pending' | 'Processing' | 'Approved' | 'Declined';
};

export const columns: ColumnDef<{
	PayFrequency: string;
	CreatedBy: string;
	TotalEmployees: number;
	LastUpdated: string;
	PayPeriod: string;
	Status: string;
}>[] = [
	{
		accessorKey: 'PayFrequency',
		header: 'Pay Frequency',
		cell: ({ row }) => {
			return <div className='w-32 mr-5 self-center'>{row.original.PayFrequency}</div>;
		},
	},
	{
		accessorKey: 'CreatedBy',
		header: 'Created By',
		cell: ({row}) =>{
			return <div className='w-32 mr-5 self-center'>{row.original.CreatedBy}</div>;
		},
	},
	{
		accessorKey: 'TotalEmployees',
		header: 'Total Employees',
		cell: ({row}) =>{
			return <div className='w-24 mr-5 self-center'>{row.original.TotalEmployees}</div>;
		},
	},
	{
		accessorKey: 'LastUpdated',
		header: 'Last Updated',
		cell: ({ row }) => {
			return <div className='w-36 mr-5 self-center'>{row.original.LastUpdated}</div>;
		},
	},
	{
		accessorKey: 'PayPeriod',
		header: 'Pay Period',
		cell: ({ row }) => {
			return <div className='w-36 mr-5 items-center justify-center self-center'>{row.original.PayPeriod}</div>;
		},
	},
	{
		accessorKey: 'Status',
		header: 'Status',
		cell: ({ row }) => (
			<Badge
				variant='outline'
				className='flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3'>
				{row.original.Status === 'Approved' ? (
					<CheckCircle2Icon className='text-green-500 dark:text-green-400' />
				) : (
					<LoaderIcon />
				)}
				{row.original.Status}
			</Badge>
		),
	},
];