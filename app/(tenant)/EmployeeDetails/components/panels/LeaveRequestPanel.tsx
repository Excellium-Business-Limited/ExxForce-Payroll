import React from 'react';
import LeaveRequestForm from '../../../components/LeaveRequestForm';

const LeaveRequestPanel: React.FC<{
  employee: any;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}> = ({ employee, onClose, onSubmit }) => (
  <div className='absolute top-0 right-0 w-1/2 min-w-[600px] h-full bg-white border-l border-gray-200 flex flex-col overflow-hidden shadow-2xl transform transition-transform duration-300 ease-in-out z-10'>
    <div className='flex items-center justify-between p-4 border-b border-gray-200 bg-white'>
      <h2 className='text-lg font-semibold text-gray-900'>Apply For Leave - {employee?.first_name} {employee?.last_name}</h2>
      <button onClick={onClose} className='p-2 hover:bg-gray-100 rounded-lg transition-colors' aria-label='Close form'>
        <svg className='w-5 h-5 text-gray-500' viewBox='0 0 24 24' fill='none'>
          <path d='M18 6L6 18M6 6L18 18' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
      </button>
    </div>

    <div className='flex-1 overflow-auto p-4'>
      <LeaveRequestForm employeeId={employee?.id?.toString() || ''} employeeCode={employee?.employee_id} onClose={onClose} onSubmit={onSubmit} />
    </div>
  </div>
);

export default LeaveRequestPanel;
