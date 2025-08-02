import "use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';

// ... other imports remain unchanged

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
        const response = await axios.get('{{exx_url}}/tenant/employee/list');
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
      <main className="flex-1 bg-[#EFF5FF] p-6 md:p-8 overflow-auto">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : hasEmployees ? (
          <table className="min-w-full text-left bg-white border rounded shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">{emp.name || 'N/A'}</td>
                  <td className="px-4 py-2">{emp.email || 'N/A'}</td>
                  <td className="px-4 py-2">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => handleEditClick(emp)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-500 text-center">No employees found.</div>
        )}
      </main>
    </div>
  );
};

export default EmployeePage;
