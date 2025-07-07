'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Pencil } from 'lucide-react';

const EmployeeDetailsPage = () => {
  return (
    <div className="min-h-screen bg-[#f9f9f9] p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Employee /</p>
          <h1 className="text-2xl font-semibold text-[#1f2937]">Employee Details</h1>
        </div>
        <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">Active</span>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-md shadow-sm p-4">
        <div className="flex justify-between items-start flex-wrap mb-6 gap-4">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="flex flex-wrap gap-3 bg-white p-0 border-b">
              {['general', 'payroll', 'document', 'loan', 'leave', 'payment-history'].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="capitalize data-[state=active]:text-[#3D56A8] text-sm"
                >
                  {tab.replace('-', ' ')}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="general" className="space-y-6 mt-6">
              {/* Basic Details */}
              <SectionCard title="Basic Details">
                <DetailGrid
                  items={[
                    ['First Name', 'John'],
                    ['Last Name', 'Smith'],
                    ['Gender', 'M'],
                    ['Phone number', '09038757516'],
                    ['Email Address', 'Johnsmith@gmail.com'],
                    ['Date of Birth', '15/09/2000'],
                  ]}
                />
              </SectionCard>

              {/* Employment Details */}
              <SectionCard title="Employment Details">
                <DetailGrid
                  items={[
                    ['Employee ID', '235561'],
                    ['Job Title', 'Software Developer'],
                    ['Department', 'Tech'],
                    ['Employee Type', 'Full Time'],
                    ['Start Date', 'May 5, 2025'],
                    ['Tax Start Date', 'May 10, 2025'],
                  ]}
                />
              </SectionCard>

              {/* Salary & Payment Details */}
              <SectionCard title="Salary & Payment Details">
                <DetailGrid
                  items={[
                    ['Account Number', '23556143222'],
                    ['Bank Name', 'Zenith Bank'],
                    ['Account Name', 'John Smith'],
                    ['Salary Amount (NGN)', '295,000.00'],
                    ['Pay Frequency', 'Monthly'],
                  ]}
                />
              </SectionCard>
            </TabsContent>

            {/* Placeholder for other tabs */}
            <TabsContent value="payroll"><PlaceholderTab name="Payroll" /></TabsContent>
            <TabsContent value="document"><PlaceholderTab name="Document" /></TabsContent>
            <TabsContent value="loan"><PlaceholderTab name="Loan" /></TabsContent>
            <TabsContent value="leave"><PlaceholderTab name="Leave" /></TabsContent>
            <TabsContent value="payment-history"><PlaceholderTab name="Payment History" /></TabsContent>
          </Tabs>
          <Button variant="destructive" className="text-sm">End Employment</Button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsPage;

/** Utility Components **/

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border border-gray-200 rounded-md px-6 py-5 relative bg-white shadow-sm">
    <div className="absolute top-4 right-4 text-gray-500 cursor-pointer">
      <Pencil size={16} />
    </div>
    <h3 className="text-sm font-medium mb-5 text-[#1f2937]">{title}</h3>
    {children}
  </div>
);

const DetailGrid = ({ items }: { items: [string, string][] }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
    {items.map(([label, value], idx) => (
      <div key={idx}>
        <p className="font-medium text-gray-600 mb-1">{label}</p>
        <p>{value}</p>
      </div>
    ))}
  </div>
);

const PlaceholderTab = ({ name }: { name: string }) => (
  <div className="text-sm text-gray-500">No data available for <strong>{name}</strong>.</div>
);
