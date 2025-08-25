import React from 'react';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { useGlobal } from '@/app/Context/page';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
const AddSs = () => {
	const pathname = usePathname();
	const router = useRouter();
	const { tenant } = useGlobal();
	const [formData, setFormData] = useState({
		name: '',
		calculation_type: 'percentage',
		value: 0,
		is_pensionable: false,
		is_taxable: false,
	});

	const [error, setError] = useState('');

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value, type } = e.target;

		// Conditionally get 'checked' property only if the input is a checkbox
		const checked =
			type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

		setFormData((prevFormData) => ({
			...prevFormData,
			// If the input type is a checkbox, use 'checked' property, otherwise use 'value'
			// For number inputs, convert the value to a number
			[name]:
				type === 'checkbox'
					? checked
					: type === 'number'
					? parseFloat(value)
					: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log(formData);
		try {
			await axios.post(
				`http://${tenant}.localhost:8000/tenant/payroll-settings/salary-components/create`,
				{
					...formData,
					is_basic: false,
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('access_token')}`,
					},
				}
			);
			alert('Salary component created successfully!');
			router.refresh();
		} catch (err: any) {
			console.error(err);
			setError(
				err.response?.data?.detail || 'Failed to create salary component'
			);
		}
	};
	return (
		<div className='min-h-screen  flex items-center justify-center p-4'>
			<div className='bg-white p-8 rounded-lg w-full max-w-md'>
				<DialogTitle>Add Salary Component</DialogTitle>
				<form
					onSubmit={handleSubmit}
					className='space-y-5'>
					{/* Name Input */}
					<div>
						<label
							htmlFor='name'
							className='block text-sm font-medium text-gray-700 mb-1'>
							Component Name
						</label>
						<input
							type='text'
							id='name'
							name='name'
							value={formData.name}
							onChange={handleChange}
							className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
							placeholder='e.g., Basic Salary, Housing Allowance'
							required
						/>
					</div>

					{/* Calculation Type Select */}
					<div>
						<label
							htmlFor='calculation_type'
							className='block text-sm font-medium text-gray-700 mb-1'>
							Calculation Type
						</label>
						<select
							id='calculation_type'
							name='calculation_type'
							value={formData.calculation_type}
							onChange={handleChange}
							className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm'>
							<option value='percentage'>Percentage</option>
							<option value='fixed'>Fixed</option>
						</select>
					</div>

					{/* Value Input (changes type based on calculation_type) */}
					<div>
						<label
							htmlFor='value'
							className='block text-sm font-medium text-gray-700 mb-1'>
							{formData.calculation_type === 'percentage'
								? 'Percentage Value (%)'
								: 'Fixed Amount'}
						</label>
						<input
							type='number'
							id='value'
							name='value'
							value={formData.value}
							onChange={handleChange}
							className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
							placeholder={
								formData.calculation_type === 'percentage'
									? 'e.g., 10 (for 10%)'
									: 'e.g., 50000'
							}
							step={formData.calculation_type === 'percentage' ? '0.01' : '1'}
							required
						/>
					</div>

					{/* Is Pensionable Checkbox */}
					<div className='flex items-center'>
						<input
							id='is_pensionable'
							name='is_pensionable'
							type='checkbox'
							checked={formData.is_pensionable}
							onChange={handleChange}
							className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
						/>
						<label
							htmlFor='is_pensionable'
							className='ml-2 block text-sm text-gray-900'>
							Is Pensionable
						</label>
					</div>

					{/* Is Taxable Checkbox */}
					<div className='flex items-center'>
						<input
							id='is_taxable'
							name='is_taxable'
							type='checkbox'
							checked={formData.is_taxable}
							onChange={handleChange}
							className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
						/>
						<label
							htmlFor='is_taxable'
							className='ml-2 block text-sm text-gray-900'>
							Is Taxable
						</label>
					</div>
					<DialogFooter>
						<div className='flex'>
							<DialogClose asChild>
								<Button
									type='button'
									variant='outline'
									className=' flex justify-center py-2 px-2 border border-transparent rounded-md shadow-sm text-sm font-medium bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 m-2'
									// onClick={() => setAdd(false)}
								>
									Cancel
								</Button>
							</DialogClose>
							<Button
								type='submit'
								className='flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 m-2'>
								Save
							</Button>
						</div>
					</DialogFooter>
				</form>
			</div>
		</div>
	);
};

export default AddSs;
