"use client";

import React, { useState } from "react";
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

const componentOptions = {
  earning: ["Housing Allowance", "Transport Allowance", "Meal Allowance"],
  deduction: ["PAYE", "Pension", "NTF"],
  benefit: ["Bonus", "Medical", "Leave Allowance"],
};

export default function EmployeeSalaryComponentSetup() {
  const [employeeName, setEmployeeName] = useState("");
  const [grossSalary, setGrossSalary] = useState<number | "">("");
  const [description, setDescription] = useState("");

  const [earningComponents, setEarningComponents] = useState<SalaryComponent[]>([]);
  const [deductionComponents, setDeductionComponents] = useState<SalaryComponent[]>([]);
  const [benefitComponents, setBenefitComponents] = useState<SalaryComponent[]>([]);

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
          className="grid grid-cols-4 gap-4 items-center border-b pb-3"
        >
          {/* Component Name */}
          <Select
            onValueChange={(value) => handleChange(type, comp.id, "name", value)}
            value={comp.name}
          >
            <SelectTrigger>
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

          {/* Fixed Value */}
          <Input
            type="number"
            value={comp.fixedValue ?? ""}
            onChange={(e) =>
              handleChange(type, comp.id, "fixedValue", e.target.value ? parseFloat(e.target.value) : undefined)
            }
            placeholder="Fixed Value"
          />

          {/* Percentage Value */}
          <Input
            type="number"
            value={comp.percentageValue ?? ""}
            onChange={(e) =>
              handleChange(type, comp.id, "percentageValue", e.target.value ? parseFloat(e.target.value) : undefined)
            }
            placeholder="%"
          />

          {/* Delete Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleRemoveComponent(type, comp.id)}
          >
            <Trash2 className="h-5 w-5 text-red-500" />
          </Button>
        </div>
      ))}
    </>
  );

  const handleSubmit = () => {
    const payload = {
      employeeName,
      grossSalary,
      earningComponents,
      deductionComponents,
      benefitComponents,
      description,
    };
    console.log("Form Data:", payload);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">Employee Salary Component Setup</h2>
        <p className="text-sm text-gray-500">
          Fill in the details below to configure the salary structure for an employee.
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
        {renderComponentRows("earning", earningComponents)}
        <Button
          variant="outline"
          onClick={() => handleAddComponent("earning")}
          className="mt-3"
        >
          + Add Another Component
        </Button>
      </section>

      {/* Deduction Components */}
      <section>
        <h3 className="font-semibold mb-4">Deduction Components</h3>
        {renderComponentRows("deduction", deductionComponents)}
        <Button
          variant="outline"
          onClick={() => handleAddComponent("deduction")}
          className="mt-3"
        >
          + Add Another Component
        </Button>
      </section>

      {/* Benefit Components */}
      <section>
        <h3 className="font-semibold mb-4">Benefit Components</h3>
        {renderComponentRows("benefit", benefitComponents)}
        <Button
          variant="outline"
          onClick={() => handleAddComponent("benefit")}
          className="mt-3"
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
          placeholder="Add any notes about this employee's salary structure"
        />
      </section>

      {/* Footer */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">Close</Button>
        <Button onClick={handleSubmit}>Save Salary Setup</Button>
      </div>
    </div>
  );
}
