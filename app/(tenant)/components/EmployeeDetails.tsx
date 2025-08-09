
'use client'

import React, { useState } from 'react';
import { X, Edit2, Trash2, Clock, FileText, DollarSign, Calendar, CreditCard, Upload } from 'lucide-react';

// Import your forms - adjust paths according to your project structure
import EmployeeForm from './EmployeeForm';
import SalarySetupForm from './SalarySetupForm';

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
  onEmployeeUpdated?: (updatedEmployee: Employee) => void;
  onEndEmployment?: (employee: Employee) => void;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({
  employee,
  onClose,
  onEmployeeUpdated,
  onEndEmployment
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'payroll' | 'document' | 'loan' | 'leave' | 'payment-history'>('general');
  const [isEmployeeFormOpen, setIsEmployeeFormOpen] = useState(false);
  const [isSalaryFormOpen, setIsSalaryFormOpen] = useState(false);

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

  const handleEmployeeFormSave = async (updatedEmployeeData: any) => {
    try {
      // Convert the form data back to Employee format
      const updatedEmployee: Employee = {
        ...employee,
        employee_id: updatedEmployeeData.employee_id,
        first_name: updatedEmployeeData.first_name,
        last_name: updatedEmployeeData.last_name,
        email: updatedEmployeeData.email,
        phone_number: updatedEmployeeData.phone_number,
        gender: updatedEmployeeData.gender,
        date_of_birth: updatedEmployeeData.date_of_birth,
        address: updatedEmployeeData.address,
        employment_type: updatedEmployeeData.employment_type,
        start_date: updatedEmployeeData.start_date,
        tax_start_date: updatedEmployeeData.tax_start_date,
        job_title: updatedEmployeeData.job_title,
        department_name: updatedEmployeeData.department_name
      };

      // Call parent's update handler
      onEmployeeUpdated?.(updatedEmployee);
      setIsEmployeeFormOpen(false);
    } catch (error) {
      console.error('Error handling employee form save:', error);
    }
  };

  const handleSalaryFormSave = async (updatedSalaryData: any) => {
    try {
      // Convert the salary form data back to Employee format
      const updatedEmployee: Employee = {
        ...employee,
        pay_grade_name: updatedSalaryData.pay_grade_name,
        custom_salary: updatedSalaryData.custom_salary,
        bank_name: updatedSalaryData.bank_name,
        account_number: updatedSalaryData.account_number,
        account_name: updatedSalaryData.account_name,
        pay_frequency: updatedSalaryData.pay_frequency,
        is_paye_applicable: updatedSalaryData.is_paye_applicable,
        is_pension_applicable: updatedSalaryData.is_pension_applicable,
        is_nhf_applicable: updatedSalaryData.is_nhf_applicable,
        is_nsitf_applicable: updatedSalaryData.is_nsitf_applicable
      };

      // Call parent's update handler
      onEmployeeUpdated?.(updatedEmployee);
      setIsSalaryFormOpen(false);
    } catch (error) {
      console.error('Error handling salary form save:', error);
    }
  };

  // Enhanced Modal Component with higher z-index and better positioning
  const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ 
    isOpen, 
    onClose, 
    title, 
    children 
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-[9999] overflow-y-auto" style={{ zIndex: 9999 }}>
        {/* Backdrop */}
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div 
            className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
            aria-hidden="true"
            onClick={onClose}
          />

          {/* Modal positioning */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          {/* Modal content */}
          <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-white z-10 pb-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
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

  // Empty State Components
  const PayrollEmptyState: React.FC = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="mb-8">
        <div className="relative">
          {/* Payroll illustration */}
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
          
          {/* Plus icon */}
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
          {/* Document illustration */}
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
          
          {/* Upload icon */}
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
          {/* Loan illustration */}
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
          
          {/* Plus icon */}
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
          {/* Leave illustration */}
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
          
          {/* Plus icon */}
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
          {/* Payment history illustration */}
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
          
          {/* History icon */}
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
    <>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                {/* Basic Details */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Basic Details</h3>
                    <button
                      onClick={() => setIsEmployeeFormOpen(true)}
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
                      onClick={() => setIsEmployeeFormOpen(true)}
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
                      onClick={() => setIsSalaryFormOpen(true)}
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
                      onClick={() => setIsSalaryFormOpen(true)}
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
      </div>

      {/* Modals - Rendered outside the main component to avoid z-index issues */}
      <Modal 
        isOpen={isEmployeeFormOpen} 
        onClose={() => setIsEmployeeFormOpen(false)}
        title="Edit Employee Details"
      >
        <EmployeeForm
          isOpen={isEmployeeFormOpen}
          isEdit={true}
          employeeData={employee}
          onClose={() => setIsEmployeeFormOpen(false)}
          onSubmit={handleEmployeeFormSave}
        />
      </Modal>

      <Modal 
        isOpen={isSalaryFormOpen} 
        onClose={() => setIsSalaryFormOpen(false)}
        title="Edit Salary Details"
      >
        <SalarySetupForm
          employeeData={employee}
          onClose={() => setIsSalaryFormOpen(false)}
          onSubmit={handleSalaryFormSave}
          onBack={() => setIsSalaryFormOpen(false)}
        />
      </Modal>
    </>
  );
};

export default EmployeeDetails;