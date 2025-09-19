'use client';

import React, { Suspense, useState, useEffect, useCallback, useMemo } from 'react';
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
import DocumentsList from '../components/DocumentsList';
import PaymentHistoryDisplay, { PaymentRecord } from '../components/PaymentHistoryDisplay';
// Extracted local components
import TopBar from './components/TopBar';
import ProfileHeader from './components/ProfileHeader';
import TabsNav from './components/TabsNav';
import GeneralTab from './components/tabs/GeneralTab';
import PayrollTab from './components/tabs/PayrollTab';
import LoansTab from './components/tabs/LoansTab';
import LeaveTab from './components/tabs/LeaveTab';
import EmployeeFormPanel from './components/panels/EmployeeFormPanel';
import SalaryFormPanel from './components/panels/SalaryFormPanel';
import SalaryComponentPanel from './components/panels/SalaryComponentPanel';
import LeaveRequestPanel from './components/panels/LeaveRequestPanel';
import DocumentUploadPanel from './components/panels/DocumentUploadPanel';
import { useGlobal } from '@/app/Context/context';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PayslipPreview, { PayslipData } from '../Payrun/_components/PayslipPreview';

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

	// Payslip preview state
	const [isPayslipOpen, setIsPayslipOpen] = useState(false);
	const [payslipData, setPayslipData] = useState<PayslipData | null>(null);

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
		// Navigate to the Loans section/page
		router.push('/Loan');
	};

	const handleUploadDocument = () => {
		setShowDocumentUpload(true);
	};

	const handleRequestLeave = () => {
		setShowLeaveRequestForm(true);
	};

	// Handler to open payslip preview using Payrun component
	const handleGeneratePayslip = useCallback((paymentRecord: PaymentRecord) => {
		if (!employee) return;
		const earnings = Object.entries(paymentRecord.earnings_breakdown || {}).map(([description, amount]) => ({ description, amount }));
		const deductions = Object.entries(paymentRecord.deductions_breakdown || {}).map(([description, amount]) => ({ description, amount }));
		const data: PayslipData = {
			employeeName: `${employee.first_name} ${employee.last_name}`,
			companyName: (employee as any)?.company_name,
			employeeID: employee.employee_id,
			position: employee.job_title,
			payPeriod: paymentRecord.pay_period || paymentRecord.period,
			paymentDate: paymentRecord.pay_date,
			earnings,
			deductions,
			netPay: paymentRecord.net_salary || paymentRecord.net,
		};
		setPayslipData(data);
		setIsPayslipOpen(true);
	}, [employee]);

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

	// tabs now handled by TabsNav

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
			<TopBar isLoading={isLoadingEmployeeDetail} onBack={onClose} onEndEmployment={handleEndEmployment} />

			{/* Detail header (avatar, name, role, id) matching design */}
			<ProfileHeader firstName={employee.first_name} lastName={employee.last_name} jobTitle={employee.job_title} employeeId={employee.employee_id} />

			{/* Tabs - exactly like original */}
			<TabsNav active={activeTab} onChange={(t) => handleTabChange(t as any)} disabled={isAnyFormOpen} />

			{/* Content with Form Overlay - exactly like original */}
			<div className='flex-1 overflow-hidden relative'>
				{/* Main Content */}
				<div
					className={`${
						isAnyFormOpen ? 'w-1/2' : 'w-full'
					} h-full overflow-y-auto bg-gray-50 transition-all duration-300`}>
					<div className='max-w-7xl mx-auto p-6'>
												{activeTab === 'general' && (
													<GeneralTab
														employee={employee}
														formatDate={formatDate as any}
														getDepartmentValue={getDepartmentValue}
														getEmployeeType={getEmployeeType as any}
														getPayFrequency={getPayFrequency as any}
														onEditGeneral={handleEmployeeEdit}
														onEditSalary={handleSalaryEdit}
														formatCurrency={formatCurrency as any}
														getSalaryValue={getSalaryValue}
													/>
												)}

												{activeTab === 'payroll' && (
													<PayrollTab employee={payrollEmployee} onSetupPayroll={handleSalaryComponentSetup} />
												)}

						{activeTab === 'document' && (
							<DocumentsList
								employee={employee}
								onUploadDocument={handleUploadDocument}
							/>
						)}

												{activeTab === 'loan' && (
													<LoansTab employee={employee as any} loans={loans as any} isLoading={isLoadingLoans} getLoanStatus={getLoanStatus} formatCurrency={(n) => formatCurrency(n) as any} formatDate={formatDate} onAddLoan={handleAddLoan} />
												)}

												{activeTab === 'leave' && (
													<LeaveTab employee={employee as any} leaveRequests={leaveRequests as any} isLoading={isLoadingLeaveRequests} onRequestLeave={handleRequestLeave} />
												)}

						{activeTab === 'payment-history' && (
							<PaymentHistoryDisplay
								employee={employee}
								onGeneratePayslip={handleGeneratePayslip}
							/>
						)}
					</div>
				</div>

				{/* Form Overlay Panels - exactly like original */}
								{showEmployeeForm && (
									<EmployeeFormPanel isOpen={showEmployeeForm} employee={employee} editType={editParam === 'salary' ? 'salary' : 'general'} onClose={handleCloseEmployeeForm} onSubmit={handleEmployeeSubmit} />
								)}

				{/* Right Side Form Panel - Salary Form Overlay */}
								{showSalaryForm && (
									<SalaryFormPanel isOpen={showSalaryForm} employee={employee} onClose={handleCloseSalaryForm} onSubmit={handleSalarySubmit} />
								)}

				{/* Right Side Form Panel - Salary Component Setup Overlay */}
								{showSalaryComponentSetup && (
									<SalaryComponentPanel employee={stableSalaryComponentEmployee} onClose={handleCloseSalaryComponentSetup} onSubmit={handleSalaryComponentSubmit} />
								)}

				{/* Right Side Form Panel - Leave Request Form Overlay */}
								{showLeaveRequestForm && (
									<LeaveRequestPanel employee={employee} onClose={handleCloseLeaveRequestForm} onSubmit={handleLeaveRequestSubmit} />
								)}

				{/* Right Side Form Panel - Document Upload Form Overlay */}
								{showDocumentUpload && (
									<DocumentUploadPanel employee={employee} isOpen={showDocumentUpload} onClose={handleCloseDocumentUpload} onSubmit={handleDocumentUploadSubmit} />
								)}

				{/* Payslip Preview Modal */}
				<Dialog open={isPayslipOpen} onOpenChange={setIsPayslipOpen}>
					<DialogContent className='max-w-3xl w-full'>
						<DialogHeader>
							<DialogTitle>Employee Payslip</DialogTitle>
						</DialogHeader>
						{payslipData && <PayslipPreview data={payslipData} />}
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
};

export default function EmployeeDetailsPageWrapper() {
	return (
		<Suspense fallback={<div>Loading Employee Details...</div>}>
			<EmployeeDetailsPage />
		</Suspense>
	);
}
