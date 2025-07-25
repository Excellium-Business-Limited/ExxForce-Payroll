'use client';

import { Button } from '@/components/ui/button';
import React from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { CalendarIcon, ChevronDown } from 'lucide-react';

const employees = [
  {
    id: '01',
    empId: '45623-05',
    name: 'Ifunanya Johnson',
    position: 'Software Developer',
    type: 'Full time',
    salary: '₦600,000.00',
    date: 'April 11, 2025',
    status: 'Active',
  },
  // Repeat or map actual employee data here
];

const EmployeePage = () => {
  return (
    <div className="min-h-screen bg-[#f9f9f9] px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#1f2937]">Employee</h1>
        <div className="flex gap-4">
          <Button className="bg-[#3D56A8] text-white text-sm px-5">+ Add employee</Button>
          <Button variant="outline" className="text-sm px-5">Import employee</Button>
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-white shadow-sm p-4 rounded-md w-64 mb-6">
        <h2 className="text-sm text-gray-500 mb-2">Total Employees</h2>
        <h1 className="text-2xl font-bold">50</h1>
        <p className="text-xs text-gray-400 mt-1">90% of employees are regular staff</p>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-md shadow-sm p-4 mb-4 flex flex-wrap gap-3 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger className="border rounded-md px-4 py-2 text-sm">Department: All <ChevronDown size={16} className="inline ml-2" /></DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Engineering</DropdownMenuItem>
            <DropdownMenuItem>HR</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="border rounded-md px-4 py-2 text-sm">Designation: All <ChevronDown size={16} className="inline ml-2" /></DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Developer</DropdownMenuItem>
            <DropdownMenuItem>Designer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="border rounded-md px-4 py-2 text-sm">Status: All <ChevronDown size={16} className="inline ml-2" /></DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Active</DropdownMenuItem>
            <DropdownMenuItem>Inactive</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" className="flex items-center gap-2 text-sm px-4 py-2">
          <CalendarIcon size={16} /> Select Dates
        </Button>

        <Button className="text-white bg-[#3D56A8] px-6 py-2 text-sm">Filter</Button>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-md shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[#f0f4ff] text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">S/N</th>
              <th className="px-4 py-3 text-left">EMPLOYEE ID</th>
              <th className="px-4 py-3 text-left">FULL NAME</th>
              <th className="px-4 py-3 text-left">POSITION</th>
              <th className="px-4 py-3 text-left">TYPE</th>
              <th className="px-4 py-3 text-left">SALARY (NGN)</th>
              <th className="px-4 py-3 text-left">DATE JOINED</th>
              <th className="px-4 py-3 text-left">STATUS</th>
              <th className="px-4 py-3 text-left">MORE</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{emp.id}</td>
                <td className="px-4 py-3">{emp.empId}</td>
                <td className="px-4 py-3">{emp.name}</td>
                <td className="px-4 py-3">{emp.position}</td>
                <td className="px-4 py-3">{emp.type}</td>
                <td className="px-4 py-3">{emp.salary}</td>
                <td className="px-4 py-3">{emp.date}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${emp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{emp.status}</span>
                </td>
                <td className="px-4 py-3 text-right">...</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 text-sm text-gray-500 border-t">Total: 32 entries</div>
      </div>
    </div>
  );
};

export default EmployeePage;
