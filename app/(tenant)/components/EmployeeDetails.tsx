'use client'

import React, { useState } from 'react';
import { X, Edit2, Trash2, Clock, FileText, DollarSign, Calendar, CreditCard, Upload } from 'lucide-react';
import EmployeeForm from '../components/EmployeeForm'; // Import the EmployeeForm

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

interface EmployeeDetailsProps {
  employee: Employee;
  onClose: () => void;
  onEdit: (employee: Employee, editType?: 'general' | 'salary') => void;
  onSalaryEdit: (employee: Employee) => void; // For salary details
  onEndEmployment?: (employee: Employee) => void;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({
  employee,
  onClose,
  onEdit,
  onSalaryEdit,
  onEndEmployment
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'payroll' | 'document' | 'loan' | 'leave' | 'payment-history'>('general');
  
  // New state for inline editing
  const [showEmployeeForm, setShowEmployeeForm] = useState<boolean>(false);
  const [editType, setEditType] = useState<'general' | 'salary'>('general');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
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
        year: 'numeric'
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

  // Handler for Basic Details and Employment Details edit
  const handleEmployeeEdit = (e: any) => {
    e.preventDefault();
    setEditType('general');
    setShowEmployeeForm(true);
  };

  // Handler for Salary & Payment Details edit
  const handleSalaryEdit = () => {
    setEditType('salary');
    setShowEmployeeForm(true);
  };

  // Handler for closing the inline form
  const handleCloseEmployeeForm = () => {
    setShowEmployeeForm(false);
  };

  // Handler for form submission
  const handleEmployeeSubmit = async (employeeFormData: any) => {
    try {
      console.log('Updating employee:', employeeFormData);
      // Call the parent's onEdit handler to update the employee
      onEdit(employee, editType);
      // Close the form after successful submission
      setShowEmployeeForm(false);
    } catch (error) {
      console.error('Error submitting employee:', error);
    }
  };

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'payroll', label: 'Payroll' },
    { id: 'document', label: 'Document' },
    { id: 'loan', label: 'Loan' },
    { id: 'leave', label: 'Leave' },
    { id: 'payment-history', label: 'Payment History' }
  ];

  const DetailField: React.FC<{ label: string; value: string | number; fullWidth?: boolean }> = ({ 
    label, 
    value, 
    fullWidth = false 
  }) => (
    <div className={fullWidth ? 'col-span-3' : ''}>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">{value || '--'}</dd>
    </div>
  );

  // Empty State Components (keeping all the same as before)
  const PayrollEmptyState: React.FC = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="mb-8">
        <div className="relative">
          <div className="bg-white rounded-lg shadow-lg p-6 w-56 h-36 border">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-xs text-gray-400">Payroll</div>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-green-200 rounded w-full"></div>
              <div className="h-2 bg-green-100 rounded w-3/4"></div>
              <div className="h-2 bg-green-100 rounded w-1/2"></div>
            </div>
          </div>
          
          <div className="absolute -bottom-3 -right-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-2">No payroll records</h3>
      <p className="text-gray-600 max-w-md mb-6 leading-relaxed">
        Payroll records for {employee.first_name} {employee.last_name} will appear here once they are processed.
      </p>

      <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
        <DollarSign className="w-4 h-4" />
        Process Payroll
      </button>
    </div>
  );

  const DocumentEmptyState: React.FC = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="mb-8">
        <div className="relative">
          <div className="bg-white rounded-lg shadow-lg p-6 w-56 h-36 border">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-xs text-gray-400">Documents</div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-50 rounded border flex items-center justify-center">
                  <FileText className="w-3 h-3 text-blue-400" />
                </div>
                <div className="h-2 bg-blue-100 rounded flex-1"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-50 rounded border flex items-center justify-center">
                  <FileText className="w-3 h-3 text-blue-400" />
                </div>
                <div className="h-2 bg-blue-100 rounded w-2/3"></div>
              </div>
            </div>
          </div>
          
          <div className="absolute -bottom-3 -right-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <Upload className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-2">No documents uploaded</h3>
      <p className="text-gray-600 max-w-md mb-6 leading-relaxed">
        Upload important documents for {employee.first_name} {employee.last_name} such as contracts, ID copies, or certificates.
      </p>

      <div className="flex gap-3">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
        <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-2 rounded-lg font-medium transition-colors">
          View Templates
        </button>
      </div>
    </div>
  );

  const LoanEmptyState: React.FC = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="mb-8">
        <div className="relative">
          <div className="bg-white rounded-lg shadow-lg p-6 w-56 h-36 border">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-xs text-gray-400">Loans</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="h-2 bg-orange-200 rounded w-1/3"></div>
                <div className="text-xs text-gray-400">₦0</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-2 bg-orange-100 rounded w-1/4"></div>
                <div className="text-xs text-gray-400">₦0</div>
              </div>
            </div>
          </div>
          
          <div className="absolute -bottom-3 -right-3">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-2">No loan records</h3>
      <p className="text-gray-600 max-w-md mb-6 leading-relaxed">
        Track and manage loans for {employee.first_name} {employee.last_name}. Set up salary advances or employee loans here.
      </p>

      <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
        <CreditCard className="w-4 h-4" />
        Create Loan
      </button>
    </div>
  );

  const LeaveEmptyState: React.FC = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="mb-8">
        <div className="relative">
          <div className="bg-white rounded-lg shadow-lg p-6 w-56 h-36 border">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-xs text-gray-400">Leave</div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-7 gap-1">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-purple-50 rounded-sm"></div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className={`w-4 h-4 rounded-sm ${i === 2 || i === 3 ? 'bg-purple-200' : 'bg-purple-50'}`}></div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="absolute -bottom-3 -right-3">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-2">No leave records</h3>
      <p className="text-gray-600 max-w-md mb-6 leading-relaxed">
        Manage leave requests and track time off for {employee.first_name} {employee.last_name}. Annual leave, sick days, and other leave types will appear here.
      </p>

      <div className="flex gap-3">
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Request Leave
        </button>
        <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-2 rounded-lg font-medium transition-colors">
          View Policy
        </button>
      </div>
    </div>
  );

  const PaymentHistoryEmptyState: React.FC = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="mb-8">
        <div className="relative">
          <div className="bg-white rounded-lg shadow-lg p-6 w-56 h-36 border">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-indigo-600" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="text-xs text-gray-400">Payments</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="h-2 bg-indigo-200 rounded w-2/3"></div>
                <div className="text-xs text-gray-400">₦0</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-2 bg-indigo-100 rounded w-1/2"></div>
                <div className="text-xs text-gray-400">₦0</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-2 bg-indigo-100 rounded w-3/4"></div>
                <div className="text-xs text-gray-400">₦0</div>
              </div>
            </div>
          </div>
          
          <div className="absolute -bottom-3 -right-3">
            <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg">
              <Clock className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-2">No payment history</h3>
      <p className="text-gray-600 max-w-md mb-6 leading-relaxed">
        Payment history for {employee.first_name} {employee.last_name} will appear here once salary payments are processed.
      </p>

      <div className="flex gap-3">
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          Process Payment
        </button>
        <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-2 rounded-lg font-medium transition-colors">
          View Reports
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white w-full h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-sm font-medium">Back to Employees</span>
          </button>
          <div className="flex items-center space-x-2 ml-4">
            <span className="text-sm text-gray-500">Employee</span>
            <span className="text-sm text-gray-400">/</span>
            <span className="text-sm text-gray-900 font-medium">Employee Details</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Active
          </span>
          <button
            onClick={() => onEndEmployment?.(employee)}
            className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <Clock className="w-4 h-4 mr-2" />
            End Employment
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content with Form Overlay */}
      <div className="flex-1 overflow-hidden relative">
        {/* Main Content */}
        <div className={`${showEmployeeForm ? 'w-1/2' : 'w-full'} h-full overflow-y-auto bg-gray-50 transition-all duration-300`}>
          <div className="max-w-7xl mx-auto p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                {/* Basic Details */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Basic Details</h3>
                    <button
                      onClick={handleEmployeeEdit}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                  </div>
                  <div className="p-6">
                    <dl className="grid grid-cols-3 gap-x-6 gap-y-4">
                      <DetailField label="First Name" value={employee.first_name} />
                      <DetailField label="Last Name" value={employee.last_name} />
                      <DetailField label="Gender" value={employee.gender === 'MALE' ? 'M' : 'F'} />
                      <DetailField label="Phone number" value={employee.phone_number} />
                      <DetailField label="Email Address" value={employee.email} />
                      <DetailField label="Date of Birth" value={formatDate(employee.date_of_birth)} />
                      <DetailField label="Address" value={employee.address} fullWidth />
                    </dl>
                  </div>
                </div>

                {/* Employment Details */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Employment Details</h3>
                    <button
                      onClick={handleEmployeeEdit}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                  </div>
                  <div className="p-6">
                    <dl className="grid grid-cols-3 gap-x-6 gap-y-4">
                      <DetailField label="Employee ID" value={employee.employee_id} />
                      <DetailField label="Job Title" value={employee.job_title} />
                      <DetailField label="Department" value={employee.department_name} />
                      <DetailField label="Employee Type" value={getEmployeeType(employee.employment_type)} />
                      <DetailField label="Start Date" value={formatDate(employee.start_date)} />
                      <DetailField label="Tax Start Date" value={formatDate(employee.tax_start_date)} />
                    </dl>
                  </div>
                </div>

                {/* Salary & Payment Details */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Salary & Payment Details</h3>
                    <button
                      onClick={handleSalaryEdit}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                  </div>
                  <div className="p-6">
                    <dl className="grid grid-cols-3 gap-x-6 gap-y-4">
                      <DetailField label="Account Number" value={employee.account_number} />
                      <DetailField label="Bank Name" value={employee.bank_name} />
                      <DetailField label="Account Name" value={employee.account_name} />
                      <DetailField label="Salary Amount (NGN)" value={formatCurrency(employee.custom_salary)} />
                      <DetailField label="Pay Frequency" value={getPayFrequency(employee.pay_frequency)} />
                    </dl>
                  </div>
                </div>

                {/* Statutory Deduction */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Statutory Deduction</h3>
                    <button
                      onClick={handleSalaryEdit}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-8">
                      {/* Deductions Column */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-4">Deductions</h4>
                        <dl className="space-y-3">
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-600">PAYE (Tax)</dt>
                            <dd className="text-sm text-gray-900 font-medium">
                              {employee.is_paye_applicable ? 'Yes' : 'No'}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-600">Pension</dt>
                            <dd className="text-sm text-gray-900 font-medium">
                              {employee.is_pension_applicable ? 'Yes' : 'No'}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-600">NHSIF</dt>
                            <dd className="text-sm text-gray-900 font-medium">
                              {employee.is_nhf_applicable ? 'Yes' : 'No'}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-600">NTF</dt>
                            <dd className="text-sm text-gray-900 font-medium">
                              {employee.is_nsitf_applicable ? 'Yes' : 'No'}
                            </dd>
                          </div>
                        </dl>
                      </div>

                      {/* Benefits Column */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-4">Benefits</h4>
                        <dl className="space-y-3">
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-600">Housing Allowance</dt>
                            <dd className="text-sm text-gray-900 font-medium">Yes</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-600">NHIS</dt>
                            <dd className="text-sm text-gray-900 font-medium">No</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-600">NHIS</dt>
                            <dd className="text-sm text-gray-900 font-medium">Yes</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-600">NHIS</dt>
                            <dd className="text-sm text-gray-900 font-medium">Yes</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payroll' && <PayrollEmptyState />}
            {activeTab === 'document' && <DocumentEmptyState />}
            {activeTab === 'loan' && <LoanEmptyState />}
            {activeTab === 'leave' && <LeaveEmptyState />}
            {activeTab === 'payment-history' && <PaymentHistoryEmptyState />}
          </div>
        </div>

        {/* Right Side Form Panel - Overlay */}
        {showEmployeeForm && (
          <div className="absolute top-0 right-0 w-1/2 min-w-[600px] h-full bg-white border-l border-gray-200 flex flex-col overflow-hidden shadow-2xl transform transition-transform duration-300 ease-in-out z-10">
            {/* Form Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
              <h2 className="text-lg font-semibold text-gray-900">
                Edit Employee - {editType === 'general' ? 'General Information' : 'Salary & Payment'}
              </h2>
              <button
                onClick={handleCloseEmployeeForm}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close form"
              >
                <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-auto">
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
      </div>
    </div>
  );
};

export default EmployeeDetails;