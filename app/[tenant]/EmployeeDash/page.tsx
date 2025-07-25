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

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`http://excellium.localhost:8000/tenant/employee/list`);
        setEmployees(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch employees');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const hasEmployees = employees.length > 0;

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-auto">
      {/* Header + Add/Import UI if any */}

      <main className="flex-1 bg-[#EFF5FF] p-6 md:p-8 overflow-auto">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : hasEmployees ? (
          <div>
            {/* Replace with table or list of employees */}
            {employees.map((emp) => (
              <div key={emp.id}>{emp.name}</div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-gray-500">
            <img src="/path-to-empty-employee-image.png" alt="No Employees" className="w-64 h-64 mb-4" />
            <p>No employees found. Please add new employees to get started.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default EmployeePage;
