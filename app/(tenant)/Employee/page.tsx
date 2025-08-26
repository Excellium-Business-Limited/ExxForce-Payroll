'use client';

import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import EmployeeForm from '../components/EmployeeForm';
import ImportModal from '../components/Import';
import EmployeeDetails from '../components/EmployeeDetails';
import SalarySetupForm from '../components/SalarySetupForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useGlobal } from '@/app/Context/page';

// Define proper TypeScript interfaces
interface Employee {
  id?: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  gender: 'MALE' | 'FEMALE';
  date_of_birth: string;
  address: string;
  employment_type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';
  start_date: string;
  tax_start_date: string;
  job_title: string;
  department_name: string;
  pay_grade_name: string;
  custom_salary: number;
  bank_name: string;
  account_number: string;
  account_name: string;
  pay_frequency: 'MONTHLY' | 'WEEKLY' | 'BIWEEKLY';
  is_paye_applicable: boolean;
  is_pension_applicable: boolean;
  is_nhf_applicable: boolean;
  is_nsitf_applicable: boolean;
}

interface Filters {
  department: string;
  designation: string;
  status: string;
}

interface PaginationInfo {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

const EmployeePage: React.FC = () => {
  // State with proper TypeScript types
  const [editType, setEditType] = useState<'general' | 'salary'>('general');
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [employeeData, setEmployeeData] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showEmployeeForm, setShowEmployeeForm] = useState<boolean>(false);
  const [showSalaryForm, setShowSalaryForm] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState<boolean>(false);
  const [pendingEmployeeData, setPendingEmployeeData] = useState<any>(null);
  const [filters, setFilters] = useState<Filters>({
    department: 'All',
    designation: 'All',
    status: 'All',
  });
  const { tenant, globalState } = useGlobal();

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Pagination calculations
  const paginationInfo: PaginationInfo = useMemo(() => {
    const totalItems = employees.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return {
      currentPage,
      itemsPerPage,
      totalItems,
      totalPages,
    };
  }, [employees.length, currentPage, itemsPerPage]);

  // Get current page data
  const currentEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return employees.slice(startIndex, endIndex);
  }, [employees, currentPage, itemsPerPage]);

  // Pagination handlers
  const handlePageChange = (page: number): void => {
    if (page >= 1 && page <= paginationInfo.totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number): void => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleNextPage = (): void => {
    if (currentPage < paginationInfo.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = (): void => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = (): (number | string)[] => {
    const { totalPages } = paginationInfo;
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Event handlers with proper types
  const handleEditClick = (employee: Employee): void => {
    setIsEdit(true);
    setEmployeeData(employee);
    setShowEmployeeForm(true);
  };

  const handleAddEmployee = (): void => {
    setIsEdit(false);
    setEmployeeData(null);
    setShowEmployeeForm(true);
  };

  const handleImportEmployee = (): void => {
    setShowImportModal(true);
  };

  const handleCloseEmployeeForm = (): void => {
    setShowEmployeeForm(false);
    setIsEdit(false);
    setEmployeeData(null);
  };

  const handleCloseSalaryForm = (): void => {
    setShowSalaryForm(false);
    setPendingEmployeeData(null);
  };

  const handleCloseImportModal = (): void => {
    setShowImportModal(false);
  };

  const handleViewEmployee = (employee: Employee): void => {
    setSelectedEmployee(employee);
    setShowEmployeeDetails(true);
  };

  const handleCloseEmployeeDetails = (): void => {
    setShowEmployeeDetails(false);
    setSelectedEmployee(null);
  };

  const handleEditFromDetails = (
    employee: Employee,
    editType?: 'general' | 'salary'
  ): void => {
    setSelectedEmployee(employee);
    setIsEdit(true);
    setEmployeeData(employee);
    setShowEmployeeDetails(false);
    setShowEmployeeForm(true);

    // You can store the editType in state if you need to pass it to EmployeeForm
    // For example: setEditType(editType || 'general');
  };

  const handleEndEmployment = async (employee: Employee): Promise<void> => {
    try {
      console.log('Ending employment for:', employee.employee_id);

      if (
        window.confirm(
          `Are you sure you want to end employment for ${employee.first_name} ${employee.last_name}?`
        )
      ) {
        await fetchEmployees();
        setShowEmployeeDetails(false);
        setSelectedEmployee(null);
      }
    } catch (error) {
      console.error('Error ending employment:', error);
    }
  };

  // Handle when EmployeeForm shows salary form
  const handleShowSalaryForm = (employeeData: any): void => {
    console.log('Showing salary form with data:', employeeData);
    setPendingEmployeeData(employeeData);
    setShowEmployeeForm(false); // Hide employee form
    setShowSalaryForm(true); // Show salary form
  };

  // Handle when salary form goes back to employee form
  const handleBackToEmployeeForm = (): void => {
    setShowSalaryForm(false);
    setShowEmployeeForm(true);
  };

  const handleEmployeeSubmit = async (employeeFormData: any): Promise<void> => {
    try {
      if (isEdit) {
        console.log('Updating employee:', employeeFormData);
      } else {
        console.log('Creating new employee:', employeeFormData);
      }

      await fetchEmployees();
    } catch (error) {
      console.error('Error submitting employee:', error);
    }
  };

  const handleSalarySubmit = async (salaryData: any): Promise<void> => {
    try {
      console.log('Salary setup completed:', salaryData);
      await fetchEmployees();
      setShowSalaryForm(false);
      setPendingEmployeeData(null);
    } catch (error) {
      console.error('Error submitting salary:', error);
    }
  };

  const handleImportSubmit = async (importData: any): Promise<void> => {
    try {
      console.log('Importing employees:', importData);
      await fetchEmployees();
      handleCloseImportModal();
    } catch (error) {
      console.error('Error importing employees:', error);
    }
  };

  // Utility functions
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (
      !dateString ||
      dateString === 'null' ||
      dateString === 'undefined' ||
      dateString.trim() === ''
    ) {
      return '--';
    }

    try {
      let date: Date;
      const dateStr = String(dateString).trim();

      if (dateStr.includes('T') || dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        date = new Date(dateStr);
      } else if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
          const day = parseInt(parts[0]);
          const month = parseInt(parts[1]);
          const year = parseInt(parts[2]);

          if (day > 31 || month > 12 || year < 1900) {
            return '--';
          }

          date = new Date(year, month - 1, day);
        } else {
          return '--';
        }
      } else if (
        dateStr.includes('-') &&
        !dateStr.match(/^\d{4}-\d{2}-\d{2}$/)
      ) {
        const parts = dateStr.split('-');
        if (parts.length === 3 && parts[0].length <= 2) {
          const day = parseInt(parts[0]);
          const month = parseInt(parts[1]);
          const year = parseInt(parts[2]);

          if (day > 31 || month > 12 || year < 1900) {
            return '--';
          }

          date = new Date(year, month - 1, day);
        } else {
          date = new Date(dateStr);
        }
      } else {
        date = new Date(dateStr);
      }

      if (isNaN(date.getTime())) {
        return '--';
      }

      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();

      return `${month}-${day}-${year}`;
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return '--';
    }
  };

  const getEmployeeStatus = (employee: Employee): string => {
    return 'Active';
  };

  const getEmployeeType = (employmentType: string): string => {
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

  const fetchEmployees = async (): Promise<void> => {
    try {
      console.log(tenant)
      const response = await axios.get<Employee[]>(
				`http://${tenant}.localhost:8000/tenant/employee/list`,
				{
					headers: {
						Authorization: `Bearer ${globalState.accessToken}`,
					},
				}
			);

      console.log('Raw employee data from API:', response.data);

      if (response.data && response.data.length > 0) {
        const firstEmployee = response.data[0];
        console.log('First employee date fields:', {
          start_date: firstEmployee.start_date,
          date_of_birth: firstEmployee.date_of_birth,
          tax_start_date: firstEmployee.tax_start_date,
        });
      }

      setEmployees(response.data || []);
      setError(null);

      const newTotalPages = Math.ceil(
        (response.data?.length || 0) / itemsPerPage
      );
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(1);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to fetch employees');
      setEmployees([]);
    }
  };

  useEffect(() => {
    const loadEmployees = async (): Promise<void> => {
      setLoading(true);
      await fetchEmployees();
      setLoading(false);
    };
    if (tenant){
      loadEmployees();
    }
  }, []);

  const hasEmployees = employees.length > 0;

  // Empty state component
  const EmptyEmployeeState: React.FC = () => (
    <div className='flex flex-col items-center justify-center min-h-[400px] text-center'>
      <div className='mb-8'>
        <div className='relative'>
          <div className='bg-white rounded-lg shadow-lg p-4 w-48 h-32 border'>
            <div className='flex gap-1 mb-3'>
              <div className='w-2 h-2 bg-red-400 rounded-full'></div>
              <div className='w-2 h-2 bg-yellow-400 rounded-full'></div>
              <div className='w-2 h-2 bg-green-400 rounded-full'></div>
            </div>
            <div className='space-y-2'>
              <div className='h-2 bg-blue-200 rounded w-full'></div>
              <div className='h-2 bg-blue-100 rounded w-3/4'></div>
              <div className='h-2 bg-blue-100 rounded w-1/2'></div>
            </div>
          </div>

          <div className='absolute -bottom-4 -right-4'>
            <div className='relative'>
              <div className='w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center'>
                <div className='w-8 h-8 bg-white rounded-full flex items-center justify-center'>
                  <svg
                    className='w-4 h-4 text-blue-500'
                    viewBox='0 0 24 24'
                    fill='none'>
                    <path
                      d='M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L12 2L3 7V9H21ZM12 17.5C9.2 17.5 7 15.3 7 12.5S9.2 7.5 12 7.5 17 9.7 17 12.5 14.8 17.5 12 17.5Z'
                      fill='currentColor'
                    />
                  </svg>
                </div>
              </div>
              <div className='absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center'>
                <svg
                  className='w-3 h-3 text-white'
                  viewBox='0 0 24 24'
                  fill='none'>
                  <path
                    d='M12 5V19M5 12H19'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className='text-xl font-semibold text-gray-800 mb-3'>
        Add employees
      </h2>
      <p className='text-gray-600 max-w-md mb-8 leading-relaxed'>
        Add employees and contractors you want to pay. Once added, you can
        assign them to pay grade and process their payments in batches.
      </p>

      <div className='flex gap-3'>
        <button
          onClick={handleAddEmployee}
          className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2'>
          <svg
            className='w-4 h-4'
            viewBox='0 0 24 24'
            fill='none'>
            <path
              d='M12 5V19M5 12H19'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
            />
          </svg>
          Add employee
        </button>
        <button
          onClick={handleImportEmployee}
          className='bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-2 rounded-lg font-medium transition-colors'>
          Import employee
        </button>
      </div>
    </div>
  );

  // Employee table component
  const EmployeeTable: React.FC = () => (
    <div className='bg-white rounded-lg shadow-sm'>
      <div className='p-6 border-b'>
        <div className='bg-blue-50 rounded-lg p-4 flex items-center gap-3'>
          <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
            <svg
              className='w-5 h-5 text-blue-600'
              viewBox='0 0 24 24'
              fill='none'>
              <path
                d='M16 7C16 9.2 14.2 11 12 11S8 9.2 8 7 9.8 3 12 3 16 4.8 16 7ZM12 14C16.4 14 20 15.8 20 18V21H4V18C4 15.8 7.6 14 12 14Z'
                fill='currentColor'
              />
            </svg>
          </div>
          <div>
            <h3 className='text-sm text-gray-600'>Total Employees</h3>
            <p className='text-2xl font-semibold text-gray-900'>
              {employees.length}
            </p>
            <p className='text-xs text-gray-500'>
              {employees.length > 0
                ? Math.round(
                    (employees.filter(
                      (emp) => emp.employment_type === 'FULL_TIME'
                    ).length /
                      employees.length) *
                      100
                  )
                : 0}
              % of employees are regular staff
            </p>
          </div>
        </div>
      </div>

      <div className='p-6 border-b'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
          <h2 className='text-lg font-medium text-gray-900'>Employees List</h2>
          <div className='flex gap-2'>
            <button
              onClick={handleAddEmployee}
              className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2'>
              <svg
                className='w-4 h-4'
                viewBox='0 0 24 24'
                fill='none'>
                <path
                  d='M12 5V19M5 12H19'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
              </svg>
              Add employee
            </button>
            <button
              onClick={handleImportEmployee}
              className='bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg font-medium transition-colors'>
              Import employee
            </button>
          </div>
        </div>

        <div className='flex flex-wrap gap-4 mt-4'>
          <select
            className='border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm'
            value={filters.department}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, department: e.target.value }))
            }>
            <option value='All'>Department: All</option>
          </select>
          <select
            className='border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm'
            value={filters.designation}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, designation: e.target.value }))
            }>
            <option value='All'>Designation: All</option>
          </select>
          <select
            className='border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm'
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }>
            <option value='All'>Status: All</option>
          </select>
          <button className='border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm flex items-center gap-2'>
            <svg
              className='w-4 h-4'
              viewBox='0 0 24 24'
              fill='none'>
              <path
                d='M8 2V5M16 2V5M3.5 9H20.5M21 8.5V17C21 18.1 20.1 19 19 19H5C3.9 19 3 18.1 3 17V8.5C3 7.4 3.9 6.5 5 6.5H19C20.1 6.5 21 7.4 21 8.5Z'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
              />
            </svg>
            Select Dates
          </button>
          <button className='bg-blue-600 text-white px-4 py-2 rounded-lg text-sm'>
            Filter
          </button>
        </div>
      </div>

      <div className='px-6 py-3 border-b bg-gray-50 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <span className='text-sm text-gray-600'>Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className='border border-gray-300 rounded px-2 py-1 text-sm bg-white'>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className='text-sm text-gray-600'>entries per page</span>
        </div>
        <div className='text-sm text-gray-600'>
          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
          {Math.min(currentPage * itemsPerPage, employees.length)} of{' '}
          {employees.length} entries
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                <input
                  type='checkbox'
                  className='rounded'
                />
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                S/N
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Employee ID
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Full Name
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Position
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Type
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Salary (NGN)
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Date Joined
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Status
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                More
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {currentEmployees.map((employee, index) => {
              const globalIndex = (currentPage - 1) * itemsPerPage + index;

              return (
                <tr
                  key={employee.employee_id || employee.id || index}
                  className='hover:bg-gray-50 cursor-pointer'
                  onClick={() => handleViewEmployee(employee)}>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <input
                      type='checkbox'
                      className='rounded'
                    />
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {String(globalIndex + 1).padStart(2, '0')}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium'>
                    {employee.employee_id}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {`${employee.first_name} ${employee.last_name}`}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {employee.job_title}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {getEmployeeType(employee.employment_type)}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {formatCurrency(employee.custom_salary)}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm'>
                    {employee.start_date ? (
                      <span className='text-gray-900'>
                        {formatDate(employee.start_date)}
                      </span>
                    ) : (
                      <span className='text-gray-400 italic'>Not set</span>
                    )}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        getEmployeeStatus(employee) === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                      {getEmployeeStatus(employee)}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(employee);
                      }}
                      className='text-gray-400 hover:text-gray-600'
                      aria-label='Edit employee'>
                      <svg
                        className='w-5 h-5'
                        viewBox='0 0 24 24'
                        fill='none'>
                        <path
                          d='M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z'
                          fill='currentColor'
                        />
                        <path
                          d='M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z'
                          fill='currentColor'
                        />
                        <path
                          d='M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z'
                          fill='currentColor'
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className='px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4'>
        <div className='text-sm text-gray-600'>
          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
          {Math.min(currentPage * itemsPerPage, employees.length)} of{' '}
          {employees.length} entries
        </div>

        <div className='flex items-center gap-2'>
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`p-2 rounded border transition-colors ${
              currentPage === 1
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
            aria-label='Previous page'>
            <svg
              className='w-4 h-4'
              viewBox='0 0 24 24'
              fill='none'>
              <path
                d='M15 18L9 12L15 6'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>

          <div className='flex items-center gap-1'>
            {getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className='px-3 py-1 text-gray-500 text-sm'>...</span>
                ) : (
                  <button
                    onClick={() => handlePageChange(page as number)}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}>
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === paginationInfo.totalPages}
            className={`p-2 rounded border transition-colors ${
              currentPage === paginationInfo.totalPages
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
            aria-label='Next page'>
            <svg
              className='w-4 h-4'
              viewBox='0 0 24 24'
              fill='none'>
              <path
                d='M9 18L15 12L9 6'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>
        </div>

        <div className='flex items-center gap-2 text-sm'>
          <span className='text-gray-600'>Go to page:</span>
          <input
            type='number'
            min='1'
            max={paginationInfo.totalPages}
            value={currentPage}
            onChange={(e) => {
              const page = parseInt(e.target.value);
              if (page >= 1 && page <= paginationInfo.totalPages) {
                handlePageChange(page);
              }
            }}
            className='w-16 px-2 py-1 border border-gray-300 rounded text-center'
          />
          <span className='text-gray-600'>of {paginationInfo.totalPages}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className='flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden'>
      {/* Show Employee Details Full Screen */}
      {showEmployeeDetails && selectedEmployee ? (
        <div className='flex-1 bg-white overflow-auto'>
          <EmployeeDetails
            employee={selectedEmployee}
            onClose={handleCloseEmployeeDetails}
            onEdit={handleEditFromDetails}
            onSalaryEdit={handleEditFromDetails}
            onEndEmployment={handleEndEmployment}
          />
        </div>
      ) : (
        /* Main Content + Overlay Layout */
        <div className='flex-1 relative overflow-hidden'>
          {/* Main Content Area - Always Full Width */}
          <div className='w-full h-full overflow-auto bg-[#EFF5FF] p-6 md:p-8'>
            {loading ? (
              <div className='flex items-center justify-center min-h-[400px]'>
                <div className='text-gray-600'>Loading...</div>
              </div>
            ) : error ? (
              <div className='flex items-center justify-center min-h-[400px]'>
                <div className='text-red-600'>{error}</div>
              </div>
            ) : hasEmployees ? (
              <EmployeeTable />
            ) : (
              <EmptyEmployeeState />
            )}
          </div>

          {/* Right Side Form Panel - Overlay for Employee Form */}
          {showEmployeeForm && (
            <div className='absolute top-0 right-0 w-1/2 min-w-[600px] h-full bg-white border-l border-gray-200 flex flex-col overflow-hidden shadow-2xl transform transition-transform duration-300 ease-in-out z-10'>
              {/* Form Header */}
              <div className='flex items-center justify-between p-4 border-b border-gray-200 bg-white'>
                <h2 className='text-lg font-semibold text-gray-900'>
                  {isEdit ? 'Edit Employee' : 'Add New Employee'}
                </h2>
                <button
                  onClick={handleCloseEmployeeForm}
                  className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
                  aria-label='Close form'>
                  <svg
                    className='w-5 h-5 text-gray-500'
                    viewBox='0 0 24 24'
                    fill='none'>
                    <path
                      d='M18 6L6 18M6 6L18 18'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </button>
              </div>

              {/* Form Content */}
              <div className='flex-1 overflow-auto'>
                <EmployeeForm
                  isOpen={showEmployeeForm}
                  isEdit={isEdit}
                  employeeData={employeeData}
                  onClose={handleCloseEmployeeForm}
                  onSubmit={handleEmployeeSubmit}
                  onShowSalaryForm={handleShowSalaryForm}
                />
              </div>
            </div>
          )}

          {/* Right Side Form Panel - Overlay for Salary Form */}
          {showSalaryForm && pendingEmployeeData && (
            <div className='absolute top-0 right-0 w-1/2 min-w-[600px] h-full bg-white border-l border-gray-200 flex flex-col overflow-hidden shadow-2xl transform transition-transform duration-300 ease-in-out z-10'>
              {/* Form Header */}
              <div className='flex items-center justify-between p-4 border-b border-gray-200 bg-white'>
                <h2 className='text-lg font-semibold text-gray-900'>
                  Salary Setup
                </h2>
                <button
                  onClick={handleCloseSalaryForm}
                  className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
                  aria-label='Close form'>
                  <svg
                    className='w-5 h-5 text-gray-500'
                    viewBox='0 0 24 24'
                    fill='none'>
                    <path
                      d='M18 6L6 18M6 6L18 18'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </button>
              </div>

              {/* Form Content */}
              <div className='flex-1 overflow-auto'>
                <SalarySetupForm
                  employeeData={pendingEmployeeData}
                  isEdit={isEdit}
                  existingEmployeeId={employeeData?.id}
                  onClose={handleCloseSalaryForm}
                  onSubmit={handleSalarySubmit}
                  onBack={handleBackToEmployeeForm}
                  parentOnSubmit={handleEmployeeSubmit}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Import Modal Dialog - Keep as modal since it's simpler */}
      <Dialog
        open={showImportModal}
        onOpenChange={handleCloseImportModal}>
        <DialogContent className='sm:max-w-[500px]'>
          <ImportModal
            isOpen={showImportModal}
            onClose={handleCloseImportModal}
            onSubmit={handleImportSubmit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeePage;