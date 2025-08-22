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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, AlertCircle } from "lucide-react";
import axios from 'axios';
import { useGlobal } from '@/app/Context/page';

// Import the SalaryCalculator component
import { SalaryCalculator, calculateNetSalary } from './SalaryCalculator';

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
  isPensionable?: boolean;
  isTaxable?: boolean;
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
  
  // New fields for component validation
  hasPensionableComponents: boolean;
  hasTaxableComponents: boolean;
  pensionableAmount: number;
  taxableAmount: number;
}

interface SalaryComponentSetupProps {
  employee?: Employee;
  onClose?: () => void;
  onSubmit?: (data: any) => void;
}

interface BenefitOption {
  id: number;
  name: string;
}

export default function SalaryComponentSetup({ employee, onClose, onSubmit }: SalaryComponentSetupProps): JSX.Element {
  const [employeeName, setEmployeeName] = useState<string>("");
  const [grossSalary, setGrossSalary] = useState<number>(0);

  const [earningComponents, setEarningComponents] = useState<SalaryComponent[]>([]);
  const [deductionComponents, setDeductionComponents] = useState<SalaryComponent[]>([]);
  const [benefitComponents, setBenefitComponents] = useState<SalaryComponent[]>([]);

  // Backend component options
  const [earningOptions, setEarningOptions] = useState<BackendComponent[]>([]);
  const [deductionOptions, setDeductionOptions] = useState<BackendDeduction[]>([]);
  const [loadingEarnings, setLoadingEarnings] = useState<boolean>(false);
  const [loadingDeductions, setLoadingDeductions] = useState<boolean>(false);
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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Get global context for tenant and auth
  const { tenant, globalState } = useGlobal();

  // Hardcoded benefit options (since no API endpoint provided)
  const benefitOptions: BenefitOption[] = [
    { id: 1, name: "Bonus" },
    { id: 2, name: "Medical" },
    { id: 3, name: "Leave Allowance" }
  ];

  // Initialize form with employee data if provided
  useEffect(() => {
    if (employee) {
      setEmployeeName(`${employee.first_name} ${employee.last_name}`);
      setGrossSalary(employee.custom_salary || 0);
    }
  }, [employee]);

  // Function to fetch earning components from API
  const fetchEarningComponents = async (): Promise<void> => {
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
          isPensionable: basicComponent.is_pensionable || false,
          isTaxable: basicComponent.is_taxable || false,
          calculatedAmount: grossSalary
        };
        setEarningComponents([newBasicComponent]);
      }
      
    } catch (error) {
      console.error('Error fetching earning components:', error);
      setEarningError('Failed to load earning components');
      
      // Fallback to hardcoded components
      const fallbackComponents: BackendComponent[] = [
        { id: 1, name: 'Basic', calculation_type: 'fixed', value: 0, is_basic: true, is_pensionable: true, is_taxable: true },
        { id: 2, name: 'Housing Allowance', calculation_type: 'percentage', value: 15, is_pensionable: false, is_taxable: true },
        { id: 3, name: 'Transport Allowance', calculation_type: 'fixed', value: 25000, is_pensionable: false, is_taxable: false },
        { id: 4, name: 'Meal Allowance', calculation_type: 'fixed', value: 20000, is_pensionable: false, is_taxable: false }
      ];
      setEarningOptions(fallbackComponents);
    } finally {
      setLoadingEarnings(false);
    }
  };

  // Function to fetch deduction components from API
  const fetchDeductionComponents = async (): Promise<void> => {
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
  const calculateComponentAmounts = (): void => {
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
    setNetSalaryCalculation(null);
  }, [grossSalary, earningComponents, deductionComponents]);

  // Enhanced calculation completion handler
  const handleCalculationComplete = (calculation: NetSalaryCalculation): void => {
    // Calculate pensionable and taxable amounts based on selected components
    let pensionableAmount = 0;
    let taxableAmount = 0;
    let hasPensionableComponents = false;
    let hasTaxableComponents = false;

    earningComponents.forEach(comp => {
      if (comp.calculatedAmount && comp.calculatedAmount > 0) {
        if (comp.isPensionable) {
          pensionableAmount += comp.calculatedAmount;
          hasPensionableComponents = true;
        }
        if (comp.isTaxable) {
          taxableAmount += comp.calculatedAmount;
          hasTaxableComponents = true;
        }
      }
    });

    const enhancedCalculation = {
      ...calculation,
      hasPensionableComponents,
      hasTaxableComponents,
      pensionableAmount,
      taxableAmount
    };

    setNetSalaryCalculation(enhancedCalculation);
  };

  const handleAddComponent = (type: ComponentType): void => {
    const newComponent: SalaryComponent = {
      id: Date.now().toString(),
      name: "",
      isEditable: true,
      calculatedAmount: 0,
      isPensionable: false,
      isTaxable: false,
    };
    
    if (type === "earning") {
      setEarningComponents([...earningComponents, newComponent]);
    } else if (type === "deduction") {
      setDeductionComponents([...deductionComponents, newComponent]);
    } else if (type === "benefit") {
      setBenefitComponents([...benefitComponents, newComponent]);
    }
  };

  const handleRemoveComponent = (type: ComponentType, id: string): void => {
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
  ): void => {
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
              
              // Set pensionable and taxable flags for earning components
              if (type === 'earning' && 'is_pensionable' in selectedComponent && 'is_taxable' in selectedComponent) {
                updatedComponent.isPensionable = selectedComponent.is_pensionable || false;
                updatedComponent.isTaxable = selectedComponent.is_taxable || false;
              }
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

  // Get available component options (filtering out already selected ones)
  const getAvailableComponentOptions = (type: ComponentType): (BackendComponent | BackendDeduction | BenefitOption)[] => {
    const allOptions = getComponentOptions(type);
    const selectedComponentNames = getCurrentComponents(type).map(comp => comp.name).filter(name => name);
    
    return allOptions.filter(option => !selectedComponentNames.includes(option.name));
  };

  // Get current components based on type
  const getCurrentComponents = (type: ComponentType): SalaryComponent[] => {
    switch (type) {
      case "earning":
        return earningComponents;
      case "deduction":
        return deductionComponents;
      case "benefit":
        return benefitComponents;
      default:
        return [];
    }
  };

  // Get component options based on type
  const getComponentOptions = (type: ComponentType): (BackendComponent | BackendDeduction | BenefitOption)[] => {
    switch (type) {
      case "earning":
        return earningOptions;
      case "deduction":
        return deductionOptions;
      case "benefit":
        return benefitOptions;
      default:
        return [];
    }
  };

  // Get loading state based on type
  const getLoadingState = (type: ComponentType): boolean => {
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
  const getErrorState = (type: ComponentType): string => {
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
  const getRetryFunction = (type: ComponentType): (() => void) => {
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
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // API submission functions
  const submitSalaryComponents = async (): Promise<void> => {
    const promises = earningComponents
      .filter(comp => comp.componentId && comp.name && (comp.fixedValue || comp.percentageValue))
      .map(async (comp) => {
        const payload: any = {
          component_id: comp.componentId
        };

        if (comp.fixedValue !== undefined && comp.fixedValue > 0) {
          payload.fixed_override = comp.fixedValue;
        } else if (comp.percentageValue !== undefined && comp.percentageValue > 0) {
          payload.percentage_override = comp.percentageValue;
        }

        return axios.post(
          `http://${tenant}.localhost:8000/tenant/employee/${employee?.employee_id}/salary-components/create`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${globalState.accessToken}`,
              'Content-Type': 'application/json'
            },
          }
        );
      });

    await Promise.all(promises);
  };

  const submitDeductionComponents = async (): Promise<void> => {
    const promises = deductionComponents
      .filter(comp => comp.componentId && comp.name && (comp.fixedValue || comp.percentageValue))
      .map(async (comp) => {
        const payload: any = {
          deduction_id: comp.componentId
        };

        if (comp.fixedValue !== undefined && comp.fixedValue > 0) {
          payload.fixed_override = comp.fixedValue;
        } else if (comp.percentageValue !== undefined && comp.percentageValue > 0) {
          payload.percentage_override = comp.percentageValue;
        }

        return axios.post(
          `http://${tenant}.localhost:8000/tenant/employee/${employee?.employee_id}/deduction-components/create`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${globalState.accessToken}`,
              'Content-Type': 'application/json'
            },
          }
        );
      });

    await Promise.all(promises);
  };

  const handleSubmitForm = async (): Promise<void> => {
    if (hasCalculationError) {
      alert('Please fix calculation errors before submitting.');
      return;
    }

    if (!employee?.employee_id) {
      alert('Employee ID is required for submission.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit salary components
      await submitSalaryComponents();
      
      // Submit deduction components
      await submitDeductionComponents();

      const payload = {
        employeeName,
        grossSalary,
        earningComponents,
        deductionComponents,
        benefitComponents,
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
      
    } catch (error) {
      console.error('Error submitting salary components:', error);
      alert('Failed to submit salary components. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseForm = (): void => {
    onClose?.();
  };

  const renderComponentRows = (type: ComponentType, components: SalaryComponent[]): JSX.Element => {
    const availableOptions = getAvailableComponentOptions(type);
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
                        : comp.name || `Select ${type} component`
                  } />
                </SelectTrigger>
                <SelectContent>
                  {/* Show already selected component if this component has a name */}
                  {comp.name && (
                    <SelectItem value={comp.name}>
                      {comp.name}
                      {type === 'earning' && comp.isPensionable && <span className="text-xs text-blue-500 ml-2">[P]</span>}
                      {type === 'earning' && comp.isTaxable && <span className="text-xs text-green-500 ml-2">[T]</span>}
                    </SelectItem>
                  )}
                  {/* Show available options */}
                  {availableOptions.map((option) => (
                    <SelectItem 
                      key={option.id} 
                      value={option.name}
                    >
                      {option.name}
                      {type === 'earning' && 'is_pensionable' in option && option.is_pensionable && <span className="text-xs text-blue-500 ml-2">[P]</span>}
                      {type === 'earning' && 'is_taxable' in option && option.is_taxable && <span className="text-xs text-green-500 ml-2">[T]</span>}
                    </SelectItem>
                  ))}
                  {availableOptions.length === 0 && !comp.name && (
                    <SelectItem value="" disabled>
                      No more options available
                    </SelectItem>
                  )}
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
              {type === 'earning' && comp.name && (
                <div className="flex gap-2 mt-1">
                  {comp.isPensionable && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Pensionable</span>}
                  {comp.isTaxable && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Taxable</span>}
                </div>
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
          disabled={loadingEarnings || getAvailableComponentOptions("earning").length === 0}
        >
          + Add Another Component
          {getAvailableComponentOptions("earning").length === 0 && (
            <span className="ml-2 text-xs text-gray-500">(All components selected)</span>
          )}
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
          disabled={loadingDeductions || getAvailableComponentOptions("deduction").length === 0}
        >
          + Add Another Component
          {getAvailableComponentOptions("deduction").length === 0 && (
            <span className="ml-2 text-xs text-gray-500">(All components selected)</span>
          )}
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
          disabled={getAvailableComponentOptions("benefit").length === 0}
        >
          + Add Another Component
          {getAvailableComponentOptions("benefit").length === 0 && (
            <span className="ml-2 text-xs text-gray-500">(All components selected)</span>
          )}
        </Button>
      </section>

      {/* Net Salary Calculator Component */}
      {employee && grossSalary > 0 && !hasCalculationError && (
        <EnhancedSalaryCalculator
          employee={employee}
          grossSalary={grossSalary}
          earningComponents={earningComponents}
          onCalculationComplete={handleCalculationComplete}
          showDetailedBreakdown={true}
          className="mt-6"
        />
      )}

      {/* Footer */}
      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button variant="outline" onClick={handleCloseForm}>
          Close
        </Button>
        <Button 
          onClick={handleSubmitForm}
          disabled={hasCalculationError || grossSalary <= 0 || isSubmitting}
          className={`${
            hasCalculationError || isSubmitting
              ? 'opacity-50 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            <>
              Save Salary Setup
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// Enhanced Salary Calculator Component
interface EnhancedSalaryCalculatorProps {
  employee: Employee;
  grossSalary: number;
  earningComponents: SalaryComponent[];
  onCalculationComplete?: (calculation: NetSalaryCalculation) => void;
  showDetailedBreakdown?: boolean;
  className?: string;
}

const EnhancedSalaryCalculator: React.FC<EnhancedSalaryCalculatorProps> = ({
  employee,
  grossSalary,
  earningComponents,
  onCalculationComplete,
  showDetailedBreakdown = true,
  className = ""
}) => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculation, setCalculation] = useState<NetSalaryCalculation | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Nigerian PAYE tax brackets for 2025
  const TAX_BRACKETS = [
    { min: 0, max: 300000, rate: 7 },
    { min: 300001, max: 600000, rate: 11 },
    { min: 600001, max: 1100000, rate: 15 },
    { min: 1100001, max: 1600000, rate: 19 },
    { min: 1600001, max: 3200000, rate: 21 },
    { min: 3200001, max: Infinity, rate: 24 }
  ];

  const CONSOLIDATED_RELIEF_ALLOWANCE = 200000 + (20000 * 12);
  const PENSION_RATE = 0.08;
  const PENSION_EMPLOYER_RATE = 0.10;
  const NHF_RATE = 0.025;
  const NSITF_RATE = 0.01;

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

  // Enhanced calculation function
  const calculateNetSalaryDetailed = (): NetSalaryCalculation => {
    const grossSalaryAmount = grossSalary;
    
    // Calculate pensionable and taxable amounts from selected components
    let pensionableAmount = 0;
    let taxableAmount = 0;
    let hasPensionableComponents = false;
    let hasTaxableComponents = false;

    earningComponents.forEach(comp => {
      if (comp.calculatedAmount && comp.calculatedAmount > 0) {
        if (comp.isPensionable) {
          pensionableAmount += comp.calculatedAmount;
          hasPensionableComponents = true;
        }
        if (comp.isTaxable) {
          taxableAmount += comp.calculatedAmount;
          hasTaxableComponents = true;
        }
      }
    });

    // For display purposes, maintain the 60/40 split
    const basicSalary = grossSalaryAmount * 0.6;
    const allowances = grossSalaryAmount * 0.4;
    const totalIncome = grossSalaryAmount;

    // Calculate deductions based on component configuration
    let pensionEmployeeContribution = 0;
    let pensionEmployerContribution = 0;
    let nhfDeduction = 0;
    let nsitfDeduction = 0;

    // Pension calculation based on pensionable components
    if (employee.is_pension_applicable) {
      if (hasPensionableComponents && pensionableAmount > 0) {
        pensionEmployeeContribution = pensionableAmount * PENSION_RATE;
        pensionEmployerContribution = pensionableAmount * PENSION_EMPLOYER_RATE;
      }
    }

    // NHF is always calculated on basic salary (as per Nigerian law)
    if (employee.is_nhf_applicable) {
      nhfDeduction = basicSalary * NHF_RATE;
    }

    // NSITF is calculated on gross salary (as per Nigerian law)
    if (employee.is_nsitf_applicable) {
      nsitfDeduction = grossSalaryAmount * NSITF_RATE;
    }

    // Tax calculation based on taxable components
    const consolidatedReliefAllowance = CONSOLIDATED_RELIEF_ALLOWANCE;
    let taxableIncomeBeforeRelief = 0;
    
    if (hasTaxableComponents && taxableAmount > 0) {
      taxableIncomeBeforeRelief = taxableAmount - pensionEmployeeContribution;
    }
    
    const taxableIncome = Math.max(0, taxableIncomeBeforeRelief - consolidatedReliefAllowance);

    let payeTax = 0;
    let marginalTaxRate = 0;

    if (employee.is_paye_applicable && taxableIncome > 0 && hasTaxableComponents) {
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
      marginalTaxRate,
      hasPensionableComponents,
      hasTaxableComponents,
      pensionableAmount,
      taxableAmount
    };
  };

  const handleCalculate = async (): Promise<void> => {
    if (grossSalary <= 0) {
      return;
    }

    setIsCalculating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const result = calculateNetSalaryDetailed();
      setCalculation(result);
      setHasCalculated(true);
      setShowDetails(showDetailedBreakdown);
      
      onCalculationComplete?.(result);
    } catch (error) {
      console.error("Error calculating net salary:", error);
    } finally {
      setIsCalculating(false);
    }
  };

  React.useEffect(() => {
    setHasCalculated(false);
    setCalculation(null);
    setShowDetails(false);
  }, [grossSalary, earningComponents]);

  if (grossSalary <= 0) {
    return (
      <Card className={`border-gray-200 ${className}`}>
        <CardContent className="p-6 text-center text-gray-500">
          <p>Enter a gross salary amount to calculate net salary</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg text-blue-700">Net Salary Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Component Status Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-3">Component Analysis</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium text-blue-800">Pensionable Components:</h5>
                  {earningComponents.filter(comp => comp.isPensionable && comp.calculatedAmount).length > 0 ? (
                    <ul className="text-blue-700 mt-1">
                      {earningComponents
                        .filter(comp => comp.isPensionable && comp.calculatedAmount)
                        .map(comp => (
                          <li key={comp.id} className="flex justify-between">
                            <span>{comp.name}</span>
                            <span>{formatCurrency(comp.calculatedAmount || 0)}</span>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-yellow-600 mt-1">No pensionable components selected</p>
                  )}
                </div>
                <div>
                  <h5 className="font-medium text-blue-800">Taxable Components:</h5>
                  {earningComponents.filter(comp => comp.isTaxable && comp.calculatedAmount).length > 0 ? (
                    <ul className="text-blue-700 mt-1">
                      {earningComponents
                        .filter(comp => comp.isTaxable && comp.calculatedAmount)
                        .map(comp => (
                          <li key={comp.id} className="flex justify-between">
                            <span>{comp.name}</span>
                            <span>{formatCurrency(comp.calculatedAmount || 0)}</span>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-yellow-600 mt-1">No taxable components selected</p>
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

                {/* Detailed Breakdown - Rest of the existing detailed breakdown code remains the same */}
                {showDetails && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Deductions Breakdown */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg text-red-700">Deductions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {employee.is_pension_applicable && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Pension (8%)
                              {!calculation.hasPensionableComponents && <span className="text-yellow-600 text-xs ml-1">(No pensionable components)</span>}
                            </span>
                            <span className="font-semibold">{formatCurrency(calculation.pensionEmployeeContribution)}</span>
                          </div>
                        )}
                        {employee.is_nhf_applicable && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">NHF (2.5% on basic)</span>
                            <span className="font-semibold">{formatCurrency(calculation.nhfDeduction)}</span>
                          </div>
                        )}
                        {employee.is_nsitf_applicable && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">NSITF (1% on gross)</span>
                            <span className="font-semibold">{formatCurrency(calculation.nsitfDeduction)}</span>
                          </div>
                        )}
                        {employee.is_paye_applicable && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              PAYE Tax
                              {!calculation.hasTaxableComponents && <span className="text-yellow-600 text-xs ml-1">(No taxable components)</span>}
                            </span>
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

                    {/* Component Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg text-green-700">Component Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {calculation.hasPensionableComponents && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Pensionable</span>
                            <span className="font-semibold">{formatCurrency(calculation.pensionableAmount)}</span>
                          </div>
                        )}
                        {calculation.hasTaxableComponents && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Taxable</span>
                            <span className="font-semibold">{formatCurrency(calculation.taxableAmount)}</span>
                          </div>
                        )}
                        <div className="border-t pt-2">
                          <div className="flex justify-between text-lg font-bold text-green-700">
                            <span>Net Salary</span>
                            <span>{formatCurrency(calculation.netSalary)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};