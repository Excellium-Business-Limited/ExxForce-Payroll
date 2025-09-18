import React from 'react';

type TabId = 'general' | 'payroll' | 'document' | 'loan' | 'leave' | 'payment-history';

export const TabsNav: React.FC<{
  active: TabId;
  onChange: (t: TabId) => void;
  disabled?: boolean;
}> = ({ active, onChange, disabled }) => {
  const tabs: { id: TabId; label: string }[] = [
    { id: 'general', label: 'General' },
    { id: 'payroll', label: 'Payroll' },
    { id: 'document', label: 'Document' },
    { id: 'loan', label: 'Loan' },
    { id: 'leave', label: 'Leave' },
    { id: 'payment-history', label: 'Payment History' },
  ];

  return (
    <div className='border-b border-gray-200 bg-white'>
      <div className='max-w-7xl mx-auto'>
        <nav className='flex space-x-8 px-6' aria-label='Tabs'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                active === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
              disabled={disabled}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default TabsNav;
