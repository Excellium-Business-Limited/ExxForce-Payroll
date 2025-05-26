"use client";

import React from "react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem
} from '@/components/ui/select';

export default function EmployeeForm({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />

      {/* Slide-in Panel */}
      <div className="ml-auto h-full w-full max-w-2xl bg-white p-6 overflow-y-auto shadow-xl">
        <div className='mb-8'>
          <h1 className='text-2xl font-bold'>Add Employee</h1>
          <p className='text-sm text-muted-foreground'>Enter employee details</p>
        </div>

        <form className='space-y-8'>
          <div className='space-y-4'>
            <h2 className='text-lg font-semibold'>Employment Details</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <Label htmlFor='employeeId'>Employee ID</Label>
                <Input id='employeeId' required />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='jobTitle'>Job Title</Label>
                <Input id='jobTitle' required />
              </div>
              <div className='space-y-2'>
                <Label>Department</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hr">Human Resources</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label>Employment Type</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="intern">Intern</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='startDate'>Start Date</Label>
                <Input id='startDate' type='date' required />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='taxStartDate'>Tax Start Date</Label>
                <Input id='taxStartDate' type='date' required />
              </div>
            </div>
          </div>

          <div className='space-y-4'>
            <h2 className='text-lg font-semibold'>Personal Details</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <Label htmlFor='firstName'>First Name</Label>
                <Input id='firstName' required />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='lastName'>Last Name</Label>
                <Input id='lastName' required />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='phone'>Phone Number</Label>
                <Input id='phone' type='tel' required />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='email'>Work Email</Label>
                <Input id='email' type='email' required />
              </div>
              <div className='space-y-2'>
                <Label>Gender</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='dob'>Date of Birth</Label>
                <Input id='dob' type='date' required />
              </div>
              <div className='space-y-2 md:col-span-2'>
                <Label htmlFor='address1'>Address Line 1</Label>
                <Input id='address1' required />
              </div>
              <div className='space-y-2 md:col-span-2'>
                <Label htmlFor='address2'>Address Line 2</Label>
                <Input id='address2' />
              </div>
            </div>
          </div>

          <div className='flex justify-end gap-4 pt-4'>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className='bg-[#3D56A8] hover:bg-[#2E4299]'>
              Save Employee
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
