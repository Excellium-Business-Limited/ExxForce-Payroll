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
import { Trash2 } from "lucide-react";
import axios from 'axios';
import { useGlobal } from '@/app/Context/page';

type ComponentType = "earning" | "deduction" | "benefit";

interface SalaryComponent {
  id: string;
  name: string;
  fixedValue?: number;
  percentageValue?: number;
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

// Define component option interface
interface ComponentOption {
  id: number | string;
  name: string;
}

export default function SalaryComponentSetup({ employee, onClose, onSubmit }: SalaryComponentSetupProps) {
  const [employeeName, setEmployeeName] = useState("");
  const [grossSalary, setGrossSalary] = useState<number | "">("");
  const [description, setDescription] = useState("");

  const [earningComponents, setEarningComponents] = useState<SalaryComponent[]>([]);
  const [deductionComponents, setDeductionComponents] = useState<SalaryComponent[]>([]);
  const [benefitComponents, setBenefitComponents] = useState<SalaryComponent[]>([]);

  // State for component options from API
  const [earningOptions, setEarningOptions] = useState<ComponentOption[]>([]);
  const [deductionOptions, setDeductionOptions] = useState<ComponentOption[]>([]);
  const [loadingEarnings, setLoadingEarnings] = useState(false);
  const [loadingDeductions, setLoadingDeductions] = useState(false);
  const [earningError, setEarningError] = useState<string>('');
  const [deductionError, setDeductionError] = useState<string>('');

  // Get global context for tenant and auth
  const { tenant, globalState } = useGlobal();

  // Hardcoded benefit options (since no API endpoint provided)
  const benefitOptions = ["Bonus", "Medical", "Leave Allowance"];

  // Initialize form with employee data if provided
  useEffect(() => {
    if (employee) {
      setEmployeeName(`${employee.first_name} ${employee.last_name}`);
      setGrossSalary(employee.custom_salary || "");
    }
  }, [employee]);

  // Add default "Basic" earning component when earning options are loaded
  useEffect(() => {
    if (earningOptions.length > 0 && earningComponents.length === 0) {
      const basicComponent: SalaryComponent = {
        id: "basic-default",
        name: "Basic",
        fixedValue: undefined,
        percentageValue: undefined,
      };
      setEarningComponents([basicComponent]);
    }
  }, [earningOptions, earningComponents.length]);

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
      
      if (Array.isArray(response.data)) {
        setEarningOptions(response.data);
      }
      else if (response.data.data && Array.isArray(response.data.data)) {
        setEarningOptions(response.data.data);
      }
      else if (response.data.components && Array.isArray(response.data.components)) {
        setEarningOptions(response.data.components);
      }
      else {
        console.warn('Unexpected earning components API response structure:', response.data);
        setEarningError('Unexpected response format');
      }
      
    } catch (error) {
      console.error('Error fetching earning components:', error);
      setEarningError('Failed to load earning components');
      
      // Fallback to hardcoded components in case of API failure
      setEarningOptions([
        { id: 'basic', name: 'Basic' },
        { id: 'housing', name: 'Housing Allowance' },
        { id: 'transport', name: 'Transport Allowance' },
        { id: 'meal', name: 'Meal Allowance' }
      ]);
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
      
      if (Array.isArray(response.data)) {
        setDeductionOptions(response.data);
      }
      else if (response.data.data && Array.isArray(response.data.data)) {
        setDeductionOptions(response.data.data);
      }
      else if (response.data.components && Array.isArray(response.data.components)) {
        setDeductionOptions(response.data.components);
      }
      else {
        console.warn('Unexpected deduction components API response structure:', response.data);
        setDeductionError('Unexpected response format');
      }
      
    } catch (error) {
      console.error('Error fetching deduction components:', error);
      setDeductionError('Failed to load deduction components');
      
      // Fallback to hardcoded components in case of API failure
      setDeductionOptions([
        { id: 'paye', name: 'PAYE' },
        { id: 'pension', name: 'Pension' },
        { id: 'ntf', name: 'NTF' }
      ]);
    } finally {
      setLoadingDeductions(false);
    }
  };

  // Fetch components on component mount
  useEffect(() => {
    fetchEarningComponents();
    fetchDeductionComponents();
  }, []);

  const handleAddComponent = (type: ComponentType) => {
    const newComponent: SalaryComponent = {
      id: Date.now().toString(),
      name: "",
      fixedValue: undefined,
      percentageValue: undefined,
    };
    if (type === "earning") setEarningComponents([...earningComponents, newComponent]);
    if (type === "deduction") setDeductionComponents([...deductionComponents, newComponent]);
    if (type === "benefit") setBenefitComponents([...benefitComponents, newComponent]);
  };

  const handleRemoveComponent = (type: ComponentType, id: string) => {
    if (type === "earning") setEarningComponents(earningComponents.filter((c) => c.id !== id));
    if (type === "deduction") setDeductionComponents(deductionComponents.filter((c) => c.id !== id));
    if (type === "benefit") setBenefitComponents(benefitComponents.filter((c) => c.id !== id));
  };

  const handleChange = (
    type: ComponentType,
    id: string,
    field: keyof SalaryComponent,
    value: any
  ) => {
    const update = (components: SalaryComponent[]) =>
      components.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      );

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
            className="grid grid-cols-12 gap-4 items-center border-b pb-4 mb-4"
          >
            {/* Component Name */}
            <div className="col-span-4">
              <Select
                onValueChange={(value) => handleChange(type, comp.id, "name", value)}
                value={comp.name}
                disabled={isLoading}
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
            </div>

            {/* Fixed Value */}
            <div className="col-span-3">
              <Input
                type="number"
                value={comp.fixedValue ?? ""}
                onChange={(e) => {
                  const value = e.target.value ? parseFloat(e.target.value) : undefined;
                  handleChange(type, comp.id, "fixedValue", value);
                  // Clear percentage value when fixed value is entered
                  if (value !== undefined && value > 0) {
                    handleChange(type, comp.id, "percentageValue", undefined);
                  }
                }}
                placeholder="0.00"
                className="w-full"
                disabled={comp.percentageValue !== undefined && comp.percentageValue > 0}
              />
            </div>

            {/* Percentage Value */}
            <div className="col-span-3">
              <Input
                type="number"
                value={comp.percentageValue ?? ""}
                onChange={(e) => {
                  const value = e.target.value ? parseFloat(e.target.value) : undefined;
                  handleChange(type, comp.id, "percentageValue", value);
                  // Clear fixed value when percentage value is entered
                  if (value !== undefined && value > 0) {
                    handleChange(type, comp.id, "fixedValue", undefined);
                  }
                }}
                placeholder="0"
                className="w-full"
                disabled={comp.fixedValue !== undefined && comp.fixedValue > 0}
              />
            </div>

            {/* Delete Button */}
            <div className="col-span-2 flex justify-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveComponent(type, comp.id)}
                className="hover:bg-red-50"
                disabled={comp.id === "basic-default"} // Disable delete for default Basic component
              >
                <Trash2 className={`h-4 w-4 ${comp.id === "basic-default" ? "text-gray-300" : "text-red-500"}`} />
              </Button>
            </div>
          </div>
        ))}
      </>
    );
  };

  const handleSubmitForm = () => {
    const payload = {
      employeeName,
      grossSalary,
      earningComponents,
      deductionComponents,
      benefitComponents,
      description,
      employee: employee,
    };
    console.log("Form Data:", payload);
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
          Fill in the details below to configure the salary structure for {employee?.first_name} {employee?.last_name}.
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
            disabled={!!employee} // Disable if employee is provided
          />
        </div>
        <div className="flex-1 space-y-2">
          <Label>Gross Salary</Label>
          <Input
            type="number"
            value={grossSalary}
            onChange={(e) =>
              setGrossSalary(e.target.value ? parseFloat(e.target.value) : "")
            }
            placeholder="₦500,000.00"
          />
        </div>
      </div>

      {/* Earning Components */}
      <section>
        <h3 className="font-semibold mb-4">Earning Components</h3>
        <div className="space-y-1">
          {/* Header Row */}
          <div className="grid grid-cols-12 gap-4 items-center text-sm font-medium text-gray-700 border-b pb-3 mb-4">
            <div className="col-span-4">Component</div>
            <div className="col-span-3">Fixed Amount (₦)</div>
            <div className="col-span-3">Percentage (%)</div>
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
            <div className="col-span-4">Component</div>
            <div className="col-span-3">Fixed Amount (₦)</div>
            <div className="col-span-3">Percentage (%)</div>
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
            <div className="col-span-4">Component</div>
            <div className="col-span-3">Fixed Amount (₦)</div>
            <div className="col-span-3">Percentage (%)</div>
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
        <Button onClick={handleSubmitForm}>
          Save Salary Setup
        </Button>
      </div>
    </div>
  );
}