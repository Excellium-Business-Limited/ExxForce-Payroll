import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, AlertCircle } from "lucide-react";

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

interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

interface NetSalaryCalculation {
  grossSalary: number;
  totalIncome: number;
  
  // Component breakdowns
  pensionableComponents: { name: string; amount: number }[];
  taxableComponents: { name: string; amount: number }[];
  otherDeductions: { name: string; amount: number }[];
  
  // Calculated amounts
  totalPensionableAmount: number;
  totalTaxableAmount: number;
  
  // Statutory deductions
  pensionEmployeeContribution: number;
  pensionEmployerContribution: number;
  nhfDeduction: number;
  nsitfDeduction: number;
  
  // Tax calculation
  consolidatedReliefAllowance: number;
  taxableIncome: number;
  payeTax: number;
  
  // Other deductions from components
  totalOtherDeductions: number;
  
  // Final amounts
  totalStatutoryDeductions: number;
  totalAllDeductions: number;
  netSalary: number;
  
  // Additional info
  effectiveTaxRate: number;
  marginalTaxRate: number;
  
  // Status flags
  hasPensionableComponents: boolean;
  hasTaxableComponents: boolean;
  hasOtherDeductions: boolean;
}

interface SalaryCalculatorProps {
  employee: Employee;
  grossSalary: number;
  earningComponents: SalaryComponent[];
  deductionComponents: SalaryComponent[];
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
const NHF_RATE = 0.025; // 2.5% of basic salary (calculated on gross for simplicity)
const NSITF_RATE = 0.01; // 1% of gross salary

export const SalaryCalculator: React.FC<SalaryCalculatorProps> = ({
  employee,
  grossSalary,
  earningComponents,
  deductionComponents,
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

  // Tax Calculation Function (operates on annual amounts)
  const calculateTax = (annualTaxableIncome: number): { annualTax: number; marginalRate: number } => {
    let annualTax = 0;
    let marginalRate = 0;

    for (const bracket of TAX_BRACKETS) {
      if (annualTaxableIncome > bracket.min - 1) {
        const taxableInBracket = Math.min(annualTaxableIncome, bracket.max) - (bracket.min - 1);
        annualTax += (taxableInBracket * bracket.rate) / 100;
        marginalRate = bracket.rate;
        
        if (annualTaxableIncome <= bracket.max) break;
      }
    }

    return { annualTax, marginalRate };
  };

  // Main Calculation Function
  const calculateNetSalaryDetailed = (): NetSalaryCalculation => {
    const grossSalaryAmount = grossSalary;
    const totalIncome = grossSalaryAmount;

    // Analyze earning components for pensionable and taxable amounts
    const pensionableComponents: { name: string; amount: number }[] = [];
    const taxableComponents: { name: string; amount: number }[] = [];
    let totalPensionableAmount = 0;
    let totalTaxableAmount = 0;

    earningComponents.forEach(comp => {
      if (comp.calculatedAmount && comp.calculatedAmount > 0 && comp.name) {
        if (comp.isPensionable) {
          pensionableComponents.push({ name: comp.name, amount: comp.calculatedAmount });
          totalPensionableAmount += comp.calculatedAmount;
        }
        if (comp.isTaxable) {
          taxableComponents.push({ name: comp.name, amount: comp.calculatedAmount });
          totalTaxableAmount += comp.calculatedAmount;
        }
      }
    });

    // Analyze deduction components for other deductions
    const otherDeductions: { name: string; amount: number }[] = [];
    let totalOtherDeductions = 0;

    deductionComponents.forEach(comp => {
      if (comp.calculatedAmount && comp.calculatedAmount > 0 && comp.name) {
        otherDeductions.push({ name: comp.name, amount: comp.calculatedAmount });
        totalOtherDeductions += comp.calculatedAmount;
      }
    });

    // Calculate statutory deductions
    let pensionEmployeeContribution = 0;
    let pensionEmployerContribution = 0;
    let nhfDeduction = 0;
    let nsitfDeduction = 0;

    // Pension calculation based on pensionable components
    if (employee.is_pension_applicable) {
      if (totalPensionableAmount > 0) {
        pensionEmployeeContribution = totalPensionableAmount * PENSION_RATE;
        pensionEmployerContribution = totalPensionableAmount * PENSION_EMPLOYER_RATE;
      }
    }

    // NHF is calculated on gross salary
    if (employee.is_nhf_applicable) {
      nhfDeduction = grossSalaryAmount * NHF_RATE;
    }

    // NSITF is calculated on gross salary
    if (employee.is_nsitf_applicable) {
      nsitfDeduction = grossSalaryAmount * NSITF_RATE;
    }

    // Calculate taxable income and PAYE tax (convert to annual for tax calculation)
    const consolidatedReliefAllowance = CONSOLIDATED_RELIEF_ALLOWANCE; // This is already annual
    let monthlyTaxableIncomeBeforeRelief = 0;
    
    if (totalTaxableAmount > 0) {
      // Subtract pension contribution from taxable income before applying relief
      monthlyTaxableIncomeBeforeRelief = totalTaxableAmount - pensionEmployeeContribution;
    }
    
    // Convert to annual amounts for tax calculation
    const annualTaxableIncomeBeforeRelief = monthlyTaxableIncomeBeforeRelief * 12;
    const annualTaxableIncome = Math.max(0, annualTaxableIncomeBeforeRelief - consolidatedReliefAllowance);
    const monthlyTaxableIncome = annualTaxableIncome / 12;

    let payeTax = 0;
    let marginalTaxRate = 0;

    if (employee.is_paye_applicable && annualTaxableIncome > 0 && totalTaxableAmount > 0) {
      const taxCalculation = calculateTax(annualTaxableIncome);
      const annualPayeTax = taxCalculation.annualTax;
      payeTax = annualPayeTax / 12; // Convert back to monthly
      marginalTaxRate = taxCalculation.marginalRate;
    }

    // Calculate totals
    const totalStatutoryDeductions = pensionEmployeeContribution + nhfDeduction + nsitfDeduction + payeTax;
    const totalAllDeductions = totalStatutoryDeductions + totalOtherDeductions;
    const netSalaryAmount = grossSalaryAmount - totalAllDeductions;
    const effectiveTaxRate = grossSalaryAmount > 0 ? (payeTax / grossSalaryAmount) * 100 : 0;

    return {
      grossSalary: grossSalaryAmount,
      totalIncome,
      pensionableComponents,
      taxableComponents,
      otherDeductions,
      totalPensionableAmount,
      totalTaxableAmount,
      pensionEmployeeContribution,
      pensionEmployerContribution,
      nhfDeduction,
      nsitfDeduction,
      consolidatedReliefAllowance,
      taxableIncome: monthlyTaxableIncome,
      payeTax,
      totalOtherDeductions,
      totalStatutoryDeductions,
      totalAllDeductions,
      netSalary: netSalaryAmount,
      effectiveTaxRate,
      marginalTaxRate,
      hasPensionableComponents: pensionableComponents.length > 0,
      hasTaxableComponents: taxableComponents.length > 0,
      hasOtherDeductions: otherDeductions.length > 0
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

  // Reset calculation when inputs change
  React.useEffect(() => {
    setHasCalculated(false);
    setCalculation(null);
    setShowDetails(false);
  }, [grossSalary, earningComponents, deductionComponents]);

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
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg text-blue-700 flex items-center">
            <Calculator className="w-5 h-5 mr-2" />
            Net Salary Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Component Analysis */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-3">Component Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                
                {/* Pensionable Components */}
                <div>
                  <h5 className="font-medium text-blue-800 mb-2">Pensionable Components:</h5>
                  {earningComponents.filter(comp => comp.isPensionable && comp.calculatedAmount && comp.name).length > 0 ? (
                    <ul className="text-blue-700 space-y-1">
                      {earningComponents
                        .filter(comp => comp.isPensionable && comp.calculatedAmount && comp.name)
                        .map(comp => (
                          <li key={comp.id} className="flex justify-between">
                            <span className="truncate mr-2">{comp.name}</span>
                            <span className="font-medium">{formatCurrency(comp.calculatedAmount || 0)}</span>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-yellow-600">No pensionable components selected</p>
                  )}
                </div>

                {/* Taxable Components */}
                <div>
                  <h5 className="font-medium text-blue-800 mb-2">Taxable Components:</h5>
                  {earningComponents.filter(comp => comp.isTaxable && comp.calculatedAmount && comp.name).length > 0 ? (
                    <ul className="text-blue-700 space-y-1">
                      {earningComponents
                        .filter(comp => comp.isTaxable && comp.calculatedAmount && comp.name)
                        .map(comp => (
                          <li key={comp.id} className="flex justify-between">
                            <span className="truncate mr-2">{comp.name}</span>
                            <span className="font-medium">{formatCurrency(comp.calculatedAmount || 0)}</span>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-yellow-600">No taxable components selected</p>
                  )}
                </div>

                {/* Other Deductions */}
                <div>
                  <h5 className="font-medium text-blue-800 mb-2">Other Deductions:</h5>
                  {deductionComponents.filter(comp => comp.calculatedAmount && comp.name).length > 0 ? (
                    <ul className="text-blue-700 space-y-1">
                      {deductionComponents
                        .filter(comp => comp.calculatedAmount && comp.name)
                        .map(comp => (
                          <li key={comp.id} className="flex justify-between">
                            <span className="truncate mr-2">{comp.name}</span>
                            <span className="font-medium">{formatCurrency(comp.calculatedAmount || 0)}</span>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">No other deductions</p>
                  )}
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
                        {formatCurrency(calculation.totalAllDeductions)}
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

                {/* Warning Messages */}
                {employee.is_pension_applicable && !calculation.hasPensionableComponents && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-yellow-400" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">No Pensionable Components</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          Employee is set to contribute to pension but no pensionable salary components are selected.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {employee.is_paye_applicable && !calculation.hasTaxableComponents && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-yellow-400" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">No Taxable Components</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          Employee is set to pay PAYE tax but no taxable salary components are selected.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

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
                      {/* Statutory Deductions */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg text-red-700">Statutory Deductions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {employee.is_pension_applicable && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Pension (8%)
                                {!calculation.hasPensionableComponents && 
                                  <span className="text-yellow-600 text-xs ml-1">(No pensionable components)</span>
                                }
                              </span>
                              <span className="font-semibold">{formatCurrency(calculation.pensionEmployeeContribution)}</span>
                            </div>
                          )}
                          {employee.is_nhf_applicable && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">NHF (2.5% of gross)</span>
                              <span className="font-semibold">{formatCurrency(calculation.nhfDeduction)}</span>
                            </div>
                          )}
                          {employee.is_nsitf_applicable && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">NSITF (1% of gross)</span>
                              <span className="font-semibold">{formatCurrency(calculation.nsitfDeduction)}</span>
                            </div>
                          )}
                          {employee.is_paye_applicable && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                PAYE Tax
                                {!calculation.hasTaxableComponents && 
                                  <span className="text-yellow-600 text-xs ml-1">(No taxable components)</span>
                                }
                              </span>
                              <span className="font-semibold">{formatCurrency(calculation.payeTax)}</span>
                            </div>
                          )}
                          <div className="border-t pt-2">
                            <div className="flex justify-between text-lg font-bold text-red-700">
                              <span>Statutory Total</span>
                              <span>{formatCurrency(calculation.totalStatutoryDeductions)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Other Deductions & Summary */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg text-purple-700">Other Deductions & Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {calculation.hasOtherDeductions ? (
                            <>
                              {calculation.otherDeductions.map((deduction, index) => (
                                <div key={index} className="flex justify-between">
                                  <span className="text-gray-600">{deduction.name}</span>
                                  <span className="font-semibold">{formatCurrency(deduction.amount)}</span>
                                </div>
                              ))}
                              <div className="border-t pt-2">
                                <div className="flex justify-between font-semibold text-purple-700">
                                  <span>Other Deductions Total</span>
                                  <span>{formatCurrency(calculation.totalOtherDeductions)}</span>
                                </div>
                              </div>
                              <div className="border-t pt-2">
                                <div className="flex justify-between text-lg font-bold text-red-700">
                                  <span>All Deductions Total</span>
                                  <span>{formatCurrency(calculation.totalAllDeductions)}</span>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <p className="text-gray-500 text-center py-4">No other deductions</p>
                              <div className="border-t pt-2">
                                <div className="flex justify-between text-lg font-bold text-red-700">
                                  <span>Total Deductions</span>
                                  <span>{formatCurrency(calculation.totalStatutoryDeductions)}</span>
                                </div>
                              </div>
                            </>
                          )}
                          <div className="border-t pt-2 bg-green-50 p-3 rounded-lg">
                            <div className="flex justify-between text-xl font-bold text-green-800">
                              <span>Net Salary</span>
                              <span>{formatCurrency(calculation.netSalary)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Tax Calculation Details */}
                    {employee.is_paye_applicable && calculation.hasTaxableComponents && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Tax Calculation Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Monthly Taxable Components</span>
                                <span>{formatCurrency(calculation.totalTaxableAmount)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Annual Taxable Components</span>
                                <span>{formatCurrency(calculation.totalTaxableAmount * 12)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Less: Annual Pension Contribution</span>
                                <span>({formatCurrency(calculation.pensionEmployeeContribution * 12)})</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Less: Consolidated Relief (Annual)</span>
                                <span>({formatCurrency(calculation.consolidatedReliefAllowance)})</span>
                              </div>
                              <div className="border-t pt-2">
                                <div className="flex justify-between font-semibold">
                                  <span>Annual Taxable Income</span>
                                  <span>{formatCurrency(calculation.taxableIncome * 12)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500 mt-1">
                                  <span>Monthly Equivalent</span>
                                  <span>{formatCurrency(calculation.taxableIncome)}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Monthly PAYE Tax</span>
                                <span className="font-semibold">{formatCurrency(calculation.payeTax)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Annual PAYE Tax</span>
                                <span className="font-semibold">{formatCurrency(calculation.payeTax * 12)}</span>
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
                            <h4 className="font-semibold mb-3 text-gray-700">PAYE Tax Brackets (2025) - Annual Amounts</h4>
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
                                    const annualTaxableIncome = calculation.taxableIncome * 12;
                                    const isApplicable = annualTaxableIncome >= bracket.min;
                                    const taxableInBracket = Math.min(
                                      Math.max(0, annualTaxableIncome - (bracket.min - 1)),
                                      bracket.max === Infinity ? annualTaxableIncome : bracket.max - (bracket.min - 1)
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
                              {formatCurrency(getAnnualAmount(calculation.totalAllDeductions))}
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
export const calculateNetSalary = (
  employee: Employee, 
  grossSalary: number, 
  earningComponents: SalaryComponent[], 
  deductionComponents: SalaryComponent[]
): NetSalaryCalculation => {
  const grossSalaryAmount = grossSalary;
  const totalIncome = grossSalaryAmount;

  // Analyze earning components for pensionable and taxable amounts
  const pensionableComponents: { name: string; amount: number }[] = [];
  const taxableComponents: { name: string; amount: number }[] = [];
  let totalPensionableAmount = 0;
  let totalTaxableAmount = 0;

  earningComponents.forEach(comp => {
    if (comp.calculatedAmount && comp.calculatedAmount > 0 && comp.name) {
      if (comp.isPensionable) {
        pensionableComponents.push({ name: comp.name, amount: comp.calculatedAmount });
        totalPensionableAmount += comp.calculatedAmount;
      }
      if (comp.isTaxable) {
        taxableComponents.push({ name: comp.name, amount: comp.calculatedAmount });
        totalTaxableAmount += comp.calculatedAmount;
      }
    }
  });

  // Analyze deduction components for other deductions
  const otherDeductions: { name: string; amount: number }[] = [];
  let totalOtherDeductions = 0;

  deductionComponents.forEach(comp => {
    if (comp.calculatedAmount && comp.calculatedAmount > 0 && comp.name) {
      otherDeductions.push({ name: comp.name, amount: comp.calculatedAmount });
      totalOtherDeductions += comp.calculatedAmount;
    }
  });

  // Calculate statutory deductions
  let pensionEmployeeContribution = 0;
  let pensionEmployerContribution = 0;
  let nhfDeduction = 0;
  let nsitfDeduction = 0;

  // Pension calculation based on pensionable components
  if (employee.is_pension_applicable) {
    if (totalPensionableAmount > 0) {
      pensionEmployeeContribution = totalPensionableAmount * PENSION_RATE;
      pensionEmployerContribution = totalPensionableAmount * PENSION_EMPLOYER_RATE;
    }
  }

  // NHF is calculated on gross salary
  if (employee.is_nhf_applicable) {
    nhfDeduction = grossSalaryAmount * NHF_RATE;
  }

  // NSITF is calculated on gross salary
  if (employee.is_nsitf_applicable) {
    nsitfDeduction = grossSalaryAmount * NSITF_RATE;
  }

  // Calculate taxable income and PAYE tax
  const consolidatedReliefAllowance = CONSOLIDATED_RELIEF_ALLOWANCE;
  let taxableIncomeBeforeRelief = 0;
  
  if (totalTaxableAmount > 0) {
    // Subtract pension contribution from taxable income before applying relief
    taxableIncomeBeforeRelief = totalTaxableAmount - pensionEmployeeContribution;
  }
  
  const taxableIncome = Math.max(0, taxableIncomeBeforeRelief - consolidatedReliefAllowance);

  let payeTax = 0;
  let marginalTaxRate = 0;

  if (employee.is_paye_applicable && taxableIncome > 0 && totalTaxableAmount > 0) {
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
  const totalStatutoryDeductions = pensionEmployeeContribution + nhfDeduction + nsitfDeduction + payeTax;
  const totalAllDeductions = totalStatutoryDeductions + totalOtherDeductions;
  const netSalaryAmount = grossSalaryAmount - totalAllDeductions;
  const effectiveTaxRate = grossSalaryAmount > 0 ? (payeTax / grossSalaryAmount) * 100 : 0;

  return {
    grossSalary: grossSalaryAmount,
    totalIncome,
    pensionableComponents,
    taxableComponents,
    otherDeductions,
    totalPensionableAmount,
    totalTaxableAmount,
    pensionEmployeeContribution,
    pensionEmployerContribution,
    nhfDeduction,
    nsitfDeduction,
    consolidatedReliefAllowance,
    taxableIncome,
    payeTax,
    totalOtherDeductions,
    totalStatutoryDeductions,
    totalAllDeductions,
    netSalary: netSalaryAmount,
    effectiveTaxRate,
    marginalTaxRate,
    hasPensionableComponents: pensionableComponents.length > 0,
    hasTaxableComponents: taxableComponents.length > 0,
    hasOtherDeductions: otherDeductions.length > 0
  };
};

export default SalaryCalculator;