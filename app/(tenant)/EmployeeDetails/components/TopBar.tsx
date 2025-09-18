import React from 'react';

export const TopBar: React.FC<{
  isLoading: boolean;
  onBack: () => void;
  onEndEmployment: () => void;
}> = ({ isLoading, onBack, onEndEmployment }) => (
  <div className='flex items-center justify-between p-6 border-b border-gray-200 bg-white'>
    <div className='flex items-center space-x-4'>
      <button onClick={onBack} className='flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors'>
        <svg className='w-5 h-5' viewBox='0 0 24 24' fill='none'>
          <path d='M19 12H5M12 19L5 12L12 5' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
        <span className='text-sm font-medium'>Back to Employees</span>
      </button>
      <div className='flex items-center space-x-2 ml-4'>
        <span className='text-sm text-gray-900 font-medium'>Employee Details</span>
        {isLoading && (
          <svg className='animate-spin h-4 w-4 text-blue-600' viewBox='0 0 24 24'>
            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' fill='none'></circle>
            <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
          </svg>
        )}
      </div>
    </div>

    <div className='flex items-center space-x-2'>
      <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
        Active
      </span>
      <button onClick={onEndEmployment} className='inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
        <svg className='w-4 h-4 mr-2' viewBox='0 0 24 24' fill='none'>
          <path d='M12 8v4l3 3' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
        End Employment
      </button>
    </div>
  </div>
);

export default TopBar;
