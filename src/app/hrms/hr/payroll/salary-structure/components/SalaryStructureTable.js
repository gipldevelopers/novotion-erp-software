// src/app/(dashboard)/hr/payroll/salary-structure/components/SalaryStructureTable.js
"use client";
import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, Eye, Edit, Trash2, IndianRupee } from 'lucide-react';
import Pagination from '@/components/common/Pagination';
import SalaryStructureFilters from './SalaryStructureFilters';

// Mock data for salary structures
const defaultData = [
  {
    id: 'SS-001',
    employee: 'Lori Broaddus',
    designation: 'Finance Manager',
    department: 'Finance',
    basicSalary: 5000,
    hra: 2000,
    conveyance: 800,
    medical: 1250,
    specialAllowance: 1950,
    total: 11000,
    effectiveDate: '2023-01-01',
    status: 'Active'
  },
  {
    id: 'SS-002',
    employee: 'John Smith',
    designation: 'Software Engineer',
    department: 'IT',
    basicSalary: 4000,
    hra: 1600,
    conveyance: 800,
    medical: 1000,
    specialAllowance: 1600,
    total: 9000,
    effectiveDate: '2023-01-15',
    status: 'Active'
  },
  {
    id: 'SS-003',
    employee: 'Sarah Johnson',
    designation: 'HR Specialist',
    department: 'HR',
    basicSalary: 4500,
    hra: 1800,
    conveyance: 800,
    medical: 1125,
    specialAllowance: 1775,
    total: 10000,
    effectiveDate: '2023-02-01',
    status: 'Active'
  },
  {
    id: 'SS-004',
    employee: 'Michael Brown',
    designation: 'Product Manager',
    department: 'Product',
    basicSalary: 6000,
    hra: 2400,
    conveyance: 800,
    medical: 1500,
    specialAllowance: 2300,
    total: 13000,
    effectiveDate: '2023-02-15',
    status: 'Active'
  },
  {
    id: 'SS-005',
    employee: 'Emily Davis',
    designation: 'UX Designer',
    department: 'Design',
    basicSalary: 4200,
    hra: 1680,
    conveyance: 800,
    medical: 1050,
    specialAllowance: 1670,
    total: 9400,
    effectiveDate: '2023-03-01',
    status: 'Inactive'
  },
];

export default function SalaryStructureTable() {
  const [data, setData] = useState(defaultData);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: info => <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{info.getValue()}</span>,
      },
      {
        accessorKey: 'employee',
        header: 'Employee',
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
        accessorKey: 'basicSalary',
        header: 'Basic',
        cell: info => <span className="text-sm font-medium text-gray-900 dark:text-white">${info.getValue()}</span>,
      },
      {
        accessorKey: 'total',
        header: 'Total',
        cell: info => <span className="text-sm font-bold text-green-600 dark:text-green-400">${info.getValue()}</span>,
      },
      {
        accessorKey: 'effectiveDate',
        header: 'Effective Date',
        cell: info => <span className="text-sm text-gray-600 dark:text-gray-400">{info.getValue()}</span>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: info => {
          const status = info.getValue();
          let statusClass = '';
          if (status === 'Active') {
            statusClass = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
          } else {
            statusClass = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
          }
          return (
            <span className={`px-2.5 py-0.5 rounded-xs text-xs font-medium ${statusClass}`}>
              {status}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: info => (
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleView(info.row.original)}
              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleEdit(info.row.original)}
              className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all duration-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(info.row.original)}
              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    []
  );

  // Apply all filters and return filtered data
  const filteredData = useMemo(() => {
    let result = [...data];
    
    // Apply global search filter
    if (globalFilter) {
      const searchTerm = globalFilter.toLowerCase();
      result = result.filter(structure => 
        structure.employee.toLowerCase().includes(searchTerm) ||
        structure.designation.toLowerCase().includes(searchTerm) ||
        structure.department.toLowerCase().includes(searchTerm) ||
        structure.id.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(structure => structure.status === statusFilter);
    }
    
    // Apply department filter
    if (departmentFilter !== 'all') {
      result = result.filter(structure => structure.department === departmentFilter);
    }
    
    return result;
  }, [data, globalFilter, statusFilter, departmentFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: Math.ceil(filteredData.length / pagination.pageSize),
  });

  // Get unique values for filter dropdowns
  const statuses = useMemo(() => {
    const uniqueStatuses = new Set(data.map(item => item.status));
    return ['all', ...Array.from(uniqueStatuses)];
  }, [data]);

  const departments = useMemo(() => {
    const uniqueDepartments = new Set(data.map(item => item.department));
    return ['all', ...Array.from(uniqueDepartments)];
  }, [data]);

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter('all');
    setDepartmentFilter('all');
    setGlobalFilter('');
  };

  // Handle actions
  const handleView = (structure) => console.log('View salary structure:', structure);
  const handleEdit = (structure) => console.log('Edit salary structure:', structure);
  const handleDelete = (structure) => {
    if (confirm(`Are you sure you want to delete ${structure.employee}'s salary structure?`)) {
      setData(data.filter(item => item.id !== structure.id));
    }
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header with title and stats */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Salary Structures</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage employee salary components and structures
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg dark:bg-blue-900/30 dark:text-blue-400">
          <IndianRupee size={18} />
          <span className="font-medium">Total: ${data.reduce((sum, item) => sum + item.total, 0).toLocaleString()}</span>
        </div>
      </div>

      {/* Filters Section */}
      <div className="mb-6">
        <SalaryStructureFilters
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          departmentFilter={departmentFilter}
          setDepartmentFilter={setDepartmentFilter}
          statuses={statuses}
          departments={departments}
          onClearFilters={clearFilters}
        />
      </div>

      {/* Results Count */}
      {/* <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredData.length} of {defaultData.length} salary structures
        {(statusFilter !== 'all' || departmentFilter !== 'all' || globalFilter) && (
          <span> (filtered)</span>
        )}
      </div> */}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="min-w-[1000px] md:min-w-full">
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
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => (
                  <tr 
                    key={row.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-150"
                  >
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-3 py-4 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-3 py-8 text-center text-gray-500 dark:text-gray-400">
                    No salary structures found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Component */}
      <Pagination
        currentPage={table.getState().pagination.pageIndex + 1}
        totalItems={filteredData.length}
        itemsPerPage={table.getState().pagination.pageSize}
        onPageChange={(page) => table.setPageIndex(page - 1)}
        onItemsPerPageChange={(size) => {
          table.setPageSize(size);
          table.setPageIndex(0);
        }}
        className="mt-6"
      />
    </div>
  );
}