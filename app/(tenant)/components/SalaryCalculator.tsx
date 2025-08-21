import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Info, AlertCircle } from "lucide-react";

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

interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

interface NetSalaryCalculation {
  grossSalary: number;
  basicSalary: number;
  allowances: number;
  totalIncome: number;
  
  // Deductions
  pensionEmployeeContribution: number;
  pensionEmployerContribution: number;
  nhfDeduction: number;
  nsitfDeduction: number;
  
  // Tax calculation
  consolidatedReliefAllowance: number;
  taxableIncome: number;
  payeTax: number;
  
  // Final amounts
  totalDeductions: number;
  netSalary: number;
  
  // Additional info
  effectiveTaxRate: number;
  marginalTaxRate: number;
}

interface SalaryCalculatorProps {
  employee: Employee;
  grossSalary: number;
  onCalculationComplete?: (calculation: NetSalaryCalculation) => void;
  showDetailedBreakdown?: boolean;
  className?: string;
}

// Nigerian PAYE tax brackets for 2025
const TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 300000, rate: 7 },        // First ₦300,000 at 7%
  { min: 300001, max: 600000, rate: 11 },  // Next ₦300,000 at 11%
  { min: 600001, max: 1100000, rate: 15 }, // Next ₦500,000 at 15%
  { min: 1100001, max: 1600000, rate: 19 }, // Next ₦500,000 at 19%
  { min: 1600001, max: 3200000, rate: 21 }, // Next ₦1,600,000 at 21%
  { min: 3200001, max: Infinity, rate: 24 }  // Above ₦3,200,000 at 24%
];

// Relief and allowances constants
const CONSOLIDATED_RELIEF_ALLOWANCE = 200000 + (20000 * 12); // ₦200,000 + (₦20,000 × 12 months)
const PENSION_RATE = 0.08; // 8% employee contribution
const PENSION_EMPLOYER_RATE = 0.10; // 10% employer contribution
const NHF_RATE = 0.025; // 2.5% of basic salary
const NSITF_RATE = 0.01; // 1% of gross salary

export const SalaryCalculator: React.FC<SalaryCalculatorProps> = ({
  employee,
  grossSalary,
  onCalculationComplete,
  showDetailedBreakdown = true,
  className = ""
}) => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculation, setCalculation] = useState<NetSalaryCalculation | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

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

  const getPayFrequencyMultiplier = (): number => {
    switch (employee.pay_frequency) {
      case 'WEEKLY': return 52;
      case 'BIWEEKLY': return 26;
      case 'MONTHLY': return 12;
      default: return 12;
    }
  };

  const getAnnualAmount = (amount: number): number => {
    return amount * getPayFrequencyMultiplier();
  };

  // Tax Calculation Function
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

  // Main Calculation Function
  const calculateNetSalaryDetailed = (): NetSalaryCalculation => {
    const grossSalaryAmount = grossSalary;
    
    // For simplicity, assume 60% basic, 40% allowances (this can be made configurable)
    const basicSalary = grossSalaryAmount * 0.6;
    const allowances = grossSalaryAmount * 0.4;
    const totalIncome = grossSalaryAmount;

    // Calculate deductions
    let pensionEmployeeContribution = 0;
    let pensionEmployerContribution = 0;
    let nhfDeduction = 0;
    let nsitfDeduction = 0;

    if (employee.is_pension_applicable) {
      pensionEmployeeContribution = grossSalaryAmount * PENSION_RATE;
      pensionEmployerContribution = grossSalaryAmount * PENSION_EMPLOYER_RATE;
    }

    if (employee.is_nhf_applicable) {
      nhfDeduction = basicSalary * NHF_RATE;
    }

    if (employee.is_nsitf_applicable) {
      nsitfDeduction = grossSalaryAmount * NSITF_RATE;
    }

    // Calculate taxable income
    const consolidatedReliefAllowance = CONSOLIDATED_RELIEF_ALLOWANCE;
    const taxableIncomeBeforeRelief = totalIncome - pensionEmployeeContribution;
    const taxableIncome = Math.max(0, taxableIncomeBeforeRelief - consolidatedReliefAllowance);

    // Calculate PAYE tax
    let payeTax = 0;
    let marginalTaxRate = 0;

    if (employee.is_paye_applicable && taxableIncome > 0) {
      const taxCalculation = calculateTax(taxableIncome);
      payeTax = taxCalculation.tax;
      marginalTaxRate = taxCalculation.marginalRate;
    }

    // Calculate totals
    const totalDeductionsAmount = pensionEmployeeContribution + nhfDeduction + nsitfDeduction + payeTax;
    const netSalaryAmount = grossSalaryAmount - totalDeductionsAmount;
    const effectiveTaxRate = grossSalaryAmount > 0 ? (payeTax / grossSalaryAmount) * 100 : 0;

    return {
      grossSalary: grossSalaryAmount,
      basicSalary,
      allowances,
      totalIncome,
      pensionEmployeeContribution,
      pensionEmployerContribution,
      nhfDeduction,
      nsitfDeduction,
      consolidatedReliefAllowance,
      taxableIncome,
      payeTax,
      totalDeductions: totalDeductionsAmount,
      netSalary: netSalaryAmount,
      effectiveTaxRate,
      marginalTaxRate
    };
  };

  // Handle Calculation
  const handleCalculate = async (): Promise<void> => {
    if (grossSalary <= 0) {
      return;
    }

    setIsCalculating(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const result = calculateNetSalaryDetailed();
      setCalculation(result);
      setHasCalculated(true);
      setShowDetails(showDetailedBreakdown);
      
      // Notify parent component
      onCalculationComplete?.(result);
    } catch (error) {
      console.error("Error calculating net salary:", error);
    } finally {
      setIsCalculating(false);
    }
  };

  // Reset calculation when gross salary changes
  React.useEffect(() => {
    setHasCalculated(false);
    setCalculation(null);
    setShowDetails(false);
  }, [grossSalary]);

  if (grossSalary <= 0) {
    return (
      <Card className={`border-gray-200 ${className}`}>
        <CardContent className="p-6 text-center text-gray-500">
          <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Enter a gross salary amount to calculate net salary</p>
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
            Net Salary Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Deductions Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Info className="w-5 h-5 text-blue-600 mr-2" />
                <h4 className="font-semibold text-blue-900">Employee Deductions</h4>
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
            </div>

            {/* Calculate Button */}
            <div className="text-center">
              <Button
                onClick={handleCalculate}
                disabled={isCalculating || grossSalary <= 0}
                className="bg-green-600 hover:bg-green-700"
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
                    Calculate Net Salary
                  </>
                )}
              </Button>
            </div>

            {/* Calculation Results */}
            {hasCalculated && calculation && (
              <div className="space-y-6 mt-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-900">
                        {formatCurrency(calculation.grossSalary)}
                      </div>
                      <div className="text-sm text-blue-600">Gross Salary</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-red-900">
                        {formatCurrency(calculation.totalDeductions)}
                      </div>
                      <div className="text-sm text-red-600">Total Deductions</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-900">
                        {formatCurrency(calculation.netSalary)}
                      </div>
                      <div className="text-sm text-green-600">Net Take-Home</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Show/Hide Details Button */}
                {showDetailedBreakdown && (
                  <div className="text-center">
                    <Button
                      variant="outline"
                      onClick={() => setShowDetails(!showDetails)}
                    >
                      {showDetails ? 'Hide Details' : 'Show Detailed Breakdown'}
                    </Button>
                  </div>
                )}

                {/* Detailed Breakdown */}
                {showDetails && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Income Breakdown */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg text-green-700">Income Components</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Basic Salary (60%)</span>
                            <span className="font-semibold">{formatCurrency(calculation.basicSalary)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Allowances (40%)</span>
                            <span className="font-semibold">{formatCurrency(calculation.allowances)}</span>
                          </div>
                          <div className="border-t pt-2">
                            <div className="flex justify-between text-lg font-bold text-green-700">
                              <span>Total Income</span>
                              <span>{formatCurrency(calculation.totalIncome)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Deductions Breakdown */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg text-red-700">Deductions</CardTitle>
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
                    {employee.is_paye_applicable && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Tax Calculation Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Gross Income</span>
                                <span>{formatCurrency(calculation.totalIncome)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Less: Pension Contribution</span>
                                <span>({formatCurrency(calculation.pensionEmployeeContribution)})</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Less: Consolidated Relief</span>
                                <span>({formatCurrency(calculation.consolidatedReliefAllowance)})</span>
                              </div>
                              <div className="border-t pt-2">
                                <div className="flex justify-between font-semibold">
                                  <span>Taxable Income</span>
                                  <span>{formatCurrency(calculation.taxableIncome)}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">PAYE Tax</span>
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
                            <h4 className="font-semibold mb-3 text-gray-700">PAYE Tax Brackets (2025)</h4>
                            <div className="overflow-x-auto">
                              <table className="min-w-full text-sm">
                                <thead>
                                  <tr className="border-b">
                                    <th className="text-left py-2">Income Range</th>
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
                        <CardTitle className="text-lg text-blue-700">Annual Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-xl font-bold text-blue-900">
                              {formatCurrency(getAnnualAmount(calculation.grossSalary))}
                            </div>
                            <div className="text-sm text-blue-600">Annual Gross</div>
                          </div>
                          <div>
                            <div className="text-xl font-bold text-red-900">
                              {formatCurrency(getAnnualAmount(calculation.totalDeductions))}
                            </div>
                            <div className="text-sm text-red-600">Annual Deductions</div>
                          </div>
                          <div>
                            <div className="text-xl font-bold text-green-900">
                              {formatCurrency(getAnnualAmount(calculation.netSalary))}
                            </div>
                            <div className="text-sm text-green-600">Annual Take-Home</div>
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

// Export the calculation function for external use
export const calculateNetSalary = (employee: Employee, grossSalary: number): NetSalaryCalculation => {
  const grossSalaryAmount = grossSalary;
  
  // For simplicity, assume 60% basic, 40% allowances (this can be made configurable)
  const basicSalary = grossSalaryAmount * 0.6;
  const allowances = grossSalaryAmount * 0.4;
  const totalIncome = grossSalaryAmount;

  // Calculate deductions
  let pensionEmployeeContribution = 0;
  let pensionEmployerContribution = 0;
  let nhfDeduction = 0;
  let nsitfDeduction = 0;

  if (employee.is_pension_applicable) {
    pensionEmployeeContribution = grossSalaryAmount * PENSION_RATE;
    pensionEmployerContribution = grossSalaryAmount * PENSION_EMPLOYER_RATE;
  }

  if (employee.is_nhf_applicable) {
    nhfDeduction = basicSalary * NHF_RATE;
  }

  if (employee.is_nsitf_applicable) {
    nsitfDeduction = grossSalaryAmount * NSITF_RATE;
  }

  // Calculate taxable income
  const consolidatedReliefAllowance = CONSOLIDATED_RELIEF_ALLOWANCE;
  const taxableIncomeBeforeRelief = totalIncome - pensionEmployeeContribution;
  const taxableIncome = Math.max(0, taxableIncomeBeforeRelief - consolidatedReliefAllowance);

  // Calculate PAYE tax
  let payeTax = 0;
  let marginalTaxRate = 0;

  if (employee.is_paye_applicable && taxableIncome > 0) {
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

    payeTax = tax;
    marginalTaxRate = marginalRate;
  }

  // Calculate totals
  const totalDeductionsAmount = pensionEmployeeContribution + nhfDeduction + nsitfDeduction + payeTax;
  const netSalaryAmount = grossSalaryAmount - totalDeductionsAmount;
  const effectiveTaxRate = grossSalaryAmount > 0 ? (payeTax / grossSalaryAmount) * 100 : 0;

  return {
    grossSalary: grossSalaryAmount,
    basicSalary,
    allowances,
    totalIncome,
    pensionEmployeeContribution,
    pensionEmployerContribution,
    nhfDeduction,
    nsitfDeduction,
    consolidatedReliefAllowance,
    taxableIncome,
    payeTax,
    totalDeductions: totalDeductionsAmount,
    netSalary: netSalaryAmount,
    effectiveTaxRate,
    marginalTaxRate
  };
};

export default SalaryCalculator;