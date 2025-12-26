"use client";
import { useState } from 'react';
import { ChevronUp, ChevronDown, Search, Filter } from 'lucide-react';

const EmployeeLeaveTable = ({ filters }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - in real app, this would come from API based on filters
  const employees = [
    { id: 1, name: 'Sarah Johnson', department: 'Engineering', totalLeaves: 18, usedLeaves: 15, remainingLeaves: 3, utilization: '83%' },
    { id: 2, name: 'Michael Chen', department: 'Sales', totalLeaves: 18, usedLeaves: 12, remainingLeaves: 6, utilization: '67%' },
    { id: 3, name: 'Emily Rodriguez', department: 'Marketing', totalLeaves: 18, usedLeaves: 10, remainingLeaves: 8, utilization: '56%' },
    { id: 4, name: 'David Kim', department: 'Engineering', totalLeaves: 18, usedLeaves: 16, remainingLeaves: 2, utilization: '89%' },
    { id: 5, name: 'Lisa Wang', department: 'HR', totalLeaves: 18, usedLeaves: 8, remainingLeaves: 10, utilization: '44%' },
    { id: 6, name: 'Robert Wilson', department: 'Finance', totalLeaves: 18, usedLeaves: 7, remainingLeaves: 11, utilization: '39%' },
    { id: 7, name: 'Jennifer Lee', department: 'Operations', totalLeaves: 18, usedLeaves: 14, remainingLeaves: 4, utilization: '78%' },
    { id: 8, name: 'Daniel Thomas', department: 'Engineering', totalLeaves: 18, usedLeaves: 13, remainingLeaves: 5, utilization: '72%' }
  ];

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });

  const filteredEmployees = sortedEmployees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <div className="ml-1 flex flex-col"><ChevronUp className="w-3 h-3 -mb-0.5 text-gray-400" /><ChevronDown className="w-3 h-3 -mt-0.5 text-gray-400" /></div>;
    }
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="ml-1 w-4 h-4 text-blue-500" /> : 
      <ChevronDown className="ml-1 w-4 h-4 text-blue-500" />;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Employee Leave Summary
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Detailed breakdown of leave usage by employee
        </p>
      </div>

      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search employees or departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Employee
                  <SortIcon columnKey="name" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('department')}
              >
                <div className="flex items-center">
                  Department
                  <SortIcon columnKey="department" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('totalLeaves')}
              >
                <div className="flex items-center">
                  Total Leaves
                  <SortIcon columnKey="totalLeaves" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('usedLeaves')}
              >
                <div className="flex items-center">
                  Used
                  <SortIcon columnKey="usedLeaves" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('remainingLeaves')}
              >
                <div className="flex items-center">
                  Remaining
                  <SortIcon columnKey="remainingLeaves" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('utilization')}
              >
                <div className="flex items-center">
                  Utilization
                  <SortIcon columnKey="utilization" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {employee.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {employee.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {employee.totalLeaves}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {employee.usedLeaves}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {employee.remainingLeaves}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    parseFloat(employee.utilization) > 80 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
                      : parseFloat(employee.utilization) > 60
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {employee.utilization}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeLeaveTable;