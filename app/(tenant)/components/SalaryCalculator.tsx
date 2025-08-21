"use client";

// Interfaces for data structures
export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

export interface NetSalaryCalculation {
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

export interface Employee {
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

// Nigerian PAYE tax brackets for 2025
const TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 300000, rate: 7 },       // First ₦300,000 at 7%
  { min: 300001, max: 600000, rate: 11 },  // Next ₦300,000 at 11%
  { min: 600001, max: 1100000, rate: 15 }, // Next ₦500,000 at 15%
  { min: 1100001, max: 1600000, rate: 19 }, // Next ₦500,000 at 19%
  { min: 1600001, max: 3200000, rate: 21 }, // Next ₦1,600,000 at 21%
  { min: 3200001, max: Infinity, rate: 24 }  // Above ₦3,200,000 at 24%
];

// Relief and allowances
const CONSOLIDATED_RELIEF_ALLOWANCE = 200000 + (20000 * 12); // ₦200,000 + (₦20,000 × 12 months)
const PENSION_RATE = 0.08; // 8% employee contribution
const PENSION_EMPLOYER_RATE = 0.10; // 10% employer contribution
const NHF_RATE = 0.025; // 2.5% of basic salary
const NSITF_RATE = 0.01; // 1% of gross salary

/**
 * Calculates the PAYE tax based on the taxable income.
 * @param taxableIncome The amount of income subject to tax.
 * @returns An object containing the calculated tax and the marginal tax rate.
 */
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

/**
 * Calculates the detailed net salary breakdown for an employee.
 * @param grossSalary The gross salary of the employee.
 * @param employee The employee data.
 * @returns A detailed breakdown of the net salary calculation.
 */
export const calculateNetSalaryDetailed = (grossSalary: number, employee: Employee): NetSalaryCalculation => {
  if (!employee) {
    throw new Error("Employee data is required for calculation");
  }

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
