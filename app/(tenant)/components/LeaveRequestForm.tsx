"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LeaveType {
  id: string;
  name: string;
  days_allowed: number;
}

interface LeaveRequestFormProps {
  employeeId: string;
  employeeCode: string;
  onClose: () => void;
  onSubmit: (leaveData: any) => Promise<void>;
}

const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({
  employeeId,
  employeeCode,
  onClose,
  onSubmit,
}) => {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [formData, setFormData] = useState({
    leave_type_id: "",
    start_date: "",
    end_date: "",
    reason: "",
    employee_code: employeeCode,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch leave types on component mount
  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const fetchLeaveTypes = async () => {
    try {
      setIsLoadingTypes(true);
      const response = await fetch('/api/tenant/leave/leave-types', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch leave types');
      }

      const data = await response.json();
      setLeaveTypes(data.data || []);
    } catch (error) {
      console.error('Error fetching leave types:', error);
      // You might want to show a toast notification here
    } finally {
      setIsLoadingTypes(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.leave_type_id) {
      newErrors.leave_type_id = "Please select a leave type";
    }

    if (!formData.start_date) {
      newErrors.start_date = "Please select a start date";
    }

    if (!formData.end_date) {
      newErrors.end_date = "Please select an end date";
    }

    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      
      if (endDate < startDate) {
        newErrors.end_date = "End date must be after start date";
      }
    }

    if (!formData.reason.trim()) {
      newErrors.reason = "Please provide a reason for leave";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateLeaveDays = () => {
    if (!formData.start_date || !formData.end_date) return 0;
    
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end dates
    
    return Math.max(0, daysDiff);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const submitData = {
        ...formData,
        days: calculateLeaveDays(),
      };

      const response = await fetch('/api/tenant/leave/leave-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit leave request');
      }

      const result = await response.json();
      
      // Call the parent's onSubmit handler
      await onSubmit(result);
      
      // Close the form on successful submission
      onClose();
    } catch (error) {
      console.error('Error submitting leave request:', error);
      // You might want to show a toast notification here
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to submit leave request' });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedLeaveType = leaveTypes.find(type => type.id === formData.leave_type_id);
  const leaveDays = calculateLeaveDays();

  return (
    <div className="max-w-xl w-full bg-white rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-4">Apply For Leave</h2>

      <form onSubmit={handleSubmit}>
        {/* Leave Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Leave type <span className="text-red-500">*</span>
          </label>
          <Select 
            value={formData.leave_type_id} 
            onValueChange={(value) => handleInputChange('leave_type_id', value)}
            disabled={isLoadingTypes}
          >
            <SelectTrigger className="w-full">
              <SelectValue 
                placeholder={isLoadingTypes ? "Loading leave types..." : "Select leave type"} 
              />
            </SelectTrigger>
            <SelectContent>
              {leaveTypes.map((leaveType) => (
                <SelectItem key={leaveType.id} value={leaveType.id}>
                  {leaveType.name} ({leaveType.days_allowed} days allowed)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.leave_type_id && (
            <p className="text-red-500 text-xs mt-1">{errors.leave_type_id}</p>
          )}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input 
                type="date" 
                className="pr-10" 
                value={formData.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
                min={new Date().toISOString().split('T')[0]} // Prevent past dates
              />
              <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
            {errors.start_date && (
              <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input 
                type="date" 
                className="pr-10" 
                value={formData.end_date}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
                min={formData.start_date || new Date().toISOString().split('T')[0]}
              />
              <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
            {errors.end_date && (
              <p className="text-red-500 text-xs mt-1">{errors.end_date}</p>
            )}
          </div>
        </div>

        {/* Leave Summary */}
        {leaveDays > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex justify-between items-center text-sm">
              <span className="text-blue-700 font-medium">Leave Duration:</span>
              <span className="text-blue-900 font-semibold">{leaveDays} days</span>
            </div>
            {selectedLeaveType && (
              <div className="flex justify-between items-center text-sm mt-1">
                <span className="text-blue-700">Available:</span>
                <span className="text-blue-900">{selectedLeaveType.days_allowed} days</span>
              </div>
            )}
          </div>
        )}

        {/* Reason */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason For Leave <span className="text-red-500">*</span>
          </label>
          <Textarea 
            placeholder="Enter reason here..." 
            className="resize-none min-h-[100px]" 
            value={formData.reason}
            onChange={(e) => handleInputChange('reason', e.target.value)}
          />
          {errors.reason && (
            <p className="text-red-500 text-xs mt-1">{errors.reason}</p>
          )}
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <Button 
            type="button"
            variant="outline" 
            className="text-gray-700 border-gray-300"
            onClick={onClose}
            disabled={isLoading}
          >
            Close
          </Button>
          <Button 
            type="submit"
            className="bg-blue-700 text-white hover:bg-blue-800"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LeaveRequestForm;