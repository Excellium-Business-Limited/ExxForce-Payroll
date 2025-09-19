'use client'

import React, { useState, useEffect } from 'react';
import { Edit2, FileText } from 'lucide-react';
import SalaryCalculator from './SalaryCalculator';
import type { Employee, PayrollComponent } from '../types/employee';

// Internal interfaces for API response structure
interface APIPayrollComponent {
  id: number;
  name: string;
  amount: string; // API returns as string
  type?: 'EARNING' | 'DEDUCTION' | 'BENEFIT';
  is_taxable?: boolean;
  is_percentage?: boolean;
  percentage_value?: number;
  description?: string;
}

// Extended Employee interface for PayrollBreakdown specific data
interface PayrollEmployee extends Employee {
  effective_gross?: string; // API returns as string
  salary_components?: APIPayrollComponent[];
  deduction_components?: APIPayrollComponent[];
  benefits?: APIPayrollComponent[];
  payroll_data?: {
    earnings?: PayrollComponent[];
    deductions?: PayrollComponent[];
    benefits?: PayrollComponent[];
    gross_salary?: number;
    net_salary?: number;
    total_deductions?: number;
    total_benefits?: number;
  };
}

interface PayrollBreakdownProps {
  employee: PayrollEmployee;
  onProcessPayroll?: (employee: Employee) => void;
}

interface NetSalaryCalculation {
  grossSalary: number;
  basicSalary: number;
  allowances: number;
  totalIncome: number;
  pensionEmployeeContribution: number;
  pensionEmployerContribution: number;
  nhfDeduction: number;
  nsitfDeduction: number;
  payeTax: number;
  totalDeductions: number;
  netSalary: number;
  annualGrossSalary: number;
  annualPensionableAmount: number;
  annualTaxableAmount: number;
  annualPensionContribution: number;
  annualNhfDeduction: number;
  annualNsitfDeduction: number;
  adjustedGrossIncome: number;
  consolidatedReliefAllowance: number;
  taxableIncome: number;
  annualPayeTax: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
  hasPensionableComponents: boolean;
  hasTaxableComponents: boolean;
  pensionableAmount: number;
  taxableAmount: number;
}

const PayrollBreakdown: React.FC<PayrollBreakdownProps> = ({
  employee,
  onProcessPayroll,
}) => {
  const [netCalculation, setNetCalculation] = useState<NetSalaryCalculation | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);

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
  const totalSalaryComponents = salaryComponents.reduce((sum: number, comp: APIPayrollComponent) => sum + parseFloat(comp.amount || '0'), 0);
  const totalDeductions = deductionComponents.reduce((sum: number, comp: APIPayrollComponent) => sum + parseFloat(comp.amount || '0'), 0);
  const totalBenefits = benefits.reduce((sum: number, comp: APIPayrollComponent) => sum + parseFloat(comp.amount || '0'), 0);
  const netSalary = netCalculation?.netSalary || (effectiveGross - totalDeductions);

  // Check if employee has any payroll components
  const hasPayrollData = salaryComponents.length > 0 || deductionComponents.length > 0 || benefits.length > 0;
  
  console.log('Debug - PayrollBreakdown data:', {
    salaryComponents: salaryComponents.length,
    deductionComponents: deductionComponents.length,
    benefits: benefits.length,
    hasPayrollData,
    effectiveGross,
    employee
  });

  // Handle calculation completion
  const handleCalculationComplete = (calculation: NetSalaryCalculation) => {
    setNetCalculation(calculation);
  };

  // Auto-calculate net salary when component mounts or data changes
  useEffect(() => {
    if (hasPayrollData && effectiveGross > 0) {
      // Auto-trigger calculation
      setShowCalculator(true);
    }
  }, [hasPayrollData, effectiveGross]);

  // Create a properly typed employee object for SalaryCalculator
  const salaryCalculatorEmployee = {
    ...employee,
    // Handle all optional properties that SalaryCalculator expects as required
    id: employee.id || 0,
    job_title: employee.job_title || 'Not Specified',
    custom_salary: employee.custom_salary || 0,
    department_name: employee.department_name || 'Not Specified',
    pay_frequency: (employee.pay_frequency as 'MONTHLY' | 'WEEKLY' | 'BIWEEKLY') || 'MONTHLY'
  };

  // If no payroll data, show empty state
  if (!hasPayrollData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="mb-8">
          <div className="relative">
            <div className="bg-white rounded-lg shadow-lg p-6 w-56 h-36 border">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">₦</span>
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
          onClick={() => onProcessPayroll?.(employee)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <span className="font-bold">₦</span>
          Setup Components
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Salary Components Summary Header */}
      <div className="bg-blue-100 rounded-lg p-6 border border-blue-600">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-black">
              Salary Components - {employee.first_name} {employee.last_name}
            </h3>
            <p className="text-sm text-black mt-1">
              Complete breakdown of salary components and deductions
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-black">
              {formatCurrency(effectiveGross)}
            </div>
            <div className="text-sm text-black">Gross Salary</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-black">
              {formatCurrency(totalDeductions)}
            </div>
            <div className="text-sm text-black">Total Deductions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-black">
              {formatCurrency(totalBenefits)}
            </div>
            <div className="text-sm text-black">Total Benefits</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-black">
              {formatCurrency(netSalary)}
            </div>
            <div className="text-sm text-black">Net Salary {netCalculation ? "(Calculated)" : "(Estimated)"}</div>
          </div>
        </div>
      </div>

      {/* Main Components Breakdown */}
      <div className="bg-blue-50 rounded-lg shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-blue-600">
          <h3 className="text-lg font-medium text-black">Salary Components Breakdown</h3>
            <div className="flex items-center space-x-2">
            <button
              onClick={() => onProcessPayroll?.(employee)}
              className="inline-flex items-center px-3 py-1.5 border border-blue-600 shadow-sm text-sm font-medium rounded-md text-black bg-blue-50 hover:bg-blue-100"
            >
              <Edit2 className="w-4 h-4 mr-1" />
              Edit Components
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Salary Components Section */}
            <div>
              <div className="bg-blue-100 rounded-lg p-4 mb-4">
                <h4 className="text-lg font-semibold text-black mb-4 flex items-center">
                  <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                    <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"/>
                    </svg>
                  </div>
                  Salary Components
                </h4>
                
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex justify-between items-center py-2 border-b border-blue-600">
                    <div>
                      <span className="text-sm font-medium text-black">COMPONENT NAME</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-black">AMOUNT (₦)</span>
                    </div>
                  </div>

                  {/* Salary Components */}
                  {salaryComponents.length > 0 ? (
                    salaryComponents.map((component: APIPayrollComponent) => (
                      <div key={component.id} className="flex justify-between items-center py-2">
                        <div>
                          <span className="text-sm text-black">{component.name}</span>
                          <div className="text-xs text-black">
                            Component ID: {component.id}
                          </div>
                        </div>
                        <span className="text-sm font-medium text-black">
                          {formatCurrency(component.amount)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-black italic">No salary components</span>
                      <span className="text-sm font-medium text-black">₦0.00</span>
                    </div>
                  )}

                  {/* Total Salary Components */}
                  <div className="flex justify-between items-center py-3 mt-4 border-t border-blue-600 font-semibold">
                    <span className="text-sm text-black">Total Salary Components</span>
                    <span className="text-sm text-black">
                      {formatCurrency(totalSalaryComponents)}
                    </span>
                  </div>

                  {/* Effective Gross */}
                  <div className="flex justify-between items-center py-3 border-t border-blue-600 font-bold">
                    <span className="text-sm text-black">Effective Gross Salary</span>
                    <span className="text-sm text-black">
                      {formatCurrency(effectiveGross)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Deductions Section */}
            <div>
              <div className="bg-blue-100 rounded-lg p-4 mb-4">
                <h4 className="text-lg font-semibold text-black mb-4 flex items-center">
                  <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                    <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6L18 18"/>
                    </svg>
                  </div>
                  Deductions
                </h4>
                
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex justify-between items-center py-2 border-b border-blue-600">
                    <div>
                      <span className="text-sm font-medium text-black">COMPONENT NAME</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-black">AMOUNT (₦)</span>
                    </div>
                  </div>

                  {/* Deduction Components */}
                  {deductionComponents.length > 0 ? (
                    deductionComponents.map((component: APIPayrollComponent) => (
                      <div key={component.id} className="flex justify-between items-center py-2">
                        <div>
                          <span className="text-sm text-black">{component.name}</span>
                          <div className="text-xs text-black">
                            Component ID: {component.id}
                          </div>
                        </div>
                        <span className="text-sm font-medium text-black">
                          -{formatCurrency(component.amount)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-black italic">No deductions configured</span>
                      <span className="text-sm font-medium text-black">₦0.00</span>
                    </div>
                  )}

                  {/* Total Deductions */}
                  <div className="flex justify-between items-center py-3 mt-4 border-t border-blue-600 font-semibold">
                    <span className="text-sm text-black">Total Deductions</span>
                    <span className="text-sm text-black">
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
              <div className="bg-green-100 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-black mb-4 flex items-center">
                  <div className="w-6 h-6 bg-green-600 rounded-lg flex items-center justify-center mr-2">
                    <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  Company Benefits
                </h4>
                
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex justify-between items-center py-2 border-b border-green-600">
                    <div>
                      <span className="text-sm font-medium text-black">BENEFIT NAME</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-black">AMOUNT (₦)</span>
                    </div>
                  </div>

                  {/* Benefit Components */}
                  {benefits.map((benefit: APIPayrollComponent) => (
                    <div key={benefit.id} className="flex justify-between items-center py-2">
                      <div>
                        <span className="text-sm text-black">{benefit.name}</span>
                        <div className="text-xs text-black">
                          Benefit ID: {benefit.id}
                        </div>
                      </div>
                      <span className="text-sm font-medium text-black">
                        {formatCurrency(benefit.amount)}
                      </span>
                    </div>
                  ))}

                  {/* Total Benefits */}
                  <div className="flex justify-between items-center py-3 mt-4 border-t border-green-600 font-semibold">
                    <span className="text-sm text-black">Total Benefits</span>
                    <span className="text-sm text-black">
                      {formatCurrency(totalBenefits)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Net Salary Calculator Integration */}
          {effectiveGross > 0 && (
            <div className="mt-8">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-black flex items-center">
                    <div className="w-6 h-6 bg-gray-600 rounded-lg flex items-center justify-center mr-2">
                      <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2l3.09 6.26L22 9l-5 4.74L18.18 21 12 17.77 5.82 21 7 13.74 2 9l6.91-1.26L12 2z"/>
                      </svg>
                    </div>
                    Net Salary Calculation (Finance Act 2023 Compliant)
                  </h4>
                  <button
                    onClick={() => setShowCalculator(!showCalculator)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {showCalculator ? 'Hide Calculator' : 'Show Calculator'}
                  </button>
                </div>

                {showCalculator && (
                  <SalaryCalculator
                    employee={salaryCalculatorEmployee as Employee}
                    grossSalary={effectiveGross}
                    earningComponents={[]}
                    onCalculationComplete={handleCalculationComplete}
                    showDetailedBreakdown={false}
                    className=""
                  />
                )}

                {/* Quick Net Salary Display */}
                {netCalculation && (
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-xl font-bold text-green-900">
                          {formatCurrency(netCalculation.grossSalary)}
                        </div>
                        <div className="text-sm text-green-600">Gross Salary</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-red-900">
                          {formatCurrency(netCalculation.totalDeductions)}
                        </div>
                        <div className="text-sm text-red-600">Total Statutory Deductions</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-blue-900">
                          {formatCurrency(netCalculation.netSalary)}
                        </div>
                        <div className="text-sm text-blue-600">Net Take-Home Pay</div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> This net salary calculation includes statutory deductions (PAYE, Pension, NHF, NSITF) 
                        as per Finance Act 2023. Component-based deductions shown above are separate.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Detailed Calculation Summary */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-black mb-4">Final Calculation Summary</h4>
            <div className="space-y-3">
              {/* Effective Gross */}
              <div className="flex justify-between items-center py-2">
                <span className="text-black">Effective Gross Salary</span>
                <span className="font-medium text-black">{formatCurrency(effectiveGross)}</span>
              </div>

              {/* Component-based Deductions */}
              {totalDeductions > 0 && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-black">Component-based Deductions</span>
                  <span className="font-medium text-black">
                    -{formatCurrency(totalDeductions)}
                  </span>
                </div>
              )}

              {/* Statutory Deductions (if calculated) */}
              {netCalculation && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-black">Statutory Deductions (PAYE, Pension, etc.)</span>
                  <span className="font-medium text-black">
                    -{formatCurrency(netCalculation.totalDeductions)}
                  </span>
                </div>
              )}

              {/* Net Salary */}
              <div className="flex justify-between items-center py-3 border-t-2 border-blue-600 font-bold text-lg">
                <span className="text-black">Net Take-Home Salary</span>
                <span className="text-black">{formatCurrency(netSalary)}</span>
              </div>

              {/* Benefits Note */}
              {totalBenefits > 0 && (
                <div className="mt-4 p-3 bg-green-100 rounded-lg border border-green-300">
                  <div className="text-sm text-green-800">
                    <strong>Additional Benefits:</strong> Benefits worth {formatCurrency(totalBenefits)} are provided 
                    in addition to the salary above.
                  </div>
                </div>
              )}

              {/* Component Summary */}
              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <div className="text-sm text-black">
                  <strong>Component Summary:</strong> {salaryComponents.length} salary component(s), {deductionComponents.length} deduction(s), and {benefits.length} benefit(s) configured.
                </div>
              </div>

              {/* Calculation Method Note */}
              {netCalculation && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="text-sm text-yellow-800">
                    <strong>Calculation Method:</strong> Net salary uses Finance Act 2023 compliant calculations. 
                    Effective tax rate: {netCalculation.effectiveTaxRate.toFixed(2)}%
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollBreakdown;