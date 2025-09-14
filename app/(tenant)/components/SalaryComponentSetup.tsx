"use client";

import React, { useState, useEffect } from "react";
import type { JSX } from "react";
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
import { useGlobal } from '@/app/Context/context';

// Import the SalaryCalculator component
// import { SalaryCalculator, calculateNetSalary } from './SalaryCalculator';
import SalaryCalculator from './SalaryCalculator';

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
  // For tracking existing components that need editing
  isExisting?: boolean;
  existingComponentId?: number;
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
    const baseURL = `${tenant}.exxforce.com`
    
    try {
      const response = await axios.get(
        `https://${baseURL}/tenant/payroll-settings/salary-components`,
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
    const baseURL = `${tenant}.exxforce.com`
    
    try {
      const response = await axios.get(
        `https://${baseURL}/tenant/payroll-settings/deduction-components`,
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

  // Function to fetch existing employee salary components
  const fetchExistingEmployeeComponents = async (): Promise<void> => {
    if (!employee?.employee_id) return;

    const baseURL = `${tenant}.exxforce.com`;
    
    try {
      // Fetch existing salary components for this employee
      const response = await axios.get(
        `https://${baseURL}/tenant/employee/${employee.employee_id}/salary-components`,
        {
          headers: {
            Authorization: `Bearer ${globalState.accessToken}`,
          },
        }
      );

      console.log('Existing employee components fetched:', response.data);

      // Process the response and populate existing components
      if (response.data && Array.isArray(response.data)) {
        const existingComponents: SalaryComponent[] = response.data.map((comp: any) => ({
          id: `existing-${comp.id}`,
          name: comp.name,
          componentId: comp.component_id,
          existingComponentId: comp.id,
          calculationType: comp.calculation_type,
          fixedValue: comp.calculation_type === 'fixed' ? comp.value : undefined,
          percentageValue: comp.calculation_type === 'percentage' ? comp.value : undefined,
          calculatedAmount: comp.calculated_amount || 0,
          isBasic: comp.is_basic || false,
          isEditable: !comp.is_basic,
          isPensionable: comp.is_pensionable || false,
          isTaxable: comp.is_taxable || false,
          isExisting: true
        }));

        setEarningComponents(prevComponents => [
          ...prevComponents.filter(comp => !comp.isExisting), // Remove any existing components
          ...existingComponents
        ]);
      }
    } catch (error: any) {
      console.error('Error fetching existing employee components:', error);
      
      // Check if it's a 404 error (endpoint doesn't exist)
      if (error.response?.status === 404) {
        console.log('Salary components endpoint not available for this employee - this is normal for new employees');
      } else {
        console.error('Unexpected error fetching employee salary components:', error.message);
      }
      
      // Don't show error to user as this is optional functionality
      // The form will work normally without existing components
    }
  };

  // Fetch components on component mount
  useEffect(() => {
    fetchEarningComponents();
    fetchDeductionComponents();
    // Also fetch existing employee components if we have an employee
    if (employee?.employee_id) {
      fetchExistingEmployeeComponents();
    }
  }, [employee?.employee_id]);

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

  // Update employee gross salary first
  const updateEmployeeGrossSalary = async (): Promise<void> => {
    const baseURL = `${tenant}.exxforce.com`;
    
    const payload = {
      salary: grossSalary // Backend expects 'salary' not 'gross_salary'
    };

    await axios.put(
      `https://${baseURL}/tenant/employee/update/${employee?.employee_id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${globalState.accessToken}`,
          'Content-Type': 'application/json'
        },
      }
    );
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

        const baseURL = `${tenant}.exxforce.com`;

        // Check if this is an existing component that needs editing
        if (comp.isExisting && comp.existingComponentId) {
          // Use PUT endpoint for editing existing components
          return axios.put(
            `https://${baseURL}/tenant/employee/${employee?.employee_id}/salary-components/${comp.existingComponentId}/edit`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${globalState.accessToken}`,
                'Content-Type': 'application/json'
              },
            }
          );
        } else {
          // Use POST endpoint for creating new components
          return axios.post(
            `https://${baseURL}/tenant/employee/${employee?.employee_id}/salary-components/create`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${globalState.accessToken}`,
                'Content-Type': 'application/json'
              },
            }
          );
        }
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

        const baseURL = `${tenant}.exxforce.com`
        return axios.post(
          `https://${baseURL}/tenant/employee/${employee?.employee_id}/deduction-components/create`,
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
      // Step 1: Update employee gross salary first
      console.log('Updating employee gross salary...');
      await updateEmployeeGrossSalary();
      
      // Step 2: Submit salary components
      console.log('Submitting salary components...');
      await submitSalaryComponents();
      
      // Step 3: Submit deduction components
      console.log('Submitting deduction components...');
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
      
      // More specific error handling
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data?.detail || error.message;
        alert(`Failed to submit: ${errorMessage}`);
      } else {
        alert('Failed to submit salary components. Please try again.');
      }
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
              {comp.isExisting && !comp.isBasic && (
                <p className="text-xs text-green-600 mt-1">
                  Existing component (editing)
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
        <SalaryCalculator
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

// Import the updated SalaryCalculator component
