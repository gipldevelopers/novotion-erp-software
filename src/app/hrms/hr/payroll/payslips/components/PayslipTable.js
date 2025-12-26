// src/app/(dashboard)/hr/payroll/payslips/components/PayslipTable.js
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
import { ChevronUp, ChevronDown, Eye, Download, Mail, FileText } from 'lucide-react';
import Pagination from '@/components/common/Pagination';
import PayslipFilters from './PayslipFilters';

// Mock data for payslips
const defaultData = [
  {
    id: 'PS-2023-12-001',
    employee: 'Lori Broaddus',
    employeeId: 'Emp-010',
    period: 'December 2023',
    issueDate: '2023-12-31',
    basicSalary: 5000,
    allowances: 4000,
    deductions: 800,
    netSalary: 8200,
    status: 'Paid',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 'PS-2023-12-002',
    employee: 'John Smith',
    employeeId: 'Emp-011',
    period: 'December 2023',
    issueDate: '2023-12-31',
    basicSalary: 4000,
    allowances: 3200,
    deductions: 600,
    netSalary: 6600,
    status: 'Paid',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 'PS-2023-12-003',
    employee: 'Sarah Johnson',
    employeeId: 'Emp-012',
    period: 'December 2023',
    issueDate: '2023-12-31',
    basicSalary: 4500,
    allowances: 3600,
    deductions: 700,
    netSalary: 7400,
    status: 'Paid',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 'PS-2023-11-001',
    employee: 'Lori Broaddus',
    employeeId: 'Emp-010',
    period: 'November 2023',
    issueDate: '2023-11-30',
    basicSalary: 5000,
    allowances: 4000,
    deductions: 800,
    netSalary: 8200,
    status: 'Paid',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 'PS-2023-11-002',
    employee: 'John Smith',
    employeeId: 'Emp-011',
    period: 'November 2023',
    issueDate: '2023-11-30',
    basicSalary: 4000,
    allowances: 3200,
    deductions: 600,
    netSalary: 6600,
    status: 'Paid',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 'PS-2023-12-004',
    employee: 'Michael Brown',
    employeeId: 'Emp-013',
    period: 'December 2023',
    issueDate: '2023-12-31',
    basicSalary: 6000,
    allowances: 4800,
    deductions: 900,
    netSalary: 9900,
    status: 'Pending',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 'PS-2023-12-005',
    employee: 'Emily Davis',
    employeeId: 'Emp-014',
    period: 'December 2023',
    issueDate: '2023-12-31',
    basicSalary: 4200,
    allowances: 3360,
    deductions: 630,
    netSalary: 6930,
    status: 'Paid',
    paymentMethod: 'Check'
  },
];

export default function PayslipTable() {
  const [data, setData] = useState(defaultData);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Payslip ID',
        cell: info => <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{info.getValue()}</span>,
      },
      {
        accessorKey: 'employee',
        header: 'Employee',
        cell: info => (
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">{info.getValue()}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{info.row.original.employeeId}</div>
          </div>
        ),
      },
      {
        accessorKey: 'period',
        header: 'Period',
        cell: info => <span className="text-sm text-gray-600 dark:text-gray-400">{info.getValue()}</span>,
      },
      {
        accessorKey: 'issueDate',
        header: 'Issue Date',
        cell: info => <span className="text-sm text-gray-600 dark:text-gray-400">{info.getValue()}</span>,
      },
      {
        accessorKey: 'basicSalary',
        header: 'Basic Salary',
        cell: info => <span className="text-sm font-medium text-gray-900 dark:text-white">${info.getValue()}</span>,
      },
      {
        accessorKey: 'netSalary',
        header: 'Net Salary',
        cell: info => <span className="text-sm font-bold text-green-600 dark:text-green-400">${info.getValue()}</span>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: info => {
          const status = info.getValue();
          let statusClass = '';
          if (status === 'Paid') {
            statusClass = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
          } else if (status === 'Pending') {
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
        accessorKey: 'paymentMethod',
        header: 'Payment Method',
        cell: info => <span className="text-sm text-gray-600 dark:text-gray-400">{info.getValue()}</span>,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: info => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleView(info.row.original)}
              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
              title="View Payslip"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDownload(info.row.original)}
              className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all duration-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
              title="Download PDF"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleEmail(info.row.original)}
              className="p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-all duration-200 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50"
              title="Email Payslip"
            >
              <Mail className="w-4 h-4" />
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
      result = result.filter(payslip => 
        payslip.employee.toLowerCase().includes(searchTerm) ||
        payslip.employeeId.toLowerCase().includes(searchTerm) ||
        payslip.id.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(payslip => payslip.status === statusFilter);
    }
    
    // Apply period filter
    if (periodFilter !== 'all') {
      result = result.filter(payslip => payslip.period === periodFilter);
    }
    
    return result;
  }, [data, globalFilter, statusFilter, periodFilter]);

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

  const periods = useMemo(() => {
    const uniquePeriods = new Set(data.map(item => item.period));
    return ['all', ...Array.from(uniquePeriods)];
  }, [data]);

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter('all');
    setPeriodFilter('all');
    setGlobalFilter('');
  };

  // Handle actions
  const handleView = (payslip) => {
    console.log('View payslip:', payslip);
    // In a real app, this would open a modal or navigate to a detailed view
  };

  const handleDownload = (payslip) => {
    console.log('Download payslip:', payslip);
    // In a real app, this would generate and download a PDF
  };

  const handleEmail = (payslip) => {
    console.log('Email payslip:', payslip);
    // In a real app, this would send the payslip via email
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header with stats */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Employee Payslips</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage and distribute employee payslips
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg dark:bg-blue-900/30 dark:text-blue-400">
          <FileText size={18} />
          <span className="font-medium">Total: {data.length} payslips</span>
        </div>
      </div>

      {/* Filters Section */}
      <div className="mb-6">
        <PayslipFilters
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          periodFilter={periodFilter}
          setPeriodFilter={setPeriodFilter}
          statuses={statuses}
          periods={periods}
          onClearFilters={clearFilters}
        />
      </div>

      {/* Results Count */}
      {/* <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredData.length} of {defaultData.length} payslips
        {(statusFilter !== 'all' || periodFilter !== 'all' || globalFilter) && (
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
                    No payslips found matching your filters.
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