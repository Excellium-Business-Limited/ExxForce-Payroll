import React from 'react';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { useGlobal } from '@/app/Context/page';
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
		const { name, type, value, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]:
				type === 'checkbox'
					? checked
					: type === 'number'
					? Number(value)
					: value,
		}));
	};

	const handleSubmit = async () => {
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
			router.push(`/${tenant}/payroll_settings/salary_components`);
		} catch (err: any) {
			console.error(err);
			setError(
				err.response?.data?.detail || 'Failed to create salary component'
			);
		}
	};
	return <div></div>;
};

export default AddSs;
