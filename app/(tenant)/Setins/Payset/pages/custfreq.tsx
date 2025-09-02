'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Edit, Info, Plus, Trash2 } from 'lucide-react';
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

interface CustomFrequency {
	id: string;
	name: string;
	payCircle: string;
	startDate: string;
	taxYear: string;
}

const CustomFrequencies = () => {
	const [customFrequencies, setCustomFrequencies] = useState<CustomFrequency[]>(
		[
			{
				id: '1',
				name: 'Contract Staffs',
				payCircle: 'Every 3 Weeks',
				startDate: '01/01/2023',
				taxYear: '2023',
			},
			{
				id: '2',
				name: 'Contract Staffs',
				payCircle: 'Every 3 Weeks',
				startDate: '01/01/2023',
				taxYear: '2023',
			},
			{
				id: '3',
				name: 'Contract Staff',
				payCircle: 'Every 3 Weeks',
				startDate: '01/01/2023',
				taxYear: '2023',
			},
			{
				id: '4',
				name: 'Contract Staff',
				payCircle: 'Quarterly',
				startDate: '01/01/2023',
				taxYear: '2023',
			},
			{
				id: '5',
				name: 'Contract Staff',
				payCircle: 'Annually',
				startDate: '01/01/2023',
				taxYear: '2023',
			},
		]
	);

	const [showForm, setShowForm] = useState(false);
	const [editingFrequency, setEditingFrequency] =
		useState<CustomFrequency | null>(null);

	const handleEdit = (frequency?: CustomFrequency) => {
		if (frequency) {
			setEditingFrequency(frequency);
		} else {
			setEditingFrequency(null);
		}
		setShowForm(true);
	};

	const handleDelete = (id: string) => {
		setCustomFrequencies((prev) => prev.filter((freq) => freq.id !== id));
	};

	const handleFormSubmit = (data: any) => {
		if (editingFrequency) {
			// Update existing frequency
			setCustomFrequencies((prev) =>
				prev.map((freq) =>
					freq.id === editingFrequency.id ? { ...freq, ...data } : freq
				)
			);
		} else {
			// Create new frequency
			const newFrequency: CustomFrequency = {
				id: Date.now().toString(),
				...data,
			};
			setCustomFrequencies((prev) => [...prev, newFrequency]);
		}
		setShowForm(false);
		setEditingFrequency(null);
	};

	const handleFormCancel = () => {
		setShowForm(false);
		setEditingFrequency(null);
	};

	return (
		<div className='p-6 max-w-6xl mx-auto'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-2xl font-semibold'>Custom Frequencies</h1>
				<Button
					onClick={() => handleEdit()}
					className='flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700'>
					<Plus className='h-4 w-4' />
					Add Custom Frequency
				</Button>
			</div>

			<Alert className='mb-6 bg-blue-50 border-blue-200'>
				<Info className='h-4 w-4 text-blue-600' />
				<AlertDescription className='text-blue-800'>
					<strong>Info:</strong> Custom frequencies allow you to create unique
					pay cycles that match your organization's specific needs.
				</AlertDescription>
			</Alert>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Frequency Name
						</TableHead>
						<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Pay Circle
						</TableHead>
						<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Start Date
						</TableHead>
						<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Tax Year
						</TableHead>
						<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Actions
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{customFrequencies.map((frequency) => (
						<TableRow
							key={frequency.id}
							className='hover:bg-gray-50'>
							<TableCell className='px-6 py-4 font-medium'>
								{frequency.name}
							</TableCell>
							<TableCell className='px-6 py-4'>{frequency.payCircle}</TableCell>
							<TableCell className='px-6 py-4'>{frequency.startDate}</TableCell>
							<TableCell className='px-6 py-4'>{frequency.taxYear}</TableCell>
							<TableCell className='px-6 py-4'>
								<div className='flex items-center gap-2'>
									<Button
										variant='outline'
										size='sm'
										onClick={() => handleEdit(frequency)}
										className='flex items-center gap-1'>
										<Edit className='h-3 w-3' />
										Edit
									</Button>
									<Button
										variant='outline'
										size='sm'
										onClick={() => handleDelete(frequency.id)}
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

			{/* Form Dialog */}
			<Dialog
				open={showForm}
				onOpenChange={setShowForm}>
				<DialogContent className='max-w-2xl'>
					<DialogTitle>
						{editingFrequency
							? 'Edit Custom Frequency'
							: 'Create Custom Frequency'}
					</DialogTitle>
					{/* Add your form component here */}
					<div className='p-4'>
						<p>Custom Frequency Form would go here</p>
						<div className='flex justify-end gap-2 mt-4'>
							<Button
								variant='outline'
								onClick={handleFormCancel}>
								Cancel
							</Button>
							<Button onClick={() => handleFormSubmit({})}>
								{editingFrequency ? 'Update' : 'Create'}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default CustomFrequencies;
