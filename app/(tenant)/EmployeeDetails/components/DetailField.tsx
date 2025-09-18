import React from 'react';

export const DetailField: React.FC<{ label: string; value: string | number | undefined; fullWidth?: boolean }>
= ({ label, value, fullWidth = false }) => (
  <div className={fullWidth ? 'col-span-3' : ''}>
    <dt className='text-sm font-medium text-gray-500'>{label}</dt>
    <dd className='mt-1 text-sm text-gray-900'>{(value as any) || '--'}</dd>
  </div>
);

export default DetailField;
