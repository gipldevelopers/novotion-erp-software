"use client";
import { Search, Filter, Download, Printer, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function ChartControls() {
  const [viewMode, setViewMode] = useState('hierarchical');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const departments = [
    'All Departments',
    'Executive',
    'Finance',
    'Technology',
    'Human Resources',
    'Marketing',
    'Sales'
  ];

  const handleExport = (format) => {
    console.log(`Exporting chart as ${format}`);
    // Implement export functionality
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {/* View Mode Selector */}
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white"
          >
            <option value="hierarchical">Hierarchical View</option>
            <option value="departmental">Departmental View</option>
            <option value="flat">Flat View</option>
          </select>

          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white"
          >
            {departments.map(dept => (
              <option key={dept} value={dept.toLowerCase().replace(' ', '-')}>
                {dept}
              </option>
            ))}
          </select>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('png')}
              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-600 dark:border-gray-500 dark:hover:bg-gray-500"
              title="Export as PNG"
            >
              <Download size={18} />
            </button>
            
            <button
              onClick={() => handleExport('pdf')}
              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-600 dark:border-gray-500 dark:hover:bg-gray-500"
              title="Export as PDF"
            >
              <Printer size={18} />
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-600 dark:border-gray-500 dark:hover:bg-gray-500"
              title="Refresh"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}