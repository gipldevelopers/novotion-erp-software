// src/app/(dashboard)/hr/attendance/components/AttendanceTable.js
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
import { ChevronUp, ChevronDown, Edit, Clock, MoreVertical } from 'lucide-react';
import Pagination from '@/components/common/Pagination';
import EditAttendanceModal from './EditAttendanceModal';
import AttendanceFilters from './AttendanceFilters';

// Mock data for attendance records
const defaultData = [
  {
    id: 'Att-001',
    employee: {
      id: 'Emp-010',
      name: 'Lori Broaddus',
      image: '/images/users/user-01.png',
      departmentId: '3', // Finance department
    },
    date: '17 Dec 2024',
    checkIn: '09:15 AM',
    checkOut: '06:30 PM',
    break: '01:00',
    late: '00:15',
    productionHours: '08:15',
    status: 'Present',
  },
  {
    id: 'Att-002',
    employee: {
      id: 'Emp-011',
      name: 'John Smith',
      image: '/images/users/user-02.png',
      departmentId: '2', // IT department
    },
    date: '17 Dec 2024',
    checkIn: '08:45 AM',
    checkOut: '05:30 PM',
    break: '00:45',
    late: '00:00',
    productionHours: '08:45',
    status: 'Present',
  },
  {
    id: 'Att-003',
    employee: {
      id: 'Emp-012',
      name: 'Sarah Johnson',
      image: '/images/users/user-03.png',
      departmentId: '1', // HR department
    },
    date: '17 Dec 2024',
    checkIn: '10:30 AM',
    checkOut: '06:45 PM',
    break: '01:00',
    late: '01:30',
    productionHours: '07:15',
    status: 'Late',
  },
  {
    id: 'Att-004',
    employee: {
      id: 'Emp-013',
      name: 'Michael Brown',
      image: '/images/users/user-04.png',
      departmentId: '2', // IT department
    },
    date: '17 Dec 2024',
    checkIn: '09:00 AM',
    checkOut: '12:30 PM',
    break: '00:30',
    late: '00:00',
    productionHours: '03:00',
    status: 'Half Day',
  },
  {
    id: 'Att-005',
    employee: {
      id: 'Emp-014',
      name: 'Emily Davis',
      image: '/images/users/user-05.jpg',
      departmentId: '4', // Marketing department
    },
    date: '17 Dec 2024',
    checkIn: '--',
    checkOut: '--',
    break: '--',
    late: '--',
    productionHours: '00:00',
    status: 'Absent',
  },
  {
    id: 'Att-006',
    employee: {
      id: 'Emp-015',
      name: 'Robert Wilson',
      image: '/images/users/user-06.jpg',
      departmentId: '10', // Administration department
    },
    date: '17 Dec 2024',
    checkIn: '08:55 AM',
    checkOut: '05:45 PM',
    break: '00:45',
    late: '00:00',
    productionHours: '08:05',
    status: 'Present',
  },
  {
    id: 'Att-007',
    employee: {
      id: 'Emp-016',
      name: 'Jennifer Lee',
      image: '/images/users/user-07.jpg',
      departmentId: '4', // Marketing department
    },
    date: '17 Dec 2024',
    checkIn: '09:10 AM',
    checkOut: '06:20 PM',
    break: '01:00',
    late: '00:10',
    productionHours: '08:10',
    status: 'Present',
  },
  {
    id: 'Att-008',
    employee: {
      id: 'Emp-017',
      name: 'David Miller',
      image: '/images/users/user-08.jpg',
      departmentId: '5', // Sales department
    },
    date: '17 Dec 2024',
    checkIn: '08:30 AM',
    checkOut: '07:15 PM',
    break: '01:15',
    late: '00:00',
    productionHours: '09:30',
    status: 'Overtime',
  },
  {
    id: 'Att-009',
    employee: {
      id: 'Emp-018',
      name: 'Amanda Taylor',
      image: '/images/users/user-09.jpg',
      departmentId: '6', // Operations department
    },
    date: '17 Dec 2024',
    checkIn: '09:05 AM',
    checkOut: '05:35 PM',
    break: '00:45',
    late: '00:05',
    productionHours: '07:45',
    status: 'Present',
  },
  {
    id: 'Att-010',
    employee: {
      id: 'Emp-019',
      name: 'Christopher Anderson',
      image: '/images/users/user-10.jpg',
      departmentId: '7', // R&D department
    },
    date: '17 Dec 2024',
    checkIn: '--',
    checkOut: '--',
    break: '--',
    late: '--',
    productionHours: '00:00',
    status: 'Leave',
  },
];

export default function AttendanceTable() {
  const [data, setData] = useState(defaultData);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [regularizingAttendance, setRegularizingAttendance] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredAction, setHoveredAction] = useState(null);

  // Function to determine if production hours are completed
  const isProductionHoursCompleted = (productionHours, status) => {
    // If status is Absent or Leave, consider it as not completed
    if (status === 'Absent' || status === 'Leave') {
      return false;
    }
    
    // Parse production hours
    if (productionHours === '--' || productionHours === '00:00') {
      return false;
    }
    
    // Convert production hours to minutes for easier comparison
    const [hours, minutes] = productionHours.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    
    // Standard full work day is considered 8 hours (480 minutes)
    // For Half Day status, consider 4 hours (240 minutes) as complete
    if (status === 'Half Day') {
      return totalMinutes >= 240;
    }
    
    // For other statuses, consider 8 hours as complete
    return totalMinutes >= 480;
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'employee',
        header: 'Employee',
        cell: info => (
          <div className="flex items-center">
            <img 
              src={info.getValue().image} 
              alt={info.getValue().name}
              className="w-8 h-8 rounded-full mr-3 object-cover"
            />
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {info.getValue().name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {info.getValue().id}
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'date',
        header: 'Date',
        cell: info => <span className="text-sm text-gray-600 dark:text-gray-400">{info.getValue()}</span>,
      },
      {
        accessorKey: 'checkIn',
        header: 'Check In',
        cell: info => <span className="text-sm text-gray-600 dark:text-gray-400">{info.getValue()}</span>,
      },
      {
        accessorKey: 'checkOut',
        header: 'Check Out',
        cell: info => <span className="text-sm text-gray-600 dark:text-gray-400">{info.getValue()}</span>,
      },
      {
        accessorKey: 'break',
        header: 'Break',
        cell: info => <span className="text-sm text-gray-600 dark:text-gray-400">{info.getValue()}</span>,
      },
      {
        accessorKey: 'late',
        header: 'Late',
        cell: info => {
          const late = info.getValue();
          if (late === '--') return <span className="text-sm text-gray-600 dark:text-gray-400">{late}</span>;
          
          return (
            <span className="text-sm text-red-600 dark:text-red-400">
              {late}
            </span>
          );
        },
      },
      {
        accessorKey: 'productionHours',
        header: 'Production Hours',
        cell: info => {
          const hours = info.getValue();
          const status = info.row.original.status;
          const isCompleted = isProductionHoursCompleted(hours, status);
          
          if (hours === '00:00' || hours === '--') {
            return (
              <div className="flex items-center">
                  <span className="
                                    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                    bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400
                  ">
                    <Clock className="w-3 h-3 text-gray-400 mr-1.5" />
                    {hours}
                  </span>
              </div>
            );
          }
          
          return (
            <div className="flex items-center">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isCompleted 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                <Clock className={`w-3 h-3 mr-1.5 ${
                  isCompleted ? 'text-green-500' : 'text-red-500'
                }`} />
                {hours}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: info => {
          const status = info.getValue();
          let statusClass = '';
          let dotColor = '';
          
          if (status === 'Present') {
            statusClass = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            dotColor = 'bg-green-500';
          } else if (status === 'Late') {
            statusClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            dotColor = 'bg-yellow-500';
          } else if (status === 'Absent') {
            statusClass = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            dotColor = 'bg-red-500';
          } else if (status === 'Half Day') {
            statusClass = 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            dotColor = 'bg-blue-500';
          } else if (status === 'Overtime') {
            statusClass = 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
            dotColor = 'bg-purple-500';
          } else if (status === 'Leave') {
            statusClass = 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
            dotColor = 'bg-gray-500';
          }
          
          return (
            <div className="flex items-center">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}`}>
                <span className={`w-1 h-1 rounded-full mr-1.5 ${dotColor}`}></span>
                {status}
              </span>
            </div>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: info => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleEdit(info.row.original)}
              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
              title="Edit Attendance"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onMouseEnter={() => setHoveredAction(`${info.row.id}-regularize`)}
              onMouseLeave={() => setHoveredAction(null)}
              onClick={() => handleRegularize(info.row.original)}
              className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all duration-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 group relative"
              title="Regularize"
            >
              <Clock className="w-4 h-4" />
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                Regularize
              </span>
            </button>
            <button
              onMouseEnter={() => setHoveredAction(`${info.row.id}-more`)}
              onMouseLeave={() => setHoveredAction(null)}
              className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all duration-200 dark:bg-gray-900/30 dark:text-gray-400 dark:hover:bg-gray-900/50 group relative"
              title="More Options"
            >
              <MoreVertical className="w-4 h-4" />
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                More
              </span>
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
      result = result.filter(record => 
        record.employee.name.toLowerCase().includes(searchTerm) ||
        record.employee.id.toLowerCase().includes(searchTerm) ||
        record.status.toLowerCase().includes(searchTerm) ||
        record.date.toLowerCase().includes(searchTerm) ||
        record.checkIn.toLowerCase().includes(searchTerm) ||
        record.checkOut.toLowerCase().includes(searchTerm) ||
        record.productionHours.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(record => record.status === statusFilter);
    }

    // Apply department filter
    if (departmentFilter !== 'all') {
      result = result.filter(record => record.employee.departmentId === departmentFilter);
    }
    
    return result;
  }, [data, globalFilter, statusFilter, departmentFilter]);

  const table = useReactTable({
    data: filteredData, // Use filteredData instead of the original data
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
    const uniqueStatuses = new Set(data.map(record => record.status));
    return ['all', ...Array.from(uniqueStatuses)];
  }, [data]);

  // Get unique departments for filter dropdown
  const departments = useMemo(() => {
    // This would typically come from your API or context
    // For now, using mock data similar to your department table
    const mockDepartments = [
      { id: 'all', name: 'All Departments' },
      { id: '1', name: 'Human Resources' },
      { id: '2', name: 'Information Technology' },
      { id: '3', name: 'Finance' },
      { id: '4', name: 'Marketing' },
      { id: '5', name: 'Sales' },
      { id: '6', name: 'Operations' },
      { id: '7', name: 'Research & Development' },
      { id: '8', name: 'Customer Service' },
      { id: '9', name: 'Quality Assurance' },
      { id: '10', name: 'Administration' },
    ];
    
    return mockDepartments;
  }, []);

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter('all');
    setDepartmentFilter('all');
    setGlobalFilter('');
  };

  // Handle actions
  const handleEdit = (attendance) => {
    setEditingAttendance(attendance);
    setIsEditModalOpen(true);
  };

  const handleRegularize = (attendance) => {
    setRegularizingAttendance(attendance);
    // setIsRegularizeModalOpen(true);
  };

  const handleSave = (updatedAttendance) => {
    setData(data.map(item => 
      item.id === updatedAttendance.id ? updatedAttendance : item
    ));
    setIsEditModalOpen(false);
    setEditingAttendance(null);
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Filters Section */}
      <div className="mb-6">
        <AttendanceFilters
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
        Showing {filteredData.length} of {defaultData.length} attendance records
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
                      className="px-3 py-4 text-left text-[15px] font-semibold text-gray-700 tracking-wider dark:text-gray-300"
                      {...(header.column.getCanSort() ? {
                        onClick: header.column.getToggleSortingHandler(),
                        className: "px-3 py-4 text-left text-[15px] font-semibold text-gray-700 tracking-wider cursor-pointer dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150"
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
                      <td key={cell.id} className="px-3 py-3 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-3 py-8 text-center text-gray-500 dark:text-gray-400">
                    No attendance records found matching your filters.
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
      <EditAttendanceModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        attendance={editingAttendance}
        onSave={handleSave}
      />
    </div>
  );
}