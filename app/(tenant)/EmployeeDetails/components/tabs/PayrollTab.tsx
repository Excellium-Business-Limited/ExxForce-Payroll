import React from 'react';
import PayrollBreakdown from '../../../components/PayrollBreakdown';

export interface PayrollTabProps {
  employee: any | null;
  onSetupPayroll: () => void;
}

const PayrollTab: React.FC<PayrollTabProps> = ({ employee, onSetupPayroll }) => {
  if (employee?.payroll_data && (
    employee.payroll_data.earnings?.length > 0 ||
    employee.payroll_data.deductions?.length > 0 ||
    employee.payroll_data.benefits?.length > 0
  )) {
    return <PayrollBreakdown employee={employee} onProcessPayroll={onSetupPayroll} />;
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-[400px] text-center'>
      <div className='mb-8'>
        <div className='relative'>
          <div className='bg-white rounded-lg shadow-lg p-6 w-56 h-36 border'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
                <span className='text-blue-600 font-bold text-sm'>₦</span>
              </div>
              <div className='text-xs text-gray-400'>Payroll</div>
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
            </div>
          </div>

          <div className='absolute -bottom-3 -right-3'>
            <div className='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg'>
              <span className='text-white font-bold text-lg'>₦</span>
            </div>
          </div>
        </div>
      </div>

      <h3 className='text-lg font-semibold text-gray-800 mb-2'>Payroll is not set up yet</h3>
      <p className='text-gray-600 max-w-md mb-6 leading-relaxed'>
        Configure payroll settings to start managing salary and benefits.
      </p>

      <button onClick={onSetupPayroll} className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2'>
        <span className='w-4 h-4 text-sm font-bold'>₦</span>
        Set Up Payroll
      </button>
    </div>
  );
};

export default PayrollTab;
