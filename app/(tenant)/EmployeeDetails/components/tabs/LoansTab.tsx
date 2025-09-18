import React from 'react';
import { CreditCard } from 'lucide-react';

export interface Loan {
  loan_number: string;
  status: string;
  amount: string;
  balance: string;
  monthly_deduction?: string;
  start_date?: string;
}

export interface LoansTabProps {
  employee: any;
  loans: Loan[];
  isLoading: boolean;
  getLoanStatus: (status: string) => { label: string; color: string };
  formatCurrency: (n: number) => string;
  formatDate: (s?: string) => string;
  onAddLoan: () => void;
}

const LoansTab: React.FC<LoansTabProps> = ({ employee, loans, isLoading, getLoanStatus, formatCurrency, formatDate, onAddLoan }) => {
  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='flex items-center space-x-2'>
          <svg className='animate-spin h-5 w-5 text-blue-600' viewBox='0 0 24 24'>
            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' fill='none'></circle>
            <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
          </svg>
          <span className='text-gray-600'>Loading loan data...</span>
        </div>
      </div>
    );
  }

  if (loans.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[400px] text-center'>
        <div className='mb-8'>
          <div className='relative'>
            <div className='bg-white rounded-lg shadow-lg p-6 w-56 h-36 border'>
              <div className='flex items-center justify-between mb-4'>
                <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
                  <CreditCard className='w-4 h-4 text-blue-600' />
                </div>
                <div className='text-xs text-gray-400'>Loans</div>
              </div>
              <div className='space-y-2'>
                <div className='flex justify-between items-center'>
                  <div className='h-2 bg-blue-200 rounded w-1/3'></div>
                  <div className='text-xs text-gray-400'>₦0</div>
                </div>
                <div className='flex justify-between items-center'>
                  <div className='h-2 bg-blue-100 rounded w-1/4'></div>
                  <div className='text-xs text-gray-400'>₦0</div>
                </div>
              </div>
            </div>

            <div className='absolute -bottom-3 -right-3'>
              <div className='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg'>
                <svg className='w-5 h-5 text-white' viewBox='0 0 24 24' fill='none'>
                  <path d='M12 5V19M5 12H19' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <h3 className='text-lg font-semibold text-gray-800 mb-2'>This employee currently has no loan</h3>
        <p className='text-gray-600 max-w-md mb-6 leading-relaxed'>Track and manage loans for {employee.first_name} {employee.last_name}.</p>

        <button onClick={onAddLoan} className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2'>
          <CreditCard className='w-4 h-4' />
          Add Loan
        </button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header with Add Loan button */}
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold text-gray-800'>
            Loan Records for {employee.first_name} {employee.last_name}
          </h3>
          <p className='text-sm text-gray-600 mt-1'>Manage and track all loan records for this employee</p>
        </div>
        <button onClick={onAddLoan} className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2'>
          <CreditCard className='w-4 h-4' />
          Add Loan
        </button>
      </div>

      {/* Loans Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {loans.map((loan) => {
          const statusInfo = getLoanStatus(loan.status);
          const loanAmount = parseFloat(loan.amount) || 0;
          const outstandingBalance = parseFloat(loan.balance) || 0;
          const monthlyDeduction = parseFloat(loan.monthly_deduction || '0') || 0;
          const progressPercentage = loanAmount > 0 ? ((loanAmount - outstandingBalance) / loanAmount) * 100 : 0;

          return (
            <div key={loan.loan_number} className='bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow'>
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-2'>
                  <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
                    <CreditCard className='w-4 h-4 text-blue-600' />
                  </div>
                  <span className='font-medium text-gray-900'>{loan.loan_number}</span>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              </div>

              <div className='space-y-3'>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-500'>Loan Amount:</span>
                  <span className='text-sm font-medium text-gray-900'>{formatCurrency(loanAmount)}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-500'>Outstanding:</span>
                  <span className='text-sm font-medium text-gray-900'>{formatCurrency(outstandingBalance)}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-500'>Monthly Deduction:</span>
                  <span className='text-sm font-medium text-gray-900'>{formatCurrency(monthlyDeduction)}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-500'>Start Date:</span>
                  <span className='text-sm font-medium text-gray-900'>{formatDate(loan.start_date)}</span>
                </div>

                {/* Progress Bar */}
                <div className='mt-4'>
                  <div className='flex justify-between text-xs text-gray-500 mb-1'>
                    <span>Progress</span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-2'>
                    <div className='bg-blue-600 h-2 rounded-full transition-all duration-300' style={{ width: `${Math.min(progressPercentage, 100)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LoansTab;
