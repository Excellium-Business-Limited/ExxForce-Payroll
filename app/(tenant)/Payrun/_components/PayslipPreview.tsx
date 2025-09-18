'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export type LineItem = { description: string; amount: number | string };

export interface PayslipData {
  employeeName: string;
  companyName?: string;
  employeeID?: string | number;
  companyAddress?: string;
  paymentDate?: string;
  position?: string;
  payPeriod?: string;
  earnings: LineItem[];
  deductions: LineItem[];
  companyBenefits?: LineItem[];
  netPay?: number | string;
}

const formatAmount = (val: number | string | undefined) => {
  const num = typeof val === 'string' ? Number(val) : (val ?? 0);
  if (!isFinite(num)) return '₦0.00';
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(num);
};

const sum = (items: LineItem[]) =>
  items.reduce((acc, i) => acc + (typeof i.amount === 'string' ? Number(i.amount) : (i.amount || 0)), 0);

export default function PayslipPreview({ data }: { data: PayslipData }) {
  const totalEarnings = sum(data.earnings);
  const totalDeductions = sum(data.deductions);
  const totalBenefits = sum(data.companyBenefits || []);
  const net = typeof data.netPay !== 'undefined' ? data.netPay : totalEarnings - totalDeductions;

  return (
    <div className='w-full bg-white rounded-xl'>
      <article>
        <div className='relative'>
          <section className='mb-2'>
            <h2 className='text-xl font-semibold'>Preview Payslip</h2>
            <p className='font-light text-sm text-muted-foreground mt-1'>
              These fields are populated with data from your pay run. Preview payslips to print or save them.
            </p>
          </section>

          <section className='grid grid-cols-3 gap-x-4 gap-y-1 my-2 text-sm'>
            <p>Employee Name: {data.employeeName}</p>
            {data.companyName && <p>Company Name: {data.companyName}</p>}
            {data.position && <p>Position: {data.position}</p>}
            {data.employeeID && <p>Employee ID: {String(data.employeeID)}</p>}
            {data.companyAddress && <p>Company Address: {data.companyAddress}</p>}
            {data.paymentDate && <p>Payment Date: {data.paymentDate}</p>}
            {data.payPeriod && <p className='col-span-3'>Pay Period: {data.payPeriod}</p>}
          </section>

          <hr />

          <Card className='my-3 !p-0 h-fit'>
            <CardHeader className='bg-[#f3f4f5]'>Earnings</CardHeader>
            <Table>
              <TableHeader>
                <TableRow className='flex justify-between'>
                  <TableHead>DESCRIPTION</TableHead>
                  <TableHead>AMOUNT (NGN)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.earnings.map((item, idx) => (
                  <TableRow key={idx} className='text-muted-foreground flex justify-between'>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{formatAmount(item.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter className='bg-[#f3f4f5]'>
                <TableRow className='flex justify-between w-full'>
                  <TableCell className='font-medium'>Total Earnings</TableCell>
                  <TableCell className='font-medium'>{formatAmount(totalEarnings)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </Card>

          <Card className='my-3 !p-0 h-fit'>
            <CardHeader className='bg-[#f3f4f5] h-fit'>Deductions</CardHeader>
            <Table>
              <TableHeader>
                <TableRow className='flex justify-between'>
                  <TableHead>DESCRIPTION</TableHead>
                  <TableHead>AMOUNT (NGN)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data.deductions || []).map((item, idx) => (
                  <TableRow key={idx} className='text-muted-foreground flex justify-between'>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{formatAmount(item.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter className='bg-[#f3f4f5]'>
                <TableRow className='flex justify-between w-full'>
                  <TableCell className='font-medium'>Total Deductions</TableCell>
                  <TableCell className='font-medium'>{formatAmount(totalDeductions)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </Card>

          <Card className='my-3 !p-0 h-[50px] rounded-xl bg-[#f3f4f5]'>
            <CardContent className='flex pt-4 justify-between bg-[#f3f4f5]'>
              <h4 className='font-bold '>Net Pay</h4>
              <h4 className='font-bold'>{formatAmount(net)}</h4>
            </CardContent>
          </Card>

          {data.companyBenefits && data.companyBenefits.length > 0 && (
            <Card className='my-3 !p-0'>
              <CardHeader className='bg-[#f3f4f5] h-fit'>Company Benefit</CardHeader>
              <Table>
                <TableHeader>
                  <TableRow className='flex justify-between'>
                    <TableHead>DESCRIPTION</TableHead>
                    <TableHead>AMOUNT (NGN)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.companyBenefits.map((item, idx) => (
                    <TableRow key={idx} className='text-muted-foreground flex justify-between'>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{formatAmount(item.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter className='bg-[#f3f4f5] mb-2'>
                  <TableRow className='flex justify-between w-full'>
                    <TableCell className='font-medium'>Total</TableCell>
                    <TableCell className='font-medium'>{formatAmount(totalBenefits)}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </Card>
          )}
        </div>
      </article>
    </div>
  );
}
