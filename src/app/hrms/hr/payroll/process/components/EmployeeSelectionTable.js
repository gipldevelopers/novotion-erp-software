// src/app/(dashboard)/hr/payroll/process/components/EmployeeSelectionTable.js
"use client";
import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, Check, ArrowLeft, ArrowRight } from 'lucide-react';

// Mock data for employees with salary details
const employeeData = [
  {
    id: 'Emp-010',
    name: 'Lori Broaddus',
    designation: 'Finance Manager',
    department: 'Finance',
    basicSalary: 5000,
    hra: 2000,
    conveyance: 800,
    medical: 1250,
    specialAllowance: 1950,
    total: 11000,
    status: 'Active'
  },
  {
    id: 'Emp-011',
    name: 'John Smith',
    designation: 'Software Engineer',
    department: 'IT',
    basicSalary: 4000,
    hra: 1600,
    conveyance: 800,
    medical: 1000,
    specialAllowance: 1600,
    total: 9000,
    status: 'Active'
  },
  {
    id: 'Emp-012',
    name: 'Sarah Johnson',
    designation: 'HR Specialist',
    department: 'HR',
    basicSalary: 4500,
    hra: 1800,
    conveyance: 800,
    medical: 1125,
    specialAllowance: 1775,
    total: 10000,
    status: 'Active'
  },
  {
    id: 'Emp-013',
    name: 'Michael Brown',
    designation: 'Product Manager',
    department: 'Product',
    basicSalary: 6000,
    hra: 2400,
    conveyance: 800,
    medical: 1500,
    specialAllowance: 2300,
    total: 13000,
    status: 'Active'
  },
];

export default function EmployeeSelectionTable({ selectedEmployees, onChange, onNext, onBack }) {
  const [data, setData] = useState(employeeData);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: () => (
          <div className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              onChange={(e) => {
                if (e.target.checked) {
                  onChange(data);
                } else {
                  onChange([]);
                }
              }}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={selectedEmployees.some(emp => emp.id === row.original.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  onChange([...selectedEmployees, row.original]);
                } else {
                  onChange(selectedEmployees.filter(emp => emp.id !== row.original.id));
                }
              }}
            />
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: 'id',
        header: 'Emp ID',
        cell: info => <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{info.getValue()}</span>,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        cell: info => <span className="text-sm font-medium text-gray-900 dark:text-white">{info.getValue()}</span>,
      },
      {
        accessorKey: 'designation',
        header: 'Designation',
        cell: info => <span className="text-sm text-gray-600 dark:text-gray-400">{info.getValue()}</span>,
      },
      {
        accessorKey: 'department',
        header: 'Department',
        cell: info => <span className="text-sm text-gray-600 dark:text-gray-400">{info.getValue()}</span>,
      },
      {
        accessorKey: 'total',
        header: 'Salary',
        cell: info => <span className="text-sm font-bold text-green-600 dark:text-green-400">${info.getValue()}</span>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: info => {
          const status = info.getValue();
          let statusClass = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
          return (
            <span className={`px-2.5 py-0.5 rounded-xs text-xs font-medium ${statusClass}`}>
              {status}
            </span>
          );
        },
      },
    ],
    [selectedEmployees, onChange]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleNext = () => {
    if (selectedEmployees.length > 0) {
      onNext();
    } else {
      alert('Please select at least one employee');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Select Employees</h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {selectedEmployees.length} of {data.length} employees selected
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            placeholder="Search employees..."
            value={globalFilter}
            onChange={e => setGlobalFilter(e.target.value)}
            className="w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="border-b border-gray-200 dark:border-gray-700">
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-3 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300"
                    {...(header.column.getCanSort() ? {
                      onClick: header.column.getToggleSortingHandler(),
                      className: "px-3 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150"
                    } : {})}
                  >
                    <div className="flex items-center">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <>
                          {{
                            asc: <ChevronUp className="ml-1 w-4 h-4 text-blue-500" />,
                            desc: <ChevronDown className="ml-1 w-4 h-4 text-blue-500" />,
                          }[header.column.getIsSorted()] ?? (
                            <div className="ml-1 flex flex-col">
                              <ChevronUp className="w-3 h-3 -mb-0.5 text-gray-400" />
                              <ChevronDown className="w-3 h-3 -mt-0.5 text-gray-400" />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-150">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-3 py-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-200 px-5 py-2.5 text-gray-800 hover:bg-gray-300 transition dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <button
          onClick={handleNext}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700 transition"
        >
          Next: Review & Process
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}