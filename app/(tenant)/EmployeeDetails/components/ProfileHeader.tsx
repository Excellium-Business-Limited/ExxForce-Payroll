import React from 'react';

export const ProfileHeader: React.FC<{ firstName?: string; lastName?: string; jobTitle?: string; employeeId?: string; }>
= ({ firstName, lastName, jobTitle, employeeId }) => (
  <div className='w-full px-6 py-4'>
    <div className='flex items-center space-x-4'>
      <div className='w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold'>
        {firstName && lastName ? `${firstName.charAt(0)}${lastName.charAt(0)}` : 'AI'}
      </div>
      <div>
        <div className='text-lg font-semibold text-gray-900'>
          {firstName} {lastName}
        </div>
        <div className='text-sm text-gray-500'>
          {jobTitle || '—'}
        </div>
        <div className='text-sm text-gray-400 mt-1'>
          ID: {employeeId}
        </div>
      </div>
    </div>
  </div>
);

export default ProfileHeader;
