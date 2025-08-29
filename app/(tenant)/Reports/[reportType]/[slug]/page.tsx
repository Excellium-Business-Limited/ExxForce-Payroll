'use client';
import { getAccessToken, getTenant } from '@/lib/auth';
import axios from 'axios';
import React, { use, useEffect, useState } from 'react';
import PayrollSummaryReport from '../[slug]/_components/payrollSum';
import TaxSummaryReport from '../[slug]/_components/taxSum';

// Payroll Data interfaces
interface PayrollTotals {
	gross: number;
	deductions: number;
	net: number;
}

interface DepartmentData {
	gross: number;
	deductions: number;
	net: number;
}

interface PayrollData {
	period: string;
	payruns_count: number;
	employees_paid: number;
	totals: PayrollTotals;
	earnings_breakdown: Record<string, number>;
	deductions_breakdown: Record<string, number>;
	group_by_department: Record<string, DepartmentData>;
}

// Tax Data interfaces
interface TaxTotals {
	gross: number;
	paye: number;
}

interface DepartmentTaxData {
	gross: number;
	paye: number;
}

interface EmployeeTaxData {
	employee: string;
	department: string;
	payrun: string;
	gross: number;
	taxable_income: number;
	paye: number;
}

interface TaxSummaryData {
	period: string;
	payruns_count: number;
	employees_paid: number;
	totals: TaxTotals;
	by_department: Record<string, DepartmentTaxData>;
	employees: EmployeeTaxData[];
}

export default function ReportPage({
	params,
}: {
	params: Promise<{ reportType: string; slug: string }>;
}) {
	// ✅ Use React's 'use' hook to unwrap the promise
	const { reportType, slug } = use(params);
	const [tenant, setTenant] = useState<string | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [data, setData] = useState<PayrollData | TaxSummaryData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// Fix: Add dependency array to prevent infinite re-renders
	useEffect(() => {
		const tenantValue = getTenant();
		const tokenValue = getAccessToken();
		setTenant(tenantValue);
		setToken(tokenValue);
	}, []); // Empty dependency array - runs only once

	const fetchPayrollSummary = async () => {
		if (!tenant || !token) {
			console.log('Missing tenant or token');
			return;
		}

		const baseURL = `http://${tenant}.localhost:8000`;
		setLoading(true);
		setError(null);

		try {
			console.log(`Fetching Payroll Summary: ${reportType}`);

			const res = await axios.get(
				`${baseURL}/tenant/reports/payroll-summary/all?from_date=2025-01-01&to_date=2026-03-31`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			console.log('API response:', res.data);
			setData(res.data);
		} catch (err: any) {
			console.error('Error fetching payroll summary:', err);
			setError(err.response?.data?.message || 'Failed to fetch payroll data');
		} finally {
			setLoading(false);
		}
	};

	const fetchTaxSummary = async () => {
		if (!tenant || !token) {
			console.log('Missing tenant or token');
			return;
		}

		const baseURL = `http://${tenant}.localhost:8000`;
		setLoading(true);
		setError(null);

		try {
			console.log(`Fetching Tax Summary: ${reportType}`);

			const res = await axios.get(
				`${baseURL}/tenant/reports/tax-summary/all?from_date=2025-01-01&to_date=2026-12-31`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			console.log('API response:', res.data);
			setData(res.data);
		} catch (err: any) {
			console.error('Error fetching tax summary:', err);
			setError(err.response?.data?.message || 'Failed to fetch tax data');
		} finally {
			setLoading(false);
		}
	};

	const fetchData = () => {
		if (reportType === 'payroll-summary') {
			fetchPayrollSummary();
		} else if (reportType === 'tax-summary') {
			fetchTaxSummary();
		}
	};

	// Fix: Add proper dependencies to prevent infinite calls
	useEffect(() => {
		if (
			tenant &&
			token &&
			(reportType === 'payroll-summary' || reportType === 'tax-summary')
		) {
			fetchData();
		}
	}, [tenant, token, reportType]); // Only run when these values change

	// Handle loading state
	// if (loading) {
	// 	return (
	// 		<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
	// 			<div className='text-center'>
	// 				<div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto'></div>
	// 				<p className='mt-4 text-lg text-gray-600'>
	// 					Loading {reportType === 'payroll-summary' ? 'payroll' : 'tax'}{' '}
	// 					summary...
	// 				</p>
	// 			</div>
	// 		</div>
	// 	);
	// }

	// Handle error state
	if (error) {
		return (
			<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
				<div className='text-center'>
					<div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md'>
						<h3 className='font-bold'>Error</h3>
						<p>{error}</p>
					</div>
					<button
						onClick={() => fetchData()}
						className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
						Retry
					</button>
				</div>
			</div>
		);
	}

	// Handle payroll-summary report
	if (reportType === 'payroll-summary') {
		if (!data) {
			return (
				<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
					<p className='text-lg text-gray-600'>No payroll data available</p>
				</div>
			);
		}
		return <PayrollSummaryReport data={data as PayrollData} />;
	}

	// Handle tax-summary report
	if (reportType === 'tax-summary') {
		if (!data) {
			return (
				<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
					<p className='text-lg text-gray-600'>No tax data available</p>
				</div>
			);
		}
		return <TaxSummaryReport data={data as TaxSummaryData} />;
	}

	// Default case for other report types
	return (
		<div className='min-h-screen bg-gray-50 p-6'>
			<div className='max-w-4xl mx-auto'>
				<h1 className='text-3xl font-bold text-gray-900 mb-4'>
					Report: {reportType}
				</h1>
				<p className='text-lg text-gray-600'>Slug: {slug}</p>
				<div className='mt-8 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded'>
					<p>This report type is not yet implemented.</p>
					<p className='mt-2 text-sm'>
						Available report types: payroll-summary, tax-summary
					</p>
				</div>
			</div>
		</div>
	);
}
