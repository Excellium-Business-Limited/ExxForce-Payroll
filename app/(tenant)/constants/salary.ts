// constants/salary.ts
import { TaxBracket } from '../types/employee';

export const SALARY_CONSTANTS = {
  BASIC_SALARY_RATIO: 0.6,
  ALLOWANCE_RATIO: 0.4,
  BASE_RELIEF_ALLOWANCE: 200000, // ₦200,000 base
  PENSION_RATE: 0.08, // 8% employee contribution
  PENSION_EMPLOYER_RATE: 0.10, // 10% employer contribution
  NHF_RATE: 0.025, // 2.5% of gross salary (Finance Act 2023)
  NSITF_RATE: 0.01, // 1% of gross salary
  CONSOLIDATION_RELIEF_RATE: 0.20 // 20% of adjusted gross income
} as const;

// Nigerian PAYE tax brackets for 2025 (Annual amounts)
export const TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 300000, rate: 7 },        // First ₦300,000 at 7%
  { min: 300001, max: 600000, rate: 11 },  // Next ₦300,000 at 11%
  { min: 600001, max: 1100000, rate: 15 }, // Next ₦500,000 at 15%
  { min: 1100001, max: 1600000, rate: 19 }, // Next ₦500,000 at 19%
  { min: 1600001, max: 3200000, rate: 21 }, // Next ₦1,600,000 at 21%
  { min: 3200001, max: Infinity, rate: 24 }  // Above ₦3,200,000 at 24%
];

export const PAY_FREQUENCY_MULTIPLIERS = {
  WEEKLY: 52,
  BIWEEKLY: 26,
  MONTHLY: 12
} as const;