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
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { format, parseISO, isValid } from 'date-fns';
import SalarySetupForm from './SalarySetupForm';
import { useGlobal } from '@/app/Context/context';

// Define the Employee interface to match your API
interface Employee {
	id?: number;
	employee_id: string;
	first_name: string;
	last_name: string;
	email: string;
	phone_number: string;
	gender: string;
	date_of_birth: string;
	address: string;
	employment_type: string;
	start_date: string;
	tax_start_date: string;
	job_title: string;
	// Support both field names from API
	department?: string;
	department_name?: string;
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
	editType?: 'general' | 'salary';
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
	editType,
	onClose,
	onSubmit
}) => {
	const router = useRouter();
	const { tenant, globalState } = useGlobal();
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
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Fetch employee details for editing
	const fetchEmployeeDetails = async () => {
		if (!isEdit || !employeeData?.employee_id) return;

		const baseURL = `${tenant}.exxforce.com`;
		try {
			const response = await axios.get(
				`https://${baseURL}/tenant/employee/detail/${employeeData.employee_id}`,
				{
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${globalState.accessToken}`,
					},
				}
			);

			console.log('Employee details fetched for EmployeeForm editing:', response.data);

			if (response.data) {
				const employee = response.data;
				
				// Split address if it contains a comma
				const addressParts = employee.address ? employee.address.split(', ') : ['', ''];
				
				// Get department value and try to match it with available options
				const rawDepartmentValue = getDepartmentValue(employee);
				const matchingDepartment = findMatchingDepartment(rawDepartmentValue);
				const departmentToUse = matchingDepartment ? matchingDepartment.name : rawDepartmentValue;
				
				console.log('Department processing:', {
					raw: rawDepartmentValue,
					matched: matchingDepartment?.name,
					final: departmentToUse
				});
				
				const newFormData = {
					employeeId: employee.employee_id || '',
					jobTitle: employee.job_title || '',
					department: departmentToUse,
					employmentType: employee.employment_type || '',
					startDate: formatDateForInput(employee.start_date),
					taxStartDate: formatDateForInput(employee.tax_start_date),
					firstName: employee.first_name || '',
					lastName: employee.last_name || '',
					phone: employee.phone_number || '',
					email: employee.email || '',
					gender: employee.gender || '',
					dob: formatDateForInput(employee.date_of_birth),
					address1: addressParts[0] || '',
					address2: addressParts[1] || '',
				};
				
				console.log('Setting EmployeeForm data to:', newFormData);
				setFormData(newFormData);
			}
		} catch (error) {
			console.error('Error fetching employee details for EmployeeForm editing:', error);
			// Keep existing form data if API call fails
		}
	};

	// Helper function to get department value from employee data
	const getDepartmentValue = (employee: Employee | null): string => {
		if (!employee) return '';
		// Check both possible field names
		const deptValue = employee.department || employee.department_name || '';
		console.log('Raw department value from API:', deptValue);
		return deptValue;
	};

	// Helper function to find matching department option
	// Accepts departmentValue as: string (name), number (id), or object { id, name, department_name }
	const findMatchingDepartment = (departmentValue: any): Department | null => {
		if (!departmentValue || departments.length === 0) return null;

		// Normalize possible search tokens
		let searchId: string | null = null;
		let searchName: string | null = null;

		if (typeof departmentValue === 'object') {
			if (departmentValue.id !== undefined && departmentValue.id !== null) {
				searchId = String(departmentValue.id);
			}
			if (departmentValue.name) searchName = String(departmentValue.name);
			if (!searchName && departmentValue.department_name) searchName = String(departmentValue.department_name);
		} else if (typeof departmentValue === 'number') {
			searchId = String(departmentValue);
		} else {
			searchName = String(departmentValue);
		}

		// Try matching by id first (department id returned by API)
		if (searchId) {
			const byId = departments.find(d => String(d.id) === searchId);
			if (byId) return byId;
		}

		// Then try exact name matches (case sensitive then insensitive)
		if (searchName) {
			let match = departments.find(d => d.name === searchName);
			if (match) return match;

			match = departments.find(d => d.name.toLowerCase() === searchName!.toLowerCase());
			if (match) return match;

			// Partial match (either contains the other)
			match = departments.find(d => d.name.toLowerCase().includes(searchName!.toLowerCase()) || searchName!.toLowerCase().includes(d.name.toLowerCase()));
			if (match) return match;
		}

		// No match found
		console.log('Department matching result:', {
			searchId,
			searchName,
			availableDepartments: departments.map(d => ({ id: d.id, name: d.name }))
		});

		return null;
	};

	// Helper function to format date for input (YYYY-MM-DD)
	const formatDateForInput = (dateString: string): string => {
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
			}
			
			return '';
		} catch (error) {
			console.warn('Error formatting date for input:', dateString, error);
			return '';
		}
	};

	// Function to format date for API (YYYY-MM-DD format)
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

	// Get today's date in YYYY-MM-DD format for max date validation
	const getTodayFormatted = (): string => {
		return format(new Date(), 'yyyy-MM-dd');
	};

	// Function to prepare employee data for API
	const prepareEmployeeDataForAPI = () => {
		return {
			employee_id: isEdit ? (employeeData?.employee_id || formData.employeeId) : formData.employeeId,
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
	};

	// Function to fetch departments from API
	const fetchDepartments = async () => {
		setLoadingDepartments(true);
		setDepartmentError('');
		const baseURL = `${tenant}.exxforce.com`;
		
		try {
			const response = await axios.get(
				`https://${baseURL}/tenant/employee/departments`,
				{
					headers: {
						Authorization: `Bearer ${globalState.accessToken}`,
					},
				}
			);
			
			console.log('Departments fetched:', response.data);
			
			let departments: Department[] = [];
			if (Array.isArray(response.data)) {
				departments = response.data;
			}
			else if (response.data.data && Array.isArray(response.data.data)) {
				departments = response.data.data;
			}
			else if (response.data.departments && Array.isArray(response.data.departments)) {
				departments = response.data.departments;
			}
			else {
				console.warn('Unexpected departments API response structure:', response.data);
				setDepartmentError('Unexpected response format');
				departments = [];
			}
			
			console.log('Processed departments:', departments);
			setDepartments(departments);
			
		} catch (error) {
			console.error('Error fetching departments:', error);
			setDepartmentError('Failed to load departments');
			
			// Fallback to hardcoded departments that match your data
			setDepartments([
				{ id: 'engineering-tech', name: 'Engineering & Tech' },
				{ id: 'hr', name: 'Human Resources' },
				{ id: 'finance', name: 'Finance' },
				{ id: 'marketing', name: 'Marketing' }
			]);
		} finally {
			setLoadingDepartments(false);
		}
	};



	// Populate form when editing or fetch fresh data from API
	useEffect(() => {
		console.log('useEffect triggered - isEdit:', isEdit, 'employeeData:', employeeData);
		
		// First fetch departments
		fetchDepartments();
		
		if (isEdit && employeeData) {
			// Fetch fresh employee details from API for editing
			fetchEmployeeDetails();
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
	}, [isEdit, employeeData, tenant, globalState.accessToken]);

	// Re-process department matching when departments are loaded
	useEffect(() => {
		if (departments.length > 0 && formData.department && isEdit) {
			const matchingDepartment = findMatchingDepartment(formData.department);
			if (matchingDepartment && matchingDepartment.name !== formData.department) {
				console.log('Updating department to match available options:', {
					original: formData.department,
					matched: matchingDepartment.name
				});
				setFormData(prev => ({
					...prev,
					department: matchingDepartment.name
				}));
			}
		}
	}, [departments, formData.department, isEdit]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		setFormData((prev) => ({ ...prev, [id]: value }));
	};

	const handleSelectChange = (key: keyof FormData, value: string) => {
		console.log(`Setting ${key} to:`, value);
		setFormData((prev) => ({ ...prev, [key]: value }));
	};

	// Remove validation - allow submission with partial data
	const validateFormData = (): boolean => {
		// No required field validation - allow submission with any data
		return true;
	};

	// Handle save employee
	const handleSaveEmployee = async () => {
		console.log('Form submission started...');
		console.log('Form data:', formData);
		console.log('Employee data:', employeeData);
		console.log('Is edit mode:', isEdit);

		if (!validateFormData()) {
			return false;
		}

		// Additional validation for edit mode
		if (isEdit && (!employeeData?.employee_id || !formData.employeeId)) {
			console.error('Edit mode but missing employee_id:', {
				employeeData_employee_id: employeeData?.employee_id,
				formData_employeeId: formData.employeeId
			});
			alert('Error: Employee ID is required for updates');
			return false;
		}

		const apiData = prepareEmployeeDataForAPI();
		setIsSubmitting(true);

		try {
			console.log('Starting API call...');
			console.log('Is edit mode:', isEdit);
			console.log('Employee data:', employeeData);
			console.log('Complete API payload:', JSON.stringify(apiData, null, 2));
			console.log('Target URL:', isEdit ? `https://${tenant}.exxforce.com/tenant/employee/update/${employeeData?.employee_id}` : `https://${tenant}.exxforce.com/tenant/employee/create`);

			let response;
			
			if (isEdit && employeeData?.employee_id) {
				console.log('Updating employee with employee_id:', employeeData.employee_id);
				// Use employee_id from employeeData (not from form since it's disabled)
				const updateEmployeeId = employeeData.employee_id;
				response = await axios.put(
					`https://${tenant}.exxforce.com/tenant/employee/update/${updateEmployeeId}`,
					apiData,
					{ 
						headers: { 
							'Content-Type': 'application/json',
							Authorization: `Bearer ${globalState.accessToken}`,
						} 
					}
				);
				console.log('Employee updated:', response.data);
			} else {
				console.log('Creating new employee...');
				response = await axios.post(
					`https://${tenant}.exxforce.com/tenant/employee/create`,
					apiData,
					{ 
						headers: { 
							'Content-Type': 'application/json',
							Authorization: `Bearer ${globalState.accessToken}`,
						} 
					}
				);
				console.log('Employee created:', response.data);
			}

			// Call the parent's onSubmit handler
			console.log('Calling parent onSubmit...');
			await onSubmit(apiData);
			
			console.log('Success! Employee saved.');
		
		// Hard redirect back to employee list page
		window.location.href = `/Employee`;
		return true;		} catch (error) {
			console.error('Error saving employee:', error);
			
			if (axios.isAxiosError(error)) {
				console.error('Request that failed:', JSON.stringify(apiData, null, 2));
				console.error('Response status:', error.response?.status);
				console.error('Response data:', error.response?.data);
				console.error('Request URL:', error.config?.url);
				console.error('Request method:', error.config?.method);
				console.error('Request headers:', error.config?.headers);
				
				if (error.response?.status === 422) {
					alert(`Validation Error: ${JSON.stringify(error.response.data, null, 2)}`);
				} else if (error.response?.status === 500) {
					alert(`Server Error (500): ${error.response?.data?.message || 'Internal server error occurred'}`);
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
		await handleSaveEmployee();
	};

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
								onChange={handleChange}
								disabled={isEdit}
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='jobTitle'>Job Title</Label>
							<Input 
								id='jobTitle' 
								value={formData.jobTitle}
								onChange={handleChange} 
							/>
						</div>
						<div className='space-y-2'>
							<Label>Department</Label>
							<Select 
								value={formData.department}
								onValueChange={(val) => handleSelectChange('department', val)} 
								disabled={loadingDepartments}
							>
								<SelectTrigger>
									<SelectValue placeholder={
										loadingDepartments 
											? 'Loading departments...' 
											: formData.department || 'Select department'
									} />
								</SelectTrigger>
								<SelectContent>
									{/* Show all available departments */}
									{departments.map((dept) => (
										<SelectItem 
											key={dept.id}
											value={dept.name}
										>
											{dept.name}
										</SelectItem>
									))}
									{/* If current value doesn't match any department, show it as an option */}
									{formData.department && 
									 !departments.some(dept => dept.name === formData.department) && (
										<SelectItem value={formData.department}>
											{formData.department}
										</SelectItem>
									)}
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
								onChange={handleChange}
								className="block w-full"
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='taxStartDate'>Tax Start Date</Label>
							<Input 
								id='taxStartDate' 
								type='date' 
								value={formData.taxStartDate}
								max="2099-12-31"
								min="1900-01-01"

								onChange={handleChange}
								className="block w-full"
							/>
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

								onChange={handleChange} 
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='lastName'>Last Name</Label>
							<Input 
								id='lastName' 
								value={formData.lastName}

								onChange={handleChange} 
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='phone'>Phone Number</Label>
							<Input 
								id='phone' 
								type='tel' 
								value={formData.phone}

								onChange={handleChange} 
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='email'>Work Email</Label>
							<Input 
								id='email' 
								type='email' 
								value={formData.email}

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

								onChange={handleChange}
								className="block w-full"
							/>
						</div>
						<div className='space-y-2 md:col-span-2'>
							<Label htmlFor='address1'>Address Line 1</Label>
							<Input 
								id='address1' 
								value={formData.address1}

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
					<Button
						type='submit'
						disabled={isSubmitting}
						className='bg-[#3D56A8] hover:bg-[#2E4299]'>
						{isSubmitting ? (isEdit ? 'Updating...' : 'Saving...') : (isEdit ? 'Update Employee' : 'Save Employee')}
					</Button>
				</div>
			</form>
		</div>
	);
};

export default EmployeeForm;
