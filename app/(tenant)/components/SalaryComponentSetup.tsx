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
import { Trash2, AlertCircle } from "lucide-react";
import axios from 'axios';
import { useGlobal } from '@/app/Context/page';

type ComponentType = "earning" | "deduction" | "benefit";

interface SalaryComponent {
  id: string;
  name: string;
  componentId?: number | string; // Reference to backend component
  calculationType?: 'fixed' | 'percentage';
  defaultValue?: number;
  fixedValue?: number;
  percentageValue?: number;
  calculatedAmount?: number; // New field for showing calculated amounts
  isBasic?: boolean; // Flag to identify basic component
  isEditable?: boolean; // Flag to control editability
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

interface SalaryComponentSetupProps {
  employee?: Employee;
  onClose?: () => void;
  onSubmit?: (data: any) => void;
}

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
      }
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

      {/* Footer */}
      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button variant="outline" onClick={handleCloseForm}>
          Close
        </Button>
        <Button 
          onClick={handleSubmitForm}
          disabled={hasCalculationError || grossSalary <= 0}
          className={hasCalculationError ? 'opacity-50 cursor-not-allowed' : ''}
        >
          Save Salary Setup
        </Button>
      </div>
    </div>
  );
}