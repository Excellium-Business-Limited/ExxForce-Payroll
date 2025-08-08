import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './page.module.css';

interface SalaryComponentDetail {
	component_name: string;
	fixed_value?: number;
	percentage_value?: number;
}

interface DeductionDetail {
	deduction_name: string;
	percentage_value: number;
}

export default function EditPayGradePage() {
	const pathname = usePathname();
	const router = useRouter();
	const segments = pathname.split('/');
	const tenant = segments[1];
	const payGradeName = decodeURIComponent(segments[segments.length - 2]);

	const [name, setName] = useState('');
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
						`http://${tenant}.localhost:8000/tenant/payroll-settings/pay-grades/${encodeURIComponent(
							payGradeName
						)}/detail`,
						{
							headers: { Authorization: `Bearer ${token}` },
						}
					),
				]);

				setAvailableSalaryComponents(salaryRes.data);
				setAvailableDeductionComponents(deductionRes.data);

				const pg = payGradeRes.data;
				setName(pg.paygrade_name);
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
	}, [tenant, payGradeName]);

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
				`http://${tenant}.localhost:8000/tenant/payroll-settings/pay-grades/${encodeURIComponent(
					payGradeName
				)}/update`,
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
			router.push(`/${tenant}/payroll_settings/pay_grades`);
		} catch (err: any) {
			console.error(err);
			setError(err.response?.data?.detail || 'Failed to update pay grade');
		}
	};

	return (
		<main className={styles.container}>
			<h1 className={styles.header}>Edit Pay Grade</h1>
			{error && <p className={styles.error}>{error}</p>}

			<div className={styles.section}>
				<div className={styles.formGroup}>
					<label className={styles.label}>Name</label>
					<input
						className={styles.input}
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>

				<div className={styles.formGroup}>
					<label className={styles.label}>Gross Salary</label>
					<input
						className={styles.input}
						type='number'
						value={grossSalary}
						onChange={(e) => setGrossSalary(Number(e.target.value))}
						required
					/>
				</div>
			</div>

			<div className={styles.section}>
				<h2 className={styles.sectionTitle}>Salary Component Details</h2>
				<button
					type='button'
					className={styles.addButton}
					onClick={addSalaryDetail}>
					+ Add Salary Component
				</button>
				{salaryDetails.map((d, i) => (
					<div
						key={i}
						className={styles.componentRow}>
						<select
							className={styles.input}
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
							className={styles.input}
							placeholder='Fixed Value'
							type='number'
							value={d.fixed_value ?? ''}
							onChange={(e) =>
								handleSalaryChange(i, 'fixed_value', e.target.value)
							}
						/>
						<span className={styles.orText}>or</span>
						<input
							className={styles.input}
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

			<div className={styles.section}>
				<h2 className={styles.sectionTitle}>Deduction Details</h2>
				<button
					type='button'
					className={styles.addButton}
					onClick={addDeductionDetail}>
					+ Add Deduction
				</button>
				{deductionDetails.map((d, i) => (
					<div
						key={i}
						className={styles.componentRow}>
						<select
							className={styles.input}
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
							className={styles.input}
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

			<button
				className={styles.submitButton}
				onClick={handleSubmit}>
				Update Pay Grade
			</button>
		</main>
	);
}
