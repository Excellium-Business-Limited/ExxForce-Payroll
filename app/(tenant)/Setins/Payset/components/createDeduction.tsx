import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { getAccessToken, getTenant } from '@/lib/auth';
import axios from 'axios';
import React, { useState } from 'react';

interface Deduction {
	name: string;
	calculation_type: string;
	value: number;
	is_tax_related: boolean;
}

const CreateDeduction = () => {
    const tenant = getTenant()
    const token = getAccessToken()
    const baseURL = `http://${tenant}.localhost:8000`
	const [formData, setFormData] = useState<Deduction>({
		name: '',
		calculation_type: '',
		value: 0,
		is_tax_related: false,
	});

	const handleInputChange = (
		field: keyof Deduction,
		value: string | number | boolean
	) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log('Form submitted:', formData);
		try{
            const res = axios.post(
							`${baseURL}/tenant/payroll-settings/deduction-components/create`,
							{
								formData,
							},
							{
								headers: { Authorization: `Bearer ${token}` },
							}
						);
                        alert('Deduction Component Successfully created')
        }catch(err:any){
            console.log(err)
        }
	};

	return (
		<div>
			<DialogTitle className='text-lg font-semibold mb-4'>Create New Deduction</DialogTitle>
			<div>
				<section className='flex flex-col justify-between align-middle p-3 m-2 w-[300px]'>
					<Label htmlFor='name'>Name</Label>
					<Input
						type='text'
						value={formData.name}
						id='name'
						onChange={(e) => handleInputChange('name', e.target.value)}
						className=''
					/>
				</section>

				<section className='flex flex-col justify-between align-middle p-3 m-2 w-[300px]'>
					<Label htmlFor='calcType'>Calculation Type</Label>
					<Select>
                        <SelectTrigger></SelectTrigger>
                        <SelectContent>
                            <SelectItem value='fixed_amount'>Fixed Amount</SelectItem>
                            <SelectItem value='percentage'>Percentage</SelectItem>
                        </SelectContent>
                    </Select>
				</section>

				<section className='flex flex-col justify-between align-middle p-3 m-2 w-[300px]'>
					<Label htmlFor='value'>Value</Label>
					<Input
						type='number'
						value={formData.value.toString()}
						id='value'
						onChange={(e) =>
							handleInputChange('value', parseFloat(e.target.value) || 0)
						}
						className=''
					/>
				</section>

				<section className='flex gap-2 p-2 m-2'>
					<Checkbox
						id='tax_related'
						checked={formData.is_tax_related}
						onCheckedChange={(checked) =>
							handleInputChange('is_tax_related', checked as boolean)
						}
					/>
					<Label htmlFor='tax_related'>Is Tax Related</Label>
				</section>
			</div>

			<div className='flex gap-2'>
				<Button
					className='m-3 text-muted-foreground'
					variant='outline'>
					Close
				</Button>
				<Button
					className='m-3 bg-blue-600 text-white'
					variant='outline'
					onClick={handleSubmit}
					type='button'>
					Save
				</Button>
			</div>
		</div>
	);
};

export default CreateDeduction;
