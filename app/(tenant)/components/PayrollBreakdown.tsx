'use client'

import React, { useState, useEffect } from 'react';
import { Edit2, FileText, DollarSign } from 'lucide-react';

interface SalaryComponent {
  id: string;
  name: string;
  amount: number;
  type: 'FIXED' | 'PERCENTAGE';
  is_taxable: boolean;
  is_pensionable: boolean;
}

interface DeductionComponent {
  id: string;
  name: string;
  amount: number;
  type: 'FIXED' | 'PERCENTAGE';
  is_statutory: boolean;
}

interface Employee {
  id?: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  custom_salary: number;
}

interface PayrollBreakdownProps {
  employee: Employee;
  onEdit: () => void;
  onGeneratePayslip: () => void;
}

const PayrollBreakdown: React.FC<PayrollBreakdownProps> = ({
  employee,
  onEdit,
  onGeneratePayslip
}:{
  employee:any, onEdit?:any, onGeneratePayslip?:any
}) => {
  const [salaryComponents, setSalaryComponents] = useState<SalaryComponent[]>([]);
  const [deductionComponents, setDeductionComponents] = useState<DeductionComponent[]>([]);
  const [companyBenefits, setCompanyBenefits] = useState<SalaryComponent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch salary components
  const fetchSalaryComponents = async () => {
    try {
      const response = await fetch('/api/tenant/payroll-settings/salary-components', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch salary components');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching salary components:', error);
      return [];
    }
  };

  // Fetch deduction components
  const fetchDeductionComponents = async () => {
    try {
      const response = await fetch('/api/tenant/payroll-settings/deduction-components', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch deduction components');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching deduction components:', error);
      return [];
    }
  };

  // Calculate component amounts based on basic pay
  const calculateComponentAmount = (component: SalaryComponent | DeductionComponent, basicPay: number): number => {
    if (component.type === 'PERCENTAGE') {
      return (basicPay * component.amount) / 100;
    }
    return component.amount;
  };

  // Load payroll data
  useEffect(() => {
    const loadPayrollData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [salaryData, deductionData] = await Promise.all([
          fetchSalaryComponents(),
          fetchDeductionComponents()
        ]);

        // Separate salary components into income and benefits
        const incomeComponents = salaryData.filter((comp: SalaryComponent) => 
          comp.name.toLowerCase().includes('allowance') || 
          comp.name.toLowerCase().includes('bonus') ||
          comp.name.toLowerCase().includes('overtime')
        );
        
        const benefitComponents = salaryData.filter((comp: SalaryComponent) => 
          comp.name.toLowerCase().includes('insurance') ||
          comp.name.toLowerCase().includes('health') ||
          comp.name.toLowerCase().includes('medical')
        );

        setSalaryComponents(incomeComponents);
        setCompanyBenefits(benefitComponents);
        setDeductionComponents(deductionData);
      } catch (err) {
        setError('Failed to load payroll data');
        console.error('Error loading payroll data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPayrollData();
  }, [employee.employee_id]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Calculate totals
  const basicPay = employee.custom_salary || 0;
  const totalAllowances = salaryComponents.reduce((sum, comp) => 
    sum + calculateComponentAmount(comp, basicPay), 0
  );
  const totalIncome = basicPay + totalAllowances;
  
  const totalDeductions = deductionComponents.reduce((sum, comp) => 
    sum + calculateComponentAmount(comp, basicPay), 0
  );
  
  const totalBenefits = companyBenefits.reduce((sum, comp) => 
    sum + calculateComponentAmount(comp, basicPay), 0
  );
  
  const totalAmount = totalIncome + totalBenefits;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <svg className="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-gray-600">Loading payroll data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 mb-2">Error loading payroll data</div>
          <button 
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Payroll Calculation Breakdown</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Edit2 className="w-4 h-4 mr-1" />
              Edit
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
            {/* Income Section */}
            <div>
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Income</h4>
                
                <div className="space-y-3">
                  {/* Basic Pay */}
                  <div className="flex justify-between items-center py-2 border-b border-blue-100">
                    <div>
                      <span className="text-sm font-medium text-gray-700">COMPONENT NAME</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">AMOUNT (NGN)</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">Basic Pay</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(basicPay).replace('NGN', '₦')}
                    </span>
                  </div>

                  {/* Salary Components (Allowances) */}
                  {salaryComponents.map((component) => (
                    <div key={component.id} className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">{component.name}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(calculateComponentAmount(component, basicPay)).replace('NGN', '₦')}
                      </span>
                    </div>
                  ))}

                  {/* Total Income */}
                  <div className="flex justify-between items-center py-3 mt-4 border-t border-blue-200 font-semibold">
                    <span className="text-sm text-gray-900">Total Income</span>
                    <span className="text-sm text-gray-900">
                      {formatCurrency(totalIncome).replace('NGN', '₦')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Deductions Section */}
            <div>
              <div className="bg-red-50 rounded-lg p-4 mb-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Deductions</h4>
                
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex justify-between items-center py-2 border-b border-red-100">
                    <div>
                      <span className="text-sm font-medium text-gray-700">COMPONENT NAME</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">AMOUNT (NGN)</span>
                    </div>
                  </div>

                  {/* Deduction Components */}
                  {deductionComponents.length > 0 ? (
                    deductionComponents.map((component) => (
                      <div key={component.id} className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-600">{component.name}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(calculateComponentAmount(component, basicPay)).replace('NGN', '₦')}
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
                    <span className="text-sm text-gray-900">Total Deduction</span>
                    <span className="text-sm text-gray-900">
                      {formatCurrency(totalDeductions).replace('NGN', '₦')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Company Benefits Section */}
          {companyBenefits.length > 0 && (
            <div className="mt-8">
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Company Benefits</h4>
                
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex justify-between items-center py-2 border-b border-green-100">
                    <div>
                      <span className="text-sm font-medium text-gray-700">COMPONENT NAME</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">AMOUNT (NGN)</span>
                    </div>
                  </div>

                  {/* Benefit Components */}
                  {companyBenefits.map((component) => (
                    <div key={component.id} className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">{component.name}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(calculateComponentAmount(component, basicPay)).replace('NGN', '₦')}
                      </span>
                    </div>
                  ))}

                  {/* Total Benefits */}
                  <div className="flex justify-between items-center py-3 mt-4 border-t border-green-200 font-semibold">
                    <span className="text-sm text-gray-900">Total</span>
                    <span className="text-sm text-gray-900">
                      {formatCurrency(totalBenefits).replace('NGN', '₦')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Net Salary/Total Amount */}
          <div className="mt-8">
            <div className="bg-blue-600 rounded-lg p-6 text-white">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Amount</span>
                <span className="text-2xl font-bold">
                  {formatCurrency(totalAmount).replace('NGN', '₦')}
                </span>
              </div>
              <div className="mt-2 text-blue-100 text-sm">
                Net pay after deductions: {formatCurrency(totalIncome - totalDeductions).replace('NGN', '₦')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollBreakdown;

// Integration code for EmployeeDetails.tsx:

/*
To integrate this component into your EmployeeDetails.tsx, make these changes:

1. Import the PayrollBreakdown component at the top:
import PayrollBreakdown from '../components/PayrollBreakdown';

2. Replace the payroll section in your activeTab === 'payroll' condition with:

{activeTab === 'payroll' && (
  <PayrollBreakdown
    employee={employee}
    onEdit={handleProcessPayroll}
    onGeneratePayslip={() => {
      // Handle payslip generation
      console.log('Generate payslip for employee:', employee.employee_id);
      // You can implement payslip generation logic here
    }}
  />
)}

This will show the actual payroll breakdown with salary components and deductions 
instead of the empty state when the payroll tab is selected.
*/