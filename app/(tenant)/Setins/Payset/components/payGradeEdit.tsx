import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import { useGlobal } from '@/app/Context/page';
import { DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface SalaryComponentDetail {
	component_name: string;
	fixed_value?: number;
	percentage_value?: number;
}

interface DeductionDetail {
	deduction_name: string;
	percentage_value: number;
}

export default function EditPayGradePage({
	id,
	name,
}: {
	id: number;
	name: string;
}) {
	const pathname = usePathname();
	const router = useRouter();
	const segments = pathname.split('/');
	const { tenant } = useGlobal();
	const payGradeId = id;

	const [payGradeName, setPayGradeName] = useState(name);
	const [grossSalary, setGrossSalary] = useState<number>(0);
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
		console.log(segments, tenant, payGradeId);
		const fetchData = async () => {
			try {
				const token = localStorage.getItem('access_token');

				const [salaryRes, deductionRes, payGradeRes] = await Promise.all([
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
					axios.get(
						`http://${tenant}.localhost:8000//tenant/payroll-settings/pay-grades/${name}/detail`,
						{
							headers: { Authorization: `Bearer ${token}` },
						}
					),
				]);
				console.log(salaryRes.data, deductionRes.data, payGradeRes.data);
				setAvailableSalaryComponents(salaryRes.data);
				setAvailableDeductionComponents(deductionRes.data);

				const pg = payGradeRes.data;
				setPayGradeName(pg.paygrade_name);
				setGrossSalary(Number(pg.gross_salary));
				setSalaryDetails(
					pg.components.map((c: any) => ({
						component_name: c.component_name,
						fixed_value: c.fixed_value ? Number(c.fixed_value) : undefined,
						percentage_value: c.percentage_value
							? Number(c.percentage_value)
							: undefined,
					}))
				);
				setDeductionDetails(
					pg.deductions.map((d: any) => ({
						deduction_name: d.deduction_name,
						percentage_value: d.percentage_value
							? Number(d.percentage_value)
							: 0,
					}))
				);
			} catch (err) {
				console.error('Error loading data', err);
				setError('Failed to load pay grade or components.');
			}
		};

		fetchData();
	}, [tenant, payGradeId]);

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

	const handleSubmit = async () => {
		try {
			const token = localStorage.getItem('access_token');
			await axios.put(
				`http://${tenant}.localhost:8000//tenant/payroll-settings/pay-grades/${payGradeName}/update`,
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
			alert('Pay grade updated successfully!');
			router.push(`/Setins/Payset`);
			// Optionally, close the dialog if you are using a modal/dialog component
			// For example, if you have a prop like onClose, call it here:
			// onClose?.();
			router.refresh();
		} catch (err: any) {
			console.error(err);
			setError(err.response?.data?.detail || 'Failed to update pay grade');
		}
	};

	return (
		<main className='w-[350px] self-center'>
			<h1 className='text-2xl font-medium mb-4'>Edit Pay Grade</h1>
			{error && <p className='text-red-500'>{error}</p>}

			<div className='mb-4'>
				<div className='mb-2'>
					<Label className='block text-sm font-medium text-gray-700'>
						Name
					</Label>
					<input
						className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500'
						value={payGradeName}
						onChange={(e) => setPayGradeName(e.target.value)}
						required
					/>
				</div>

				<div className='mb-2'>
					<Label className='block text-sm font-medium text-gray-700'>
						Gross Salary
					</Label>
					<input
						className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500'
						type='number'
						value={grossSalary}
						onChange={(e) => setGrossSalary(Number(e.target.value))}
					/>
				</div>

				<div className='mb-2'>
					<Label className='block text-sm font-medium text-gray-700'>
						Gross Salary
					</Label>
					<input
						className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500'
						type='number'
						value={grossSalary}
						onChange={(e) => setGrossSalary(Number(e.target.value))}
						required
					/>
				</div>
			</div>

			<div className='mb-4'>
				<h2 className='text-lg font-medium mb-2'>Salary Component Details</h2>
				<button
					type='button'
					className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
					onClick={addSalaryDetail}>
					+ Add Salary Component
				</button>
				{salaryDetails.map((d, i) => (
					<div
						key={i}
						className='flex items-center space-x-2 mb-2'>
						<select
							className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500'
							value={d.component_name}
							onChange={(e) =>
								handleSalaryChange(i, 'component_name', e.target.value)
							}
							required>
							<option value=''>Select Salary Component</option>
							{availableSalaryComponents.map((comp) => (
								<option
									key={comp.id}
									value={comp.name}>
									{comp.name}
								</option>
							))}
						</select>
						<input
							className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500'
							placeholder='Fixed Value'
							type='number'
							value={d.fixed_value ?? ''}
							onChange={(e) =>
								handleSalaryChange(i, 'fixed_value', e.target.value)
							}
						/>
						<span className='mx-2 text-gray-500'>or</span>
						<input
							className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500'
							placeholder='Percentage Value'
							type='number'
							value={d.percentage_value ?? ''}
							onChange={(e) =>
								handleSalaryChange(i, 'percentage_value', e.target.value)
							}
						/>
					</div>
				))}
			</div>

			<div className='mb-4'>
				<h2 className='text-lg font-medium mb-2'>Deduction Details</h2>
				<button
					type='button'
					className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
					onClick={addDeductionDetail}>
					+ Add Deduction
				</button>
				{deductionDetails.map((d, i) => (
					<div
						key={i}
						className='flex items-center space-x-2 mb-2'>
						<select
							className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500'
							value={d.deduction_name}
							onChange={(e) =>
								handleDeductionChange(i, 'deduction_name', e.target.value)
							}
							required>
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
							className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500'
							placeholder='Percentage Value'
							type='number'
							value={d.percentage_value}
							onChange={(e) =>
								handleDeductionChange(i, 'percentage_value', e.target.value)
							}
							required
						/>
					</div>
				))}
			</div>
			<DialogClose asChild>
				<button
					className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
					onClick={handleSubmit}>
					Update Pay Grade
				</button>
			</DialogClose>
		</main>
	);
}
