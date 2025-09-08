// hooks/useSalaryCalculator.ts
import { useState, useCallback, useMemo, useReducer } from 'react';
import { Employee, SalaryComponent, NetSalaryCalculation } from '../types/employee';
import { calculateNetSalaryDetailed } from '../utils/salaryCalculations';
import { validateSalaryInput, sanitizeEmployee } from '../utils/validation';

interface SalaryCalculatorState {
  calculation: NetSalaryCalculation | null;
  isCalculating: boolean;
  hasCalculated: boolean;
  showDetails: boolean;
  error: string | null;
  lastCalculatedValues: {
    grossSalary: number | null;
    componentsSignature: string | null;
  };
}

type SalaryCalculatorAction = 
  | { type: 'START_CALCULATION' }
  | { type: 'CALCULATION_SUCCESS'; payload: { calculation: NetSalaryCalculation; grossSalary: number; componentsSignature: string } }
  | { type: 'CALCULATION_ERROR'; payload: string }
  | { type: 'TOGGLE_DETAILS' }
  | { type: 'RESET_CALCULATION' }
  | { type: 'SET_SHOW_DETAILS'; payload: boolean };

const salaryCalculatorReducer = (
  state: SalaryCalculatorState, 
  action: SalaryCalculatorAction
): SalaryCalculatorState => {
  switch (action.type) {
    case 'START_CALCULATION':
      return {
        ...state,
        isCalculating: true,
        error: null
      };
    case 'CALCULATION_SUCCESS':
      return {
        ...state,
        calculation: action.payload.calculation,
        isCalculating: false,
        hasCalculated: true,
        error: null,
        lastCalculatedValues: {
          grossSalary: action.payload.grossSalary,
          componentsSignature: action.payload.componentsSignature
        }
      };
    case 'CALCULATION_ERROR':
      return {
        ...state,
        isCalculating: false,
        error: action.payload,
        calculation: null
      };
    case 'TOGGLE_DETAILS':
      return {
        ...state,
        showDetails: !state.showDetails
      };
    case 'SET_SHOW_DETAILS':
      return {
        ...state,
        showDetails: action.payload
      };
    case 'RESET_CALCULATION':
      return {
        ...state,
        calculation: null,
        hasCalculated: false,
        error: null,
        lastCalculatedValues: {
          grossSalary: null,
          componentsSignature: null
        }
      };
    default:
      return state;
  }
};

const initialState: SalaryCalculatorState = {
  calculation: null,
  isCalculating: false,
  hasCalculated: false,
  showDetails: false,
  error: null,
  lastCalculatedValues: {
    grossSalary: null,
    componentsSignature: null
  }
};

interface UseSalaryCalculatorProps {
  employee: Employee;
  grossSalary: number;
  earningComponents?: SalaryComponent[];
  showDetailedBreakdown?: boolean;
  onCalculationComplete?: (calculation: NetSalaryCalculation) => void;
  onCalculationError?: (error: string) => void;
}

export const useSalaryCalculator = ({ 
  employee, 
  grossSalary, 
  earningComponents = [],
  showDetailedBreakdown = true,
  onCalculationComplete,
  onCalculationError
}: UseSalaryCalculatorProps) => {
  const [state, dispatch] = useReducer(salaryCalculatorReducer, initialState);

  // Generate a signature for the earning components to detect changes
  const getComponentsSignature = useCallback((): string => {
    return earningComponents
      .map(comp => `${comp.id}-${comp.calculatedAmount || 0}-${comp.isPensionable}-${comp.isTaxable}`)
      .sort()
      .join('|');
  }, [earningComponents]);

  // Check if current values differ from last calculated values
  const isCalculationOutdated = useMemo((): boolean => {
    if (!state.hasCalculated) return false;
    
    const currentComponentsSignature = getComponentsSignature();
    return (
      state.lastCalculatedValues.grossSalary !== grossSalary ||
      state.lastCalculatedValues.componentsSignature !== currentComponentsSignature
    );
  }, [state.hasCalculated, state.lastCalculatedValues, grossSalary, getComponentsSignature]);

  // Memoize validation results
  const validationResults = useMemo(() => {
    const isValidSalary = validateSalaryInput(grossSalary);
    const canCalculate = isValidSalary && grossSalary > 0;
    
    return {
      isValidSalary,
      canCalculate,
      validationMessage: !isValidSalary ? 'Please enter a valid salary amount' : null
    };
  }, [grossSalary]);

  // Set initial show details state
  React.useEffect(() => {
    dispatch({ type: 'SET_SHOW_DETAILS', payload: showDetailedBreakdown });
  }, [showDetailedBreakdown]);

  const calculate = useCallback(async () => {
    if (!validationResults.canCalculate) {
      const error = validationResults.validationMessage || 'Invalid input';
      dispatch({ type: 'CALCULATION_ERROR', payload: error });
      onCalculationError?.(error);
      return null;
    }

    dispatch({ type: 'START_CALCULATION' });

    try {
      // Sanitize employee data
      const sanitizedEmployee = sanitizeEmployee(employee);
      
      // Simulate API call delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const result = calculateNetSalaryDetailed(sanitizedEmployee, grossSalary, earningComponents);
      const componentsSignature = getComponentsSignature();
      
      dispatch({ 
        type: 'CALCULATION_SUCCESS', 
        payload: { 
          calculation: result, 
          grossSalary, 
          componentsSignature 
        } 
      });
      
      onCalculationComplete?.(result);
      return result;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Calculation failed';
      dispatch({ type: 'CALCULATION_ERROR', payload: errorMessage });
      onCalculationError?.(errorMessage);
      return null;
    }
  }, [employee, grossSalary, earningComponents, validationResults, getComponentsSignature, onCalculationComplete, onCalculationError]);

  const toggleDetails = useCallback(() => {
    dispatch({ type: 'TOGGLE_DETAILS' });
  }, []);

  const resetCalculation = useCallback(() => {
    dispatch({ type: 'RESET_CALCULATION' });
  }, []);

  return {
    // State
    calculation: state.calculation,
    isCalculating: state.isCalculating,
    hasCalculated: state.hasCalculated,
    showDetails: state.showDetails,
    error: state.error,
    
    // Computed values
    isCalculationOutdated,
    canCalculate: validationResults.canCalculate,
    validationMessage: validationResults.validationMessage,
    
    // Actions
    calculate,
    toggleDetails,
    resetCalculation
  };
};