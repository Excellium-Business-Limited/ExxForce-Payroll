"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ApplyLeaveForm = () => {
  return (
    <div className="max-w-xl w-full bg-white rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-4">Apply For Leave</h2>

      {/* Leave Type */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Leave type</label>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select leave type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="annual">Annual Leave</SelectItem>
            <SelectItem value="sick">Sick Leave</SelectItem>
            <SelectItem value="casual">Casual Leave</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start date</label>
          <div className="relative">
            <Input type="date" className="pr-10" />
            <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End date</label>
          <div className="relative">
            <Input type="date" className="pr-10" />
            <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Reason */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Reason For Leave</label>
        <Textarea placeholder="Enter reason here..." className="resize-none min-h-[100px]" />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" className="text-gray-700 border-gray-300">Close</Button>
        <Button className="bg-blue-700 text-white hover:bg-blue-800">Submit</Button>
      </div>
    </div>
  );
};

export default ApplyLeaveForm;
