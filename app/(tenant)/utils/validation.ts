// utils/validation.ts
import { Employee, SalaryComponent } from '../types/employee';

export const validateSalaryInput = (salary: number): boolean => {
  return salary > 0 && salary <= 100000000 && !isNaN(salary) && Number.isFinite(salary);
};

export const validateEmployee = (employee: Employee): string[] => {
  const errors: string[] = [];
  
  if (!employee.employee_id?.trim()) {
    errors.push('Employee ID is required');
  }
  
  if (!employee.first_name?.trim() || !employee.last_name?.trim()) {
    errors.push('Employee name is required');
  }
  
  if (!validateSalaryInput(employee.custom_salary)) {
    errors.push('Valid salary amount is required');
  }
  
  if (!['MALE', 'FEMALE'].includes(employee.gender)) {
    errors.push('Valid gender is required');
  }
  
  if (!['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'].includes(employee.employment_type)) {
    errors.push('Valid employment type is required');
  }
  
  if (!['MONTHLY', 'WEEKLY', 'BIWEEKLY'].includes(employee.pay_frequency)) {
    errors.push('Valid pay frequency is required');
  }
  
  return errors;
};

export const validateSalaryComponents = (components: SalaryComponent[]): string[] => {
  const errors: string[] = [];
  
  components.forEach((component, index) => {
    if (!component.name?.trim()) {
      errors.push(`Component ${index + 1}: Name is required`);
    }
    
    if (component.calculatedAmount !== undefined && component.calculatedAmount < 0) {
      errors.push(`Component ${index + 1}: Amount cannot be negative`);
    }
    
    if (component.percentageValue !== undefined && 
        (component.percentageValue < 0 || component.percentageValue > 100)) {
      errors.push(`Component ${index + 1}: Percentage must be between 0 and 100`);
    }
  });
  
  return errors;
};

export const sanitizeString = (input: string | undefined): string => {
  return input?.trim().replace(/[<>]/g, '') || '';
};

export const sanitizeEmployee = (employee: Employee): Employee => {
  return {
    ...employee,
    first_name: sanitizeString(employee.first_name),
    last_name: sanitizeString(employee.last_name),
    email: sanitizeString(employee.email),
    job_title: sanitizeString(employee.job_title),
    department_name: sanitizeString(employee.department_name),
    address: sanitizeString(employee.address),
    bank_name: sanitizeString(employee.bank_name),
    account_name: sanitizeString(employee.account_name)
  };
};