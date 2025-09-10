// components/SalaryCalculator.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Info, AlertCircle } from "lucide-react";

// Types
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

interface SalaryComponent {
  id: string;
  name: string;
  componentId?: number | string;
  calculationType?: 'fixed' | 'percentage';
  defaultValue?: number;
  fixedValue?: number;
  percentageValue?: number;
  calculatedAmount?: number;
  isBasic?: boolean;
  isEditable?: boolean;
  isPensionable?: boolean;
  isTaxable?: boolean;
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
  consolidatedReliefAllowance: number;
  taxableIncome: number;
  payeTax: number;
  totalDeductions: number;
  netSalary: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
  annualGrossSalary: number;
  annualPensionableAmount: number;
  annualTaxableAmount: number;
  annualPensionContribution: number;
  annualNhfDeduction: number;
  annualNsitfDeduction: number;
  adjustedGrossIncome: number;
  annualPayeTax: number;
  hasPensionableComponents: boolean;
  hasTaxableComponents: boolean;
  pensionableAmount: number;
  taxableAmount: number;
}

interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

interface SalaryCalculatorProps {
  employee: Employee;
  grossSalary: number;
  earningComponents?: SalaryComponent[];
  onCalculationComplete?: (calculation: NetSalaryCalculation) => void;
  onCalculationError?: (error: string) => void;
  showDetailedBreakdown?: boolean;
  className?: string;
  disabled?: boolean;
}

// Constants
const SALARY_CONSTANTS = {
  BASIC_SALARY_RATIO: 0.6,
  ALLOWANCE_RATIO: 0.4,
  BASE_RELIEF_ALLOWANCE: 200000,
  PENSION_RATE: 0.08,
  PENSION_EMPLOYER_RATE: 0.10,
  NHF_RATE: 0.025,
  NSITF_RATE: 0.01,
  CONSOLIDATION_RELIEF_RATE: 0.20
} as const;

const TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 300000, rate: 7 },
  { min: 300001, max: 600000, rate: 11 },
  { min: 600001, max: 1100000, rate: 15 },
  { min: 1100001, max: 1600000, rate: 19 },
  { min: 1600001, max: 3200000, rate: 21 },
  { min: 3200001, max: Infinity, rate: 24 }
];

const PAY_FREQUENCY_MULTIPLIERS = {
  WEEKLY: 52,
  BIWEEKLY: 26,
  MONTHLY: 12
} as const;

const SalaryCalculator: React.FC<SalaryCalculatorProps> = ({
  employee,
  grossSalary,
  earningComponents = [],
  onCalculationComplete,
  onCalculationError,
  showDetailedBreakdown = true,
  className = "",
  disabled = false
}) => {
  const [calculation, setCalculation] = useState<NetSalaryCalculation | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState<string>('');
  const [isCalculationOutdated, setIsCalculationOutdated] = useState(false);

  // Validation
  const validation = useMemo(() => {
    const errors: string[] = [];
    
    // Basic validation
    if (!employee) {
      errors.push('Employee information is required');
    } else {
      if (!employee.employee_id?.trim()) {
        errors.push('Employee ID is required');
      }
      if (!employee.first_name?.trim() || !employee.last_name?.trim()) {
        errors.push('Employee name is required');
      }
      if (!['MONTHLY', 'WEEKLY', 'BIWEEKLY'].includes(employee.pay_frequency)) {
        errors.push('Valid pay frequency is required');
      }
    }
    
    // Salary validation
    if (grossSalary <= 0) {
      errors.push('Gross salary must be greater than 0');
    } else if (grossSalary > 100000000) {
      errors.push('Gross salary seems unreasonably high');
    } else if (!Number.isFinite(grossSalary) || isNaN(grossSalary)) {
      errors.push('Gross salary must be a valid number');
    }

    // Component validation
    earningComponents.forEach((component, index) => {
      if (component.name && component.calculatedAmount !== undefined && component.calculatedAmount < 0) {
        errors.push(`Component ${index + 1} (${component.name}): Amount cannot be negative`);
      }
      if (component.percentageValue !== undefined && 
          (component.percentageValue < 0 || component.percentageValue > 100)) {
        errors.push(`Component ${index + 1} (${component.name}): Percentage must be between 0 and 100`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      canCalculate: errors.length === 0 && grossSalary > 0 && employee
    };
  }, [employee, grossSalary, earningComponents]);

  // Calculate tax
  const calculateTax = (taxableIncome: number): { tax: number; marginalRate: number } => {
    let tax = 0;
    let marginalRate = 0;

    for (const bracket of TAX_BRACKETS) {
      if (taxableIncome > bracket.min - 1) {
        const taxableInBracket = Math.min(taxableIncome, bracket.max) - (bracket.min - 1);
        tax += (taxableInBracket * bracket.rate) / 100;
        marginalRate = bracket.rate;
        
        if (taxableIncome <= bracket.max) break;
      }
    }

    return { tax, marginalRate };
  };

  // Get pay frequency multiplier
  const getPayFrequencyMultiplier = (): number => {
    return PAY_FREQUENCY_MULTIPLIERS[employee.pay_frequency] || PAY_FREQUENCY_MULTIPLIERS.MONTHLY;
  };

  // Main calculation function
  const performCalculation = (): NetSalaryCalculation => {
    const monthlyGross = grossSalary;
    const payFrequencyMultiplier = getPayFrequencyMultiplier();
    const annualGrossSalary = monthlyGross * payFrequencyMultiplier;

    // Analyze earning components
    let monthlyPensionableAmount = 0;
    let monthlyTaxableAmount = 0;
    let hasPensionableComponents = false;
    let hasTaxableComponents = false;

    earningComponents.forEach(comp => {
      if (comp.calculatedAmount && comp.calculatedAmount > 0) {
        if (comp.isPensionable) {
          monthlyPensionableAmount += comp.calculatedAmount;
          hasPensionableComponents = true;
        }
        if (comp.isTaxable) {
          monthlyTaxableAmount += comp.calculatedAmount;
          hasTaxableComponents = true;
        }
      }
    });

    const annualPensionableAmount = monthlyPensionableAmount * payFrequencyMultiplier;
    const annualTaxableAmount = monthlyTaxableAmount * payFrequencyMultiplier;

    // Calculate statutory deductions
    let annualPensionContribution = 0;
    let annualPensionEmployerContribution = 0;
    let annualNhfDeduction = 0;
    let annualNsitfDeduction = 0;

    if (employee.is_pension_applicable) {
      const pensionBase = hasPensionableComponents ? annualPensionableAmount : annualGrossSalary;
      if (pensionBase > 0) {
        annualPensionContribution = pensionBase * SALARY_CONSTANTS.PENSION_RATE;
        annualPensionEmployerContribution = pensionBase * SALARY_CONSTANTS.PENSION_EMPLOYER_RATE;
      }
    }

    if (employee.is_nhf_applicable) {
      annualNhfDeduction = annualGrossSalary * SALARY_CONSTANTS.NHF_RATE;
    }

    if (employee.is_nsitf_applicable) {
      annualNsitfDeduction = annualGrossSalary * SALARY_CONSTANTS.NSITF_RATE;
    }

    // Calculate tax
    const adjustedGrossIncome = annualGrossSalary - (annualPensionContribution + annualNhfDeduction);
    const consolidatedReliefAllowance = (SALARY_CONSTANTS.CONSOLIDATION_RELIEF_RATE * adjustedGrossIncome) + SALARY_CONSTANTS.BASE_RELIEF_ALLOWANCE;

    let annualTaxableIncomeForTax = 0;
    if (hasTaxableComponents) {
      annualTaxableIncomeForTax = annualTaxableAmount - (annualPensionContribution + annualNhfDeduction + consolidatedReliefAllowance);
    } else {
      annualTaxableIncomeForTax = annualGrossSalary - (annualPensionContribution + annualNhfDeduction + consolidatedReliefAllowance);
    }

    const finalTaxableIncome = Math.max(0, annualTaxableIncomeForTax);

    let annualPayeTax = 0;
    let marginalTaxRate = 0;

    if (employee.is_paye_applicable && finalTaxableIncome > 0) {
      const taxCalculation = calculateTax(finalTaxableIncome);
      annualPayeTax = taxCalculation.tax;
      marginalTaxRate = taxCalculation.marginalRate;
    }

    // Convert to monthly
    const basicSalary = monthlyGross * SALARY_CONSTANTS.BASIC_SALARY_RATIO;
    const allowances = monthlyGross * SALARY_CONSTANTS.ALLOWANCE_RATIO;
    const monthlyPensionContribution = annualPensionContribution / payFrequencyMultiplier;
    const monthlyPensionEmployerContribution = annualPensionEmployerContribution / payFrequencyMultiplier;
    const monthlyNhfDeduction = annualNhfDeduction / payFrequencyMultiplier;
    const monthlyNsitfDeduction = annualNsitfDeduction / payFrequencyMultiplier;
    const monthlyPayeTax = annualPayeTax / payFrequencyMultiplier;

    const totalMonthlyDeductions = monthlyPensionContribution + monthlyNhfDeduction + monthlyNsitfDeduction + monthlyPayeTax;
    const netMonthlySalary = monthlyGross - totalMonthlyDeductions;
    const effectiveTaxRate = monthlyGross > 0 ? (monthlyPayeTax / monthlyGross) * 100 : 0;

    return {
      grossSalary: monthlyGross,
      basicSalary,
      allowances,
      totalIncome: monthlyGross,
      pensionEmployeeContribution: monthlyPensionContribution,
      pensionEmployerContribution: monthlyPensionEmployerContribution,
      nhfDeduction: monthlyNhfDeduction,
      nsitfDeduction: monthlyNsitfDeduction,
      payeTax: monthlyPayeTax,
      totalDeductions: totalMonthlyDeductions,
      netSalary: netMonthlySalary,
      annualGrossSalary,
      annualPensionableAmount,
      annualTaxableAmount,
      annualPensionContribution,
      annualNhfDeduction,
      annualNsitfDeduction,
      adjustedGrossIncome,
      consolidatedReliefAllowance,
      taxableIncome: finalTaxableIncome,
      annualPayeTax,
      effectiveTaxRate,
      marginalTaxRate,
      hasPensionableComponents,
      hasTaxableComponents,
      pensionableAmount: monthlyPensionableAmount,
      taxableAmount: monthlyTaxableAmount
    };
  };

  // Handle calculation
  const calculate = async (): Promise<void> => {
    if (disabled || !validation.canCalculate) return;

    setIsCalculating(true);
    setError('');

    try {
      // Add small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const result = performCalculation();
      setCalculation(result);
      setHasCalculated(true);
      setIsCalculationOutdated(false);
      onCalculationComplete?.(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Calculation failed';
      setError(errorMessage);
      onCalculationError?.(errorMessage);
    } finally {
      setIsCalculating(false);
    }
  };

  // Toggle details
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  // Reset calculation when inputs change
  useEffect(() => {
    if (hasCalculated) {
      setIsCalculationOutdated(true);
    }
  }, [grossSalary, earningComponents, employee]);

  // Utility Functions
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (rate: number): string => {
    return `${rate.toFixed(2)}%`;
  };

  // Early return for invalid input
  if (!validation.canCalculate && grossSalary <= 0) {
    return (
      <Card className={`border-gray-200 ${className}`}>
        <CardContent className="p-6 text-center text-gray-500">
          <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Enter a gross salary amount to calculate net salary</p>
          {validation.errors.length > 0 && (
            <div className="mt-4 text-left">
              {validation.errors.map((error, index) => (
                <p key={index} className="text-red-500 text-sm">{error}</p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Employee Deductions Info */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg text-blue-700 flex items-center">
            <Calculator className="w-5 h-5 mr-2" />
            Net Salary Calculator (Finance Act 2023 Compliant)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Component Status Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Info className="w-5 h-5 text-blue-600 mr-2" />
                <h4 className="font-semibold text-blue-900">Component Analysis</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium text-blue-800 mb-2">Pensionable Components:</h5>
                  {earningComponents.filter(comp => comp.isPensionable && comp.calculatedAmount).length > 0 ? (
                    <ul className="text-blue-700 space-y-1">
                      {earningComponents
                        .filter(comp => comp.isPensionable && comp.calculatedAmount)
                        .map(comp => (
                          <li key={comp.id} className="flex justify-between text-xs">
                            <span>{comp.name}</span>
                            <span className="font-medium">{formatCurrency(comp.calculatedAmount || 0)}</span>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-yellow-600">Using gross salary as pensionable amount</p>
                  )}
                </div>
                <div>
                  <h5 className="font-medium text-blue-800 mb-2">Taxable Components:</h5>
                  {earningComponents.filter(comp => comp.isTaxable && comp.calculatedAmount).length > 0 ? (
                    <ul className="text-blue-700 space-y-1">
                      {earningComponents
                        .filter(comp => comp.isTaxable && comp.calculatedAmount)
                        .map(comp => (
                          <li key={comp.id} className="flex justify-between text-xs">
                            <span>{comp.name}</span>
                            <span className="font-medium">{formatCurrency(comp.calculatedAmount || 0)}</span>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-yellow-600">Using gross salary as taxable amount</p>
                  )}
                </div>
              </div>
            </div>

            {/* Deductions Info */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Info className="w-5 h-5 text-gray-600 mr-2" />
                <h4 className="font-semibold text-gray-900">Employee Deductions (Finance Act 2023)</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${employee.is_paye_applicable ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>PAYE Tax</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${employee.is_pension_applicable ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>Pension (8%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${employee.is_nhf_applicable ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>NHF (2.5%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${employee.is_nsitf_applicable ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>NSITF (1%)</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-600">
                <p><strong>Note:</strong> All calculations are done annually first, then divided to get monthly amounts as per Finance Act 2023.</p>
              </div>
            </div>

            {/* Validation Errors */}
            {!validation.isValid && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Validation Errors</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <ul className="list-disc list-inside space-y-1">
                        {validation.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Calculation Error</h3>
                    <div className="mt-2 text-sm text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Calculate Button */}
            <div className="text-center">
              <Button
                onClick={calculate}
                disabled={isCalculating || !validation.canCalculate || disabled}
                className={`${
                  isCalculationOutdated 
                    ? 'bg-yellow-600 hover:bg-yellow-700' 
                    : hasCalculated 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-green-600 hover:bg-green-700'
                }`}
                size="lg"
              >
                {isCalculating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="w-5 h-5 mr-2" />
                    {isCalculationOutdated 
                      ? 'Update Calculation' 
                      : hasCalculated 
                        ? 'Recalculate Net Salary' 
                        : 'Calculate Net Salary'
                    }
                  </>
                )}
              </Button>
            </div>

            {/* Outdated Calculation Warning */}
            {isCalculationOutdated && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Calculation May Be Outdated</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      The gross salary or earning components have changed since the last calculation. 
                      Click "Update Calculation" to get the latest results.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Calculation Results */}
            {hasCalculated && calculation && (
              <div className="space-y-6 mt-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className={`${isCalculationOutdated ? 'border-yellow-200 bg-yellow-50' : 'border-blue-200 bg-blue-50'}`}>
                    <CardContent className="p-4 text-center">
                      <div className={`text-2xl font-bold ${isCalculationOutdated ? 'text-yellow-900' : 'text-blue-900'}`}>
                        {formatCurrency(calculation.grossSalary)}
                      </div>
                      <div className={`text-sm ${isCalculationOutdated ? 'text-yellow-600' : 'text-blue-600'}`}>Monthly Gross</div>
                      <div className={`text-xs mt-1 ${isCalculationOutdated ? 'text-yellow-500' : 'text-blue-500'}`}>
                        Annual: {formatCurrency(calculation.annualGrossSalary)}
                      </div>
                      {isCalculationOutdated && (
                        <div className="text-xs text-yellow-600 mt-1 font-medium">
                          ⚠ May be outdated
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card className={`${isCalculationOutdated ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'}`}>
                    <CardContent className="p-4 text-center">
                      <div className={`text-2xl font-bold ${isCalculationOutdated ? 'text-yellow-900' : 'text-red-900'}`}>
                        {formatCurrency(calculation.totalDeductions)}
                      </div>
                      <div className={`text-sm ${isCalculationOutdated ? 'text-yellow-600' : 'text-red-600'}`}>Monthly Deductions</div>
                      <div className={`text-xs mt-1 ${isCalculationOutdated ? 'text-yellow-500' : 'text-red-500'}`}>
                        Annual: {formatCurrency(calculation.totalDeductions * getPayFrequencyMultiplier())}
                      </div>
                      {isCalculationOutdated && (
                        <div className="text-xs text-yellow-600 mt-1 font-medium">
                          ⚠ May be outdated
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card className={`${isCalculationOutdated ? 'border-yellow-200 bg-yellow-50' : 'border-green-200 bg-green-50'}`}>
                    <CardContent className="p-4 text-center">
                      <div className={`text-2xl font-bold ${isCalculationOutdated ? 'text-yellow-900' : 'text-green-900'}`}>
                        {formatCurrency(calculation.netSalary)}
                      </div>
                      <div className={`text-sm ${isCalculationOutdated ? 'text-yellow-600' : 'text-green-600'}`}>Monthly Take-Home</div>
                      <div className={`text-xs mt-1 ${isCalculationOutdated ? 'text-yellow-500' : 'text-green-500'}`}>
                        Annual: {formatCurrency(calculation.netSalary * getPayFrequencyMultiplier())}
                      </div>
                      {isCalculationOutdated && (
                        <div className="text-xs text-yellow-600 mt-1 font-medium">
                          ⚠ May be outdated
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Show/Hide Details Button */}
                {showDetailedBreakdown && (
                  <div className="text-center">
                    <Button
                      variant="outline"
                      onClick={toggleDetails}
                    >
                      {showDetails ? 'Hide Details' : 'Show Detailed Breakdown'}
                    </Button>
                  </div>
                )}

                {/* Detailed Breakdown */}
                {showDetails && (
                  <>
                    {/* Finance Act 2023 Calculation Steps */}
                    <Card className="border-purple-200">
                      <CardHeader>
                        <CardTitle className="text-lg text-purple-700">Finance Act 2023 Calculation Steps</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="bg-purple-50 p-4 rounded-lg space-y-3">
                          <div className="flex justify-between">
                            <span className="font-medium">Step 1: Annual Gross Salary</span>
                            <span className="font-bold">{formatCurrency(calculation.annualGrossSalary)}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span>Step 2: Annual Pension Contribution (8%)</span>
                            <span>({formatCurrency(calculation.annualPensionContribution)})</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span>Step 3: Annual NHF Deduction (2.5%)</span>
                            <span>({formatCurrency(calculation.annualNhfDeduction)})</span>
                          </div>
                          
                          <div className="border-t pt-2">
                            <div className="flex justify-between font-medium">
                              <span>Adjusted Gross Income</span>
                              <span>{formatCurrency(calculation.adjustedGrossIncome)}</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between">
                            <span>Consolidated Relief Allowance</span>
                            <span>({formatCurrency(calculation.consolidatedReliefAllowance)})</span>
                          </div>
                          
                          <div className="border-t pt-2">
                            <div className="flex justify-between font-bold text-purple-700">
                              <span>Annual Taxable Income</span>
                              <span>{formatCurrency(calculation.taxableIncome)}</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between">
                            <span>Annual PAYE Tax</span>
                            <span className="font-bold">{formatCurrency(calculation.annualPayeTax)}</span>
                          </div>
                          
                          <div className="border-t pt-2 text-sm text-purple-600">
                            <p><strong>Monthly Tax:</strong> {formatCurrency(calculation.annualPayeTax)} ÷ 12 = {formatCurrency(calculation.payeTax)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Monthly Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg text-green-700">Monthly Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Gross Salary</span>
                            <span className="font-semibold">{formatCurrency(calculation.grossSalary)}</span>
                          </div>
                          <div className="border-t pt-2">
                            <div className="flex justify-between text-lg font-bold text-green-700">
                              <span>Monthly Income</span>
                              <span>{formatCurrency(calculation.totalIncome)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Monthly Deductions */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg text-red-700">Monthly Deductions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {employee.is_pension_applicable && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Pension (8%)</span>
                              <span className="font-semibold">{formatCurrency(calculation.pensionEmployeeContribution)}</span>
                            </div>
                          )}
                          {employee.is_nhf_applicable && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">NHF (2.5%)</span>
                              <span className="font-semibold">{formatCurrency(calculation.nhfDeduction)}</span>
                            </div>
                          )}
                          {employee.is_nsitf_applicable && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">NSITF (1%)</span>
                              <span className="font-semibold">{formatCurrency(calculation.nsitfDeduction)}</span>
                            </div>
                          )}
                          {employee.is_paye_applicable && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">PAYE Tax</span>
                              <span className="font-semibold">{formatCurrency(calculation.payeTax)}</span>
                            </div>
                          )}
                          <div className="border-t pt-2">
                            <div className="flex justify-between text-lg font-bold text-red-700">
                              <span>Total Deductions</span>
                              <span>{formatCurrency(calculation.totalDeductions)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Tax Calculation Details */}
                    {employee.is_paye_applicable && calculation.taxableIncome > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Annual Tax Calculation Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Annual Gross</span>
                                <span>{formatCurrency(calculation.annualGrossSalary)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Less: Pension (8%)</span>
                                <span>({formatCurrency(calculation.annualPensionContribution)})</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Less: NHF (2.5%)</span>
                                <span>({formatCurrency(calculation.annualNhfDeduction)})</span>
                              </div>
                              <div className="border-t pt-2">
                                <div className="flex justify-between font-semibold">
                                  <span>Adjusted Gross Income</span>
                                  <span>{formatCurrency(calculation.adjustedGrossIncome)}</span>
                                </div>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Consolidated Relief (20% + ₦200k)</span>
                                <span>({formatCurrency(calculation.consolidatedReliefAllowance)})</span>
                              </div>
                              <div className="border-t pt-2">
                                <div className="flex justify-between font-semibold">
                                  <span>Annual Taxable Income</span>
                                  <span>{formatCurrency(calculation.taxableIncome)}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Annual PAYE Tax</span>
                                <span className="font-semibold">{formatCurrency(calculation.annualPayeTax)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Monthly PAYE Tax</span>
                                <span className="font-semibold">{formatCurrency(calculation.payeTax)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Effective Tax Rate</span>
                                <span className="font-semibold">{formatPercentage(calculation.effectiveTaxRate)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Marginal Tax Rate</span>
                                <span className="font-semibold">{formatPercentage(calculation.marginalTaxRate)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Tax Brackets Reference */}
                          <div className="mt-6">
                            <h4 className="font-semibold mb-3 text-gray-700">PAYE Tax Brackets (2025) - Annual Calculation</h4>
                            <div className="overflow-x-auto">
                              <table className="min-w-full text-sm">
                                <thead>
                                  <tr className="border-b">
                                    <th className="text-left py-2">Annual Income Range</th>
                                    <th className="text-left py-2">Tax Rate</th>
                                    <th className="text-left py-2">Tax on Range</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {TAX_BRACKETS.map((bracket, index) => {
                                    const isApplicable = calculation.taxableIncome >= bracket.min;
                                    const taxableInBracket = Math.min(
                                      Math.max(0, calculation.taxableIncome - (bracket.min - 1)),
                                      bracket.max === Infinity ? calculation.taxableIncome : bracket.max - (bracket.min - 1)
                                    );
                                    const taxInBracket = (taxableInBracket * bracket.rate) / 100;
                                    
                                    return (
                                      <tr key={index} className={`${isApplicable ? 'bg-blue-50' : ''}`}>
                                        <td className="py-2">
                                          {formatCurrency(bracket.min)} - {bracket.max === Infinity ? 'Above' : formatCurrency(bracket.max)}
                                        </td>
                                        <td className="py-2">{bracket.rate}%</td>
                                        <td className="py-2">
                                          {isApplicable ? formatCurrency(taxInBracket) : '-'}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Annual Summary */}
                    <Card className="border-blue-200">
                      <CardHeader>
                        <CardTitle className="text-lg text-blue-700">Annual Summary (Calculation Basis)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-xl font-bold text-blue-900">
                              {formatCurrency(calculation.annualGrossSalary)}
                            </div>
                            <div className="text-sm text-blue-600">Annual Gross</div>
                          </div>
                          <div>
                            <div className="text-xl font-bold text-red-900">
                              {formatCurrency((calculation.totalDeductions * getPayFrequencyMultiplier()))}
                            </div>
                            <div className="text-sm text-red-600">Annual Deductions</div>
                          </div>
                          <div>
                            <div className="text-xl font-bold text-green-900">
                              {formatCurrency(calculation.netSalary * getPayFrequencyMultiplier())}
                            </div>
                            <div className="text-sm text-green-600">Annual Take-Home</div>
                          </div>
                        </div>
                        
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                          <h5 className="font-semibold text-blue-800 mb-2">Key Annual Amounts Used in Calculation:</h5>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p><strong>Adjusted Gross Income:</strong> {formatCurrency(calculation.adjustedGrossIncome)}</p>
                              <p><strong>Consolidated Relief:</strong> {formatCurrency(calculation.consolidatedReliefAllowance)}</p>
                            </div>
                            <div>
                              <p><strong>Annual Taxable Income:</strong> {formatCurrency(calculation.taxableIncome)}</p>
                              <p><strong>Annual PAYE Tax:</strong> {formatCurrency(calculation.annualPayeTax)}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalaryCalculator;