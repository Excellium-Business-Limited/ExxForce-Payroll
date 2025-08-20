"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, AlertCircle, Calculator, Info } from "lucide-react";
import axios from 'axios';
import { useGlobal } from '@/app/Context/page';

type ComponentType = "earning" | "deduction" | "benefit";

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
}

interface BackendComponent {
  id: number;
  name: string;
  calculation_type: 'fixed' | 'percentage';
  value: number;
  is_basic?: boolean;
  is_pensionable?: boolean;
  is_taxable?: boolean;
}

interface BackendDeduction {
  id: number;
  name: string;
  calculation_type: 'fixed' | 'percentage';
  value: number;
  is_tax_related?: boolean;
  is_active?: boolean;
}

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

interface SalaryComponentSetupProps {
  employee?: Employee;
  onClose?: () => void;
  onSubmit?: (data: any) => void;
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

// Relief and allowances
const CONSOLIDATED_RELIEF_ALLOWANCE = 200000 + (20000 * 12); // ₦200,000 + (₦20,000 × 12 months)
const PENSION_RATE = 0.08; // 8% employee contribution
const PENSION_EMPLOYER_RATE = 0.10; // 10% employer contribution
const NHF_RATE = 0.025; // 2.5% of basic salary
const NSITF_RATE = 0.01; // 1% of gross salary

export default function SalaryComponentSetup({ employee, onClose, onSubmit }: SalaryComponentSetupProps) {
  const [employeeName, setEmployeeName] = useState("");
  const [grossSalary, setGrossSalary] = useState<number>(0);
  const [description, setDescription] = useState("");

  const [earningComponents, setEarningComponents] = useState<SalaryComponent[]>([]);
  const [deductionComponents, setDeductionComponents] = useState<SalaryComponent[]>([]);
  const [benefitComponents, setBenefitComponents] = useState<SalaryComponent[]>([]);

  // Backend component options
  const [earningOptions, setEarningOptions] = useState<BackendComponent[]>([]);
  const [deductionOptions, setDeductionOptions] = useState<BackendDeduction[]>([]);
  const [loadingEarnings, setLoadingEarnings] = useState(false);
  const [loadingDeductions, setLoadingDeductions] = useState(false);
  const [earningError, setEarningError] = useState<string>('');
  const [deductionError, setDeductionError] = useState<string>('');

  // Calculation states
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [totalDeductions, setTotalDeductions] = useState<number>(0);
  const [basicAmount, setBasicAmount] = useState<number>(0);
  const [netSalary, setNetSalary] = useState<number>(0);
  const [hasCalculationError, setHasCalculationError] = useState<boolean>(false);
  const [calculationError, setCalculationError] = useState<string>('');

  // Net salary calculation states
  const [netSalaryCalculation, setNetSalaryCalculation] = useState<NetSalaryCalculation | null>(null);
  const [isCalculatingNetSalary, setIsCalculatingNetSalary] = useState(false);
  const [hasCalculatedNetSalary, setHasCalculatedNetSalary] = useState(false);

  // Get global context for tenant and auth
  const { tenant, globalState } = useGlobal();

  // Hardcoded benefit options (since no API endpoint provided)
  const benefitOptions = ["Bonus", "Medical", "Leave Allowance"];

  // Initialize form with employee data if provided
  useEffect(() => {
    if (employee) {
      setEmployeeName(`${employee.first_name} ${employee.last_name}`);
      setGrossSalary(employee.custom_salary || 0);
    }
  }, [employee]);

  // Nigerian Tax Calculation Functions
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

  const calculateNetSalaryDetailed = (): NetSalaryCalculation => {
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

  const handleCalculateNetSalary = async () => {
    if (!employee) {
      alert("Employee data is required for tax calculation");
      return;
    }

    if (grossSalary <= 0) {
      alert("Please enter a valid gross salary amount");
      return;
    }

    setIsCalculatingNetSalary(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const result = calculateNetSalaryDetailed();
      setNetSalaryCalculation(result);
      setHasCalculatedNetSalary(true);
    } catch (error) {
      console.error("Error calculating net salary:", error);
      alert("Failed to calculate net salary. Please try again.");
    } finally {
      setIsCalculatingNetSalary(false);
    }
  };

  // Function to fetch earning components from API
  const fetchEarningComponents = async () => {
    setLoadingEarnings(true);
    setEarningError('');
    
    try {
      const response = await axios.get(
        `http://${tenant}.localhost:8000/tenant/payroll-settings/salary-components`,
        {
          headers: {
            Authorization: `Bearer ${globalState.accessToken}`,
          },
        }
      );
      
      console.log('Earning components fetched:', response.data);
      
      let components: BackendComponent[] = [];
      if (Array.isArray(response.data)) {
        components = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        components = response.data.data;
      } else if (response.data.components && Array.isArray(response.data.components)) {
        components = response.data.components;
      }
      
      setEarningOptions(components);
      
      // Initialize with Basic component if available
      const basicComponent = components.find(comp => comp.is_basic || comp.name.toLowerCase().includes('basic'));
      if (basicComponent && earningComponents.length === 0) {
        const newBasicComponent: SalaryComponent = {
          id: "basic-default",
          name: basicComponent.name,
          componentId: basicComponent.id,
          calculationType: basicComponent.calculation_type,
          defaultValue: basicComponent.value,
          isBasic: true,
          isEditable: false,
          calculatedAmount: grossSalary
        };
        setEarningComponents([newBasicComponent]);
      }
      
    } catch (error) {
      console.error('Error fetching earning components:', error);
      setEarningError('Failed to load earning components');
      
      // Fallback to hardcoded components
      const fallbackComponents: BackendComponent[] = [
        { id: 1, name: 'Basic', calculation_type: 'fixed', value: 0, is_basic: true },
        { id: 2, name: 'Housing Allowance', calculation_type: 'percentage', value: 15 },
        { id: 3, name: 'Transport Allowance', calculation_type: 'fixed', value: 25000 },
        { id: 4, name: 'Meal Allowance', calculation_type: 'fixed', value: 20000 }
      ];
      setEarningOptions(fallbackComponents);
    } finally {
      setLoadingEarnings(false);
    }
  };

  // Function to fetch deduction components from API
  const fetchDeductionComponents = async () => {
    setLoadingDeductions(true);
    setDeductionError('');
    
    try {
      const response = await axios.get(
        `http://${tenant}.localhost:8000/tenant/payroll-settings/deduction-components`,
        {
          headers: {
            Authorization: `Bearer ${globalState.accessToken}`,
          },
        }
      );
      
      console.log('Deduction components fetched:', response.data);
      
      let components: BackendDeduction[] = [];
      if (Array.isArray(response.data)) {
        components = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        components = response.data.data;
      } else if (response.data.components && Array.isArray(response.data.components)) {
        components = response.data.components;
      }
      
      setDeductionOptions(components);
      
    } catch (error) {
      console.error('Error fetching deduction components:', error);
      setDeductionError('Failed to load deduction components');
      
      // Fallback to hardcoded components
      const fallbackComponents: BackendDeduction[] = [
        { id: 1, name: 'PAYE', calculation_type: 'percentage', value: 7.5, is_tax_related: true },
        { id: 2, name: 'Pension', calculation_type: 'percentage', value: 8 },
        { id: 3, name: 'NSITF', calculation_type: 'percentage', value: 1 }
      ];
      setDeductionOptions(fallbackComponents);
    } finally {
      setLoadingDeductions(false);
    }
  };

  // Fetch components on component mount
  useEffect(() => {
    fetchEarningComponents();
    fetchDeductionComponents();
  }, []);

  // Calculate component amounts and update basic component
  const calculateComponentAmounts = () => {
    if (grossSalary <= 0) return;

    setHasCalculationError(false);
    setCalculationError('');

    // Calculate earning components (excluding basic)
    let totalNonBasicEarnings = 0;
    const updatedEarningComponents = earningComponents.map(comp => {
      if (comp.isBasic) {
        return comp; // Skip basic component calculation for now
      }

      let calculatedAmount = 0;
      if (comp.calculationType === 'percentage' && comp.percentageValue !== undefined) {
        calculatedAmount = (grossSalary * comp.percentageValue) / 100;
      } else if (comp.calculationType === 'fixed' && comp.fixedValue !== undefined) {
        calculatedAmount = comp.fixedValue;
      }

      totalNonBasicEarnings += calculatedAmount;
      return { ...comp, calculatedAmount };
    });

    // Calculate basic component as remainder
    const remainingForBasic = grossSalary - totalNonBasicEarnings;
    
    // Check if basic would go below ₦1
    if (remainingForBasic < 1) {
      setHasCalculationError(true);
      setCalculationError(`Basic salary cannot be less than ₦1. Current components exceed gross salary by ₦${Math.abs(remainingForBasic).toLocaleString()}`);
      return;
    }

    // Update basic component
    const finalEarningComponents = updatedEarningComponents.map(comp => {
      if (comp.isBasic) {
        return { ...comp, calculatedAmount: remainingForBasic };
      }
      return comp;
    });

    // Calculate deduction components
    let totalDeductionsAmount = 0;
    const updatedDeductionComponents = deductionComponents.map(comp => {
      let calculatedAmount = 0;
      if (comp.calculationType === 'percentage' && comp.percentageValue !== undefined) {
        calculatedAmount = (grossSalary * comp.percentageValue) / 100;
      } else if (comp.calculationType === 'fixed' && comp.fixedValue !== undefined) {
        calculatedAmount = comp.fixedValue;
      }

      totalDeductionsAmount += calculatedAmount;
      return { ...comp, calculatedAmount };
    });

    // Update states
    setEarningComponents(finalEarningComponents);
    setDeductionComponents(updatedDeductionComponents);
    setTotalEarnings(grossSalary); // Total earnings is always gross
    setTotalDeductions(totalDeductionsAmount);
    setBasicAmount(remainingForBasic);
    setNetSalary(grossSalary - totalDeductionsAmount);
  };

  // Recalculate when components or gross salary changes
  useEffect(() => {
    if (grossSalary > 0 && (earningComponents.length > 0 || deductionComponents.length > 0)) {
      calculateComponentAmounts();
    }
  }, [grossSalary, earningComponents.length, deductionComponents.length]);

  // Also recalculate when component values change
  useEffect(() => {
    if (grossSalary > 0) {
      const timeoutId = setTimeout(() => {
        calculateComponentAmounts();
      }, 300); // Debounce calculations
      
      return () => clearTimeout(timeoutId);
    }
  }, [earningComponents, deductionComponents, grossSalary]);

  // Reset calculation when gross salary changes
  useEffect(() => {
    setHasCalculatedNetSalary(false);
    setNetSalaryCalculation(null);
  }, [grossSalary, earningComponents, deductionComponents]);

  const handleAddComponent = (type: ComponentType) => {
    const newComponent: SalaryComponent = {
      id: Date.now().toString(),
      name: "",
      isEditable: true,
      calculatedAmount: 0,
    };
    
    if (type === "earning") {
      setEarningComponents([...earningComponents, newComponent]);
    } else if (type === "deduction") {
      setDeductionComponents([...deductionComponents, newComponent]);
    } else if (type === "benefit") {
      setBenefitComponents([...benefitComponents, newComponent]);
    }
  };

  const handleRemoveComponent = (type: ComponentType, id: string) => {
    if (type === "earning") {
      // Don't allow removal of basic component
      const componentToRemove = earningComponents.find(c => c.id === id);
      if (componentToRemove?.isBasic) return;
      
      setEarningComponents(earningComponents.filter((c) => c.id !== id));
    } else if (type === "deduction") {
      setDeductionComponents(deductionComponents.filter((c) => c.id !== id));
    } else if (type === "benefit") {
      setBenefitComponents(benefitComponents.filter((c) => c.id !== id));
    }
  };

  const handleChange = (
    type: ComponentType,
    id: string,
    field: keyof SalaryComponent,
    value: any
  ) => {
    const update = (components: SalaryComponent[]) =>
      components.map((c) => {
        if (c.id === id) {
          const updatedComponent = { ...c, [field]: value };
          
          // When name changes, update component metadata
          if (field === 'name') {
            const options = type === 'earning' ? earningOptions : deductionOptions;
            const selectedComponent = options.find(opt => opt.name === value);
            if (selectedComponent) {
              updatedComponent.componentId = selectedComponent.id;
              updatedComponent.calculationType = selectedComponent.calculation_type;
              updatedComponent.defaultValue = selectedComponent.value;
              updatedComponent.isBasic = 'is_basic' in selectedComponent ? selectedComponent.is_basic : false;
              updatedComponent.isEditable = !updatedComponent.isBasic;
            }
          }
          
          // Clear opposite value when one is set
          if (field === 'fixedValue' && value !== undefined && value > 0) {
            updatedComponent.percentageValue = undefined;
          } else if (field === 'percentageValue' && value !== undefined && value > 0) {
            updatedComponent.fixedValue = undefined;
          }
          
          return updatedComponent;
        }
        return c;
      });

    if (type === "earning") setEarningComponents(update(earningComponents));
    if (type === "deduction") setDeductionComponents(update(deductionComponents));
    if (type === "benefit") setBenefitComponents(update(benefitComponents));
  };

  // Get component options based on type
  const getComponentOptions = (type: ComponentType) => {
    switch (type) {
      case "earning":
        return earningOptions;
      case "deduction":
        return deductionOptions;
      case "benefit":
        return benefitOptions.map((option, index) => ({ id: index, name: option }));
      default:
        return [];
    }
  };

  // Get loading state based on type
  const getLoadingState = (type: ComponentType) => {
    switch (type) {
      case "earning":
        return loadingEarnings;
      case "deduction":
        return loadingDeductions;
      case "benefit":
        return false;
      default:
        return false;
    }
  };

  // Get error state based on type
  const getErrorState = (type: ComponentType) => {
    switch (type) {
      case "earning":
        return earningError;
      case "deduction":
        return deductionError;
      case "benefit":
        return '';
      default:
        return '';
    }
  };

  // Get retry function based on type
  const getRetryFunction = (type: ComponentType) => {
    switch (type) {
      case "earning":
        return fetchEarningComponents;
      case "deduction":
        return fetchDeductionComponents;
      default:
        return () => {};
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (rate: number) => {
    return `${rate.toFixed(2)}%`;
  };

  const getPayFrequencyMultiplier = () => {
    if (!employee) return 12;
    switch (employee.pay_frequency) {
      case 'WEEKLY': return 52;
      case 'BIWEEKLY': return 26;
      case 'MONTHLY': return 12;
      default: return 12;
    }
  };

  const getAnnualAmount = (amount: number) => {
    return amount * getPayFrequencyMultiplier();
  };

  const renderComponentRows = (type: ComponentType, components: SalaryComponent[]) => {
    const options = getComponentOptions(type);
    const isLoading = getLoadingState(type);
    const error = getErrorState(type);
    const retryFunction = getRetryFunction(type);

    return (
      <>
        {components.map((comp) => (
          <div
            key={comp.id}
            className={`grid grid-cols-12 gap-4 items-center border-b pb-4 mb-4 ${
              comp.isBasic ? 'bg-blue-50 rounded-lg p-3' : ''
            }`}
          >
            {/* Component Name */}
            <div className="col-span-3">
              <Select
                onValueChange={(value) => handleChange(type, comp.id, "name", value)}
                value={comp.name}
                disabled={isLoading || comp.isBasic}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={
                    isLoading 
                      ? `Loading ${type} components...` 
                      : error 
                        ? `Error loading ${type} components` 
                        : `Select ${type} component`
                  } />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem 
                      key={option.id} 
                      value={typeof option.id === 'string' ? option.id : option.name}
                    >
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {error && type !== 'benefit' && (
                <p className="text-xs text-red-500 mt-1">
                  {error}
                  <button 
                    type="button"
                    onClick={retryFunction}
                    className="ml-2 text-blue-500 underline hover:no-underline"
                  >
                    Retry
                  </button>
                </p>
              )}
              {comp.isBasic && (
                <p className="text-xs text-blue-600 mt-1">
                  Auto-calculated as remainder
                </p>
              )}
            </div>

            {/* Fixed Value */}
            <div className="col-span-2">
              <Input
                type="number"
                value={comp.fixedValue ?? ""}
                onChange={(e) => {
                  const value = e.target.value ? parseFloat(e.target.value) : undefined;
                  handleChange(type, comp.id, "fixedValue", value);
                }}
                placeholder="0.00"
                className="w-full"
                disabled={
                  comp.percentageValue !== undefined && comp.percentageValue > 0 ||
                  comp.isBasic ||
                  comp.calculationType === 'percentage'
                }
              />
            </div>

            {/* Percentage Value */}
            <div className="col-span-2">
              <Input
                type="number"
                value={comp.percentageValue ?? ""}
                onChange={(e) => {
                  const value = e.target.value ? parseFloat(e.target.value) : undefined;
                  handleChange(type, comp.id, "percentageValue", value);
                }}
                placeholder="0"
                className="w-full"
                disabled={
                  comp.fixedValue !== undefined && comp.fixedValue > 0 ||
                  comp.isBasic ||
                  comp.calculationType === 'fixed'
                }
                max="100"
                min="0"
                step="0.1"
              />
            </div>

            {/* Calculated Amount */}
            <div className="col-span-3">
              <div className={`px-3 py-2 rounded-md text-sm font-medium ${
                comp.isBasic 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {formatCurrency(comp.calculatedAmount || 0)}
              </div>
            </div>

            {/* Delete Button */}
            <div className="col-span-2 flex justify-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveComponent(type, comp.id)}
                className="hover:bg-red-50"
                disabled={comp.isBasic}
              >
                <Trash2 className={`h-4 w-4 ${
                  comp.isBasic ? "text-gray-300" : "text-red-500"
                }`} />
              </Button>
            </div>
          </div>
        ))}
      </>
    );
  };

  const handleSubmitForm = () => {
    if (hasCalculationError) {
      alert('Please fix calculation errors before submitting.');
      return;
    }

    if (!hasCalculatedNetSalary) {
      alert('Please calculate the net salary before submitting.');
      return;
    }

    const payload = {
      employeeName,
      grossSalary,
      earningComponents,
      deductionComponents,
      benefitComponents,
      description,
      employee: employee,
      calculations: {
        totalEarnings,
        totalDeductions,
        basicAmount,
        netSalary
      },
      netSalaryCalculation
    };
    console.log("Salary Component Setup Data:", payload);
    onSubmit?.(payload);
  };

  const handleCloseForm = () => {
    onClose?.();
  };

  return (
    <div className="p-6 bg-white space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">Employee Salary Component Setup</h2>
        <p className="text-sm text-gray-500">
          Configure salary structure for {employee?.first_name} {employee?.last_name}. 
          The Basic component will auto-adjust based on other components.
        </p>
      </div>

      {/* Employee Details */}
      <div className="flex gap-6">
        <div className="flex-1 space-y-2">
          <Label>Employee Name</Label>
          <Input
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            placeholder="John Doe"
            disabled={!!employee}
          />
        </div>
        <div className="flex-1 space-y-2">
          <Label>Gross Salary</Label>
          <Input
            type="number"
            value={grossSalary}
            onChange={(e) => {
              const value = e.target.value ? parseFloat(e.target.value) : 0;
              setGrossSalary(value);
            }}
            placeholder="₦500,000.00"
            min="1"
          />
        </div>
      </div>

      {/* Calculation Error Alert */}
      {hasCalculationError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Calculation Error</h3>
              <div className="mt-2 text-sm text-red-700">
                {calculationError}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Card */}
      {grossSalary > 0 && !hasCalculationError && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Salary Breakdown</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-blue-600 font-medium">Gross Salary:</span>
              <div className="text-blue-900 font-semibold">{formatCurrency(grossSalary)}</div>
            </div>
            <div>
              <span className="text-blue-600 font-medium">Basic Amount:</span>
              <div className="text-blue-900 font-semibold">{formatCurrency(basicAmount)}</div>
            </div>
            <div>
              <span className="text-blue-600 font-medium">Total Deductions:</span>
              <div className="text-red-600 font-semibold">{formatCurrency(totalDeductions)}</div>
            </div>
            <div>
              <span className="text-blue-600 font-medium">Net Salary:</span>
              <div className="text-green-600 font-semibold">{formatCurrency(netSalary)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Nigerian Tax Calculator Section */}
      {employee && grossSalary > 0 && !hasCalculationError && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-lg text-green-700 flex items-center">
              <Calculator className="w-5 h-5 mr-2" />
              Nigerian Tax Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Tax Calculation Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Info className="w-5 h-5 text-blue-600 mr-2" />
                  <h4 className="font-semibold text-blue-900">Employee Tax Information</h4>
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
                  onClick={handleCalculateNetSalary}
                  disabled={isCalculatingNetSalary || grossSalary <= 0}
                  className="bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  {isCalculatingNetSalary ? (
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
                      Calculate Net Salary with Nigerian Tax
                    </>
                  )}
                </Button>
              </div>

              {/* Tax Calculation Results */}
              {netSalaryCalculation && (
                <div className="space-y-6 mt-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-blue-200 bg-blue-50">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-900">
                          {formatCurrency(netSalaryCalculation.grossSalary)}
                        </div>
                        <div className="text-sm text-blue-600">Gross Salary</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-red-200 bg-red-50">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-red-900">
                          {formatCurrency(netSalaryCalculation.totalDeductions)}
                        </div>
                        <div className="text-sm text-red-600">Total Deductions</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-900">
                          {formatCurrency(netSalaryCalculation.netSalary)}
                        </div>
                        <div className="text-sm text-green-600">Net Take-Home</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Detailed Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Income Breakdown */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg text-green-700">Income Components</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Basic Salary (60%)</span>
                          <span className="font-semibold">{formatCurrency(netSalaryCalculation.basicSalary)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Allowances (40%)</span>
                          <span className="font-semibold">{formatCurrency(netSalaryCalculation.allowances)}</span>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between text-lg font-bold text-green-700">
                            <span>Total Income</span>
                            <span>{formatCurrency(netSalaryCalculation.totalIncome)}</span>
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
                            <span className="font-semibold">{formatCurrency(netSalaryCalculation.pensionEmployeeContribution)}</span>
                          </div>
                        )}
                        {employee.is_nhf_applicable && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">NHF (2.5%)</span>
                            <span className="font-semibold">{formatCurrency(netSalaryCalculation.nhfDeduction)}</span>
                          </div>
                        )}
                        {employee.is_nsitf_applicable && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">NSITF (1%)</span>
                            <span className="font-semibold">{formatCurrency(netSalaryCalculation.nsitfDeduction)}</span>
                          </div>
                        )}
                        {employee.is_paye_applicable && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">PAYE Tax</span>
                            <span className="font-semibold">{formatCurrency(netSalaryCalculation.payeTax)}</span>
                          </div>
                        )}
                        <div className="border-t pt-2">
                          <div className="flex justify-between text-lg font-bold text-red-700">
                            <span>Total Deductions</span>
                            <span>{formatCurrency(netSalaryCalculation.totalDeductions)}</span>
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
                              <span>{formatCurrency(netSalaryCalculation.totalIncome)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Less: Pension Contribution</span>
                              <span>({formatCurrency(netSalaryCalculation.pensionEmployeeContribution)})</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Less: Consolidated Relief</span>
                              <span>({formatCurrency(netSalaryCalculation.consolidatedReliefAllowance)})</span>
                            </div>
                            <div className="border-t pt-2">
                              <div className="flex justify-between font-semibold">
                                <span>Taxable Income</span>
                                <span>{formatCurrency(netSalaryCalculation.taxableIncome)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">PAYE Tax</span>
                              <span className="font-semibold">{formatCurrency(netSalaryCalculation.payeTax)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Effective Tax Rate</span>
                              <span className="font-semibold">{formatPercentage(netSalaryCalculation.effectiveTaxRate)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Marginal Tax Rate</span>
                              <span className="font-semibold">{formatPercentage(netSalaryCalculation.marginalTaxRate)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Tax Brackets Reference */}
                        <div className="mt-6">
                          <h4 className="font-semibold mb-3 text-gray-700">Nigerian PAYE Tax Brackets (2025)</h4>
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
                                  const isApplicable = netSalaryCalculation.taxableIncome >= bracket.min;
                                  const taxableInBracket = Math.min(
                                    Math.max(0, netSalaryCalculation.taxableIncome - (bracket.min - 1)),
                                    bracket.max === Infinity ? netSalaryCalculation.taxableIncome : bracket.max - (bracket.min - 1)
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
                            {formatCurrency(getAnnualAmount(netSalaryCalculation.grossSalary))}
                          </div>
                          <div className="text-sm text-blue-600">Annual Gross</div>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-red-900">
                            {formatCurrency(getAnnualAmount(netSalaryCalculation.totalDeductions))}
                          </div>
                          <div className="text-sm text-red-600">Annual Deductions</div>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-green-900">
                            {formatCurrency(getAnnualAmount(netSalaryCalculation.netSalary))}
                          </div>
                          <div className="text-sm text-green-600">Annual Take-Home</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Earning Components */}
      <section>
        <h3 className="font-semibold mb-4">Earning Components</h3>
        <div className="space-y-1">
          {/* Header Row */}
          <div className="grid grid-cols-12 gap-4 items-center text-sm font-medium text-gray-700 border-b pb-3 mb-4">
            <div className="col-span-3">Component</div>
            <div className="col-span-2">Fixed Amount (₦)</div>
            <div className="col-span-2">Percentage (%)</div>
            <div className="col-span-3">Calculated Amount</div>
            <div className="col-span-2 text-center">Action</div>
          </div>
          {renderComponentRows("earning", earningComponents)}
        </div>
        <Button
          variant="outline"
          onClick={() => handleAddComponent("earning")}
          className="mt-4"
          disabled={loadingEarnings}
        >
          + Add Another Component
        </Button>
      </section>

      {/* Deduction Components */}
      <section>
        <h3 className="font-semibold mb-4">Deduction Components</h3>
        <div className="space-y-1">
          {/* Header Row */}
          <div className="grid grid-cols-12 gap-4 items-center text-sm font-medium text-gray-700 border-b pb-3 mb-4">
            <div className="col-span-3">Component</div>
            <div className="col-span-2">Fixed Amount (₦)</div>
            <div className="col-span-2">Percentage (%)</div>
            <div className="col-span-3">Calculated Amount</div>
            <div className="col-span-2 text-center">Action</div>
          </div>
          {renderComponentRows("deduction", deductionComponents)}
        </div>
        <Button
          variant="outline"
          onClick={() => handleAddComponent("deduction")}
          className="mt-4"
          disabled={loadingDeductions}
        >
          + Add Another Component
        </Button>
      </section>

      {/* Benefit Components */}
      <section>
        <h3 className="font-semibold mb-4">Benefit Components</h3>
        <div className="space-y-1">
          {/* Header Row */}
          <div className="grid grid-cols-12 gap-4 items-center text-sm font-medium text-gray-700 border-b pb-3 mb-4">
            <div className="col-span-3">Component</div>
            <div className="col-span-2">Fixed Amount (₦)</div>
            <div className="col-span-2">Percentage (%)</div>
            <div className="col-span-3">Calculated Amount</div>
            <div className="col-span-2 text-center">Action</div>
          </div>
          {renderComponentRows("benefit", benefitComponents)}
        </div>
        <Button
          variant="outline"
          onClick={() => handleAddComponent("benefit")}
          className="mt-4"
        >
          + Add Another Component
        </Button>
      </section>

      {/* Description */}
      <section>
        <Label>Notes</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={`Add any notes about ${employee?.first_name || 'this employee'}'s salary structure`}
        />
      </section>

      {/* Submission Warning */}
      {!hasCalculatedNetSalary && grossSalary > 0 && !hasCalculationError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Calculate Net Salary Required</h3>
              <div className="mt-2 text-sm text-yellow-700">
                You must calculate the net salary using the Nigerian Tax Calculator before submitting the form.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button variant="outline" onClick={handleCloseForm}>
          Close
        </Button>
        <Button 
          onClick={handleSubmitForm}
          disabled={hasCalculationError || grossSalary <= 0 || !hasCalculatedNetSalary}
          className={`${
            hasCalculationError || !hasCalculatedNetSalary 
              ? 'opacity-50 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {hasCalculatedNetSalary ? (
            <>
              Save Salary Setup
            </>
          ) : (
            <>
              Calculate Net Salary First
            </>
          )}
        </Button>
      </div>
    </div>
  );
}