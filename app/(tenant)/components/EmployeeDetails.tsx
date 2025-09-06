'use client';

import React, { useState, useEffect } from 'react';
import {
	X,
	Edit2,
	Trash2,
	Clock,
	FileText,
	DollarSign,
	Calendar,
	CreditCard,
	Upload,
} from 'lucide-react';
import { redirect, useRouter } from 'next/navigation';
import EmployeeForm from '../components/EmployeeForm'; // Import the EmployeeForm
import SalarySetupForm from '../components/SalarySetupForm'; // Import the SalarySetupForm
import SalaryComponentSetup from '../components/SalaryComponentSetup'; // Import the SalaryComponentSetup
import LeaveListDisplay from '../components/LeaveListDisplay'; // Import the LeaveListDisplay
import LeaveRequestForm from '../components/LeaveRequestForm'; // Import the LeaveRequestForm
import PayrollBreakdown from '../components/PayrollBreakdown'; // Import the PayrollBreakdown
import DocumentUploadModal from '../components/DocumentUploadModal'; // Import the DocumentUploadModal
import { useGlobal } from '@/app/Context/context';
import axios from 'axios';

interface Employee {
	id?: number;
	employee_id: string;
	first_name: string;
	last_name: string;
	email: string;
	phone_number: string;
	gender: 'MALE' | 'FEMALE';
	date_of_birth: string;
	address: string;
	employment_type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';
	start_date: string;
	tax_start_date: string;
	job_title: string;
	department_name: string;
	pay_grade_name: string;
	custom_salary: number;
	bank_name: string;
	account_number: string;
	account_name: string;
	pay_frequency: 'MONTHLY' | 'WEEKLY' | 'BIWEEKLY';
	is_paye_applicable: boolean;
	is_pension_applicable: boolean;
	is_nhf_applicable: boolean;
	is_nsitf_applicable: boolean;
}

interface PayrollComponent {
	id: string;
	name: string;
	type: 'EARNING' | 'DEDUCTION' | 'BENEFIT';
	amount: number;
	is_percentage: boolean;
	percentage_value?: number;
	is_taxable?: boolean;
	description?: string;
}

interface PayrollData {
	earnings: PayrollComponent[];
	deductions: PayrollComponent[];
	benefits: PayrollComponent[];
	gross_salary: number;
	net_salary: number;
	total_deductions: number;
	total_benefits: number;
}

interface DetailedEmployee extends Employee {
	payroll_data?: PayrollData;
}

interface LeaveRequest {
	id: string;
	leave_type: string;
	days: number;
	start_date: string;
	end_date: string;
	submitted_date: string;
	status: 'PENDING' | 'APPROVED' | 'REJECTED';
	reason: string;
}

interface Loan {
	loan_number: string;
	amount: string;
	balance: string;
	status:
		| 'ACTIVE'
		| 'COMPLETED'
		| 'PENDING'
		| 'pending'
		| 'active'
		| 'completed';
	start_date: string;
	end_date?: string;
	monthly_deduction?: string;
	interest_rate?: number;
	loan_type?: string;
}

interface EmployeeDetailsProps {
	employee: Employee;
	onClose: () => void;
	onEdit: (employee: Employee, editType?: 'general' | 'salary') => void;
	onSalaryEdit: (employee: Employee) => void; // For salary details
	onEndEmployment?: (employee: Employee) => void;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({
	employee: initialEmployee,
	onClose,
	onEdit,
	onSalaryEdit,
	onEndEmployment,
}) => {
	const router = useRouter();
	const { tenant, globalState } = useGlobal();
	const [activeTab, setActiveTab] = useState<
		'general' | 'payroll' | 'document' | 'loan' | 'leave' | 'payment-history'
	>('general');

	// Employee data state - using detailed employee data from API
	const [employee, setEmployee] = useState<DetailedEmployee>(initialEmployee);
	const [isLoadingEmployeeDetail, setIsLoadingEmployeeDetail] =
		useState<boolean>(false);

	// New state for inline editing
	const [showEmployeeForm, setShowEmployeeForm] = useState<boolean>(false);
	const [showSalaryForm, setShowSalaryForm] = useState<boolean>(false);
	const [showSalaryComponentSetup, setShowSalaryComponentSetup] =
		useState<boolean>(false);
	const [showDocumentUpload, setShowDocumentUpload] = useState<boolean>(false);
	const [editType, setEditType] = useState<'general' | 'salary'>('general');

	// Leave-related state
	const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
	const [showLeaveRequestForm, setShowLeaveRequestForm] =
		useState<boolean>(false);
	const [isLoadingLeaveRequests, setIsLoadingLeaveRequests] =
		useState<boolean>(false);

	// Loan-related state
	const [loans, setLoans] = useState<Loan[]>([]);
	const [isLoadingLoans, setIsLoadingLoans] = useState<boolean>(false);

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-NG', {
			style: 'currency',
			currency: 'NGN',
			minimumFractionDigits: 2,
		}).format(amount);
	};

	const formatDate = (dateString: string) => {
		if (!dateString || dateString === 'null' || dateString === 'undefined') {
			return '--';
		}

		try {
			const date = new Date(dateString);
			if (isNaN(date.getTime())) {
				return '--';
			}

			return date.toLocaleDateString('en-GB', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
			});
		} catch (error) {
			return '--';
		}
	};

	const getEmployeeType = (employmentType: string) => {
		switch (employmentType) {
			case 'FULL_TIME':
				return 'Full Time';
			case 'PART_TIME':
				return 'Part Time';
			case 'CONTRACT':
				return 'Contract';
			case 'INTERN':
				return 'Intern';
			default:
				return employmentType;
		}
	};

	const getPayFrequency = (frequency: string) => {
		switch (frequency) {
			case 'MONTHLY':
				return 'Monthly';
			case 'WEEKLY':
				return 'Weekly';
			case 'BIWEEKLY':
				return 'Biweekly';
			default:
				return frequency;
		}
	};

	const getLoanStatus = (status: string) => {
		const normalizedStatus = status.toLowerCase();
		switch (normalizedStatus) {
			case 'active':
				return { label: 'Active', color: 'bg-blue-100 text-blue-800' };
			case 'completed':
				return { label: 'Completed', color: 'bg-blue-100 text-blue-800' };
			case 'pending':
				return { label: 'Pending', color: 'bg-blue-100 text-blue-800' };
			default:
				return { label: status, color: 'bg-blue-100 text-blue-800' };
		}
	};

	// Check if any form is currently open
	const isAnyFormOpen =
		showEmployeeForm ||
		showSalaryForm ||
		showSalaryComponentSetup ||
		showLeaveRequestForm ||
		showDocumentUpload;

	// Handler for tab change with form validation
	const handleTabChange = (
		newTab:
			| 'general'
			| 'payroll'
			| 'document'
			| 'loan'
			| 'leave'
			| 'payment-history'
	) => {
		if (isAnyFormOpen) {
			// Show a confirmation dialog or toast notification
			alert('Please save or cancel the current form before switching tabs.');
			return;
		}
		setActiveTab(newTab);
	};

	// Fetch detailed employee information
	const fetchEmployeeDetail = async () => {
		if (!initialEmployee.employee_id || !tenant || !globalState.accessToken)
			return;

		try {
			setIsLoadingEmployeeDetail(true);
			const baseURL = `${tenant}.exxforce.com`;

			const response = await axios.get(
				`https://${baseURL}/tenant/employee/detail/${initialEmployee.employee_id}`,
				{
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${globalState.accessToken}`,
					},
				}
			);

			console.log('Detailed employee data fetched:', response.data);

			if (response.data) {
				setEmployee(response.data);
			}
		} catch (error: any) {
			console.error('Error fetching employee detail:', error);
			// if (error.response?.status === 401) {
			//           // Redirect to login if unauthorized
			//           setTimeout(() => {
			//             redirect('/login');
			//           }, 2000);
			//         }
			// Keep using the initial employee data if API call fails
			setEmployee(initialEmployee);
		} finally {
			setIsLoadingEmployeeDetail(false);
		}
	};

	// Fetch leave requests for the employee
	const fetchLeaveRequests = async () => {
		if (!initialEmployee.employee_id) return;

		try {
			setIsLoadingLeaveRequests(true);
			const response = await axios.get(
				`http://${tenant}.localhost:8000/tenant/leave/employee/${initialEmployee.employee_id}/leaves`,
				{
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${globalState.accessToken}`,
					},
				}
			);

			console.log('Leave requests fetched:', response.data);

			if (Array.isArray(response.data)) {
				setLeaveRequests(response.data);
			} else if (response.data.data && Array.isArray(response.data.data)) {
				setLeaveRequests(response.data.data);
			} else if (response.data.leaves && Array.isArray(response.data.leaves)) {
				setLeaveRequests(response.data.leaves);
			} else {
				console.warn(
					'Unexpected leave requests API response structure:',
					response.data
				);
				setLeaveRequests([]);
			}
		} catch (error) {
			console.error('Error fetching leave requests:', error);
			setLeaveRequests([]);
		} finally {
			setIsLoadingLeaveRequests(false);
		}
	};

	// Fetch loans for the employee
	const fetchLoans = async () => {
		if (!initialEmployee.employee_id) return;

		try {
			setIsLoadingLoans(true);
			const response = await axios.get(
				`http://${tenant}.localhost:8000/tenant/loans/${initialEmployee.employee_id}/loans`,
				{
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${globalState.accessToken}`,
					},
				}
			);

			console.log('Loans fetched:', response.data);

			// Handle the specific API response structure
			if (
				response.data &&
				response.data.loans &&
				Array.isArray(response.data.loans)
			) {
				setLoans(response.data.loans);
			} else if (Array.isArray(response.data)) {
				setLoans(response.data);
			} else if (response.data.data && Array.isArray(response.data.data)) {
				setLoans(response.data.data);
			} else {
				console.warn('Unexpected loans API response structure:', response.data);
				setLoans([]);
			}
		} catch (error) {
			console.error('Error fetching loans:', error);
			setLoans([]);
		} finally {
			setIsLoadingLoans(false);
		}
	};

	// Fetch detailed employee data on component mount
	useEffect(() => {
		fetchEmployeeDetail();
	}, [initialEmployee.employee_id, tenant, globalState.accessToken]);

	// Fetch leave requests when the leave tab is active
	useEffect(() => {
		if (activeTab === 'leave') {
			fetchLeaveRequests();
		}
	}, [activeTab, initialEmployee.employee_id]);

	// Fetch loans when the loan tab is active
	useEffect(() => {
		if (activeTab === 'loan') {
			fetchLoans();
		}
	}, [activeTab, initialEmployee.employee_id]);

	// Handler for Basic Details and Employment Details edit
	const handleEmployeeEdit = (e: any) => {
		e.preventDefault();
		setEditType('general');
		setShowEmployeeForm(true);
		setShowSalaryForm(false); // Close salary form if open
		setShowSalaryComponentSetup(false); // Close salary component setup if open
		setShowLeaveRequestForm(false); // Close leave request form if open
		setShowDocumentUpload(false); // Close document upload if open
	};

	// Handler for Salary & Payment Details edit
	const handleSalaryEdit = () => {
		setShowSalaryForm(true);
		setShowEmployeeForm(false); // Close employee form if open
		setShowSalaryComponentSetup(false); // Close salary component setup if open
		setShowLeaveRequestForm(false); // Close leave request form if open
		setShowDocumentUpload(false); // Close document upload if open
	};

	// Handler for Process Payroll button
	const handleProcessPayroll = () => {
		setShowSalaryComponentSetup(true);
		setShowEmployeeForm(false); // Close employee form if open
		setShowSalaryForm(false); // Close salary form if open
		setShowLeaveRequestForm(false); // Close leave request form if open
		setShowDocumentUpload(false); // Close document upload if open
	};

	// Handler for Leave Request button
	const handleRequestLeave = () => {
		setShowLeaveRequestForm(true);
		setShowEmployeeForm(false); // Close employee form if open
		setShowSalaryForm(false); // Close salary form if open
		setShowSalaryComponentSetup(false); // Close salary component setup if open
		setShowDocumentUpload(false); // Close document upload if open
	};

	// Handler for Document Upload button
	const handleUploadDocument = () => {
		setShowDocumentUpload(true);
		setShowEmployeeForm(false); // Close employee form if open
		setShowSalaryForm(false); // Close salary form if open
		setShowSalaryComponentSetup(false); // Close salary component setup if open
		setShowLeaveRequestForm(false); // Close leave request form if open
	};

	// Handler for Add Loan button
	const handleAddLoan = () => {
		router.push('/loans');
	};

	// Handler for closing the inline forms
	const handleCloseEmployeeForm = () => {
		setShowEmployeeForm(false);
	};

	const handleCloseSalaryForm = () => {
		setShowSalaryForm(false);
	};

	const handleCloseSalaryComponentSetup = () => {
		setShowSalaryComponentSetup(false);
	};

	const handleCloseLeaveRequestForm = () => {
		setShowLeaveRequestForm(false);
	};

	const handleCloseDocumentUpload = () => {
		setShowDocumentUpload(false);
	};

	// Handler for form submission
	const handleEmployeeSubmit = async (employeeFormData: any) => {
		try {
			console.log('Updating employee:', employeeFormData);
			// Call the parent's onEdit handler to update the employee
			onEdit(employee, editType);
			// Refresh employee detail after update
			await fetchEmployeeDetail();
			// Close the form after successful submission
			setShowEmployeeForm(false);
		} catch (error) {
			console.error('Error submitting employee:', error);
		}
	};

	// Handler for salary form submission
	const handleSalarySubmit = async (salaryFormData: any) => {
		try {
			console.log('Updating salary:', salaryFormData);
			// Call the parent's onEdit handler to update the salary
			onEdit(employee, 'salary');
			// Refresh employee detail after update
			await fetchEmployeeDetail();
			// Close the form after successful submission
			setShowSalaryForm(false);
		} catch (error) {
			console.error('Error submitting salary:', error);
		}
	};

	// Handler for salary component setup submission
	const handleSalaryComponentSubmit = async (salaryComponentData: any) => {
		try {
			console.log('Updating salary component:', salaryComponentData);
			// Handle salary component setup submission
			setShowSalaryComponentSetup(false);
			// Refresh employee detail after component setup
			await fetchEmployeeDetail();
		} catch (error) {
			console.error('Error submitting salary component:', error);
		}
	};

	// Handler for leave request submission
	const handleLeaveRequestSubmit = async (leaveRequestData: any) => {
		try {
			console.log('Leave request submitted:', leaveRequestData);
			// Refresh the leave requests list
			await fetchLeaveRequests();
			// Close the form after successful submission
			setShowLeaveRequestForm(false);
		} catch (error) {
			console.error('Error submitting leave request:', error);
		}
	};

	// Handler for document upload submission
	const handleDocumentUploadSubmit = async (documentData: any) => {
		try {
			console.log('Document uploaded:', documentData);
			// Handle document upload logic here
			// You might want to call an API to save the document
			// Close the form after successful submission
			setShowDocumentUpload(false);
		} catch (error) {
			console.error('Error uploading document:', error);
		}
	};

	// Handler for payslip generation
	const handleGeneratePayslip = () => {
		console.log('Generate payslip for employee:', employee.employee_id);
		// You can implement payslip generation logic here
		// For example, open a new window or download a PDF
	};

	const tabs = [
		{ id: 'general', label: 'General' },
		{ id: 'payroll', label: 'Payroll' },
		{ id: 'document', label: 'Document' },
		{ id: 'loan', label: 'Loan' },
		{ id: 'leave', label: 'Leave' },
		{ id: 'payment-history', label: 'Payment History' },
	];

	const DetailField: React.FC<{
		label: string;
		value: string | number;
		fullWidth?: boolean;
	}> = ({ label, value, fullWidth = false }) => (
		<div className={fullWidth ? 'col-span-3' : ''}>
			<dt className='text-sm font-medium text-gray-500'>{label}</dt>
			<dd className='mt-1 text-sm text-gray-900'>{value || '--'}</dd>
		</div>
	);

	// Enhanced Payroll Component Display
	const PayrollComponentCard: React.FC<{
		title: string;
		components: PayrollComponent[];
		type: 'earnings' | 'deductions' | 'benefits';
		total?: number;
	}> = ({ title, components, type, total }) => {
		const getIconColor = () => {
			switch (type) {
				case 'earnings':
					return 'text-green-600 bg-green-100';
				case 'deductions':
					return 'text-red-600 bg-red-100';
				case 'benefits':
					return 'text-blue-600 bg-blue-100';
				default:
					return 'text-gray-600 bg-gray-100';
			}
		};

		const getIcon = () => {
			switch (type) {
				case 'earnings':
					return (
						<svg
							className='w-5 h-5'
							viewBox='0 0 24 24'
							fill='none'>
							<path
								d='M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z'
								fill='currentColor'
							/>
						</svg>
					);
				case 'deductions':
					return (
						<svg
							className='w-5 h-5'
							viewBox='0 0 24 24'
							fill='none'>
							<path
								d='M12 2L13.09 8.26L20 9L14 14L16.18 22L12 18.27L7.82 22L10 14L4 9L10.91 8.26L12 2Z'
								stroke='currentColor'
								strokeWidth='2'
								fill='none'
							/>
						</svg>
					);
				case 'benefits':
					return (
						<svg
							className='w-5 h-5'
							viewBox='0 0 24 24'
							fill='none'>
							<path
								d='M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z'
								stroke='currentColor'
								strokeWidth='2'
								fill='none'
							/>
						</svg>
					);
				default:
					return <DollarSign className='w-5 h-5' />;
			}
		};

		return (
			<div className='bg-white rounded-lg border border-gray-200 p-6'>
				<div className='flex items-center justify-between mb-4'>
					<div className='flex items-center gap-3'>
						<div
							className={`w-10 h-10 rounded-lg flex items-center justify-center ${getIconColor()}`}>
							{getIcon()}
						</div>
						<div>
							<h4 className='text-lg font-semibold text-gray-900'>{title}</h4>
							{total !== undefined && (
								<p className='text-sm text-gray-600'>
									Total: {formatCurrency(total)}
								</p>
							)}
						</div>
					</div>
					{components.length > 0 && (
						<span className='bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full'>
							{components.length} item{components.length !== 1 ? 's' : ''}
						</span>
					)}
				</div>

				{components.length === 0 ? (
					<div className='text-center py-8 text-gray-500'>
						<div className='mb-2'>No {type} configured</div>
						<p className='text-sm'>
							Add {type} components to calculate payroll
						</p>
					</div>
				) : (
					<div className='space-y-3'>
						{components.map((component, index) => (
							<div
								key={component.id || index}
								className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
								<div className='flex-1'>
									<div className='flex items-center justify-between'>
										<span className='font-medium text-gray-900'>
											{component.name}
										</span>
										<span className='font-semibold text-gray-900'>
											{component.is_percentage && component.percentage_value
												? `${component.percentage_value}%`
												: formatCurrency(component.amount)}
										</span>
									</div>
									{component.description && (
										<p className='text-sm text-gray-600 mt-1'>
											{component.description}
										</p>
									)}
									<div className='flex items-center gap-4 mt-2'>
										<span
											className={`text-xs px-2 py-1 rounded-full ${
												component.type === 'EARNING'
													? 'bg-green-100 text-green-800'
													: component.type === 'DEDUCTION'
													? 'bg-red-100 text-red-800'
													: 'bg-blue-100 text-blue-800'
											}`}>
											{component.type}
										</span>
										{component.is_taxable !== undefined && (
											<span
												className={`text-xs px-2 py-1 rounded-full ${
													component.is_taxable
														? 'bg-yellow-100 text-yellow-800'
														: 'bg-gray-100 text-gray-600'
												}`}>
												{component.is_taxable ? 'Taxable' : 'Non-taxable'}
											</span>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		);
	};

	// Enhanced Payroll Display Component
	const PayrollDisplay: React.FC = () => {
		const payrollData = employee.payroll_data;

		if (!payrollData) {
			return <PayrollEmptyState />;
		}

		const hasAnyComponents =
			(payrollData.earnings && payrollData.earnings.length > 0) ||
			(payrollData.deductions && payrollData.deductions.length > 0) ||
			(payrollData.benefits && payrollData.benefits.length > 0);

		if (!hasAnyComponents) {
			return <PayrollEmptyState />;
		}

		return (
			<div className='space-y-6'>
				{/* Payroll Summary */}
				<div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200'>
					<div className='flex items-center justify-between mb-6'>
						<div>
							<h3 className='text-lg font-semibold text-gray-800'>
								Payroll Summary - {employee.first_name} {employee.last_name}
							</h3>
							<p className='text-sm text-gray-600 mt-1'>
								Complete breakdown of salary components and calculations
							</p>
						</div>
						<div className='flex gap-2'>
							<button
								onClick={handleProcessPayroll}
								className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2'>
								<DollarSign className='w-4 h-4' />
								Process Payroll
							</button>
							<button
								onClick={handleGeneratePayslip}
								className='bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2'>
								<FileText className='w-4 h-4' />
								Generate Payslip
							</button>
						</div>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
						<div className='text-center'>
							<div className='text-2xl font-bold text-green-700'>
								{formatCurrency(payrollData.gross_salary || 0)}
							</div>
							<div className='text-sm text-gray-600'>Gross Salary</div>
						</div>
						<div className='text-center'>
							<div className='text-2xl font-bold text-red-700'>
								{formatCurrency(payrollData.total_deductions || 0)}
							</div>
							<div className='text-sm text-gray-600'>Total Deductions</div>
						</div>
						<div className='text-center'>
							<div className='text-2xl font-bold text-blue-700'>
								{formatCurrency(payrollData.total_benefits || 0)}
							</div>
							<div className='text-sm text-gray-600'>Total Benefits</div>
						</div>
						<div className='text-center'>
							<div className='text-2xl font-bold text-gray-900'>
								{formatCurrency(payrollData.net_salary || 0)}
							</div>
							<div className='text-sm text-gray-600'>Net Salary</div>
						</div>
					</div>
				</div>

				{/* Payroll Components Grid */}
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					{/* Earnings */}
					<PayrollComponentCard
						title='Earnings'
						components={payrollData.earnings || []}
						type='earnings'
						total={payrollData.gross_salary}
					/>

					{/* Deductions */}
					<PayrollComponentCard
						title='Deductions'
						components={payrollData.deductions || []}
						type='deductions'
						total={payrollData.total_deductions}
					/>

					{/* Benefits */}
					<PayrollComponentCard
						title='Benefits'
						components={payrollData.benefits || []}
						type='benefits'
						total={payrollData.total_benefits}
					/>
				</div>

				{/* Detailed Breakdown */}
				<div className='bg-white rounded-lg border border-gray-200 p-6'>
					<h4 className='text-lg font-semibold text-gray-900 mb-4'>
						Payroll Calculation Breakdown
					</h4>
					<div className='space-y-4'>
						{/* Base Salary */}
						<div className='flex justify-between items-center py-2 border-b border-gray-100'>
							<span className='font-medium text-gray-900'>Base Salary</span>
							<span className='font-semibold text-gray-900'>
								{formatCurrency(employee.custom_salary)}
							</span>
						</div>

						{/* Earnings breakdown */}
						{payrollData.earnings && payrollData.earnings.length > 0 && (
							<div>
								<h5 className='font-medium text-green-700 mb-2'>Earnings</h5>
								{payrollData.earnings.map((earning, index) => (
									<div
										key={earning.id || index}
										className='flex justify-between items-center py-1 pl-4 text-sm'>
										<span className='text-gray-600'>+ {earning.name}</span>
										<span className='text-green-600'>
											{earning.is_percentage && earning.percentage_value
												? `+${earning.percentage_value}%`
												: `+${formatCurrency(earning.amount)}`}
										</span>
									</div>
								))}
							</div>
						)}

						{/* Gross Salary */}
						<div className='flex justify-between items-center py-2 border-y border-gray-200 font-semibold'>
							<span className='text-gray-900'>Gross Salary</span>
							<span className='text-green-600'>
								{formatCurrency(payrollData.gross_salary || 0)}
							</span>
						</div>

						{/* Deductions breakdown */}
						{payrollData.deductions && payrollData.deductions.length > 0 && (
							<div>
								<h5 className='font-medium text-red-700 mb-2'>Deductions</h5>
								{payrollData.deductions.map((deduction, index) => (
									<div
										key={deduction.id || index}
										className='flex justify-between items-center py-1 pl-4 text-sm'>
										<span className='text-gray-600'>- {deduction.name}</span>
										<span className='text-red-600'>
											{deduction.is_percentage && deduction.percentage_value
												? `-${deduction.percentage_value}%`
												: `-${formatCurrency(deduction.amount)}`}
										</span>
									</div>
								))}
							</div>
						)}

						{/* Benefits breakdown */}
						{payrollData.benefits && payrollData.benefits.length > 0 && (
							<div>
								<h5 className='font-medium text-blue-700 mb-2'>Benefits</h5>
								{payrollData.benefits.map((benefit, index) => (
									<div
										key={benefit.id || index}
										className='flex justify-between items-center py-1 pl-4 text-sm'>
										<span className='text-gray-600'>+ {benefit.name}</span>
										<span className='text-blue-600'>
											{benefit.is_percentage && benefit.percentage_value
												? `+${benefit.percentage_value}%`
												: `+${formatCurrency(benefit.amount)}`}
										</span>
									</div>
								))}
							</div>
						)}

						{/* Net Salary */}
						<div className='flex justify-between items-center py-3 border-t-2 border-gray-300 font-bold text-lg'>
							<span className='text-gray-900'>Net Salary</span>
							<span className='text-blue-600'>
								{formatCurrency(payrollData.net_salary || 0)}
							</span>
						</div>
					</div>
				</div>
			</div>
		);
	};

	// Updated Empty State Components (all blue now)
	const PayrollEmptyState: React.FC = () => (
		<div className='flex flex-col items-center justify-center min-h-[400px] text-center'>
			<div className='mb-8'>
				<div className='relative'>
					<div className='bg-white rounded-lg shadow-lg p-6 w-56 h-36 border'>
						<div className='flex items-center justify-between mb-4'>
							<div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
								<DollarSign className='w-4 h-4 text-blue-600' />
							</div>
							<div className='text-xs text-gray-400'>Payroll</div>
						</div>
						<div className='space-y-2'>
							<div className='h-2 bg-blue-200 rounded w-full'></div>
							<div className='h-2 bg-blue-100 rounded w-3/4'></div>
							<div className='h-2 bg-blue-100 rounded w-1/2'></div>
						</div>
					</div>

					<div className='absolute -bottom-3 -right-3'>
						<div className='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg'>
							<svg
								className='w-5 h-5 text-white'
								viewBox='0 0 24 24'
								fill='none'>
								<path
									d='M12 5V19M5 12H19'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
								/>
							</svg>
						</div>
					</div>
				</div>
			</div>

			<h3 className='text-lg font-semibold text-gray-800 mb-2'>
				No payroll records
			</h3>
			<p className='text-gray-600 max-w-md mb-6 leading-relaxed'>
				Payroll records for {employee.first_name} {employee.last_name} will
				appear here once they are processed.
			</p>

			<button
				onClick={handleProcessPayroll}
				className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2'>
				<DollarSign className='w-4 h-4' />
				Process Payroll
			</button>
		</div>
	);

	const DocumentEmptyState: React.FC = () => (
		<div className='flex flex-col items-center justify-center min-h-[400px] text-center'>
			<div className='mb-8'>
				<div className='relative'>
					<div className='bg-white rounded-lg shadow-lg p-6 w-56 h-36 border'>
						<div className='flex items-center justify-between mb-4'>
							<div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
								<FileText className='w-4 h-4 text-blue-600' />
							</div>
							<div className='text-xs text-gray-400'>Documents</div>
						</div>
						<div className='space-y-3'>
							<div className='flex items-center gap-2'>
								<div className='w-6 h-6 bg-blue-50 rounded border flex items-center justify-center'>
									<FileText className='w-3 h-3 text-blue-400' />
								</div>
								<div className='h-2 bg-blue-100 rounded flex-1'></div>
							</div>
							<div className='flex items-center gap-2'>
								<div className='w-6 h-6 bg-blue-50 rounded border flex items-center justify-center'>
									<FileText className='w-3 h-3 text-blue-400' />
								</div>
								<div className='h-2 bg-blue-100 rounded w-2/3'></div>
							</div>
						</div>
					</div>

					<div className='absolute -bottom-3 -right-3'>
						<div className='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg'>
							<Upload className='w-5 h-5 text-white' />
						</div>
					</div>
				</div>
			</div>

			<h3 className='text-lg font-semibold text-gray-800 mb-2'>
				No documents uploaded
			</h3>
			<p className='text-gray-600 max-w-md mb-6 leading-relaxed'>
				Upload important documents for {employee.first_name}{' '}
				{employee.last_name} such as contracts, ID copies, or certificates.
			</p>

			<button
				onClick={handleUploadDocument}
				className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2'>
				<Upload className='w-4 h-4' />
				Upload Document
			</button>
		</div>
	);

	const LoanEmptyState: React.FC = () => (
		<div className='flex flex-col items-center justify-center min-h-[400px] text-center'>
			<div className='mb-8'>
				<div className='relative'>
					<div className='bg-white rounded-lg shadow-lg p-6 w-56 h-36 border'>
						<div className='flex items-center justify-between mb-4'>
							<div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
								<CreditCard className='w-4 h-4 text-blue-600' />
							</div>
							<div className='text-xs text-gray-400'>Loans</div>
						</div>
						<div className='space-y-2'>
							<div className='flex justify-between items-center'>
								<div className='h-2 bg-blue-200 rounded w-1/3'></div>
								<div className='text-xs text-gray-400'>₦0</div>
							</div>
							<div className='flex justify-between items-center'>
								<div className='h-2 bg-blue-100 rounded w-1/4'></div>
								<div className='text-xs text-gray-400'>₦0</div>
							</div>
						</div>
					</div>

					<div className='absolute -bottom-3 -right-3'>
						<div className='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg'>
							<svg
								className='w-5 h-5 text-white'
								viewBox='0 0 24 24'
								fill='none'>
								<path
									d='M12 5V19M5 12H19'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
								/>
							</svg>
						</div>
					</div>
				</div>
			</div>

			<h3 className='text-lg font-semibold text-gray-800 mb-2'>
				This employee currently has no loan
			</h3>
			<p className='text-gray-600 max-w-md mb-6 leading-relaxed'>
				Track and manage loans for {employee.first_name} {employee.last_name}.
				Set up salary advances or employee loans here.
			</p>

			<button
				onClick={handleAddLoan}
				className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2'>
				<CreditCard className='w-4 h-4' />
				Add Loan
			</button>
		</div>
	);

	const LoanListDisplay: React.FC = () => (
		<div className='space-y-6'>
			{/* Header with Add Loan button */}
			<div className='flex items-center justify-between'>
				<div>
					<h3 className='text-lg font-semibold text-gray-800'>
						Loan Records for {employee.first_name} {employee.last_name}
					</h3>
					<p className='text-sm text-gray-600 mt-1'>
						Manage and track all loan records for this employee
					</p>
				</div>
				<button
					onClick={handleAddLoan}
					className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2'>
					<CreditCard className='w-4 h-4' />
					Add Loan
				</button>
			</div>

			{/* Loans Grid */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				{loans.map((loan) => {
					const statusInfo = getLoanStatus(loan.status);
					const loanAmount = parseFloat(loan.amount) || 0;
					const outstandingBalance = parseFloat(loan.balance) || 0;
					const monthlyDeduction =
						parseFloat(loan.monthly_deduction || '0') || 0;
					const progressPercentage =
						loanAmount > 0
							? ((loanAmount - outstandingBalance) / loanAmount) * 100
							: 0;

					return (
						<div
							key={loan.loan_number}
							className='bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow'>
							<div className='flex items-center justify-between mb-4'>
								<div className='flex items-center gap-2'>
									<div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
										<CreditCard className='w-4 h-4 text-blue-600' />
									</div>
									<span className='font-medium text-gray-900'>
										{loan.loan_type || 'Loan'}
									</span>
								</div>
								<span
									className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
									{statusInfo.label}
								</span>
							</div>

							<div className='space-y-3'>
								<div className='flex justify-between items-center'>
									<span className='text-sm text-gray-600'>Loan Number:</span>
									<span className='font-medium text-gray-900 text-xs'>
										{loan.loan_number}
									</span>
								</div>

								<div className='flex justify-between items-center'>
									<span className='text-sm text-gray-600'>Loan Amount:</span>
									<span className='font-semibold text-gray-900'>
										{formatCurrency(loanAmount)}
									</span>
								</div>

								<div className='flex justify-between items-center'>
									<span className='text-sm text-gray-600'>Outstanding:</span>
									<span className='font-semibold text-blue-600'>
										{formatCurrency(outstandingBalance)}
									</span>
								</div>

								{monthlyDeduction > 0 && (
									<div className='flex justify-between items-center'>
										<span className='text-sm text-gray-600'>
											Monthly Deduction:
										</span>
										<span className='font-medium text-gray-900'>
											{formatCurrency(monthlyDeduction)}
										</span>
									</div>
								)}

								{loan.interest_rate && (
									<div className='flex justify-between items-center'>
										<span className='text-sm text-gray-600'>
											Interest Rate:
										</span>
										<span className='font-medium text-gray-900'>
											{loan.interest_rate}%
										</span>
									</div>
								)}

								<div className='flex justify-between items-center text-xs text-gray-500'>
									<span>Start: {formatDate(loan.start_date)}</span>
									{loan.end_date && (
										<span>End: {formatDate(loan.end_date)}</span>
									)}
								</div>

								{/* Progress Bar - only show if we have valid amounts */}
								{loanAmount > 0 && (
									<div className='mt-4'>
										<div className='flex justify-between text-xs text-gray-600 mb-1'>
											<span>Repayment Progress</span>
											<span>{Math.round(progressPercentage)}%</span>
										</div>
										<div className='w-full bg-gray-200 rounded-full h-2'>
											<div
												className='bg-blue-600 h-2 rounded-full transition-all duration-300'
												style={{
													width: `${Math.min(progressPercentage, 100)}%`,
												}}></div>
										</div>
									</div>
								)}
							</div>
						</div>
					);
				})}
			</div>

			{/* Summary Card */}
			{loans.length > 0 && (
				<div className='bg-blue-50 rounded-lg p-6 border border-blue-200'>
					<h4 className='text-lg font-semibold text-blue-900 mb-4'>
						Loan Summary
					</h4>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
						<div className='text-center'>
							<div className='text-2xl font-bold text-blue-900'>
								{formatCurrency(
									loans.reduce(
										(sum, loan) => sum + (parseFloat(loan.amount) || 0),
										0
									)
								)}
							</div>
							<div className='text-sm text-blue-700'>Total Loans</div>
						</div>
						<div className='text-center'>
							<div className='text-2xl font-bold text-blue-900'>
								{formatCurrency(
									loans.reduce(
										(sum, loan) => sum + (parseFloat(loan.balance) || 0),
										0
									)
								)}
							</div>
							<div className='text-sm text-blue-700'>Outstanding Balance</div>
						</div>
						<div className='text-center'>
							<div className='text-2xl font-bold text-blue-900'>
								{formatCurrency(
									loans.reduce(
										(sum, loan) =>
											sum + (parseFloat(loan.monthly_deduction || '0') || 0),
										0
									)
								)}
							</div>
							<div className='text-sm text-blue-700'>Monthly Deductions</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);

	const LeaveEmptyState: React.FC = () => (
		<div className='flex flex-col items-center justify-center min-h-[400px] text-center'>
			<div className='mb-8'>
				<div className='relative'>
					<div className='bg-white rounded-lg shadow-lg p-6 w-56 h-36 border'>
						<div className='flex items-center justify-between mb-4'>
							<div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
								<Calendar className='w-4 h-4 text-blue-600' />
							</div>
							<div className='text-xs text-gray-400'>Leave</div>
						</div>
						<div className='space-y-3'>
							<div className='grid grid-cols-7 gap-1'>
								{[...Array(7)].map((_, i) => (
									<div
										key={i}
										className='w-4 h-4 bg-blue-50 rounded-sm'></div>
								))}
							</div>
							<div className='grid grid-cols-7 gap-1'>
								{[...Array(7)].map((_, i) => (
									<div
										key={i}
										className={`w-4 h-4 rounded-sm ${
											i === 2 || i === 3 ? 'bg-blue-200' : 'bg-blue-50'
										}`}></div>
								))}
							</div>
						</div>
					</div>

					<div className='absolute -bottom-3 -right-3'>
						<div className='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg'>
							<svg
								className='w-5 h-5 text-white'
								viewBox='0 0 24 24'
								fill='none'>
								<path
									d='M12 5V19M5 12H19'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
								/>
							</svg>
						</div>
					</div>
				</div>
			</div>

			<h3 className='text-lg font-semibold text-gray-800 mb-2'>
				No leave records
			</h3>
			<p className='text-gray-600 max-w-md mb-6 leading-relaxed'>
				Manage leave requests and track time off for {employee.first_name}{' '}
				{employee.last_name}. Annual leave, sick days, and other leave types
				will appear here.
			</p>

			<div className='flex gap-3'>
				<button
					onClick={handleRequestLeave}
					className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2'>
					<Calendar className='w-4 h-4' />
					Request Leave
				</button>
				<button className='bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-2 rounded-lg font-medium transition-colors'>
					View Policy
				</button>
			</div>
		</div>
	);

	const PaymentHistoryEmptyState: React.FC = () => (
		<div className='flex flex-col items-center justify-center min-h-[400px] text-center'>
			<div className='mb-8'>
				<div className='relative'>
					<div className='bg-white rounded-lg shadow-lg p-6 w-56 h-36 border'>
						<div className='flex items-center justify-between mb-4'>
							<div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
								<svg
									className='w-4 h-4 text-blue-600'
									viewBox='0 0 24 24'
									fill='none'>
									<path
										d='M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
								</svg>
							</div>
							<div className='text-xs text-gray-400'>Payments</div>
						</div>
						<div className='space-y-2'>
							<div className='flex justify-between items-center'>
								<div className='h-2 bg-blue-200 rounded w-2/3'></div>
								<div className='text-xs text-gray-400'>₦0</div>
							</div>
							<div className='flex justify-between items-center'>
								<div className='h-2 bg-blue-100 rounded w-1/2'></div>
								<div className='text-xs text-gray-400'>₦0</div>
							</div>
							<div className='flex justify-between items-center'>
								<div className='h-2 bg-blue-100 rounded w-3/4'></div>
								<div className='text-xs text-gray-400'>₦0</div>
							</div>
						</div>
					</div>

					<div className='absolute -bottom-3 -right-3'>
						<div className='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg'>
							<Clock className='w-5 h-5 text-white' />
						</div>
					</div>
				</div>
			</div>

			<h3 className='text-lg font-semibold text-gray-800 mb-2'>
				No payment history
			</h3>
			<p className='text-gray-600 max-w-md mb-6 leading-relaxed'>
				Payment history for {employee.first_name} {employee.last_name} will
				appear here once salary payments are processed.
			</p>

			<div className='flex gap-3'>
				<button className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2'>
					<DollarSign className='w-4 h-4' />
					Process Payment
				</button>
				<button className='bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-2 rounded-lg font-medium transition-colors'>
					View Reports
				</button>
			</div>
		</div>
	);

	return (
		<div className='bg-white w-full h-full overflow-hidden flex flex-col'>
			{/* Header */}
			<div className='flex items-center justify-between p-6 border-b border-gray-200 bg-white'>
				<div className='flex items-center space-x-4'>
					<button
						onClick={onClose}
						className='flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors'>
						<svg
							className='w-5 h-5'
							viewBox='0 0 24 24'
							fill='none'>
							<path
								d='M19 12H5M12 19L5 12L12 5'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
						<span className='text-sm font-medium'>Back to Employees</span>
					</button>
					<div className='flex items-center space-x-2 ml-4'>
						<span className='text-sm text-gray-900 font-medium'>
							Employee Details
						</span>
						{isLoadingEmployeeDetail && (
							<svg
								className='animate-spin h-4 w-4 text-blue-600'
								viewBox='0 0 24 24'>
								<circle
									className='opacity-25'
									cx='12'
									cy='12'
									r='10'
									stroke='currentColor'
									strokeWidth='4'
									fill='none'></circle>
								<path
									className='opacity-75'
									fill='currentColor'
									d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
							</svg>
						)}
					</div>
				</div>

				<div className='flex items-center space-x-2'>
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
						Active
					</span>
					<button
						onClick={() => onEndEmployment?.(employee)}
						className='inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
						<Clock className='w-4 h-4 mr-2' />
						End Employment
					</button>
				</div>
			</div>

			{/* Tabs */}
			<div className='border-b border-gray-200 bg-white'>
				<div className='max-w-7xl mx-auto'>
					<nav
						className='flex space-x-8 px-6'
						aria-label='Tabs'>
						{tabs.map((tab) => (
							<button
								key={tab.id}
								onClick={() => handleTabChange(tab.id as any)}
								className={`py-4 px-1 border-b-2 font-medium text-sm ${
									activeTab === tab.id
										? 'border-blue-500 text-blue-600'
										: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
								} ${isAnyFormOpen ? 'cursor-not-allowed opacity-50' : ''}`}
								disabled={isAnyFormOpen}>
								{tab.label}
							</button>
						))}
					</nav>
				</div>
			</div>

			{/* Content with Form Overlay */}
			<div className='flex-1 overflow-hidden relative'>
				{/* Main Content */}
				<div
					className={`${
						isAnyFormOpen ? 'w-1/2' : 'w-full'
					} h-full overflow-y-auto bg-gray-50 transition-all duration-300`}>
					<div className='max-w-7xl mx-auto p-6'>
						{activeTab === 'general' && (
							<div className='space-y-6'>
								{isLoadingEmployeeDetail ? (
									<div className='flex items-center justify-center min-h-[400px]'>
										<div className='flex items-center space-x-2'>
											<svg
												className='animate-spin h-5 w-5 text-blue-600'
												viewBox='0 0 24 24'>
												<circle
													className='opacity-25'
													cx='12'
													cy='12'
													r='10'
													stroke='currentColor'
													strokeWidth='4'
													fill='none'></circle>
												<path
													className='opacity-75'
													fill='currentColor'
													d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
											</svg>
											<span className='text-gray-600'>
												Loading employee details...
											</span>
										</div>
									</div>
								) : (
									<>
										{/* Basic Details */}
										<div className='bg-white rounded-lg shadow-sm'>
											<div className='flex items-center justify-between p-6 border-b border-gray-200'>
												<h3 className='text-lg font-medium text-gray-900'>
													Basic Details
												</h3>
												<button
													onClick={handleEmployeeEdit}
													className='inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'>
													<Edit2 className='w-4 h-4 mr-1' />
													Edit
												</button>
											</div>
											<div className='p-6'>
												<dl className='grid grid-cols-3 gap-x-6 gap-y-4'>
													<DetailField
														label='Employee ID'
														value={employee.employee_id}
													/>
													<DetailField
														label='Job Title'
														value={employee.job_title}
													/>
													<DetailField
														label='Department'
														value={employee.department_name}
													/>
													<DetailField
														label='Employee Type'
														value={getEmployeeType(employee.employment_type)}
													/>
													<DetailField
														label='Start Date'
														value={formatDate(employee.start_date)}
													/>
													<DetailField
														label='Tax Start Date'
														value={formatDate(employee.tax_start_date)}
													/>
												</dl>
											</div>
										</div>

										{/* Salary & Payment Details */}
										<div className='bg-white rounded-lg shadow-sm'>
											<div className='flex items-center justify-between p-6 border-b border-gray-200'>
												<h3 className='text-lg font-medium text-gray-900'>
													Payment Details
												</h3>
												<button
													onClick={handleSalaryEdit}
													className='inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'>
													<Edit2 className='w-4 h-4 mr-1' />
													Edit
												</button>
											</div>
											<div className='p-6'>
												<dl className='grid grid-cols-3 gap-x-6 gap-y-4'>
													<DetailField
														label='Account Number'
														value={employee.account_number}
													/>
													<DetailField
														label='Bank Name'
														value={employee.bank_name}
													/>
													<DetailField
														label='Account Name'
														value={employee.account_name}
													/>
													<DetailField
														label='Salary Amount (NGN)'
														value={formatCurrency(employee.custom_salary)}
													/>
													<DetailField
														label='Pay Frequency'
														value={getPayFrequency(employee.pay_frequency)}
													/>
												</dl>
											</div>
										</div>

										{/* Statutory Deduction */}
										<div className='bg-white rounded-lg shadow-sm'>
											<div className='flex items-center justify-between p-6 border-b border-gray-200'>
												<h3 className='text-lg font-medium text-gray-900'>
													Statutory Deduction
												</h3>
												<button
													onClick={handleSalaryEdit}
													className='inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'>
													<Edit2 className='w-4 h-4 mr-1' />
													Edit
												</button>
											</div>
											<div className='p-6'>
												<div className='grid grid-cols-2 gap-8'>
													{/* Deductions Column */}
													<div>
														<h4 className='text-sm font-medium text-gray-700 mb-4'>
															Deductions
														</h4>
														<dl className='space-y-3'>
															<div className='flex justify-between'>
																<dt className='text-sm text-gray-600'>
																	PAYE (Tax)
																</dt>
																<dd className='text-sm text-gray-900 font-medium'>
																	{employee.is_paye_applicable ? 'Yes' : 'No'}
																</dd>
															</div>
															<div className='flex justify-between'>
																<dt className='text-sm text-gray-600'>
																	Pension
																</dt>
																<dd className='text-sm text-gray-900 font-medium'>
																	{employee.is_pension_applicable
																		? 'Yes'
																		: 'No'}
																</dd>
															</div>
															<div className='flex justify-between'>
																<dt className='text-sm text-gray-600'>NHF</dt>
																<dd className='text-sm text-gray-900 font-medium'>
																	{employee.is_nhf_applicable ? 'Yes' : 'No'}
																</dd>
															</div>
															<div className='flex justify-between'>
																<dt className='text-sm text-gray-600'>NSITF</dt>
																<dd className='text-sm text-gray-900 font-medium'>
																	{employee.is_nsitf_applicable ? 'Yes' : 'No'}
																</dd>
															</div>
														</dl>
													</div>
												</div>
											</div>
										</div>
									</>
								)}
							</div>
						)}

						{activeTab === 'payroll' && (
							<div>
								{isLoadingEmployeeDetail ? (
									<div className='flex items-center justify-center min-h-[400px]'>
										<div className='flex items-center space-x-2'>
											<svg
												className='animate-spin h-5 w-5 text-blue-600'
												viewBox='0 0 24 24'>
												<circle
													className='opacity-25'
													cx='12'
													cy='12'
													r='10'
													stroke='currentColor'
													strokeWidth='4'
													fill='none'></circle>
												<path
													className='opacity-75'
													fill='currentColor'
													d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
											</svg>
											<span className='text-gray-600'>
												Loading payroll data...
											</span>
										</div>
									</div>
								) : (
									// <PayrollBreakdown
									// 	employee={employee}
									// 	onProcessPayroll={handleProcessPayroll}
									// 	onGeneratePayslip={handleGeneratePayslip}
									// />
									<div></div>
								)}
							</div>
						)}

						{activeTab === 'document' && <DocumentEmptyState />}

						{activeTab === 'loan' && (
							<div>
								{isLoadingLoans ? (
									<div className='flex items-center justify-center min-h-[400px]'>
										<div className='flex items-center space-x-2'>
											<svg
												className='animate-spin h-5 w-5 text-blue-600'
												viewBox='0 0 24 24'>
												<circle
													className='opacity-25'
													cx='12'
													cy='12'
													r='10'
													stroke='currentColor'
													strokeWidth='4'
													fill='none'></circle>
												<path
													className='opacity-75'
													fill='currentColor'
													d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
											</svg>
											<span className='text-gray-600'>
												Loading loan data...
											</span>
										</div>
									</div>
								) : loans.length > 0 ? (
									<LoanListDisplay />
								) : (
									<LoanEmptyState />
								)}
							</div>
						)}

						{activeTab === 'leave' && (
							<div>
								{isLoadingLeaveRequests ? (
									<div className='flex items-center justify-center min-h-[400px]'>
										<div className='flex items-center space-x-2'>
											<svg
												className='animate-spin h-5 w-5 text-blue-600'
												viewBox='0 0 24 24'>
												<circle
													className='opacity-25'
													cx='12'
													cy='12'
													r='10'
													stroke='currentColor'
													strokeWidth='4'
													fill='none'></circle>
												<path
													className='opacity-75'
													fill='currentColor'
													d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
											</svg>
											<span className='text-gray-600'>
												Loading leave requests...
											</span>
										</div>
									</div>
								) : leaveRequests.length > 0 ? (
									<LeaveListDisplay
										leaveRequests={leaveRequests}
										onRequestLeave={handleRequestLeave}
									/>
								) : (
									<LeaveEmptyState />
								)}
							</div>
						)}
						{activeTab === 'payment-history' && <PaymentHistoryEmptyState />}
					</div>
				</div>

				{/* Right Side Form Panel - Employee Form Overlay */}
				{showEmployeeForm && (
					<div className='absolute top-0 right-0 w-1/2 min-w-[600px] h-full bg-white border-l border-gray-200 flex flex-col overflow-hidden shadow-2xl transform transition-transform duration-300 ease-in-out z-10'>
						{/* Form Header */}
						<div className='flex items-center justify-between p-4 border-b border-gray-200 bg-white'>
							<h2 className='text-lg font-semibold text-gray-900'>
								Edit Employee - General Information
							</h2>
							<button
								onClick={handleCloseEmployeeForm}
								className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
								aria-label='Close form'>
								<svg
									className='w-5 h-5 text-gray-500'
									viewBox='0 0 24 24'
									fill='none'>
									<path
										d='M18 6L6 18M6 6L18 18'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
								</svg>
							</button>
						</div>

						{/* Form Content */}
						<div className='flex-1 overflow-auto'>
							<EmployeeForm
								isOpen={showEmployeeForm}
								isEdit={true}
								employeeData={employee}
								editType={editType}
								onClose={handleCloseEmployeeForm}
								onSubmit={handleEmployeeSubmit}
							/>
						</div>
					</div>
				)}

				{/* Right Side Form Panel - Salary Form Overlay */}
				{showSalaryForm && (
					<div className='absolute top-0 right-0 w-1/2 min-w-[600px] h-full bg-white border-l border-gray-200 flex flex-col overflow-hidden shadow-2xl transform transition-transform duration-300 ease-in-out z-10'>
						{/* Form Header */}
						<div className='flex items-center justify-between p-4 border-b border-gray-200 bg-white'>
							<h2 className='text-lg font-semibold text-gray-900'>
								Edit Salary & Payment Details
							</h2>
							<button
								onClick={handleCloseSalaryForm}
								className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
								aria-label='Close form'>
								<svg
									className='w-5 h-5 text-gray-500'
									viewBox='0 0 24 24'
									fill='none'>
									<path
										d='M18 6L6 18M6 6L18 18'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
								</svg>
							</button>
						</div>

						{/* Form Content */}
						<div className='flex-1 overflow-auto'>
							<SalarySetupForm
								// isOpen={showSalaryForm}
								isEdit={true}
								employeeData={employee}
								onClose={handleCloseSalaryForm}
								onSubmit={handleSalarySubmit}
								onBack={function (): void {
									throw new Error('Function not implemented.');
								}}
								parentOnSubmit={function (
									employeeFormData: any
								): Promise<void> {
									throw new Error('Function not implemented.');
								}}
							/>
						</div>
					</div>
				)}

				{/* Right Side Form Panel - Salary Component Setup Overlay */}
				{showSalaryComponentSetup && (
					<div className='absolute top-0 right-0 w-1/2 min-w-[600px] h-full bg-white border-l border-gray-200 flex flex-col overflow-hidden shadow-2xl transform transition-transform duration-300 ease-in-out z-10'>
						{/* Form Header */}
						<div className='flex items-center justify-between p-4 border-b border-gray-200 bg-white'>
							<h2 className='text-lg font-semibold text-gray-900'>
								Process Payroll - {employee.first_name} {employee.last_name}
							</h2>
							<button
								onClick={handleCloseSalaryComponentSetup}
								className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
								aria-label='Close form'>
								<svg
									className='w-5 h-5 text-gray-500'
									viewBox='0 0 24 24'
									fill='none'>
									<path
										d='M18 6L6 18M6 6L18 18'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
								</svg>
							</button>
						</div>

						{/* Form Content */}
						<div className='flex-1 overflow-auto'>
							<SalaryComponentSetup
								employee={employee}
								onClose={handleCloseSalaryComponentSetup}
								onSubmit={handleSalaryComponentSubmit}
							/>
						</div>
					</div>
				)}

				{/* Right Side Form Panel - Leave Request Form Overlay */}
				{showLeaveRequestForm && (
					<div className='absolute top-0 right-0 w-1/2 min-w-[600px] h-full bg-white border-l border-gray-200 flex flex-col overflow-hidden shadow-2xl transform transition-transform duration-300 ease-in-out z-10'>
						{/* Form Header */}
						<div className='flex items-center justify-between p-4 border-b border-gray-200 bg-white'>
							<h2 className='text-lg font-semibold text-gray-900'>
								Apply For Leave - {employee.first_name} {employee.last_name}
							</h2>
							<button
								onClick={handleCloseLeaveRequestForm}
								className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
								aria-label='Close form'>
								<svg
									className='w-5 h-5 text-gray-500'
									viewBox='0 0 24 24'
									fill='none'>
									<path
										d='M18 6L6 18M6 6L18 18'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
								</svg>
							</button>
						</div>

						{/* Form Content */}
						<div className='flex-1 overflow-auto p-4'>
							<LeaveRequestForm
								employeeId={employee.id?.toString() || ''}
								employeeCode={employee.employee_id}
								onClose={handleCloseLeaveRequestForm}
								onSubmit={handleLeaveRequestSubmit}
							/>
						</div>
					</div>
				)}

				{/* Right Side Form Panel - Document Upload Form Overlay */}
				{showDocumentUpload && (
					<div className='absolute top-0 right-0 w-1/2 min-w-[600px] h-full bg-white border-l border-gray-200 flex flex-col overflow-hidden shadow-2xl transform transition-transform duration-300 ease-in-out z-10'>
						{/* Form Header */}
						<div className='flex items-center justify-between p-4 border-b border-gray-200 bg-white'>
							<h2 className='text-lg font-semibold text-gray-900'>
								Upload Document
							</h2>
							<button
								onClick={handleCloseDocumentUpload}
								className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
								aria-label='Close form'>
								<svg
									className='w-5 h-5 text-gray-500'
									viewBox='0 0 24 24'
									fill='none'>
									<path
										d='M18 6L6 18M6 6L18 18'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
								</svg>
							</button>
						</div>

						{/* Form Content */}
						<div className='flex-1 overflow-auto'>
							{/* <DocumentUploadModal
								isOpen={showDocumentUpload}
								onClose={handleCloseDocumentUpload}
								onSubmit={handleDocumentUploadSubmit}
								employee={employee.id?.toString()}
								employeeName={`${employee.first_name} ${employee.last_name}`}
							/> */}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default EmployeeDetails;
