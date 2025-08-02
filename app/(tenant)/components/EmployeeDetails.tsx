import React, { useState } from 'react';
import { X, Edit2, Trash2, Clock } from 'lucide-react';

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
  onEdit: (employee: Employee) => void;
  onEndEmployment?: (employee: Employee) => void;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({
  employee,
  onClose,
  onEdit,
  onEndEmployment
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'payroll' | 'document' | 'loan' | 'leave' | 'payment-history'>('general');

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
                    onClick={() => onEdit(employee)}
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
                    onClick={() => onEdit(employee)}
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
                    onClick={() => onEdit(employee)}
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
            </div>
          )}

          {activeTab === 'payroll' && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-gray-500">Payroll information will be displayed here</p>
            </div>
          )}

          {activeTab === 'document' && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-gray-500">Document information will be displayed here</p>
            </div>
          )}

          {activeTab === 'loan' && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-gray-500">Loan information will be displayed here</p>
            </div>
          )}

          {activeTab === 'leave' && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-gray-500">Leave information will be displayed here</p>
            </div>
          )}

          {activeTab === 'payment-history' && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-gray-500">Payment history will be displayed here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;