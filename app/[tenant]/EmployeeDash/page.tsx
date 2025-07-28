"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EmployeePage = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [employeeData, setEmployeeData] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleEditClick = (employee) => {
    setIsEdit(true);
    setEmployeeData(employee);
  };

  const handleAddEmployee = () => {
    // Add your add employee logic here
    console.log('Add employee clicked');
  };

  const handleImportEmployee = () => {
    // Add your import employee logic here
    console.log('Import employee clicked');
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`http://excellium.localhost:8000/tenant/employee/list`);
        setEmployees(response.data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch employees');
        setEmployees([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const hasEmployees = employees.length > 0;

  // Empty state component that matches the Figma design
  const EmptyEmployeeState = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      {/* Employee illustration */}
      <div className="mb-8">
        <div className="relative">
          {/* Browser window mockup */}
          <div className="bg-white rounded-lg shadow-lg p-4 w-48 h-32 border">
            <div className="flex gap-1 mb-3">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-blue-200 rounded w-full"></div>
              <div className="h-2 bg-blue-100 rounded w-3/4"></div>
              <div className="h-2 bg-blue-100 rounded w-1/2"></div>
            </div>
          </div>
          
          {/* Employee avatar with plus icon */}
          <div className="absolute -bottom-4 -right-4">
            <div className="relative">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L12 2L3 7V9H21ZM12 17.5C9.2 17.5 7 15.3 7 12.5S9.2 7.5 12 7.5 17 9.7 17 12.5 14.8 17.5 12 17.5Z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Text content */}
      <h2 className="text-xl font-semibold text-gray-800 mb-3">Add employees</h2>
      <p className="text-gray-600 max-w-md mb-8 leading-relaxed">
        Add employees and contractors you want to pay. Once added, you can assign them to pay grade and process their payments in batches.
      </p>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button 
          onClick={handleAddEmployee}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Add employee
        </button>
        <button 
          onClick={handleImportEmployee}
          className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Import employee
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-auto">
      <main className="flex-1 bg-[#EFF5FF] p-6 md:p-8 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-gray-600">Loading...</div>
          </div>
        ) : hasEmployees ? (
          <div>
            {/* Replace with table or list of employees */}
            {employees.map((emp) => (
              <div key={emp.id} className="p-4 bg-white rounded-lg mb-2">
                {emp.name || 'Employee'}
              </div>
            ))}
          </div>
        ) : (
          <EmptyEmployeeState />
        )}
      </main>
    </div>
  );
};

export default EmployeePage;