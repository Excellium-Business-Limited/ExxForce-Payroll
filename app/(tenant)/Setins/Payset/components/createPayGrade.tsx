'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import { useGlobal } from '@/app/Context/page';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogTitle } from '@/components/ui/dialog';
import { getTenant } from '@/lib/auth';

interface SalaryComponentDetail {
	component_name: string;
	fixed_value?: number;
	percentage_value?: number;
}

interface DeductionDetail {
	deduction_name: string;
	percentage_value: number;
}

const createPayGrade = () => {
	const pathname = usePathname();
	const router = useRouter();
	const tenant = useGlobal();
	const [name, setName] = useState('');
	const [grossSalary, setGrossSalary] = useState<number>();
	const [salaryDetails, setSalaryDetails] = useState<SalaryComponentDetail[]>(
		[]
	);
	const [deductionDetails, setDeductionDetails] = useState<DeductionDetail[]>(
		[]
	);
	const [availableSalaryComponents, setAvailableSalaryComponents] = useState<
		any[]
	>([]);
	const [availableDeductionComponents, setAvailableDeductionComponents] =
		useState<any[]>([]);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchComponents = async () => {
			const tenant = getTenant();
			try {
				const token = localStorage.getItem('access_token');
				const [salaryRes, deductionRes] = await Promise.all([
					axios.get(
						`http://${tenant}.localhost:8000/tenant/payroll-settings/salary-components`,
						{
							headers: { Authorization: `Bearer ${token}` },
						}
					),
					axios.get(
						`http://${tenant}.localhost:8000/tenant/payroll-settings/deduction-components`,
						{
							headers: { Authorization: `Bearer ${token}` },
						}
					),
				]);
				setAvailableSalaryComponents(salaryRes.data);
				setAvailableDeductionComponents(deductionRes.data);
			} catch (err) {
				console.error('Error fetching components', err);
			}
		};

		fetchComponents();
	}, []);
	useEffect(() => {
		console.log(availableDeductionComponents);
		console.log(availableSalaryComponents);
	});
	const addSalaryDetail = () => {
		setSalaryDetails((prev) => [
			...prev,
			{
				component_name: '',
				fixed_value: undefined,
				percentage_value: undefined,
			},
		]);
	};

	const addDeductionDetail = () => {
		setDeductionDetails((prev) => [
			...prev,
			{ deduction_name: '', percentage_value: 0 },
		]);
	};

	const handleSalaryChange = (index: number, field: string, value: string) => {
		setSalaryDetails((prev) => {
			const updated = [...prev];
			if (field === 'component_name') updated[index].component_name = value;
			else if (field === 'fixed_value') {
				updated[index].fixed_value = Number(value) || undefined;
				updated[index].percentage_value = undefined;
			} else if (field === 'percentage_value') {
				updated[index].percentage_value = Number(value) || undefined;
				updated[index].fixed_value = undefined;
			}
			return updated;
		});
	};

	const handleDeductionChange = (
		index: number,
		field: string,
		value: string
	) => {
		setDeductionDetails((prev) => {
			const updated = [...prev];
			if (field === 'deduction_name') updated[index].deduction_name = value;
			else if (field === 'percentage_value')
				updated[index].percentage_value = Number(value);
			return updated;
		});
	};

	const handleSubmit = async () => {
		try {
			const token = localStorage.getItem('access_token');
			await axios.post(
				`http://${tenant}.localhost:8000/tenant/payroll-settings/pay-grades/create`,
				{
					name,
					gross_salary: grossSalary,
					component_details: salaryDetails.map((d) => ({
						component_name: d.component_name,
						fixed_value: d.fixed_value,
						percentage_value: d.percentage_value,
					})),
					deduction_details: deductionDetails.map((d) => ({
						deduction_name: d.deduction_name,
						percentage_value: d.percentage_value,
					})),
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			alert('Pay grade created successfully!');
			router.push(`/${tenant}/payroll_settings/pay_grades`);
		} catch (err: any) {
			console.error(err);
			setError(err.response?.data?.detail || 'Failed to create pay grade');
		}
	};

	return (
		<div>
			<DialogTitle className=''>Create New Pay Grade</DialogTitle>
			<p className='text-muted-foreground font-extralight'>
				Fill in the details below to create a new paygrade template
			</p>
			<form
				className='shadow-2xl border rounded-2xl p-3 items-center justify-center align-middle'
				onSubmit={handleSubmit}>
				<div className='flex space-x-1 gap-4'>
					<span className='block'>
						<Label className='text-gray-700'>Pay Grade name</Label>
						<input
							value={name}
							onChange={(e) => setName(e.target.value)}
							type='text'
							className='mt-1 block border-gray-300 rounded-md p-2 m-2 shadow-sm focus:border-blue-500 focus:ring-blue-500'
							required
						/>
					</span>
					<span className='block'>
						<Label className='text-gray-700'>Gross Salary</Label>
						<input
							type='number'
							value={grossSalary}
							onChange={(e) => setGrossSalary(Number(e.target.value))}
							className='mt-1 block border-gray-300 rounded-md p-2 m-2 shadow-sm focus:border-blue-500 focus:ring-blue-500'
							required
						/>
					</span>
				</div>
				<div>
					<fieldset>
						<legend>Salary Component Details</legend>
						<Button
							variant={'default'}
							type='button'
							onClick={addSalaryDetail}
							className=' bg-blue-600 hover:bg-blue-700 text-white'>
							+ Add Salary Component
						</Button>
						{salaryDetails.map((d, i) => (
							<div
								key={i}
								className='w-fit'>
								<select
									value={d.component_name}
									onChange={(e) =>
										handleSalaryChange(i, 'component_name', e.target.value)
									}
									className='border-2 border-gray-400 shadow-2xl rounded-lg m-2 p-2 w-[150px]'
									required>
									<option value=''>Select Salary Component</option>
									{availableSalaryComponents.map((comp) => (
										<option
											key={comp.id}
											value={comp.name}>
											{comp.name}
											{/* (
											{comp.component_type === 'E' ? 'Earning' : 'Deduction'}) */}
										</option>
									))}
								</select>
								<input
									placeholder='Fixed Value'
									type='number'
									value={d.fixed_value ?? ''}
									onChange={(e) =>
										handleSalaryChange(i, 'fixed_value', e.target.value)
									}
									className='border-2 border-gray-400 shadow-2xl rounded-lg m-2 p-2 w-[120px]'
								/>
								<span className='text-black text-sm'>or</span>
								<input
									placeholder='Percentage Value'
									type='number'
									value={d.percentage_value ?? ''}
									onChange={(e) =>
										handleSalaryChange(i, 'percentage_value', e.target.value)
									}
									className='border-2 border-gray-400 shadow-2xl rounded-lg m-2 p-2 w-[120px]'
								/>
							</div>
						))}
					</fieldset>
					<fieldset>
						<legend>Deduction Details</legend>
						<Button
                            variant={'default'}
							type='button'
							onClick={addDeductionDetail}
							className=' bg-blue-600 hover:bg-blue-700 text-white'>
							+ Add Deduction
						</Button>
						{deductionDetails.map((d, i) => (
							<div key={i}>
								<select
									value={d.deduction_name}
									onChange={(e) =>
										handleDeductionChange(i, 'deduction_name', e.target.value)
									}
									className='border-2 border-gray-400 shadow-2xl rounded-lg m-2 p-2 w-[150px]'
									>
									<option value=''>Select Deduction Component</option>
									{availableDeductionComponents.map((ded) => (
										<option
											key={ded.id}
											value={ded.name}>
											{ded.name}
										</option>
									))}
								</select>
								<input
									placeholder='Percentage Value'
									type='number'
									value={d.percentage_value}
									onChange={(e) =>
										handleDeductionChange(i, 'percentage_value', e.target.value)
									}
									className='border-2 border-gray-400 shadow-2xl rounded-lg m-2 p-2 w-[120px]'
								/>
							</div>
						))}
					</fieldset>
				</div>
				<div className='mt-4 flex justify-end'>
					<Button
						type='submit'
						variant={'outline'}
						className='bg-blue-600 text-white px-4 py-2 rounded'>
						Create
					</Button>
				</div>
			</form>
		</div>
	);
};

export default createPayGrade;
