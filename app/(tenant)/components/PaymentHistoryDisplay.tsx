'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Download, FileText, Eye, DollarSign } from 'lucide-react';
import { useGlobal } from '@/app/Context/context';
import axios from 'axios';

interface PaymentRecord {
  id?: number | string;
  employee_id?: string;
  employee_name?: string;
  payrun?: string;
  period?: string;
  pay_period?: string;
  pay_date?: string;
  gross?: number;
  gross_salary?: number;
  net?: number;
  net_salary?: number;
  deductions?: number;
  total_deductions?: number;
  total_allowances?: number;
  status?: 'PAID' | 'PENDING' | 'PROCESSING' | 'FAILED' | 'DRAFT';
  payment_method?: string;
  payslip_id?: string;
  created_at?: string;
  payroll_run_id?: string;
  earnings_breakdown?: Record<string, number>;
  deductions_breakdown?: Record<string, number>;
}

interface APIResponse {
  employee?: string;
  employee_id?: string;
  department?: string;
  period?: string;
  payruns_count?: number;
  totals?: {
    gross: number;
    deductions: number;
    net: number;
  };
  history?: PaymentRecord[];
}

interface PaymentHistoryDisplayProps {
  employee: {
    employee_id: string;
    first_name: string;
    last_name: string;
  } | null;
  onGeneratePayslip?: (paymentRecord: PaymentRecord) => void;
}

const PaymentHistoryDisplay: React.FC<PaymentHistoryDisplayProps> = ({
  employee,
  onGeneratePayslip
}) => {
  // Early return if no employee
  if (!employee) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-gray-600'>No employee selected</div>
      </div>
    );
  }

  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const { tenant, globalState } = useGlobal();

  const formatCurrency = (amount: number | undefined | null) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '₦0.00';
    }
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(amount).replace('NGN', '₦');
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString || dateString === 'null' || dateString === 'undefined') {
      return '--';
    }

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '--';
      }

      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (error) {
      return '--';
    }
  };

  const getStatusColor = (status: string | undefined) => {
    const statusUpper = status?.toUpperCase() || 'UNKNOWN';
    switch (statusUpper) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'DRAFT':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const fetchPaymentHistory = async () => {
    if (!employee?.employee_id || !tenant || !globalState.accessToken) return;

    try {
      setIsLoading(true);
      setError('');
      const baseURL = `${tenant}.exxforce.com`;

      const response = await axios.get(
        `https://${baseURL}/tenant/reports/employee-history/${employee.employee_id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${globalState.accessToken}`,
          },
        }
      );

      console.log('Payment history fetched:', response.data);

      let paymentRecords: PaymentRecord[] = [];
      const apiData: APIResponse = response.data;

      // Handle the specific API response structure
      if (apiData.history && Array.isArray(apiData.history)) {
        paymentRecords = apiData.history.map((record, index) => ({
          id: index + 1, // Generate ID since API doesn't provide one
          employee_id: apiData.employee_id,
          employee_name: apiData.employee,
          payrun: record.payrun,
          period: record.period,
          pay_period: record.period, // Map period to pay_period for compatibility
          pay_date: record.period?.split(' → ')[1] || record.period || '', // Extract end date as pay date
          gross: record.gross,
          gross_salary: record.gross, // Map for compatibility
          net: record.net,
          net_salary: record.net, // Map for compatibility
          deductions: record.deductions,
          total_deductions: record.deductions, // Map for compatibility
          status: record.payrun?.includes('DRAFT') ? 'DRAFT' as const : 'PAID' as const, // Determine status from payrun name
          earnings_breakdown: record.earnings_breakdown,
          deductions_breakdown: record.deductions_breakdown,
        }));
      } else {
        // Fallback to original logic for other API structures
        if (Array.isArray(response.data)) {
          paymentRecords = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          paymentRecords = response.data.data;
        } else if (response.data.payments && Array.isArray(response.data.payments)) {
          paymentRecords = response.data.payments;
        } else if (response.data.payment_history && Array.isArray(response.data.payment_history)) {
          paymentRecords = response.data.payment_history;
        } else {
          console.warn('Unexpected payment history API response structure:', response.data);
          paymentRecords = [];
        }
      }

      // Sort by pay_date (most recent first)
      paymentRecords.sort((a, b) => {
        const dateA = new Date(a.pay_date || a.period || a.created_at || '');
        const dateB = new Date(b.pay_date || b.period || b.created_at || '');
        return dateB.getTime() - dateA.getTime();
      });

      setPaymentHistory(paymentRecords);
    } catch (error: any) {
      console.error('Error fetching payment history:', error);
      setError('Failed to load payment history');
      setPaymentHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, [employee?.employee_id, tenant, globalState.accessToken]);

  const handleGeneratePayslip = (record: PaymentRecord) => {
    if (onGeneratePayslip) {
      onGeneratePayslip(record);
    } else {
      // Default behavior - could navigate to payslip page
      console.log('Generate payslip for record:', record);
      // You can implement navigation to payslip component here
      // router.push(`/payslip/${record.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='flex items-center space-x-2'>
          <svg
            className='animate-spin h-5 w-5 text-blue-600'
            viewBox='0 0 24 24'>
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
              fill='none'></circle>
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
          </svg>
          <span className='text-gray-600'>Loading payment history...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[400px] text-center'>
        <div className='mb-4'>
          <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <FileText className='w-8 h-8 text-red-600' />
          </div>
        </div>
        <h3 className='text-lg font-semibold text-gray-800 mb-2'>
          Error Loading Payment History
        </h3>
        <p className='text-gray-600 mb-4'>{error}</p>
        <button
          onClick={fetchPaymentHistory}
          className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors'>
          Try Again
        </button>
      </div>
    );
  }

  if (paymentHistory.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[400px] text-center'>
        <div className='mb-8'>
          <div className='relative'>
            <div className='bg-white rounded-lg shadow-lg p-6 w-56 h-36 border'>
              <div className='flex items-center justify-between mb-4'>
                <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
                  <DollarSign className='w-4 h-4 text-blue-600' />
                </div>
                <div className='text-xs text-gray-400'>Payments</div>
              </div>
              <div className='space-y-2'>
                <div className='flex justify-between items-center'>
                  <div className='h-2 bg-blue-200 rounded w-2/3'></div>
                  <div className='text-xs text-gray-400'>₦0</div>
                </div>
                <div className='flex justify-between items-center'>
                  <div className='h-2 bg-blue-100 rounded w-1/2'></div>
                  <div className='text-xs text-gray-400'>₦0</div>
                </div>
                <div className='flex justify-between items-center'>
                  <div className='h-2 bg-blue-100 rounded w-3/4'></div>
                  <div className='text-xs text-gray-400'>₦0</div>
                </div>
              </div>
            </div>

            <div className='absolute -bottom-3 -right-3'>
              <div className='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg'>
                <Calendar className='w-5 h-5 text-white' />
              </div>
            </div>
          </div>
        </div>

        <h3 className='text-lg font-semibold text-gray-800 mb-2'>
          No payment history
        </h3>
        <p className='text-gray-600 max-w-md mb-6 leading-relaxed'>
          Payment history for {employee.first_name} {employee.last_name} will
          appear here once salary payments are processed.
        </p>

        <button
          onClick={fetchPaymentHistory}
          className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2'>
          <DollarSign className='w-4 h-4' />
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold text-gray-800'>
            Payment History for {employee.first_name} {employee.last_name}
          </h3>
          <p className='text-sm text-gray-600 mt-1'>
            {paymentHistory.length} payment record{paymentHistory.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <button
          onClick={fetchPaymentHistory}
          className='bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2'>
          <Calendar className='w-4 h-4' />
          Refresh
        </button>
      </div>

      {/* Payment Records Table */}
      <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Period
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  End Date
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Gross Salary
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Deductions
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Net Salary
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {paymentHistory.map((record, index) => (
                <tr key={record.id || index} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {record.pay_period || record.period || '--'}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {formatDate(record.pay_date || record.period?.split(' → ')[1])}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                    {formatCurrency(record.gross_salary || record.gross)}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-red-600'>
                    {formatCurrency(record.total_deductions || record.deductions)}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600'>
                    {formatCurrency(record.net_salary || record.net)}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        record.status
                      )}`}>
                      {record.status || 'Unknown'}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    <div className='flex items-center space-x-2'>
                      <button
                        onClick={() => handleGeneratePayslip(record)}
                        className='inline-flex items-center px-3 py-1.5 border border-blue-300 shadow-sm text-xs font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'>
                        <FileText className='w-3 h-3 mr-1' />
                        Payslip
                      </button>
                      {(record.status === 'PAID' || record.status === 'DRAFT') && (
                        <button className='inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors'>
                          <Eye className='w-3 h-3 mr-1' />
                          View
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Card */}
      {paymentHistory.length > 0 && (
        <div className='bg-blue-50 rounded-lg p-6 border border-blue-200'>
          <h4 className='text-lg font-semibold text-blue-900 mb-4'>
            Payment Summary
          </h4>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-blue-900'>
                {paymentHistory.length}
              </div>
              <div className='text-sm text-blue-700'>Total Payments</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-blue-900'>
                {formatCurrency(
                  paymentHistory.reduce((sum, record) => sum + ((record.gross_salary || record.gross) || 0), 0)
                )}
              </div>
              <div className='text-sm text-blue-700'>Total Gross</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-blue-900'>
                {formatCurrency(
                  paymentHistory.reduce((sum, record) => sum + ((record.total_deductions || record.deductions) || 0), 0)
                )}
              </div>
              <div className='text-sm text-blue-700'>Total Deductions</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-blue-900'>
                {formatCurrency(
                  paymentHistory.reduce((sum, record) => sum + ((record.net_salary || record.net) || 0), 0)
                )}
              </div>
              <div className='text-sm text-blue-700'>Total Net Paid</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistoryDisplay;
