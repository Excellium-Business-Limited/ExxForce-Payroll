'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ImportModal from '../../components/Import';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ImportHub() {
  const [active, setActive] = useState<'employees' | 'loans' | 'paygrades' | 'salaryComponents' | 'employeeSalaryComponents'>('employees');

  const onSubmit = async (formData: FormData) => {
    // Route to backend based on selection
    const base = localStorage.getItem('tenant');
    const token = localStorage.getItem('access_token');
    if (!base || !token || !active) throw new Error('Missing auth/tenant');
    const urlMap: Record<string, string> = {
      employees: `https://${base}.exxforce.com/tenant/employee/import-csv`,
      loans: `https://${base}.exxforce.com/tenant/loans/import-csv`,
      paygrades: `https://${base}.exxforce.com/tenant/paygrade/import-csv`,
      salaryComponents: `https://${base}.exxforce.com/tenant/salary-components/import-csv`,
      employeeSalaryComponents: `https://${base}.exxforce.com/tenant/employee-salary-components/import-csv`,
    };
    const res = await fetch(urlMap[active], {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) throw new Error('Import failed');
  };

  return (
    <div className='p-6 space-y-4'>
      <h1 className='text-2xl font-semibold'>Import</h1>
      <p className='text-sm text-muted-foreground'>Import salary components, pay grades, employees, and loans.</p>

    <Tabs value={active} onValueChange={(v) => setActive(v as any)}>
        <TabsList>
          <TabsTrigger value='employees'>Employees</TabsTrigger>
          <TabsTrigger value='loans'>Loans</TabsTrigger>
          <TabsTrigger value='paygrades'>Pay Grades</TabsTrigger>
          <TabsTrigger value='salaryComponents'>Salary Components</TabsTrigger>
      <TabsTrigger value='employeeSalaryComponents'>Employee Salary Component</TabsTrigger>
        </TabsList>

        <TabsContent value='employees'>
          <Card className='p-0 overflow-hidden'>
            <ImportModal
              title='Import Employees'
              isOpen={true}
              onClose={() => { /* no-op inline */ }}
              onSubmit={onSubmit}
              inlineMode
            >
              <li>• Employee ID, First Name, Last Name (required)</li>
              <li>• Email, Phone Number, Job Title (required)</li>
              <li>• Department, Employment Type, Start Date (required)</li>
              <li>• Date of Birth, Gender, Address (optional)</li>
            </ImportModal>
          </Card>
        </TabsContent>

        <TabsContent value='loans'>
          <Card className='p-0 overflow-hidden'>
            <ImportModal
              title='Import Loans'
              isOpen={true}
              onClose={() => {}}
              onSubmit={onSubmit}
              inlineMode
            >
              <li>• Employee ID (required)</li>
              <li>• Principal, Interest, Tenor (required)</li>
            </ImportModal>
          </Card>
        </TabsContent>

        <TabsContent value='paygrades'>
          <Card className='p-0 overflow-hidden'>
            <ImportModal
              title='Import Pay Grades'
              isOpen={true}
              onClose={() => {}}
              onSubmit={onSubmit}
              inlineMode
            >
              <li>• Pay Grade Name (required)</li>
              <li>• Description (optional)</li>
            </ImportModal>
          </Card>
        </TabsContent>

        <TabsContent value='salaryComponents'>
          <Card className='p-0 overflow-hidden'>
            <ImportModal
              title='Import Salary Components'
              isOpen={true}
              onClose={() => {}}
              onSubmit={onSubmit}
              inlineMode
            >
              <li>• Component Name, Type (earning/deduction) (required)</li>
              <li>• Percentage or Fixed Amount (required)</li>
            </ImportModal>
          </Card>
        </TabsContent>

        <TabsContent value='employeeSalaryComponents'>
          <Card className='p-0 overflow-hidden'>
            <ImportModal
              title='Import Employee Salary Component'
              isOpen={true}
              onClose={() => {}}
              onSubmit={onSubmit}
              inlineMode
            >
              <li>• Employee ID (required)</li>
              <li>• Component Name (must exist)</li>
              <li>• Amount or Percentage (required)</li>
              <li>• Effective Date (optional)</li>
            </ImportModal>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
