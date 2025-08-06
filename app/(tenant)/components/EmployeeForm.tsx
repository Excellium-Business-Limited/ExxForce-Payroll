'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectTrigger,
	SelectValue,
	SelectItem,
} from '@/components/ui/select';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import axios from 'axios';
import { format, parseISO, isValid } from 'date-fns';
import SalarySetupForm from './SalarySetupForm';

// Define the Employee interface to match your API
interface Employee {
	id?: number;
	employee_id: string;
	first_name: string;
	last_name: string;
	email: string;
	phone_number: string;
	gender: 'MALE' | 'FEMALE' | 'OTHER' ;
	date_of_birth: string;
	address: string;
	employment_type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';
	start_date: string;
	tax_start_date: string;
	job_title: string;
	department_name: string;
	pay_grade_name?: string;
	custom_salary?: number;
	bank_name?: string;
	account_number?: string;
	account_name?: string;
	pay_frequency?: 'MONTHLY' | 'WEEKLY' | 'BIWEEKLY';
	is_paye_applicable?: boolean;
	is_pension_applicable?: boolean;
	is_nhf_applicable?: boolean;
	is_nsitf_applicable?: boolean;
}

// Define department interface
interface Department {
	id: number | string;
	name: string;
}

// Define props interface for the EmployeeForm component
interface EmployeeFormProps {
	isOpen: boolean;
	isEdit: boolean;
	employeeData: Employee | null;
	onClose: () => void;
	onSubmit: (employeeFormData: any) => Promise<void>;
}

// Form data interface that matches your form fields
interface FormData {
	employeeId: string;
	jobTitle: string;
	department: string;
	employmentType: string;
	startDate: string;
	taxStartDate: string;
	firstName: string;
	lastName: string;
	phone: string;
	email: string;
	gender: string;
	dob: string;
	address1: string;
	address2: string;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
	isOpen,
	isEdit,
	employeeData,
	onClose,
	onSubmit
}) => {
	const [formData, setFormData] = useState<FormData>({
		employeeId: '',
		jobTitle: '',
		department: '',
		employmentType: '',
		startDate: '',
		taxStartDate: '',
		firstName: '',
		lastName: '',
		phone: '',
		email: '',
		gender: '',
		dob: '',
		address1: '',
		address2: '',
	});

	// State for departments
	const [departments, setDepartments] = useState<Department[]>([]);
	const [loadingDepartments, setLoadingDepartments] = useState(false);
	const [departmentError, setDepartmentError] = useState<string>('');

	// State for form flow
	const [showSalaryForm, setShowSalaryForm] = useState(false);
	const [savedEmployeeData, setSavedEmployeeData] = useState<any>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Helper function to format date for input (YYYY-MM-DD) using date-fns
	const formatDateForInput = (dateString: string): string => {
		if (!dateString) return '';
		
		try {
			// Try parsing as ISO string first
			let date = parseISO(dateString);
			
			// If parseISO fails, try creating a new Date object
			if (!isValid(date)) {
				date = new Date(dateString);
			}
			
			// If still invalid, try manual parsing for different formats
			if (!isValid(date)) {
				const parts = dateString.split(/[-\/]/);
				if (parts.length === 3) {
					// Try YYYY-MM-DD or YYYY/MM/DD
					if (parts[0].length === 4) {
						date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
					}
					// Try MM/DD/YYYY or DD/MM/YYYY formats
					else if (parts[2].length === 4) {
						// Assume MM/DD/YYYY format (can be adjusted based on your data)
						date = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
					}
				}
			}
			
			if (isValid(date)) {
				return format(date, 'yyyy-MM-dd');
			}
			
			return '';
		} catch (error) {
			console.warn('Error formatting date for input:', dateString, error);
			return '';
		}
	};

	// Helper function to format date for display in YYYY-MM-DD format
	const formatDateForDisplay = (dateString: string): string => {
		if (!dateString) return '';
		
		try {
			const date = parseISO(dateString);
			if (isValid(date)) {
				return format(date, 'yyyy-MM-dd');
			}
			return dateString;
		} catch (error) {
			return dateString;
		}
	};

	// Get today's date in YYYY-MM-DD format for max date validation
	const getTodayFormatted = (): string => {
		return format(new Date(), 'yyyy-MM-dd');
	};

	// Function to fetch departments from API
	const fetchDepartments = async () => {
		setLoadingDepartments(true);
		setDepartmentError('');
		
		try {
			const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://excellium.localhost:8000';
			const response = await axios.get(`${baseUrl}/tenant/employee/departments`);
			
			console.log('Departments fetched:', response.data);
			
			if (Array.isArray(response.data)) {
				setDepartments(response.data);
			}
			else if (response.data.data && Array.isArray(response.data.data)) {
				setDepartments(response.data.data);
			}
			else if (response.data.departments && Array.isArray(response.data.departments)) {
				setDepartments(response.data.departments);
			}
			else {
				console.warn('Unexpected departments API response structure:', response.data);
				setDepartmentError('Unexpected response format');
			}
			
		} catch (error) {
			console.error('Error fetching departments:', error);
			setDepartmentError('Failed to load departments');
			
			// Fallback to hardcoded departments in case of API failure
			setDepartments([
				{ id: 'hr', name: 'Human Resources' },
				{ id: 'finance', name: 'Finance' },
				{ id: 'engineering', name: 'Engineering' },
				{ id: 'marketing', name: 'Marketing' }
			]);
		} finally {
			setLoadingDepartments(false);
		}
	};

	// Fetch departments on component mount
	useEffect(() => {
		fetchDepartments();
	}, []);

	// Reset form states when component opens/closes
	useEffect(() => {
		if (!isOpen) {
			setShowSalaryForm(false);
			setSavedEmployeeData(null);
		}
	}, [isOpen]);

	// Populate form when editing
	useEffect(() => {
		if (isEdit && employeeData) {
			setFormData({
				employeeId: employeeData.employee_id || '',
				jobTitle: employeeData.job_title || '',
				department: employeeData.department_name || '',
				employmentType: employeeData.employment_type || '',
				startDate: formatDateForInput(employeeData.start_date),
				taxStartDate: formatDateForInput(employeeData.tax_start_date),
				firstName: employeeData.first_name || '',
				lastName: employeeData.last_name || '',
				phone: employeeData.phone_number || '',
				email: employeeData.email || '',
				gender: employeeData.gender || '',
				dob: formatDateForInput(employeeData.date_of_birth),
				address1: employeeData.address || '',
				address2: '',
			});
		} else {
			// Reset form for new employee
			setFormData({
				employeeId: '',
				jobTitle: '',
				department: '',
				employmentType: '',
				startDate: '',
				taxStartDate: '',
				firstName: '',
				lastName: '',
				phone: '',
				email: '',
				gender: '',
				dob: '',
				address1: '',
				address2: '',
			});
		}
	}, [isEdit, employeeData]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		setFormData((prev) => ({ ...prev, [id]: value }));
	};

	const handleSelectChange = (key: keyof FormData, value: string) => {
		setFormData((prev) => ({ ...prev, [key]: value }));
	};

	const handleSaveEmployee = async (showSalaryNext: boolean = false) => {
		console.log('Form submission started...');
		console.log('Form data:', formData);

		// Basic form validation
		const requiredFields = [
			'employeeId', 'jobTitle', 'department', 'employmentType', 
			'startDate', 'taxStartDate', 'firstName', 'lastName', 
			'phone', 'email', 'dob', 'address1'
		];

		const missingFields = requiredFields.filter(field => !formData[field as keyof FormData]);
		
		if (missingFields.length > 0) {
			alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
			console.log('Missing required fields:', missingFields);
			return false;
		}

		// Enhanced date formatting function to ensure YYYY-MM-DD format for API
		const formatDateForAPI = (dateString: string): string => {
			if (!dateString) return '';
			
			try {
				let date = parseISO(dateString);
				
				if (!isValid(date)) {
					date = new Date(dateString);
				}
				
				if (!isValid(date)) {
					const parts = dateString.split(/[-\/]/);
					if (parts.length === 3) {
						if (parts[0].length === 4) {
							date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
						}
						else if (parts[2].length === 4) {
							date = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
						}
					}
				}
				
				if (isValid(date)) {
					return format(date, 'yyyy-MM-dd');
				} else {
					console.warn('Invalid date format:', dateString);
					return '';
				}
			} catch (error) {
				console.error('Error formatting date for API:', dateString, error);
				return '';
			}
		};

		const apiData = {
			employee_id: formData.employeeId,
			job_title: formData.jobTitle,
			department_name: formData.department,
			employment_type: formData.employmentType,
			start_date: formatDateForAPI(formData.startDate),
			tax_start_date: formatDateForAPI(formData.taxStartDate),
			first_name: formData.firstName,
			last_name: formData.lastName,
			phone_number: formData.phone,
			email: formData.email,
			gender: formData.gender || 'PREFER_NOT_TO_SAY',
			date_of_birth: formatDateForAPI(formData.dob),
			address: `${formData.address1}${formData.address2 ? ', ' + formData.address2 : ''}`,
		};

		setIsSubmitting(true);

		try {
			console.log('Starting API call...');
			console.log('Complete API payload:', JSON.stringify(apiData, null, 2));

			const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://excellium.localhost:8000';
			let response;
			if (isEdit && employeeData?.id) {
				console.log('Updating employee with ID:', employeeData.id);
				response = await axios.put(
					`${baseUrl}/tenant/employee/update/${employeeData.id}`,
					apiData,
					{ headers: { 'Content-Type': 'application/json' } }
				);
				console.log('Employee updated:', response.data);
			} else {
				console.log('Creating new employee...');
				response = await axios.post(
					`${baseUrl}/tenant/employee/create`,
					apiData,
					{ headers: { 'Content-Type': 'application/json' } }
				);
				console.log('Employee created:', response.data);
			}

			// Store saved employee data for salary form
			setSavedEmployeeData({ ...apiData, id: response.data.id || employeeData?.id });

			// Call the parent's onSubmit handler
			console.log('Calling parent onSubmit...');
			await onSubmit(apiData);
			
			console.log('Success! Employee saved.');
			
			if (showSalaryNext && !isEdit) {
				// Show salary form for new employees
				setShowSalaryForm(true);
			} else {
				// Regular save - show success message and close
				alert(isEdit ? 'Employee updated successfully!' : 'Employee created successfully!');
				onClose();
			}

			return true;
			
		} catch (error) {
			console.error('Error saving employee:', error);
			
			if (axios.isAxiosError(error)) {
				console.error('Request that failed:', JSON.stringify(apiData, null, 2));
				console.error('Response status:', error.response?.status);
				console.error('Response data:', error.response?.data);
				
				if (error.response?.status === 422) {
					alert(`Validation Error: ${JSON.stringify(error.response.data, null, 2)}`);
				} else {
					alert(`Failed to save employee: ${error.response?.data?.message || error.message}`);
				}
			} else {
				alert('Failed to save employee: Unknown error');
			}
			return false;
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await handleSaveEmployee(false);
	};

	const handleSaveAndNext = async (e: React.FormEvent) => {
		e.preventDefault();
		await handleSaveEmployee(true);
	};

	const handleSalaryFormClose = () => {
		setShowSalaryForm(false);
		onClose();
	};

	const handleSalaryFormSubmit = async (salaryData: any) => {
		// The salary form will handle its own submission
		// After successful submission, close the entire modal
		setShowSalaryForm(false);
		onClose();
	};

	const handleBackToEmployee = () => {
		setShowSalaryForm(false);
	};

	// If showing salary form, render it in a separate dialog
	if (showSalaryForm) {
		return (
			<>
				{/* Keep the employee form dialog open but hidden */}
				<div style={{ display: 'none' }}>
					<div className='ml-auto h-full w-full max-w-2xl bg-white p-6 overflow-y-auto'>
						{/* Employee form content hidden */}
					</div>
				</div>
				
				{/* Render salary form in its own dialog */}
				<Dialog open={showSalaryForm} onOpenChange={setShowSalaryForm}>
					<DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-0">
						<SalarySetupForm
							employeeData={savedEmployeeData}
							onClose={handleSalaryFormClose}
							onSubmit={handleSalaryFormSubmit}
							onBack={handleBackToEmployee}
						/>
					</DialogContent>
				</Dialog>
			</>
		);
	}

	return (
		<div className='ml-auto h-full w-full max-w-2xl bg-white p-6 overflow-y-auto'>
			<div className='mb-8'>
				<h1 className='text-2xl font-bold'>
					{isEdit ? 'Edit Employee' : 'Add Employee'}
				</h1>
				<p className='text-sm text-muted-foreground'>
					{isEdit ? 'Update employee details' : 'Enter employee details'}
				</p>
			</div>

			<form onSubmit={handleSubmit}>
				<div className='space-y-4'>
					<h2 className='text-lg font-semibold'>Employment Details</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div className='space-y-2'>
							<Label htmlFor='employeeId'>Employee ID</Label>
							<Input 
								id='employeeId' 
								value={formData.employeeId}
								required 
								onChange={handleChange} 
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='jobTitle'>Job Title</Label>
							<Input 
								id='jobTitle' 
								value={formData.jobTitle}
								required 
								onChange={handleChange} 
							/>
						</div>
						<div className='space-y-2'>
							<Label>Department</Label>
							<Select 
								value={formData.department}
								onValueChange={(val) => handleSelectChange('department', val)} 
								required
								disabled={loadingDepartments}
							>
								<SelectTrigger>
									<SelectValue placeholder={
										loadingDepartments 
											? 'Loading departments...' 
											: departmentError 
												? 'Error loading departments' 
												: 'Select department'
									} />
								</SelectTrigger>
								<SelectContent>
									{departments.map((dept) => (
										<SelectItem 
											key={dept.id} 
											value={typeof dept.id === 'string' ? dept.id : dept.name}
										>
											{dept.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{departmentError && (
								<p className="text-xs text-red-500 mt-1">
									{departmentError}
									<button 
										type="button"
										onClick={fetchDepartments}
										className="ml-2 text-blue-500 underline hover:no-underline"
									>
										Retry
									</button>
								</p>
							)}
						</div>
						<div className='space-y-2'>
							<Label>Employment Type</Label>
							<Select 
								value={formData.employmentType}
								onValueChange={(val) => handleSelectChange('employmentType', val)} 
								required
							>
								<SelectTrigger>
									<SelectValue placeholder='Select type' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='FULL_TIME'>Full-time</SelectItem>
									<SelectItem value='PART_TIME'>Part-time</SelectItem>
									<SelectItem value='CONTRACT'>Contract</SelectItem>
									<SelectItem value='INTERN'>Intern</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='startDate'>Start Date</Label>
							<Input 
								id='startDate' 
								type='date' 
								value={formData.startDate}
								max="2099-12-31"
								min="1900-01-01"
								required 
								onChange={handleChange}
								className="block w-full"
							/>
							<p className="text-xs text-gray-500">
								{formData.startDate && `Format: ${formatDateForDisplay(formData.startDate)}`}
							</p>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='taxStartDate'>Tax Start Date</Label>
							<Input 
								id='taxStartDate' 
								type='date' 
								value={formData.taxStartDate}
								max="2099-12-31"
								min="1900-01-01"
								required 
								onChange={handleChange}
								className="block w-full"
							/>
							<p className="text-xs text-gray-500">
								{formData.taxStartDate && `Format: ${formatDateForDisplay(formData.taxStartDate)}`}
							</p>
						</div>
					</div>
				</div>

				<div className='space-y-4 mt-8'>
					<h2 className='text-lg font-semibold'>Personal Details</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div className='space-y-2'>
							<Label htmlFor='firstName'>First Name</Label>
							<Input 
								id='firstName' 
								value={formData.firstName}
								required 
								onChange={handleChange} 
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='lastName'>Last Name</Label>
							<Input 
								id='lastName' 
								value={formData.lastName}
								required 
								onChange={handleChange} 
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='phone'>Phone Number</Label>
							<Input 
								id='phone' 
								type='tel' 
								value={formData.phone}
								required 
								onChange={handleChange} 
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='email'>Work Email</Label>
							<Input 
								id='email' 
								type='email' 
								value={formData.email}
								required 
								onChange={handleChange} 
							/>
						</div>
						<div className='space-y-2'>
							<Label>Gender</Label>
							<Select 
								value={formData.gender}
								onValueChange={(val) => handleSelectChange('gender', val)}
							>
								<SelectTrigger>
									<SelectValue placeholder='Select gender' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='MALE'>Male</SelectItem>
									<SelectItem value='FEMALE'>Female</SelectItem>
									<SelectItem value='OTHER'>Other</SelectItem>
									<SelectItem value='PREFER_NOT_TO_SAY'>Prefer not to say</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='dob'>Date of Birth</Label>
							<Input 
								id='dob' 
								type='date' 
								value={formData.dob}
								max={getTodayFormatted()}
								min="1900-01-01"
								required 
								onChange={handleChange}
								className="block w-full"
							/>
							<p className="text-xs text-gray-500">
								{formData.dob && `Format: ${formatDateForDisplay(formData.dob)}`}
							</p>
						</div>
						<div className='space-y-2 md:col-span-2'>
							<Label htmlFor='address1'>Address Line 1</Label>
							<Input 
								id='address1' 
								value={formData.address1}
								required 
								onChange={handleChange} 
							/>
						</div>
						<div className='space-y-2 md:col-span-2'>
							<Label htmlFor='address2'>Address Line 2</Label>
							<Input 
								id='address2' 
								value={formData.address2}
								onChange={handleChange} 
							/>
						</div>
					</div>
				</div>

				<div className='flex justify-end gap-4 pt-4 mt-8'>
					<Button
						variant='outline'
						type='button'
						onClick={onClose}
						disabled={isSubmitting}
						className='text-muted-foreground'>
						Cancel
					</Button>
					{isEdit ? (
						<Button
							type='submit'
							disabled={isSubmitting}
							className='bg-[#3D56A8] hover:bg-[#2E4299]'>
							{isSubmitting ? 'Updating...' : 'Update Employee'}
						</Button>
					) : (
						<>
							<Button
								type='submit'
								disabled={isSubmitting}
								variant='outline'
								className='text-gray-700 border-gray-300'>
								{isSubmitting ? 'Saving...' : 'Save Employee'}
							</Button>
							<Button
								type='button'
								onClick={handleSaveAndNext}
								disabled={isSubmitting}
								className='bg-[#3D56A8] hover:bg-[#2E4299]'>
								{isSubmitting ? 'Saving...' : 'Save and Next'}
							</Button>
						</>
					)}
				</div>
			</form>
		</div>
	);
};

export default EmployeeForm;