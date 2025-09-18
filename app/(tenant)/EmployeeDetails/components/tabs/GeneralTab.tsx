import React from 'react';
import DetailField from '../DetailField';

export interface GeneralTabProps {
  employee: any;
  formatDate: (s?: string) => string;
  getDepartmentValue: (e: any) => string;
  getEmployeeType: (s: string) => string;
  getPayFrequency: (s: string) => string;
  onEditGeneral: () => void;
  onEditSalary: () => void;
  formatCurrency: (n: number | undefined | null) => string;
  getSalaryValue: (e: any) => number;
}

const GeneralTab: React.FC<GeneralTabProps> = ({ employee, formatDate, getDepartmentValue, getEmployeeType, getPayFrequency, onEditGeneral, onEditSalary, formatCurrency, getSalaryValue }) => (
  <div className='space-y-6'>
    {/* Basic Details */}
    <div className='bg-white rounded-lg shadow-sm'>
      <div className='flex items-center justify-between p-6 border-b border-gray-200'>
        <h3 className='text-lg font-medium text-gray-900'>Basic Details</h3>
        <button onClick={onEditGeneral} className='inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'>
          Edit
        </button>
      </div>
      <div className='p-6'>
        <dl className='grid grid-cols-3 gap-x-6 gap-y-4'>
          <DetailField label='First Name' value={employee.first_name} />
          <DetailField label='Last Name' value={employee.last_name} />
          <DetailField label='Gender' value={employee.gender} />
          <DetailField label='Phone number' value={employee.phone_number} />
          <DetailField label='Email Address' value={employee.email} />
          <DetailField label='Date of Birth' value={formatDate(employee.date_of_birth)} />
        </dl>
      </div>
    </div>

    {/* Employment Details */}
    <div className='bg-white rounded-lg shadow-sm'>
      <div className='flex items-center justify-between p-6 border-b border-gray-200'>
        <h3 className='text-lg font-medium text-gray-900'>Employment Details</h3>
        <button onClick={onEditGeneral} className='inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'>
          Edit
        </button>
      </div>
      <div className='p-6'>
        <dl className='grid grid-cols-3 gap-x-6 gap-y-4'>
          <DetailField label='Employee ID' value={employee.employee_id} />
          <DetailField label='Job Title' value={employee.job_title} />
          <DetailField label='Department' value={getDepartmentValue(employee)} />
          <DetailField label='Employee Type' value={getEmployeeType(employee.employment_type)} />
          <DetailField label='Start Date' value={formatDate(employee.start_date)} />
          <DetailField label='Tax Start Date' value={formatDate(employee.tax_start_date)} />
        </dl>
      </div>
    </div>

    {/* Payment Details */}
    <div className='bg-white rounded-lg shadow-sm'>
      <div className='flex items-center justify-between p-6 border-b border-gray-200'>
        <h3 className='text-lg font-medium text-gray-900'>Payment Details</h3>
        <button onClick={onEditSalary} className='inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'>
          Edit
        </button>
      </div>
      <div className='p-6'>
        <dl className='grid grid-cols-3 gap-x-6 gap-y-4'>
          <DetailField label='Account Number' value={employee.account_number} />
          <DetailField label='Bank Name' value={employee.bank_name} />
          <DetailField label='Account Name' value={employee.account_name} />
          <DetailField label='Pay Frequency' value={getPayFrequency(employee.pay_frequency)} />
          <DetailField label='PAYE Applicable' value={employee.is_paye_applicable ? 'Yes' : 'No'} />
          <DetailField label='Pension Applicable' value={employee.is_pension_applicable ? 'Yes' : 'No'} />
          <DetailField label='NHF Applicable' value={employee.is_nhf_applicable ? 'Yes' : 'No'} />
          <DetailField label='NSITF Applicable' value={employee.is_nsitf_applicable ? 'Yes' : 'No'} />
          <DetailField label='Gross Salary' value={formatCurrency(getSalaryValue(employee))} />
        </dl>
      </div>
    </div>
  </div>
);

export default GeneralTab;
