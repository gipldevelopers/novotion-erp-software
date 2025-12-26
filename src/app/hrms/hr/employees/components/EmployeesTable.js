// src/app/(dashboard)/hr/employees/components/EmployeeTable.js
"use client";
import { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, Eye, Edit, Trash2, Loader2 } from 'lucide-react';
import Pagination from '@/components/common/Pagination';
import EmployeeFilters from './EmployeeFilters';
import { employeeService } from '@/services/employeeService';
import { toast } from 'sonner';

export default function EmployeeTable() {
  // const [data, setData] = useState(defaultData); // Removed static defaultData
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [designationFilter, setDesignationFilter] = useState('all');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredAction, setHoveredAction] = useState(null);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch employees from mock service
  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const params = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: globalFilter,
        status: statusFilter !== 'all' ? statusFilter : '',
        role: designationFilter !== 'all' ? designationFilter : '' // Assuming 'role' maps to designation for filter
      };

      const response = await employeeService.getAllEmployees(params);
      setData(response.data || []);
      setTotalItems(response.pagination?.totalItems || 0);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to load employees');
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [pagination.pageIndex, pagination.pageSize, globalFilter, statusFilter, designationFilter]);


  const columns = useMemo(
    () => [
      {
        accessorKey: 'employeeId', // Changed from id to employeeId matches mockData
        header: 'Emp ID',
        cell: info => <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{info.getValue() || info.row.original.id}</span>,
      },
      {
        accessorKey: 'firstName', // Changed from name to firstName/lastName combo or full name
        header: 'Name',
        cell: info => (
          <div className="flex items-center">
            {/* <img 
              src={info.row.original.avatar || '/images/users/user-01.png'} 
              alt={info.getValue()}
              className="w-8 h-8 rounded-full mr-3 object-cover"
            /> */}
            <div className="w-8 h-8 rounded-full mr-3 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                {info.row.original.firstName?.charAt(0)}{info.row.original.lastName?.charAt(0)}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {info.row.original.firstName} {info.row.original.lastName}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: info => <span className="text-sm text-gray-600 dark:text-gray-400">{info.getValue()}</span>,
      },
      {
        accessorKey: 'phone', // Note: mockData might vary, using phone if available
        header: 'Phone',
        cell: info => <span className="text-sm text-gray-600 dark:text-gray-400">{info.getValue() || 'N/A'}</span>,
      },
      {
        accessorKey: 'position', // Changed from designation to position/role
        header: 'Designation',
        cell: info => <span className="text-sm text-gray-600 dark:text-gray-400">{info.getValue()?.name || info.getValue() || 'N/A'}</span>,
      },
      {
        accessorKey: 'joiningDate',
        header: 'Joining Date',
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
          } else if (status === 'On Leave') {
            statusClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
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
              onMouseEnter={() => setHoveredAction(`${info.row.id}-view`)}
              onMouseLeave={() => setHoveredAction(null)}
              onClick={() => handleView(info.row.original)}
              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 group relative"
              title="View"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onMouseEnter={() => setHoveredAction(`${info.row.id}-edit`)}
              onMouseLeave={() => setHoveredAction(null)}
              onClick={() => handleEdit(info.row.original)}
              className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all duration-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 group relative"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onMouseEnter={() => setHoveredAction(`${info.row.id}-delete`)}
              onMouseLeave={() => setHoveredAction(null)}
              onClick={() => handleDelete(info.row.original)}
              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 group relative"
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

  const table = useReactTable({
    data,
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
    getFilteredRowModel: getFilteredRowModel(), // Client-side filtering backing off
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true, // We are handling pagination server-side (mocked)
    pageCount: Math.ceil(totalItems / pagination.pageSize),
  });

  // Get unique values for filter dropdowns (Mocking these strings for now as they might come from another API)
  const statuses = ['all', 'Active', 'Inactive', 'On Leave', 'Terminated'];
  const designations = ['all', 'Software Engineer', 'Product Manager', 'HR Manager', 'Sales Executive', 'Designer'];

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter('all');
    setDesignationFilter('all');
    setGlobalFilter('');
    table.setPageIndex(0);
  };

  // Handle actions
  const handleView = (employee) => console.log('View employee:', employee);
  const handleEdit = (employee) => console.log('Edit employee:', employee);

  const handleDelete = async (employee) => {
    if (confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
      try {
        await employeeService.deleteEmployee(employee.id);
        toast.success("Employee deleted successfully");
        fetchEmployees();
      } catch (error) {
        toast.error("Failed to delete employee");
      }
    }
  };

  if (isLoading && data.length === 0) {
    return (
      <div className="p-4 sm:p-6 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Filters Section */}
      <div className="mb-6">
        <EmployeeFilters
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          designationFilter={designationFilter}
          setDesignationFilter={setDesignationFilter}
          statuses={statuses}
          designations={designations}
          onClearFilters={clearFilters}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="min-w-[800px] md:min-w-full">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="border-b border-gray-200 dark:border-gray-700">
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-3 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300"
                      {...(header.column.getCanSort() ? {
                        onClick: header.column.getToggleSortingHandler(),
                        className: "px-3 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150"
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
                    onMouseEnter={() => setHoveredRow(row.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-3 py-2 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-3 py-8 text-center text-gray-500 dark:text-gray-400">
                    No employees found matching your filters.
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
        totalItems={totalItems}
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