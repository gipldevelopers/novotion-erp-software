// src/app/(dashboard)/hr/payroll/components/RecentPayrollRuns.js
"use client";
import { useState } from 'react';
import { Eye, Download, Calendar, ChevronUp, ChevronDown } from 'lucide-react';

export default function RecentPayrollRuns() {
  const [sortField, setSortField] = useState('processedDate');
  const [sortDirection, setSortDirection] = useState('desc');

  // Mock data for recent payroll runs
  const payrollRuns = [
    {
      id: 'PR-2023-11',
      period: 'November 2023',
      processedDate: '07-05-2025',
      totalAmount: 125000,
      status: 'Completed',
      employees: 854
    },
    {
      id: 'PR-2023-10',
      period: 'October 2023',
      processedDate: '07-06-2025',
      totalAmount: 122500,
      status: 'Completed',
      employees: 845
    },
    {
      id: 'PR-2023-09',
      period: 'September 2023',
      processedDate: '07-07-2025',
      totalAmount: 118000,
      status: 'Completed',
      employees: 832
    },
    {
      id: 'PR-2023-08',
      period: 'August 2023',
      processedDate: '08-08-2025',
      totalAmount: 115500,
      status: 'Completed',
      employees: 820
    },
    {
      id: 'PR-2023-12',
      period: 'December 2023',
      processedDate: '07-09-2025',
      totalAmount: 0,
      status: 'Pending',
      employees: 854
    }
  ];

  // Sort payroll runs based on selected field and direction
  const sortedRuns = [...payrollRuns].sort((a, b) => {
    if (sortDirection === 'asc') {
      return a[sortField] > b[sortField] ? 1 : -1;
    } else {
      return a[sortField] < b[sortField] ? 1 : -1;
    }
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="ml-1 w-4 h-4 text-blue-500" /> : 
      <ChevronDown className="ml-1 w-4 h-4 text-blue-500" />;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Recent Payroll Runs
        </h2>
        <button className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          <Calendar size={16} />
          Process New Payroll
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th 
                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center">
                  Payroll ID
                  <SortIcon field="id" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150"
                onClick={() => handleSort('period')}
              >
                <div className="flex items-center">
                  Period
                  <SortIcon field="period" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150"
                onClick={() => handleSort('processedDate')}
              >
                <div className="flex items-center">
                  Processed Date
                  <SortIcon field="processedDate" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150"
                onClick={() => handleSort('totalAmount')}
              >
                <div className="flex items-center">
                  Total Amount
                  <SortIcon field="totalAmount" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150"
                onClick={() => handleSort('employees')}
              >
                <div className="flex items-center">
                  Employees
                  <SortIcon field="employees" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  Status
                  <SortIcon field="status" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedRuns.map((run) => (
              <tr key={run.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-150">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                  {run.id}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {run.period}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {run.processedDate}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {run.totalAmount > 0 ? `$${run.totalAmount.toLocaleString()}` : '-'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {run.employees}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-0.5 rounded-xs text-xs font-medium ${getStatusClass(run.status)}`}>
                    {run.status}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    <button 
                      className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {run.status === 'Completed' && (
                      <button 
                        className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all duration-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                        title="Download Reports"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {sortedRuns.length} of {payrollRuns.length} payroll runs
        </p>
        <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
          View All Payroll History →
        </button>
      </div>
    </div>
  );
}