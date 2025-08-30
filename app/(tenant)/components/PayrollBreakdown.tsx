'use client'

import React from 'react';
import { Edit2, FileText, DollarSign } from 'lucide-react';

interface SalaryComponent {
  id: number;
  name: string;
  amount: string; // API returns as string
}

interface DeductionComponent {
  id: number;
  name: string;
  amount: string; // API returns as string
}

interface BenefitComponent {
  id: number;
  name: string;
  amount: string; // API returns as string
}

interface Employee {
  id?: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  custom_salary?: number;
  effective_gross: string; // API returns as string
  salary_components: SalaryComponent[];
  deduction_components: DeductionComponent[];
  benefits: BenefitComponent[];
  // Additional fields from the actual API response
  department?: string;
  job_title?: string;
  employment_type?: string;
  pay_frequency?: string;
}

interface PayrollBreakdownProps {
  employee: Employee;
  onProcessPayroll?: () => void;
  onGeneratePayslip?: () => void;
}

const PayrollBreakdown: React.FC<PayrollBreakdownProps> = ({
  employee,
  onProcessPayroll,
  onGeneratePayslip
}) => {
  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(numAmount || 0);
  };

  // Extract data from employee
  const salaryComponents = employee.salary_components || [];
  const deductionComponents = employee.deduction_components || [];
  const benefits = employee.benefits || [];
  const effectiveGross = parseFloat(employee.effective_gross || '0');
  
  // Calculate totals
  const totalSalaryComponents = salaryComponents.reduce((sum, comp) => sum + parseFloat(comp.amount || '0'), 0);
  const totalDeductions = deductionComponents.reduce((sum, comp) => sum + parseFloat(comp.amount || '0'), 0);
  const totalBenefits = benefits.reduce((sum, comp) => sum + parseFloat(comp.amount || '0'), 0);
  const netSalary = effectiveGross - totalDeductions;

  // Check if employee has any payroll components - fix the logic
  const hasPayrollData = salaryComponents.length > 0 || deductionComponents.length > 0 || benefits.length > 0;
  
  console.log('Debug - PayrollBreakdown data:', {
    salaryComponents: salaryComponents.length,
    deductionComponents: deductionComponents.length,
    benefits: benefits.length,
    hasPayrollData,
    effectiveGross,
    employee
  });

  // If no payroll data, show empty state
  if (!hasPayrollData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="mb-8">
          <div className="relative">
            <div className="bg-white rounded-lg shadow-lg p-6 w-56 h-36 border">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-xs text-gray-400">Components</div>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-blue-200 rounded w-full"></div>
                <div className="h-2 bg-blue-100 rounded w-3/4"></div>
                <div className="h-2 bg-blue-100 rounded w-1/2"></div>
              </div>
            </div>
            
            <div className="absolute -bottom-3 -right-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-2">No salary components configured</h3>
        <p className="text-gray-600 max-w-md mb-6 leading-relaxed">
          Salary components for {employee.first_name} {employee.last_name} will appear here once they are configured.
        </p>

        <button 
          onClick={onProcessPayroll}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <DollarSign className="w-4 h-4" />
          Setup Components
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Salary Components Summary Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Salary Components - {employee.first_name} {employee.last_name}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Complete breakdown of salary components and deductions
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={onProcessPayroll}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              Manage Components
            </button>
            <button 
              onClick={onGeneratePayslip}
              className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Generate Payslip
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-700">
              {formatCurrency(effectiveGross)}
            </div>
            <div className="text-sm text-gray-600">Gross Salary</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-700">
              {formatCurrency(totalDeductions)}
            </div>
            <div className="text-sm text-gray-600">Total Deductions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-700">
              {formatCurrency(totalBenefits)}
            </div>
            <div className="text-sm text-gray-600">Total Benefits</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(netSalary)}
            </div>
            <div className="text-sm text-gray-600">Net Salary</div>
          </div>
        </div>
      </div>

      {/* Main Components Breakdown */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Salary Components Breakdown</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={onProcessPayroll}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Edit2 className="w-4 h-4 mr-1" />
              Edit Components
            </button>
            <button
              onClick={onGeneratePayslip}
              className="inline-flex items-center px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded-md"
            >
              <FileText className="w-4 h-4 mr-1" />
              Generate Payslip
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Salary Components Section */}
            <div>
              <div className="bg-green-50 rounded-lg p-4 mb-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center mr-2">
                    <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"/>
                    </svg>
                  </div>
                  Salary Components
                </h4>
                
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex justify-between items-center py-2 border-b border-green-100">
                    <div>
                      <span className="text-sm font-medium text-gray-700">COMPONENT NAME</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">AMOUNT (₦)</span>
                    </div>
                  </div>

                  {/* Salary Components */}
                  {salaryComponents.length > 0 ? (
                    salaryComponents.map((component) => (
                      <div key={component.id} className="flex justify-between items-center py-2">
                        <div>
                          <span className="text-sm text-gray-600">{component.name}</span>
                          <div className="text-xs text-gray-500">
                            Component ID: {component.id}
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(component.amount)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-500 italic">No salary components</span>
                      <span className="text-sm font-medium text-gray-900">₦0.00</span>
                    </div>
                  )}

                  {/* Total Salary Components */}
                  <div className="flex justify-between items-center py-3 mt-4 border-t border-green-200 font-semibold">
                    <span className="text-sm text-gray-900">Total Salary Components</span>
                    <span className="text-sm text-green-600">
                      {formatCurrency(totalSalaryComponents)}
                    </span>
                  </div>

                  {/* Effective Gross */}
                  <div className="flex justify-between items-center py-3 border-t border-green-300 font-bold">
                    <span className="text-sm text-gray-900">Effective Gross Salary</span>
                    <span className="text-sm text-green-600">
                      {formatCurrency(effectiveGross)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Deductions Section */}
            <div>
              <div className="bg-red-50 rounded-lg p-4 mb-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-6 h-6 bg-red-500 rounded-lg flex items-center justify-center mr-2">
                    <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6L18 18"/>
                    </svg>
                  </div>
                  Deductions
                </h4>
                
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex justify-between items-center py-2 border-b border-red-100">
                    <div>
                      <span className="text-sm font-medium text-gray-700">COMPONENT NAME</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">AMOUNT (₦)</span>
                    </div>
                  </div>

                  {/* Deduction Components */}
                  {deductionComponents.length > 0 ? (
                    deductionComponents.map((component) => (
                      <div key={component.id} className="flex justify-between items-center py-2">
                        <div>
                          <span className="text-sm text-gray-600">{component.name}</span>
                          <div className="text-xs text-gray-500">
                            Component ID: {component.id}
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          -{formatCurrency(component.amount)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-500 italic">No deductions configured</span>
                      <span className="text-sm font-medium text-gray-900">₦0.00</span>
                    </div>
                  )}

                  {/* Total Deductions */}
                  <div className="flex justify-between items-center py-3 mt-4 border-t border-red-200 font-semibold">
                    <span className="text-sm text-gray-900">Total Deductions</span>
                    <span className="text-sm text-red-600">
                      -{formatCurrency(totalDeductions)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Company Benefits Section */}
          {benefits.length > 0 && (
            <div className="mt-8">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center mr-2">
                    <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  Company Benefits
                </h4>
                
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex justify-between items-center py-2 border-b border-blue-100">
                    <div>
                      <span className="text-sm font-medium text-gray-700">COMPONENT NAME</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">AMOUNT (₦)</span>
                    </div>
                  </div>

                  {/* Benefit Components */}
                  {benefits.map((component) => (
                    <div key={component.id} className="flex justify-between items-center py-2">
                      <div>
                        <span className="text-sm text-gray-600">{component.name}</span>
                        <div className="text-xs text-gray-500">
                          Component ID: {component.id}
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(component.amount)}
                      </span>
                    </div>
                  ))}

                  {/* Total Benefits */}
                  <div className="flex justify-between items-center py-3 mt-4 border-t border-blue-200 font-semibold">
                    <span className="text-sm text-gray-900">Total Benefits</span>
                    <span className="text-sm text-blue-600">
                      {formatCurrency(totalBenefits)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Calculation Summary */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Final Calculation Summary</h4>
            <div className="space-y-3">
              {/* Effective Gross */}
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700">Effective Gross Salary</span>
                <span className="font-medium text-gray-900">{formatCurrency(effectiveGross)}</span>
              </div>

              {/* Total Deductions */}
              {totalDeductions > 0 && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">Total Deductions</span>
                  <span className="font-medium text-red-600">
                    -{formatCurrency(totalDeductions)}
                  </span>
                </div>
              )}

              {/* Net Salary */}
              <div className="flex justify-between items-center py-3 border-t-2 border-gray-300 font-bold text-lg">
                <span className="text-gray-900">Net Salary</span>
                <span className="text-blue-600">{formatCurrency(netSalary)}</span>
              </div>

              {/* Benefits Note */}
              {totalBenefits > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-800">
                    <strong>Note:</strong> Benefits worth {formatCurrency(totalBenefits)} are provided 
                    in addition to the net salary above.
                  </div>
                </div>
              )}

              {/* Component Summary */}
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-green-800">
                  <strong>Component Summary:</strong> {salaryComponents.length} salary component(s), {deductionComponents.length} deduction(s), and {benefits.length} benefit(s) configured.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollBreakdown;