"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EmployeeForm from '../components/EmployeeForm';
import ImportModal from '../components/Import';

const EmployeePage = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [employeeData, setEmployeeData] = useState<{ id: number; name: string } | null>(null);
  const [employees, setEmployees] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD:app/[tenant]/EmployeeDash/page.tsx
  const [error, setError] = useState(null);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
=======
  const [error, setError] = useState<string | null>(null);
>>>>>>> 067eff2b54cb9e45946706d88dc705f05a726dfd:app/(tenant)/EmployeeDash/page.tsx
  const [filters, setFilters] = useState({
    department: 'All',
    designation: 'All',
    status: 'All'
  });

  const handleEditClick = (employee: { id: number; name: string }) => {
    setIsEdit(true);
    setEmployeeData(employee);
    setShowEmployeeForm(true);
  };

  const handleAddEmployee = () => {
    setIsEdit(false);
    setEmployeeData(null);
    setShowEmployeeForm(true);
  };

  const handleImportEmployee = () => {
    setShowImportModal(true);
  };

  const handleCloseEmployeeForm = () => {
    setShowEmployeeForm(false);
    setIsEdit(false);
    setEmployeeData(null);
  };

  const handleCloseImportModal = () => {
    setShowImportModal(false);
  };

  const handleEmployeeSubmit = async (employeeData) => {
    // Handle employee creation/update logic here
    try {
      if (isEdit) {
        // Update employee logic
        console.log('Updating employee:', employeeData);
      } else {
        // Create new employee logic
        console.log('Creating new employee:', employeeData);
      }
      
      // Refresh the employee list after successful submission
      const response = await axios.get(`http://excellium.localhost:8000/tenant/employee/list`);
      setEmployees(response.data || []);
      
      // Close the form
      handleCloseEmployeeForm();
    } catch (error) {
      console.error('Error submitting employee:', error);
    }
  };

  const handleImportSubmit = async (importData) => {
    // Handle import logic here
    try {
      console.log('Importing employees:', importData);
      
      // Refresh the employee list after successful import
      const response = await axios.get(`http://excellium.localhost:8000/tenant/employee/list`);
      setEmployees(response.data || []);
      
      // Close the modal
      handleCloseImportModal();
    } catch (error) {
      console.error('Error importing employees:', error);
    }
  };

  const formatCurrency = (amount : number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString : string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getEmployeeStatus = (employee : string) => {
    // You can add logic here to determine status based on employee data
    // For now, assuming active employees
    return 'Active';
  };

  const getEmployeeType = (employmentType : string) => {
    switch (employmentType) {
      case 'FULL_TIME':
        return 'Full time';
      case 'PART_TIME':
        return 'Part time';
      case 'CONTRACT':
        return 'Contract';
      case 'INTERN':
        return 'Intern';
      default:
        return employmentType;
    }
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

  // Employee table component
  const EmployeeTable = () => (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Stats card */}
      <div className="p-6 border-b">
        <div className="bg-blue-50 rounded-lg p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none">
              <path d="M16 7C16 9.2 14.2 11 12 11S8 9.2 8 7 9.8 3 12 3 16 4.8 16 7ZM12 14C16.4 14 20 15.8 20 18V21H4V18C4 15.8 7.6 14 12 14Z" fill="currentColor"/>
            </svg>
          </div>
          <div>
            <h3 className="text-sm text-gray-600">Total Employees</h3>
            <p className="text-2xl font-semibold text-gray-900">{employees.length}</p>
            <p className="text-xs text-gray-500">
              {Math.round((employees.filter(emp => emp.employment_type === 'FULL_TIME').length / employees.length) * 100)}% of employees are regular staff
            </p>
          </div>
        </div>
      </div>

      {/* Filters and actions */}
      <div className="p-6 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-medium text-gray-900">Employees List</h2>
          <div className="flex gap-2">
            <button
              onClick={handleAddEmployee}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Add employee
            </button>
            <button
              onClick={handleImportEmployee}
              className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Import employee
            </button>
          </div>
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap gap-4 mt-4">
          <select className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm">
            <option>Department: All</option>
          </select>
          <select className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm">
            <option>Designation: All</option>
          </select>
          <select className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm">
            <option>Status: All</option>
          </select>
          <button className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M8 2V5M16 2V5M3.5 9H20.5M21 8.5V17C21 18.1 20.1 19 19 19H5C3.9 19 3 18.1 3 17V8.5C3 7.4 3.9 6.5 5 6.5H19C20.1 6.5 21 7.4 21 8.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Select Dates
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
            Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input type="checkbox" className="rounded" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S/N</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary (NGN)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Joined</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">More</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee, index) => (
              <tr key={employee.employee_id || index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input type="checkbox" className="rounded" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {String(index + 1).padStart(2, '0')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                  {employee.employee_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {`${employee.first_name} ${employee.last_name}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {employee.job_title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getEmployeeType(employee.employment_type)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(employee.custom_salary)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(employee.start_date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    getEmployeeStatus(employee) === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {getEmployeeStatus(employee)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleEditClick(employee)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" fill="currentColor"/>
                      <path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" fill="currentColor"/>
                      <path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" fill="currentColor"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Total: {employees.length} entries
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded border border-gray-300 hover:bg-gray-50">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</span>
          <span className="px-3 py-1 text-gray-600 text-sm">2</span>
          <span className="px-3 py-1 text-gray-600 text-sm">3</span>
          <span className="text-gray-500">...</span>
          <span className="px-3 py-1 text-gray-600 text-sm">32</span>
          <button className="p-2 rounded border border-gray-300 hover:bg-gray-50">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
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
        ) : error ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-red-600">{error}</div>
          </div>
        ) : hasEmployees ? (
          <EmployeeTable />
        ) : (
          <EmptyEmployeeState />
        )}
      </main>

      {/* Employee Form Modal/Sidebar - Slides from right, covers half screen */}
      {showEmployeeForm && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={handleCloseEmployeeForm}
          />
          
          {/* Modal Content - Slides from right */}
          <div className="absolute right-0 top-0 h-full w-1/2 transform transition-transform duration-300 ease-in-out">
            <EmployeeForm
              isOpen={showEmployeeForm}
              isEdit={isEdit}
              employeeData={employeeData}
              onClose={handleCloseEmployeeForm}
              onSubmit={handleEmployeeSubmit}
            />
          </div>
        </div>
      )}

      {/* Import Modal - Centered */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={handleCloseImportModal}
          />
          
          {/* Modal Content - Centered */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative transform transition-all duration-300 ease-in-out">
              <ImportModal
                isOpen={showImportModal}
                onClose={handleCloseImportModal}
                onSubmit={handleImportSubmit}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeePage;