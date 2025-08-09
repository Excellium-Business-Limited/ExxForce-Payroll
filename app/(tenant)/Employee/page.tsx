
"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { X, Edit2, Trash2, Clock, FileText, DollarSign, Calendar, CreditCard, Upload } from 'lucide-react';

// Mock components for demonstration
const EmployeeForm = ({ isOpen, isEdit, employeeData, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    job_title: '',
    department_name: '',
    employment_type: '',
    ...employeeData
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h3 className="text-lg font-semibold mb-4">
        {isEdit ? 'Edit Employee' : 'Add New Employee'}
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter first name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter last name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter email"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone_number"
            value={formData.phone_number || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter phone number"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Title *
          </label>
          <input
            type="text"
            name="job_title"
            value={formData.job_title || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter job title"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department *
          </label>
          <select
            name="department_name"
            value={formData.department_name || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select Department</option>
            <option value="Engineering">Engineering</option>
            <option value="Product">Product</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="HR">HR</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Employment Type *
          </label>
          <select
            name="employment_type"
            value={formData.employment_type || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select Type</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERN">Intern</option>
          </select>
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {isEdit ? 'Update' : 'Save'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

const SalarySetupForm = ({ employeeData, onClose, onSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    custom_salary: '',
    bank_name: '',
    account_number: '',
    account_name: '',
    pay_frequency: '',
    is_paye_applicable: true,
    is_pension_applicable: true,
    is_nhf_applicable: true,
    is_nsitf_applicable: true,
    ...employeeData
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h3 className="text-lg font-semibold mb-4">Salary Setup</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Salary Amount (NGN) *
          </label>
          <input
            type="number"
            name="custom_salary"
            value={formData.custom_salary || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter salary amount"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bank Name *
          </label>
          <input
            type="text"
            name="bank_name"
            value={formData.bank_name || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter bank name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Number *
          </label>
          <input
            type="text"
            name="account_number"
            value={formData.account_number || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter account number"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Name *
          </label>
          <input
            type="text"
            name="account_name"
            value={formData.account_name || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter account name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pay Frequency *
          </label>
          <select
            name="pay_frequency"
            value={formData.pay_frequency || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select Frequency</option>
            <option value="MONTHLY">Monthly</option>
            <option value="WEEKLY">Weekly</option>
            <option value="BIWEEKLY">Biweekly</option>
          </select>
        </div>
        
        <div className="border-t pt-4">
          <h4 className="text-md font-medium text-gray-800 mb-3">Statutory Deductions</h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="paye"
                name="is_paye_applicable"
                checked={formData.is_paye_applicable}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="paye" className="ml-2 text-sm text-gray-700">
                PAYE (Tax)
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="pension"
                name="is_pension_applicable"
                checked={formData.is_pension_applicable}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="pension" className="ml-2 text-sm text-gray-700">
                Pension
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="nhf"
                name="is_nhf_applicable"
                checked={formData.is_nhf_applicable}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="nhf" className="ml-2 text-sm text-gray-700">
                NHSIF
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="nsitf"
                name="is_nsitf_applicable"
                checked={formData.is_nsitf_applicable}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="nsitf" className="ml-2 text-sm text-gray-700">
                NTF
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

const ImportModal = ({ isOpen, onClose, onSubmit }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ file: selectedFile });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h3 className="text-lg font-semibold mb-4">Import Employees</h3>
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div className="mb-4">
            <Upload className="w-8 h-8 text-gray-400 mx-auto" />
          </div>
          <div className="mb-2">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="text-blue-600 hover:text-blue-800 font-medium">Click to upload</span>
              <span className="text-gray-600"> or drag and drop</span>
            </label>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="sr-only"
            />
          </div>
          <p className="text-sm text-gray-500">
            CSV, XLSX or XLS (max. 10MB)
          </p>
          {selectedFile && (
            <p className="text-sm text-green-600 mt-2">
              Selected: {selectedFile.name}
            </p>
          )}
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Template Format</h4>
          <p className="text-xs text-blue-700 mb-2">
            Make sure your file contains the following columns:
          </p>
          <div className="text-xs text-blue-600 space-y-1">
            <div>• First Name, Last Name, Email, Phone Number</div>
            <div>• Job Title, Department, Employment Type</div>
            <div>• Start Date, Date of Birth, Address</div>
          </div>
        </div>
        
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={!selectedFile}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Import
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-300 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Download Template
          </button>
        </div>
      </div>
    </form>
  );
};

// Sidebar Component
const Sidebar = ({ isOpen, onClose, title, children, width = 'w-1/2' }) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full ${width} bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="h-[calc(100%-80px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
};

// Mock Employee Details Component
const EmployeeDetails = ({ employee, onClose, onEdit, onEndEmployment }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [isEmployeeFormOpen, setIsEmployeeFormOpen] = useState(false);
  const [isSalaryFormOpen, setIsSalaryFormOpen] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
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

  const getEmployeeType = (employmentType) => {
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

  const getPayFrequency = (frequency) => {
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

  const handleEmployeeFormSave = async (updatedEmployeeData) => {
    try {
      console.log('Employee updated:', updatedEmployeeData);
      setIsEmployeeFormOpen(false);
    } catch (error) {
      console.error('Error handling employee form save:', error);
    }
  };

  const handleSalaryFormSave = async (updatedSalaryData) => {
    try {
      console.log('Salary updated:', updatedSalaryData);
      setIsSalaryFormOpen(false);
    } catch (error) {
      console.error('Error handling salary form save:', error);
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

  const DetailField = ({ label, value, fullWidth = false }) => (
    <div className={fullWidth ? 'col-span-3' : ''}>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">{value || '--'}</dd>
    </div>
  );

  // Empty State Components
  const PayrollEmptyState = () => (
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

  const DocumentEmptyState = () => (
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

  const LoanEmptyState = () => (
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

  const LeaveEmptyState = () => (
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

  const PaymentHistoryEmptyState = () => (
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
                  onClick={() => setActiveTab(tab.id)}
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
                            <dt className="text-sm text-gray-600">Transport Allowance</dt>
                            <dd className="text-sm text-gray-900 font-medium">Yes</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-600">Medical</dt>
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

      {/* Sidebar Forms */}
      <Sidebar
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
      </Sidebar>

      <Sidebar
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
      </Sidebar>
    </>
  );
};

// Main Employee Page Component
const EmployeePage = () => {
  // Mock data
  const [employees] = useState([
    {
      id: 1,
      employee_id: 'EMP001',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@company.com',
      phone_number: '+234-801-234-5678',
      gender: 'MALE',
      date_of_birth: '1990-05-15',
      address: '123 Main Street, Lagos, Nigeria',
      employment_type: 'FULL_TIME',
      start_date: '2023-01-15',
      tax_start_date: '2023-01-15',
      job_title: 'Software Engineer',
      department_name: 'Engineering',
      pay_grade_name: 'Grade 5',
      custom_salary: 500000,
      bank_name: 'Access Bank',
      account_number: '1234567890',
      account_name: 'John Doe',
      pay_frequency: 'MONTHLY',
      is_paye_applicable: true,
      is_pension_applicable: true,
      is_nhf_applicable: true,
      is_nsitf_applicable: true
    },
    {
      id: 2,
      employee_id: 'EMP002',
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@company.com',
      phone_number: '+234-802-345-6789',
      gender: 'FEMALE',
      date_of_birth: '1988-08-22',
      address: '456 Oak Avenue, Abuja, Nigeria',
      employment_type: 'FULL_TIME',
      start_date: '2022-11-01',
      tax_start_date: '2022-11-01',
      job_title: 'Product Manager',
      department_name: 'Product',
      pay_grade_name: 'Grade 6',
      custom_salary: 750000,
      bank_name: 'GTBank',
      account_number: '0987654321',
      account_name: 'Jane Smith',
      pay_frequency: 'MONTHLY',
      is_paye_applicable: true,
      is_pension_applicable: true,
      is_nhf_applicable: true,
      is_nsitf_applicable: true
    }
  ]);

  const [isEdit, setIsEdit] = useState(false);
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showSalaryForm, setShowSalaryForm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Pagination calculations
  const paginationInfo = useMemo(() => {
    const totalItems = employees.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    return {
      currentPage,
      itemsPerPage,
      totalItems,
      totalPages
    };
  }, [employees.length, currentPage, itemsPerPage]);

  // Get current page data
  const currentEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return employees.slice(startIndex, endIndex);
  }, [employees, currentPage, itemsPerPage]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'null' || dateString === 'undefined') {
      return '--';
    }
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '--';
      }

      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();

      return `${month}-${day}-${year}`;
    } catch (error) {
      return '--';
    }
  };

  const getEmployeeType = (employmentType) => {
    switch (employmentType) {
      case 'FULL_TIME':
        return 'Full time';
      case 'PART_TIME':
        return 'Part time';
      case 'CONTRACT':
        return 'Contract';
      case 'INTERN':
        return 'Intern';
      default:
        return employmentType;
    }
  };

  const handleEditClick = (employee) => {
    setIsEdit(true);
    setEmployeeData(employee);
    setShowEmployeeForm(true);
  };

  const handleAddEmployee = () => {
    setIsEdit(false);
    setEmployeeData(null);
    setShowEmployeeForm(true);
  };

  const handleImportEmployee = () => {
    setShowImportModal(true);
  };

  const handleCloseEmployeeForm = () => {
    setShowEmployeeForm(false);
    setIsEdit(false);
    setEmployeeData(null);
  };

  const handleCloseSalaryForm = () => {
    setShowSalaryForm(false);
    setIsEdit(false);
    setEmployeeData(null);
  };

  const handleCloseImportModal = () => {
    setShowImportModal(false);
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeDetails(true);
  };

  const handleCloseEmployeeDetails = () => {
    setShowEmployeeDetails(false);
    setSelectedEmployee(null);
  };

  const handleEmployeeSubmit = async (employeeFormData) => {
    try {
      console.log('Employee submitted:', employeeFormData);
      // Close employee form and show salary form
      setShowEmployeeForm(false);
      setEmployeeData(employeeFormData); // Pass the employee data to salary form
      setShowSalaryForm(true);
    } catch (error) {
      console.error('Error submitting employee:', error);
    }
  };

  const handleSalarySubmit = async (salaryFormData) => {
    try {
      console.log('Salary setup submitted:', salaryFormData);
      // Close both forms and refresh data
      handleCloseSalaryForm();
    } catch (error) {
      console.error('Error submitting salary setup:', error);
    }
  };

  const handleImportSubmit = async (importData) => {
    try {
      console.log('Import submitted:', importData);
      handleCloseImportModal();
    } catch (error) {
      console.error('Error importing employees:', error);
    }
  };

  const hasEmployees = employees.length > 0;

  // Empty state component
  const EmptyEmployeeState = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="mb-8">
        <div className="relative">
          <div className="bg-white rounded-lg shadow-lg p-4 w-48 h-32 border">
            <div className="flex gap-1 mb-3">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-blue-200 rounded w-full"></div>
              <div className="h-2 bg-blue-100 rounded w-3/4"></div>
              <div className="h-2 bg-blue-100 rounded w-1/2"></div>
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4">
            <div className="relative">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L12 2L3 7V9H21ZM12 17.5C9.2 17.5 7 15.3 7 12.5S9.2 7.5 12 7.5 17 9.7 17 12.5 14.8 17.5 12 17.5Z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-3">Add employees</h2>
      <p className="text-gray-600 max-w-md mb-8 leading-relaxed">
        Add employees and contractors you want to pay. Once added, you can assign them to pay grade and process their payments in batches.
      </p>

      <div className="flex gap-3">
        <button 
          onClick={handleAddEmployee}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Add employee
        </button>
        <button 
          onClick={handleImportEmployee}
          className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Import employee
        </button>
      </div>
    </div>
  );

  // Employee table component
  const EmployeeTable = () => (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Stats card */}
      <div className="p-6 border-b">
        <div className="bg-blue-50 rounded-lg p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none">
              <path d="M16 7C16 9.2 14.2 11 12 11S8 9.2 8 7 9.8 3 12 3 16 4.8 16 7ZM12 14C16.4 14 20 15.8 20 18V21H4V18C4 15.8 7.6 14 12 14Z" fill="currentColor"/>
            </svg>
          </div>
          <div>
            <h3 className="text-sm text-gray-600">Total Employees</h3>
            <p className="text-2xl font-semibold text-gray-900">{employees.length}</p>
            <p className="text-xs text-gray-500">
              {employees.length > 0 ? Math.round((employees.filter(emp => emp.employment_type === 'FULL_TIME').length / employees.length) * 100) : 0}% of employees are regular staff
            </p>
          </div>
        </div>
      </div>

      {/* Filters and actions */}
      <div className="p-6 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-medium text-gray-900">Employees List</h2>
          <div className="flex gap-2">
            <button
              onClick={handleAddEmployee}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Add employee
            </button>
            <button
              onClick={handleImportEmployee}
              className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Import employee
            </button>
          </div>
        </div>
      </div>

      {/* Items per page selector */}
      <div className="px-6 py-3 border-b bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-gray-600">entries per page</span>
        </div>
        <div className="text-sm text-gray-600">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, employees.length)} of {employees.length} entries
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input type="checkbox" className="rounded" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S/N</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary (NGN)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Joined</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">More</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentEmployees.map((employee, index) => {
              const globalIndex = (currentPage - 1) * itemsPerPage + index;
              
              return (
                <tr 
                  key={employee.employee_id || employee.id || index}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleViewEmployee(employee)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" className="rounded" onClick={(e) => e.stopPropagation()} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {String(globalIndex + 1).padStart(2, '0')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                    {employee.employee_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {`${employee.first_name} ${employee.last_name}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.job_title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getEmployeeType(employee.employment_type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(employee.custom_salary)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(employee.start_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(employee);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                      aria-label="Edit employee"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" fill="currentColor"/>
                        <path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" fill="currentColor"/>
                        <path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" fill="currentColor"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, employees.length)} of {employees.length} entries
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded border transition-colors ${
              currentPage === 1 
                ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: paginationInfo.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setCurrentPage(Math.min(paginationInfo.totalPages, currentPage + 1))}
            disabled={currentPage === paginationInfo.totalPages}
            className={`p-2 rounded border transition-colors ${
              currentPage === paginationInfo.totalPages 
                ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-50">
      {/* Show Employee Details Full Screen or Main Content */}
      {showEmployeeDetails && selectedEmployee ? (
        <div className="flex-1 bg-white overflow-auto">
          <EmployeeDetails
            employee={selectedEmployee}
            onClose={handleCloseEmployeeDetails}
            onEdit={handleEditClick}
            onEndEmployment={(employee) => {
              console.log('End employment for:', employee);
              setShowEmployeeDetails(false);
            }}
          />
        </div>
      ) : (
        <main className="flex-1 p-6 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-gray-600">Loading...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-red-600">{error}</div>
            </div>
          ) : hasEmployees ? (
            <EmployeeTable />
          ) : (
            <EmptyEmployeeState />
          )}
        </main>
      )}

      {/* Employee Form Sidebar */}
      <Sidebar
        isOpen={showEmployeeForm}
        onClose={handleCloseEmployeeForm}
        title={isEdit ? "Edit Employee" : "Add New Employee"}
        width="w-1/2"
      >
        <EmployeeForm
          isOpen={showEmployeeForm}
          isEdit={isEdit}
          employeeData={employeeData}
          onClose={handleCloseEmployeeForm}
          onSubmit={handleEmployeeSubmit}
        />
      </Sidebar>

      {/* Salary Setup Form Sidebar */}
      <Sidebar
        isOpen={showSalaryForm}
        onClose={handleCloseSalaryForm}
        title="Salary Setup"
        width="w-1/2"
      >
        <SalarySetupForm
          employeeData={employeeData}
          onClose={handleCloseSalaryForm}
          onSubmit={handleSalarySubmit}
          onBack={() => {
            setShowSalaryForm(false);
            setShowEmployeeForm(true);
          }}
        />
      </Sidebar>

      {/* Import Modal Sidebar */}
      <Sidebar
        isOpen={showImportModal}
        onClose={handleCloseImportModal}
        title="Import Employees"
        width="w-1/3"
      >
        <ImportModal
          isOpen={showImportModal}
          onClose={handleCloseImportModal}
          onSubmit={handleImportSubmit}
        />
      </Sidebar>
    </div>
  );
};

export default EmployeePage;