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

            {/* Payroll Tab */}
            <TabsContent value="payroll" className="mt-6">
              {/* ... existing payroll content ... */}
            </TabsContent>
            
            {/* Documents Tab */}
            <TabsContent value="document" className="mt-6">
              <div className="bg-white rounded-md shadow-sm p-6">
                <h2 className="text-lg font-medium mb-4">Documents</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded On</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1DA1F2]">
                          <span role="img" aria-label="pdf">📄</span> Employee_offer_letter.pdf
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Uploaded on May 19, 2025</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            
            {/* Loan Tab */}
            <TabsContent value="loan" className="mt-6">
              <div className="bg-white rounded-md shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium">Loan Details</h3>
                  <Button className="text-sm">Request New Loan</Button>
                </div>
                
                {/* Active Loans */}
                <div className="mb-8">
                  <h4 className="text-sm font-medium mb-4">Active Loans</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LOAN TYPE</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AMOUNT</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATE ISSUED</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">REPAID</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BALANCE</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Staff Loan</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">¥500,000.00</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">May 15, 2025</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">¥100,000.00</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">¥400,000.00</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Button variant="ghost" size="sm" className="text-[#3D56A8]">View</Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Repayment Schedule */}
                <div className="mb-8">
                  <h4 className="text-sm font-medium mb-4">Repayment Schedule</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATE</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AMOUNT</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RECEIPT</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">June 10, 2025</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">¥20,000.00</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Paid</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Button variant="ghost" size="sm" className="text-[#3D56A8]">Download</Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">July 10, 2025</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">¥20,000.00</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">August 10, 2025</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">¥20,000.00</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Loan Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="border border-gray-200 rounded-md p-4">
                    <h5 className="text-sm font-medium text-gray-500 mb-2">Total Loan Amount</h5>
                    <p className="text-xl font-semibold">¥500,000.00</p>
                  </div>
                  <div className="border border-gray-200 rounded-md p-4">
                    <h5 className="text-sm font-medium text-gray-500 mb-2">Amount Repaid</h5>
                    <p className="text-xl font-semibold">¥100,000.00</p>
                  </div>
                  <div className="border border-gray-200 rounded-md p-4">
                    <h5 className="text-sm font-medium text-gray-500 mb-2">Remaining Balance</h5>
                    <p className="text-xl font-semibold">¥400,000.00</p>
                  </div>
                </div>

                {/* Documents */}
                <div className="mb-8">
                  <h4 className="text-sm font-medium mb-4">Documents</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded On</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1DA1F2]">
                            <span role="img" aria-label="pdf">📄</span> Loan_agreement.pdf
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Uploaded on May 15, 2025</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="leave" className="mt-6">
              <div className="bg-white rounded-md shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-medium">Leave</h2>
                  <Button className="text-sm bg-[#1DA1F2] text-white">Apply For Leave</Button>
                </div>
                <p className="text-sm text-gray-500 mb-4">Manage your leave requests</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="border border-gray-200 rounded-md p-4 text-center">
                    <span role="img" aria-label="annual leave">🌴</span> Annual Leave<br />
                    Available: 20 Days<br />
                    Used: 0 Days
                  </div>
                  <div className="border border-gray-200 rounded-md p-4 text-center">
                    <span role="img" aria-label="sick leave">🤒</span> Sick Leave<br />
                    Available: 20 Days<br />
                    Used: 0 Days
                  </div>
                  <div className="border border-gray-200 rounded-md p-4 text-center">
                    <span role="img" aria-label="maternity leave">🤰</span> Maternity Leave<br />
                    Available: 20 Days<br />
                    Used: 0 Days
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Leave Request</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Annual Leave</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">21 Days</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">30. June 2025</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Approved</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Family Vacation</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Annual Leave</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">21 Days</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">30. June 2025</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Approved</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Family Vacation</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Annual Leave</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">21 Days</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">30. June 2025</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Approved</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Family Vacation</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Annual Leave</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">21 Days</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">30. June 2025</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Approved</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Family Vacation</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </TabsContent>
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