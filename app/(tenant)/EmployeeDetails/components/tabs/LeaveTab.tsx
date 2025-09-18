import React from 'react';
import { Calendar } from 'lucide-react';
import LeaveListDisplay from '../../../components/LeaveListDisplay';

export interface LeaveRequest { /* kept minimal for rendering */ }

export interface LeaveTabProps {
  employee: any;
  leaveRequests: any[];
  isLoading: boolean;
  onRequestLeave: () => void;
}

const LeaveTab: React.FC<LeaveTabProps> = ({ employee, leaveRequests, isLoading, onRequestLeave }) => {
  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='flex items-center space-x-2'>
          <svg className='animate-spin h-5 w-5 text-blue-600' viewBox='0 0 24 24'>
            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' fill='none'></circle>
            <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
          </svg>
          <span className='text-gray-600'>Loading leave requests...</span>
        </div>
      </div>
    );
  }

  if (leaveRequests.length > 0) {
    return <LeaveListDisplay leaveRequests={leaveRequests} onRequestLeave={onRequestLeave} />;
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-[400px] text-center'>
      <div className='mb-8'>
        <div className='relative'>
          <div className='bg-white rounded-lg shadow-lg p-6 w-56 h-36 border'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
                <Calendar className='w-4 h-4 text-blue-600' />
              </div>
              <div className='text-xs text-gray-400'>Leave</div>
            </div>
            <div className='space-y-2'>
              <div className='flex justify-between items-center'>
                <div className='h-2 bg-blue-200 rounded w-1/2'></div>
                <div className='text-xs text-gray-400'>0 days</div>
              </div>
              <div className='flex justify-between items-center'>
                <div className='h-2 bg-blue-100 rounded w-1/3'></div>
                <div className='text-xs text-gray-400'>0 days</div>
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

      <h3 className='text-lg font-semibold text-gray-800 mb-2'>No leave requests found</h3>
      <p className='text-gray-600 max-w-md mb-6 leading-relaxed'>
        {employee.first_name} {employee.last_name} hasn't submitted any leave requests yet.
      </p>

      <button onClick={onRequestLeave} className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2'>
        <Calendar className='w-4 h-4' />
        Request Leave
      </button>
    </div>
  );
};

export default LeaveTab;
