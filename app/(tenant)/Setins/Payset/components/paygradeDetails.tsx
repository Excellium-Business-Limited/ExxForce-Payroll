'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import styles from './payGradeDetail.module.css';
import { useGlobal } from '@/app/Context/page';

interface ComponentDetail {
	component_name: string;
	fixed_value?: string;
	percentage_value?: string;
	calculation_type: string;
	is_basic: boolean;
}

interface DeductionDetail {
	deduction_name: string;
	percentage_value: string;
}

interface PayGradeDetail {
	paygrade_name: string;
	gross_salary: string;
	components: ComponentDetail[];
	deductions: DeductionDetail[];
}


function paygradeDetails( {name} : {name:string}) {
    const pathname = usePathname();
		const router = useRouter();
		const segments = pathname.split('/');
        const tenant = useGlobal()
        const pgName = decodeURIComponent(segments[4]);

				const [payGrade, setPayGrade] = useState<PayGradeDetail | null>(null);
				const [error, setError] = useState('');
				const [isLoading, setIsLoading] = useState(true);

				useEffect(() => {
					const fetchPayGrade = async () => {
						try {
							const token = localStorage.getItem('access_token');
							const res = await axios.get<PayGradeDetail>(
								`http://${tenant}.localhost:8000/tenant/payroll-settings/pay-grades${name}/detail`,
								{ headers: { Authorization: `Bearer ${token}` } }
							);
							setPayGrade(res.data);
						} catch (err: any) {
							console.error('Error loading pay grade', err);
							setError(
								err.response?.data?.detail || 'Failed to load pay grade'
							);
						} finally {
							setIsLoading(false);
						}
					};

					fetchPayGrade();
				}, [tenant, pgName]);
  return (
		<div>
			paygradeDetails
			<button
				className={``}
				onClick={() =>
					router.push(
						`/${tenant}/payroll_settings/pay_grades/${encodeURIComponent(
							payGrade?.paygrade_name || ''
						)}/edit`
					)
				}>
				Edit Pay Grade
			</button>
			<Link
				href={`/${tenant}/payroll_settings/pay_grades`}
				className={``}>
				Back to Pay Grades
			</Link>
		</div>
	);
}

export default paygradeDetails