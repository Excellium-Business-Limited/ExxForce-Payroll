'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { useRouter, useSearchParams } from 'next/navigation';
import EmployeeForm from '../components/EmployeeForm';
import SalarySetupForm from '../components/SalarySetupForm';
import SalaryComponentSetup from '../components/SalaryComponentSetup';
import LeaveListDisplay from '../components/LeaveListDisplay';
import LeaveRequestForm from '../components/LeaveRequestForm';
import PayrollBreakdown from '../components/PayrollBreakdown';
import DocumentUploadModal from '../components/DocumentUploadModal';
import DocumentsList from '../components/DocumentsList';
import { useGlobal } from '@/app/Context/context';
import axios from 'axios';

// Import types from the centralized types file
import { 
	Employee, 
	PayrollComponent, 
	PayrollData, 
	DetailedEmployee, 
	LeaveRequest, 
	Loan 
} from '../types/employee';

const EmployeeDetailsPage: React.FC = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const employeeId = searchParams.get('id');
	const editParam = searchParams.get('edit');
	const { tenant, globalState } = useGlobal();
	const [activeTab, setActiveTab] = useState<
		'general' | 'payroll' | 'document' | 'loan' | 'leave' | 'payment-history'
	>('general');

	// Employee data state - using detailed employee data from API
	const [employee, setEmployee] = useState<DetailedEmployee | null>(null);
	const [isLoadingEmployeeDetail, setIsLoadingEmployeeDetail] = useState<boolean>(true);

	// New state for inline editing
	const [showEmployeeForm, setShowEmployeeForm] = useState<boolean>(false);
	const [showSalaryForm, setShowSalaryForm] = useState<boolean>(false);
	const [showSalaryComponentSetup, setShowSalaryComponentSetup] = useState<boolean>(false);
	const [showDocumentUpload, setShowDocumentUpload] = useState<boolean>(false);
	const [editType, setEditType] = useState<'general' | 'salary'>('general');

	// Leave-related state
	const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
	const [showLeaveRequestForm, setShowLeaveRequestForm] = useState<boolean>(false);
	const [isLoadingLeaveRequests, setIsLoadingLeaveRequests] = useState<boolean>(false);

	// Loan-related state
	const [loans, setLoans] = useState<Loan[]>([]);
	const [isLoadingLoans, setIsLoadingLoans] = useState<boolean>(false);

	const formatCurrency = (amount: number | undefined | null) => {
		if (amount === null || amount === undefined || isNaN(amount)) {
			return '--';
		}
		return new Intl.NumberFormat('en-NG', {
			style: 'currency',
			currency: 'NGN',
			minimumFractionDigits: 2,
		}).format(amount).replace('NGN', '₦');
	};

	const formatDate = (dateString: string | undefined) => {
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

	// Helper function to get department value from employee data
	const getDepartmentValue = (employee: any): string => {
		if (!employee) return '';
		// Check both possible field names from API
		return employee.department || employee.department_name || '';
	};

	// Helper function to get salary value from employee data (prefer effective_gross)
	const getSalaryValue = (employee: any): number => {
		if (!employee) return 0;
		// Prefer effective_gross, then gross_salary, then custom_salary
		return employee.effective_gross ?? employee.gross_salary ?? employee.custom_salary ?? 0;
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
		if (!employeeId || !tenant || !globalState.accessToken) return;

		try {
			setIsLoadingEmployeeDetail(true);
			const baseURL = `${tenant}.exxforce.com`;

			const response = await axios.get(
				`https://${baseURL}/tenant/employee/detail/${employeeId}`,
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
			// Keep using null if API call fails
			setEmployee(null);
		} finally {
			setIsLoadingEmployeeDetail(false);
		}
	};

	// Fetch leave requests for the employee
	const fetchLeaveRequests = async () => {
		if (!employeeId) return;

		try {
			setIsLoadingLeaveRequests(true);
			const response = await axios.get(
				`https://${tenant}.exxforce.com/tenant/leave/employee/${employeeId}/leaves`,
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
		if (!employeeId) return;

		try {
			setIsLoadingLoans(true);
			const response = await axios.get(
				`https://${tenant}.exxforce.com/tenant/loans/${employeeId}/loans`,
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

	// Functions to handle actions
	const handleEmployeeEdit = () => {
		setEditType('general');
		setShowEmployeeForm(true);
	};

	const handleSalaryEdit = () => {
		setEditType('salary');
		setShowSalaryForm(true);
	};

	const handleSalaryComponentSetup = () => {
		setShowSalaryComponentSetup(true);
	};

	const handleAddLoan = () => {
		console.log('Add loan functionality to be implemented');
	};

	const handleUploadDocument = () => {
		setShowDocumentUpload(true);
	};

	const handleRequestLeave = () => {
		setShowLeaveRequestForm(true);
	};

	// Handler for form submission
	const handleEmployeeSubmit = async (employeeFormData: any) => {
		try {
			console.log('Employee form submitted with data:', employeeFormData);
			// The EmployeeForm component handles the API call directly
			// Just refresh employee detail after successful update
			await fetchEmployeeDetail();
			// Close the form after successful submission
			setShowEmployeeForm(false);
			
			// Remove the edit parameter from URL
			if (editParam) {
				router.push(`/EmployeeDetails?id=${employeeId}`);
			}
		} catch (error) {
			console.error('Error after employee submission:', error);
		}
	};

	// Handler for salary form submission
	const handleSalarySubmit = async (salaryFormData: any) => {
		try {
			console.log('Updating salary:', salaryFormData);
			// Refresh employee detail after update
			await fetchEmployeeDetail();
			// Close the form after successful submission
			setShowSalaryForm(false);
			
			// Remove the edit parameter from URL
			if (editParam) {
				router.push(`/EmployeeDetails?id=${employeeId}`);
			}
		} catch (error) {
			console.error('Error submitting salary:', error);
		}
	};

	// Handler for salary component setup submission
	const handleSalaryComponentSubmit = useCallback(async (salaryComponentData: any) => {
		try {
			console.log('Updating salary component:', salaryComponentData);
			// Handle salary component setup submission
			setShowSalaryComponentSetup(false);
			// Refresh employee detail after component setup
			await fetchEmployeeDetail();
		} catch (error) {
			console.error('Error submitting salary component:', error);
		}
	}, []);

	// Functions to handle form closures
	const handleCloseSalaryComponentSetup = useCallback(() => {
		setShowSalaryComponentSetup(false);
	}, []);

	const handleCloseEmployeeForm = useCallback(() => {
		setShowEmployeeForm(false);
		if (editParam) {
			router.push(`/EmployeeDetails?id=${employeeId}`);
		}
	}, [editParam, employeeId, router]);

	const handleCloseSalaryForm = useCallback(() => {
		setShowSalaryForm(false);
		if (editParam) {
			router.push(`/EmployeeDetails?id=${employeeId}`);
		}
	}, [editParam, employeeId, router]);

	const handleCloseDocumentUpload = useCallback(() => {
		setShowDocumentUpload(false);
	}, []);

	const handleCloseLeaveRequestForm = useCallback(() => {
		setShowLeaveRequestForm(false);
	}, []);

	// Handler for leave request submission
	const handleLeaveRequestSubmit = useCallback(async (leaveRequestData: any) => {
		try {
			console.log('Leave request submitted:', leaveRequestData);
			// Refresh the leave requests list
			await fetchLeaveRequests();
			// Close the form after successful submission
			setShowLeaveRequestForm(false);
		} catch (error) {
			console.error('Error submitting leave request:', error);
		}
	}, []);

	// Handler for document upload submission
	const handleDocumentUploadSubmit = useCallback(async (documentData: any) => {
		try {
			console.log('Document uploaded:', documentData);
			// Handle document upload logic here
			// You might want to call an API to save the document
			// Close the form after successful submission
			setShowDocumentUpload(false);
			// Force refresh of documents to show the newly uploaded document
			// This will be handled by the DocumentsList component's own refresh mechanism
		} catch (error) {
			console.error('Error uploading document:', error);
		}
	}, []);

	// Function to handle back navigation
	const onClose = () => {
		router.push('/Employee');
	};

	// Handle employee termination/end employment
	const handleEndEmployment = async () => {
		if (!employee) return;
		
		if (window.confirm(`Are you sure you want to end employment for ${employee.first_name} ${employee.last_name}?`)) {
			try {
				// Implementation for employee termination API call here
				console.log('Ending employment for:', employee.employee_id);
				// After successful termination
				router.push('/Employee'); // Redirect to employee list
			} catch (error) {
				console.error('Error ending employment:', error);
			}
		}
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
		value: string | number | undefined;
		fullWidth?: boolean;
	}> = ({ label, value, fullWidth = false }) => (
		<div className={fullWidth ? 'col-span-3' : ''}>
			<dt className='text-sm font-medium text-gray-500'>{label}</dt>
			<dd className='mt-1 text-sm text-gray-900'>{value || '--'}</dd>
		</div>
	);

	// Effects
	useEffect(() => {
		if (employeeId) {
			fetchEmployeeDetail();
		}
	}, [employeeId, tenant, globalState.accessToken]);

	// Effect to handle edit param from URL
	useEffect(() => {
		if (editParam && employee) {
			if (editParam === 'salary') {
				setEditType('salary');
				setShowSalaryForm(true);
			} else if (editParam === 'general') {
				setEditType('general');
				setShowEmployeeForm(true);
			}
		}
	}, [editParam, employee]);

	// Effect to fetch leave requests when the active tab changes to 'leave'
	useEffect(() => {
		if (activeTab === 'leave' && employee?.employee_id) {
			fetchLeaveRequests();
		}
	}, [activeTab, employee?.employee_id]);

	// Effect to fetch loans when the active tab changes to 'loan'
	useEffect(() => {
		if (activeTab === 'loan' && employee?.employee_id) {
			fetchLoans();
		}
	}, [activeTab, employee?.employee_id]);

// Normalize payroll-related fields so `PayrollBreakdown` receives expected shape
const payrollEmployee = useMemo(() => {
	if (!employee) return null;

	// Pull gross/effective gross from multiple possible fields
	const effective_gross =
		(employee as any).effective_gross ??
		(employee.payroll_data && employee.payroll_data.gross_salary) ??
		(employee as any).gross_salary ??
		(employee as any).custom_salary ??
		'0';

	const salary_components = (employee as any).salary_components ?? (employee.payroll_data && employee.payroll_data.earnings) ?? [];
	const deduction_components = (employee as any).deduction_components ?? (employee.payroll_data && employee.payroll_data.deductions) ?? [];
	const benefits = (employee as any).benefits ?? (employee.payroll_data && employee.payroll_data.benefits) ?? [];

	return {
		...employee,
		effective_gross: String(effective_gross),
		salary_components,
		deduction_components,
		benefits,
		payroll_data: employee.payroll_data ?? {
			earnings: salary_components,
			deductions: deduction_components,
			benefits: benefits,
			gross_salary: Number(effective_gross) || 0,
		},
	} as any;
}, [employee]);

// Create a stable employee object for SalaryComponentSetup to prevent unnecessary re-renders
const stableSalaryComponentEmployee = useMemo(() => {
	if (!employee) return undefined;
	
	// Only include essential fields that SalaryComponentSetup needs
	// This prevents the component from re-rendering when unrelated employee fields change
	return {
		...employee, // Include all base employee fields
		// Override with stable references for salary-related fields
		effective_gross: (employee as any).effective_gross,
		gross_salary: (employee as any).gross_salary,
		salary_components: (employee as any).salary_components,
		components: (employee as any).components,
	} as Employee;
}, [
	employee?.employee_id,
	employee?.first_name,
	employee?.last_name,
	(employee as any)?.effective_gross,
	(employee as any)?.gross_salary,
	employee?.custom_salary,
	(employee as any)?.salary_components,
	(employee as any)?.components,
	employee?.payroll_data
]);

	// Show loading state
	if (isLoadingEmployeeDetail) {
		return (
			<div className='bg-white w-full h-full overflow-hidden flex flex-col'>
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
						<span className='text-gray-600'>Loading employee details...</span>
					</div>
				</div>
			</div>
		);
	}

	// Show error state if employee not found
	if (!employee) {
		return (
			<div className='bg-white w-full h-full overflow-hidden flex flex-col'>
				<div className='flex items-center justify-center min-h-[400px]'>
					<div className='text-center'>
						<h2 className='text-2xl font-semibold text-red-600'>Employee Not Found</h2>
						<p className='mt-2'>The employee you're looking for doesn't exist or you don't have access.</p>
						<button
							className='mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
							onClick={onClose}
						>
							Back to Employee List
						</button>
					</div>
				</div>
			</div>
		);
	}

	// The rest of the component renders here exactly like the original but adapted for page...
	// [I'll continue with the remaining JSX structure in the next part]

	return (
		<div className='bg-white w-full h-full overflow-hidden flex flex-col'>
			{/* Header - exactly like original */}
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
						onClick={handleEndEmployment}
						className='inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
						<Clock className='w-4 h-4 mr-2' />
						End Employment
					</button>
				</div>
			</div>

			{/* Detail header (avatar, name, role, id) matching design */}
			<div className='w-full px-6 py-4'>
				<div className='flex items-center space-x-4'>
					<div className='w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold'>
						{(employee.first_name && employee.last_name) ? `${employee.first_name.charAt(0)}${employee.last_name.charAt(0)}` : 'AI'}
					</div>
					<div>
						<div className='text-lg font-semibold text-gray-900'>
							{employee.first_name} {employee.last_name}
						</div>
						<div className='text-sm text-gray-500'>
							{employee.job_title || '—'}
						</div>
						<div className='text-sm text-gray-400 mt-1'>
							ID: {employee.employee_id}
						</div>
					</div>
				</div>
			</div>

			{/* Tabs - exactly like original */}
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

			{/* Content with Form Overlay - exactly like original */}
			<div className='flex-1 overflow-hidden relative'>
				{/* Main Content */}
				<div
					className={`${
						isAnyFormOpen ? 'w-1/2' : 'w-full'
					} h-full overflow-y-auto bg-gray-50 transition-all duration-300`}>
					<div className='max-w-7xl mx-auto p-6'>
						{activeTab === 'general' && (
							<div className='space-y-6'>
								{/* Basic Details (personal) */}
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
												label='First Name'
												value={employee.first_name}
											/>
											<DetailField
												label='Last Name'
												value={employee.last_name}
											/>
											<DetailField
												label='Gender'
												value={employee.gender}
											/>
											<DetailField
												label='Phone number'
												value={employee.phone_number}
											/>
											<DetailField
												label='Email Address'
												value={employee.email}
											/>
											<DetailField
												label='Date of Birth'
												value={formatDate(employee.date_of_birth)}
											/>
										</dl>
									</div>
								</div>

								{/* Employment Details */}
								<div className='bg-white rounded-lg shadow-sm'>
									<div className='flex items-center justify-between p-6 border-b border-gray-200'>
										<h3 className='text-lg font-medium text-gray-900'>
											Employment Details
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
												value={getDepartmentValue(employee)}
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
												label='Pay Frequency'
												value={getPayFrequency(employee.pay_frequency)}
											/>
											<DetailField
												label='PAYE Applicable'
												value={employee.is_paye_applicable ? 'Yes' : 'No'}
											/>
											<DetailField
												label='Pension Applicable'
												value={employee.is_pension_applicable ? 'Yes' : 'No'}
											/>
											<DetailField
												label='NHF Applicable'
												value={employee.is_nhf_applicable ? 'Yes' : 'No'}
											/>
											<DetailField
												label='NSITF Applicable'
												value={employee.is_nsitf_applicable ? 'Yes' : 'No'}
											/>
											<DetailField
												label='Gross Salary'
												value={formatCurrency(getSalaryValue(employee))}
											/>
										</dl>
									</div>
								</div>
							</div>
						)}

						{activeTab === 'payroll' && (
							<div>
								{payrollEmployee?.payroll_data && 
							 (payrollEmployee.payroll_data.earnings?.length > 0 || 
							  payrollEmployee.payroll_data.deductions?.length > 0 || 
							  payrollEmployee.payroll_data.benefits?.length > 0) ? (
								<PayrollBreakdown employee={payrollEmployee} onProcessPayroll={() => setShowSalaryComponentSetup(true)} />
								) : (
									<div className='flex flex-col items-center justify-center min-h-[400px] text-center'>
										<div className='mb-8'>
											<div className='relative'>
												<div className='bg-white rounded-lg shadow-lg p-6 w-56 h-36 border'>
													<div className='flex items-center justify-between mb-4'>
														<div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
															<span className='text-blue-600 font-bold text-sm'>₦</span>
														</div>
														<div className='text-xs text-gray-400'>Payroll</div>
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
													</div>
												</div>

												<div className='absolute -bottom-3 -right-3'>
													<div className='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg'>
														<span className='text-white font-bold text-lg'>₦</span>
													</div>
												</div>
											</div>
										</div>

										<h3 className='text-lg font-semibold text-gray-800 mb-2'>
											Payroll is not set up yet
										</h3>
										<p className='text-gray-600 max-w-md mb-6 leading-relaxed'>
											Configure payroll settings for {employee.first_name} {employee.last_name}
											to start managing their salary and benefits.
										</p>

										<button
											onClick={handleSalaryComponentSetup}
											className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2'>
											<span className='w-4 h-4 text-sm font-bold'>₦</span>
											Set Up Payroll
										</button>
									</div>
								)}
							</div>
						)}

						{activeTab === 'document' && (
							<DocumentsList
								employee={employee}
								onUploadDocument={handleUploadDocument}
							/>
						)}

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
												const monthlyDeduction = parseFloat(loan.monthly_deduction || '0') || 0;
												const progressPercentage = loanAmount > 0 ? ((loanAmount - outstandingBalance) / loanAmount) * 100 : 0;

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
																	{loan.loan_number}
																</span>
															</div>
															<span
																className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
																{statusInfo.label}
															</span>
														</div>

														<div className='space-y-3'>
															<div className='flex justify-between'>
																<span className='text-sm text-gray-500'>Loan Amount:</span>
																<span className='text-sm font-medium text-gray-900'>
																	{formatCurrency(loanAmount)}
																</span>
															</div>
															<div className='flex justify-between'>
																<span className='text-sm text-gray-500'>Outstanding:</span>
																<span className='text-sm font-medium text-gray-900'>
																	{formatCurrency(outstandingBalance)}
																</span>
															</div>
															<div className='flex justify-between'>
																<span className='text-sm text-gray-500'>Monthly Deduction:</span>
																<span className='text-sm font-medium text-gray-900'>
																	{formatCurrency(monthlyDeduction)}
																</span>
															</div>
															<div className='flex justify-between'>
																<span className='text-sm text-gray-500'>Start Date:</span>
																<span className='text-sm font-medium text-gray-900'>
																	{formatDate(loan.start_date)}
																</span>
															</div>

															{/* Progress Bar */}
															<div className='mt-4'>
																<div className='flex justify-between text-xs text-gray-500 mb-1'>
																	<span>Progress</span>
																	<span>{Math.round(progressPercentage)}%</span>
																</div>
																<div className='w-full bg-gray-200 rounded-full h-2'>
																	<div
																		className='bg-blue-600 h-2 rounded-full transition-all duration-300'
																		style={{ width: `${Math.min(progressPercentage, 100)}%` }}
																	></div>
																</div>
															</div>
														</div>
													</div>
												);
											})}
										</div>
									</div>
								) : (
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
													<div className='space-y-2'>
														<div className='flex justify-between items-center'>
															<div className='h-2 bg-blue-200 rounded w-1/2'></div>
															<div className='text-xs text-gray-400'>0 days</div>
														</div>
														<div className='flex justify-between items-center'>
															<div className='h-2 bg-blue-100 rounded w-1/3'></div>
															<div className='text-xs text-gray-400'>0 days</div>
														</div>
													</div>
												</div>

												<div className='absolute -bottom-3 -right-3'>
													<div className='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg'>
														<Calendar className='w-5 h-5 text-white' />
													</div>
												</div>
											</div>
										</div>

										<h3 className='text-lg font-semibold text-gray-800 mb-2'>
											No leave requests found
										</h3>
										<p className='text-gray-600 max-w-md mb-6 leading-relaxed'>
											{employee.first_name} {employee.last_name} hasn't submitted any leave
											requests yet. Leave history will appear here once they apply.
										</p>

										<button
											onClick={handleRequestLeave}
											className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2'>
											<Calendar className='w-4 h-4' />
											Request Leave
										</button>
									</div>
								)}
							</div>
						)}

						{activeTab === 'payment-history' && (
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
										<span className='w-4 h-4 text-sm font-bold'>₦</span>
										Process Payment
									</button>
									<button className='bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-2 rounded-lg font-medium transition-colors'>
										View Reports
									</button>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Form Overlay Panels - exactly like original */}
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
								key={`employee-form-${employee.employee_id}-${employee.department_name}-${employee.employment_type}-${employee.gender}`}
								isOpen={showEmployeeForm}
								isEdit={true}
								employeeData={{
									...employee,
									email: employee.email ?? ''  // Default to empty string if undefined
								}}
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
								isEdit={true}
								employeeData={employee}
								onClose={handleCloseSalaryForm}
								onSubmit={handleSalarySubmit}
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
								employee={stableSalaryComponentEmployee}
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
							<DocumentUploadModal
								isOpen={showDocumentUpload}
								onClose={handleCloseDocumentUpload}
								onSubmit={handleDocumentUploadSubmit}
								employee={employee}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default EmployeeDetailsPage;
