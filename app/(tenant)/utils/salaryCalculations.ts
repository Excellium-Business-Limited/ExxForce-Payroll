// utils/salaryCalculations.ts
import { Employee, SalaryComponent, NetSalaryCalculation } from '../types/employee';
import { SALARY_CONSTANTS, TAX_BRACKETS, PAY_FREQUENCY_MULTIPLIERS } from '../constants/salary';
import { validateSalaryInput, validateEmployee, validateSalaryComponents } from './validation';

// Utility function to get pay frequency multiplier
export const getPayFrequencyMultiplier = (frequency: Employee['pay_frequency']): number => {
  return PAY_FREQUENCY_MULTIPLIERS[frequency] || PAY_FREQUENCY_MULTIPLIERS.MONTHLY;
};

// Tax calculation function
export const calculateTax = (taxableIncome: number): { tax: number; marginalRate: number } => {
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

// Analyze earning components
interface ComponentAnalysis {
  monthlyPensionableAmount: number;
  monthlyTaxableAmount: number;
  annualPensionableAmount: number;
  annualTaxableAmount: number;
  hasPensionableComponents: boolean;
  hasTaxableComponents: boolean;
}

const analyzeEarningComponents = (
  earningComponents: SalaryComponent[], 
  payFrequencyMultiplier: number
): ComponentAnalysis => {
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

  return {
    monthlyPensionableAmount,
    monthlyTaxableAmount,
    annualPensionableAmount: monthlyPensionableAmount * payFrequencyMultiplier,
    annualTaxableAmount: monthlyTaxableAmount * payFrequencyMultiplier,
    hasPensionableComponents,
    hasTaxableComponents
  };
};

// Calculate statutory deductions
interface StatutoryDeductions {
  annualPensionContribution: number;
  annualPensionEmployerContribution: number;
  annualNhfDeduction: number;
  annualNsitfDeduction: number;
}

const calculateStatutoryDeductions = (
  employee: Employee,
  annualGrossSalary: number,
  componentAnalysis: ComponentAnalysis
): StatutoryDeductions => {
  let annualPensionContribution = 0;
  let annualPensionEmployerContribution = 0;
  let annualNhfDeduction = 0;
  let annualNsitfDeduction = 0;

  // Pension calculation (8% of pensionable components or gross if no components)
  if (employee.is_pension_applicable) {
    const pensionBase = componentAnalysis.hasPensionableComponents 
      ? componentAnalysis.annualPensionableAmount 
      : annualGrossSalary;
    
    if (pensionBase > 0) {
      annualPensionContribution = pensionBase * SALARY_CONSTANTS.PENSION_RATE;
      annualPensionEmployerContribution = pensionBase * SALARY_CONSTANTS.PENSION_EMPLOYER_RATE;
    }
  }

  // NHF calculation (2.5% of gross salary - Finance Act 2023)
  if (employee.is_nhf_applicable) {
    annualNhfDeduction = annualGrossSalary * SALARY_CONSTANTS.NHF_RATE;
  }

  // NSITF calculation (1% of gross salary)
  if (employee.is_nsitf_applicable) {
    annualNsitfDeduction = annualGrossSalary * SALARY_CONSTANTS.NSITF_RATE;
  }

  return {
    annualPensionContribution,
    annualPensionEmployerContribution,
    annualNhfDeduction,
    annualNsitfDeduction
  };
};

// Calculate PAYE tax
interface TaxCalculation {
  adjustedGrossIncome: number;
  consolidatedReliefAllowance: number;
  taxableIncome: number;
  annualPayeTax: number;
  marginalTaxRate: number;
}

const calculatePayeTax = (
  employee: Employee,
  annualGrossSalary: number,
  statutoryDeductions: StatutoryDeductions,
  componentAnalysis: ComponentAnalysis
): TaxCalculation => {
  // Step 1: Calculate Adjusted Gross Income (Finance Act 2023 method)
  const adjustedGrossIncome = annualGrossSalary - (
    statutoryDeductions.annualPensionContribution + 
    statutoryDeductions.annualNhfDeduction
  );

  // Step 2: Calculate Consolidated Relief Allowance
  const consolidatedReliefAllowance = (
    SALARY_CONSTANTS.CONSOLIDATION_RELIEF_RATE * adjustedGrossIncome
  ) + SALARY_CONSTANTS.BASE_RELIEF_ALLOWANCE;

  // Step 3: Calculate Annual Taxable Income
  let annualTaxableIncomeForTax = 0;
  if (componentAnalysis.hasTaxableComponents) {
    // Use only taxable components for tax calculation
    annualTaxableIncomeForTax = componentAnalysis.annualTaxableAmount - (
      statutoryDeductions.annualPensionContribution + 
      statutoryDeductions.annualNhfDeduction + 
      consolidatedReliefAllowance
    );
  } else {
    // Use gross salary if no specific taxable components
    annualTaxableIncomeForTax = annualGrossSalary - (
      statutoryDeductions.annualPensionContribution + 
      statutoryDeductions.annualNhfDeduction + 
      consolidatedReliefAllowance
    );
  }
  
  const finalTaxableIncome = Math.max(0, annualTaxableIncomeForTax);

  // Step 4: Calculate Annual PAYE Tax
  let annualPayeTax = 0;
  let marginalTaxRate = 0;

  if (employee.is_paye_applicable && finalTaxableIncome > 0) {
    const taxCalculation = calculateTax(finalTaxableIncome);
    annualPayeTax = taxCalculation.tax;
    marginalTaxRate = taxCalculation.marginalRate;
  }

  return {
    adjustedGrossIncome,
    consolidatedReliefAllowance,
    taxableIncome: finalTaxableIncome,
    annualPayeTax,
    marginalTaxRate
  };
};

// Main calculation function
export const calculateNetSalaryDetailed = (
  employee: Employee,
  grossSalary: number,
  earningComponents: SalaryComponent[] = []
): NetSalaryCalculation => {
  // Validate inputs
  if (!validateSalaryInput(grossSalary)) {
    throw new Error('Invalid gross salary amount');
  }

  const employeeErrors = validateEmployee(employee);
  if (employeeErrors.length > 0) {
    throw new Error(`Employee validation failed: ${employeeErrors.join(', ')}`);
  }

  const componentErrors = validateSalaryComponents(earningComponents);
  if (componentErrors.length > 0) {
    throw new Error(`Component validation failed: ${componentErrors.join(', ')}`);
  }

  const monthlyGross = grossSalary;
  const payFrequencyMultiplier = getPayFrequencyMultiplier(employee.pay_frequency);
  
  try {
    // Step 1: Annualize the gross salary
    const annualGrossSalary = monthlyGross * payFrequencyMultiplier;
    
    // Step 2: Analyze earning components
    const componentAnalysis = analyzeEarningComponents(earningComponents, payFrequencyMultiplier);
    
    // Step 3: Calculate statutory deductions
    const statutoryDeductions = calculateStatutoryDeductions(
      employee, 
      annualGrossSalary, 
      componentAnalysis
    );
    
    // Step 4: Calculate tax
    const taxCalculation = calculatePayeTax(
      employee,
      annualGrossSalary,
      statutoryDeductions,
      componentAnalysis
    );

    // Step 5: For display purposes, maintain the 60/40 split
    const basicSalary = monthlyGross * SALARY_CONSTANTS.BASIC_SALARY_RATIO;
    const allowances = monthlyGross * SALARY_CONSTANTS.ALLOWANCE_RATIO;

    // Step 6: Convert back to monthly amounts
    const monthlyPensionContribution = statutoryDeductions.annualPensionContribution / payFrequencyMultiplier;
    const monthlyPensionEmployerContribution = statutoryDeductions.annualPensionEmployerContribution / payFrequencyMultiplier;
    const monthlyNhfDeduction = statutoryDeductions.annualNhfDeduction / payFrequencyMultiplier;
    const monthlyNsitfDeduction = statutoryDeductions.annualNsitfDeduction / payFrequencyMultiplier;
    const monthlyPayeTax = taxCalculation.annualPayeTax / payFrequencyMultiplier;

    // Step 7: Calculate final amounts
    const totalMonthlyDeductions = monthlyPensionContribution + monthlyNhfDeduction + monthlyNsitfDeduction + monthlyPayeTax;
    const netMonthlySalary = monthlyGross - totalMonthlyDeductions;
    const effectiveTaxRate = monthlyGross > 0 ? (monthlyPayeTax / monthlyGross) * 100 : 0;

    return {
      // Monthly display amounts
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
      
      // Annual calculation basis
      annualGrossSalary,
      annualPensionableAmount: componentAnalysis.annualPensionableAmount,
      annualTaxableAmount: componentAnalysis.annualTaxableAmount,
      annualPensionContribution: statutoryDeductions.annualPensionContribution,
      annualNhfDeduction: statutoryDeductions.annualNhfDeduction,
      annualNsitfDeduction: statutoryDeductions.annualNsitfDeduction,
      
      // Tax calculation details
      adjustedGrossIncome: taxCalculation.adjustedGrossIncome,
      consolidatedReliefAllowance: taxCalculation.consolidatedReliefAllowance,
      taxableIncome: taxCalculation.taxableIncome,
      annualPayeTax: taxCalculation.annualPayeTax,
      
      effectiveTaxRate,
      marginalTaxRate: taxCalculation.marginalTaxRate,
      hasPensionableComponents: componentAnalysis.hasPensionableComponents,
      hasTaxableComponents: componentAnalysis.hasTaxableComponents,
      pensionableAmount: componentAnalysis.monthlyPensionableAmount,
      taxableAmount: componentAnalysis.monthlyTaxableAmount
    };
    
  } catch (error) {
    throw new Error(`Calculation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};