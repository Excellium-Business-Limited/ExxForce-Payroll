// types/employee.ts
export interface Employee {
  id?: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone_number?: string;
  gender: 'MALE' | 'FEMALE';
  date_of_birth?: string;
  address?: string;
  employment_type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';
  start_date?: string;
  tax_start_date?: string;
  job_title?: string;
  department_name?: string;
  pay_grade_name?: string;
  custom_salary: number;
  bank_name?: string;
  account_number?: string;
  account_name?: string;
  pay_frequency: 'MONTHLY' | 'WEEKLY' | 'BIWEEKLY';
  is_paye_applicable: boolean;
  is_pension_applicable: boolean;
  is_nhf_applicable: boolean;
  is_nsitf_applicable: boolean;
}

export interface SalaryComponent {
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

export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

export interface NetSalaryCalculation {
  // Monthly amounts (display)
  grossSalary: number;
  basicSalary: number;
  allowances: number;
  totalIncome: number;
  
  // Monthly deductions
  pensionEmployeeContribution: number;
  pensionEmployerContribution: number;
  nhfDeduction: number;
  nsitfDeduction: number;
  payeTax: number;
  totalDeductions: number;
  netSalary: number;
  
  // Annual amounts (calculation basis)
  annualGrossSalary: number;
  annualPensionableAmount: number;
  annualTaxableAmount: number;
  annualPensionContribution: number;
  annualNhfDeduction: number;
  annualNsitfDeduction: number;
  
  // Tax calculation details
  adjustedGrossIncome: number;
  consolidatedReliefAllowance: number;
  taxableIncome: number;
  annualPayeTax: number;
  
  // Additional info
  effectiveTaxRate: number;
  marginalTaxRate: number;
  
  // Enhanced fields for component validation
  hasPensionableComponents: boolean;
  hasTaxableComponents: boolean;
  pensionableAmount: number;
  taxableAmount: number;
}

export interface SalaryCalculatorProps {
  /** Employee data for calculation */
  employee: Employee;
  /** Monthly gross salary amount */
  grossSalary: number;
  /** Optional earning components for detailed calculation */
  earningComponents?: SalaryComponent[];
  /** Callback fired when calculation completes successfully */
  onCalculationComplete?: (calculation: NetSalaryCalculation) => void;
  /** Callback fired when calculation encounters an error */
  onCalculationError?: (error: string) => void;
  /** Whether to show detailed breakdown by default */
  showDetailedBreakdown?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Whether the calculator is disabled */
  disabled?: boolean;
}

// Additional types for EmployeeDetails
export interface PayrollComponent {
  id: string;
  name: string;
  type: 'EARNING' | 'DEDUCTION' | 'BENEFIT';
  amount: number;
  is_percentage: boolean;
  percentage_value?: number;
  is_taxable?: boolean;
  description?: string;
}

export interface PayrollData {
  earnings: PayrollComponent[];
  deductions: PayrollComponent[];
  benefits: PayrollComponent[];
  gross_salary: number;
  net_salary: number;
  total_deductions: number;
  total_benefits: number;
}

export interface DetailedEmployee extends Employee {
  payroll_data?: PayrollData;
}

export interface LeaveRequest {
  id: string;
  leave_type: string;
  days: number;
  start_date: string;
  end_date: string;
  submitted_date: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reason: string;
}

export interface Loan {
  loan_number: string;
  amount: string;
  balance: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PENDING' | 'pending' | 'active' | 'completed';
  start_date: string;
  end_date?: string;
  monthly_deduction?: string;
  interest_rate?: number;
  loan_type?: string;
}