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

const componentOptions = {
  earning: ["Housing Allowance", "Transport Allowance", "Meal Allowance"],
  deduction: ["PAYE", "Pension", "NTF"],
  benefit: ["Bonus", "Medical", "Leave Allowance"],
};

export default function SalaryComponentSetup({ employee, onClose, onSubmit }: SalaryComponentSetupProps) {
  const [employeeName, setEmployeeName] = useState("");
  const [grossSalary, setGrossSalary] = useState<number | "">("");
  const [description, setDescription] = useState("");

  const [earningComponents, setEarningComponents] = useState<SalaryComponent[]>([]);
  const [deductionComponents, setDeductionComponents] = useState<SalaryComponent[]>([]);
  const [benefitComponents, setBenefitComponents] = useState<SalaryComponent[]>([]);

  // Initialize form with employee data if provided
  useEffect(() => {
    if (employee) {
      setEmployeeName(`${employee.first_name} ${employee.last_name}`);
      setGrossSalary(employee.custom_salary || "");
    }
  }, [employee]);

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

  const renderComponentRows = (type: ComponentType, components: SalaryComponent[]) => (
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
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Component" />
              </SelectTrigger>
              <SelectContent>
                {componentOptions[type].map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fixed Value */}
          <div className="col-span-3">
            <Input
              type="number"
              value={comp.fixedValue ?? ""}
              onChange={(e) =>
                handleChange(type, comp.id, "fixedValue", e.target.value ? parseFloat(e.target.value) : undefined)
              }
              placeholder="0.00"
              className="w-full"
            />
          </div>

          {/* Percentage Value */}
          <div className="col-span-3">
            <Input
              type="number"
              value={comp.percentageValue ?? ""}
              onChange={(e) =>
                handleChange(type, comp.id, "percentageValue", e.target.value ? parseFloat(e.target.value) : undefined)
              }
              placeholder="0"
              className="w-full"
            />
          </div>

          {/* Delete Button */}
          <div className="col-span-2 flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveComponent(type, comp.id)}
              className="hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      ))}
    </>
  );

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