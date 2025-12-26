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
import { ChevronUp, ChevronDown, Eye, Edit, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import Pagination from '@/components/common/Pagination';
import LeaveRequestsFilters from './LeaveRequestsFilters';
import EditLeaveModal from './EditLeaveModal';
import { useRouter } from 'next/navigation';

// Mock data for leave requests
const defaultData = [
  {
    id: 'LR-001',
    employeeId: '01',
    employeeName: 'Willie Torres',
    leaveType: 'Medical Leave',
    reason: 'Going to Hospital',
    days: 2,
    fromDate: '11 Oct, 2023',
    toDate: '12 Oct, 2023',
    status: 'approved',
    image: '/images/users/user-01.png',
  },
  {
    id: 'LR-002',
    employeeId: '02',
    employeeName: 'Sarah Johnson',
    leaveType: 'Vacation',
    reason: 'Family trip',
    days: 5,
    fromDate: '15 Oct, 2023',
    toDate: '19 Oct, 2023',
    status: 'pending',
    image: '/images/users/user-02.png',
  },
  {
    id: 'LR-003',
    employeeId: '03',
    employeeName: 'Michael Chen',
    leaveType: 'Sick Leave',
    reason: 'Fever and cold',
    days: 1,
    fromDate: '10 Oct, 2023',
    toDate: '10 Oct, 2023',
    status: 'approved',
    image: '/images/users/user-03.png',
  },
  {
    id: 'LR-004',
    employeeId: '04',
    employeeName: 'Emily Rodriguez',
    leaveType: 'Personal Leave',
    reason: 'Personal matters',
    days: 3,
    fromDate: '20 Oct, 2023',
    toDate: '22 Oct, 2023',
    status: 'rejected',
    image: '/images/users/user-04.png',
  },
  {
    id: 'LR-005',
    employeeId: '05',
    employeeName: 'David Kim',
    leaveType: 'Emergency Leave',
    reason: 'Family emergency',
    days: 2,
    fromDate: '08 Oct, 2023',
    toDate: '09 Oct, 2023',
    status: 'approved',
    image: '/images/users/user-05.jpg',
  },
  {
    id: 'LR-006',
    employeeId: '06',
    employeeName: 'Lisa Wang',
    leaveType: 'Maternity Leave',
    reason: 'Childbirth',
    days: 90,
    fromDate: '01 Feb, 2024',
    toDate: '01 May, 2024',
    status: 'pending',
    image: '/images/users/user-06.jpg',
  },
  {
    id: 'LR-007',
    employeeId: '07',
    employeeName: 'Robert Wilson',
    leaveType: 'Paternity Leave',
    reason: 'Newborn child',
    days: 15,
    fromDate: '15 Mar, 2024',
    toDate: '29 Mar, 2024',
    status: 'approved',
    image: '/images/users/user-07.jpg',
  },
  {
    id: 'LR-008',
    employeeId: '08',
    employeeName: 'Jennifer Lee',
    leaveType: 'Sick Leave',
    reason: 'Medical procedure',
    days: 3,
    fromDate: '05 Apr, 2024',
    toDate: '07 Apr, 2024',
    status: 'pending',
    image: '/images/users/user-08.jpg',
  },
  {
    id: 'LR-009',
    employeeId: '09',
    employeeName: 'Daniel Thomas',
    leaveType: 'Vacation',
    reason: 'Holiday break',
    days: 7,
    fromDate: '20 Dec, 2023',
    toDate: '26 Dec, 2023',
    status: 'approved',
    image: '/images/users/user-09.jpg',
  },
  {
    id: 'LR-010',
    employeeId: '10',
    employeeName: 'Amanda Taylor',
    leaveType: 'Personal Leave',
    reason: 'Moving houses',
    days: 2,
    fromDate: '18 Nov, 2023',
    toDate: '19 Nov, 2023',
    status: 'rejected',
    image: '/images/users/user-10.jpg',
  },
];

export default function LeaveRequestsTable() {
  const router = useRouter();
  const [data, setData] = useState(defaultData);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [leaveTypeFilter, setLeaveTypeFilter] = useState('all');
   const [dateRange, setDateRange] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredAction, setHoveredAction] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

   // Add this function to handle editing
  const handleEdit = (request) => {
    setSelectedRequest(request);
    setEditModalOpen(true);
  };

    // Add this function to save edits
  const handleSaveEdit = (updatedRequest) => {
    setData(data.map(req => 
      req.id === updatedRequest.id ? { ...req, ...updatedRequest } : req
    ));
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Request ID',
        cell: info => <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{info.getValue()}</span>,
      },
      {
        accessorKey: 'employeeName',
        header: 'Employee Name',
        cell: info => (
          <div className="flex items-center">
            <img 
              src={info.row.original.image} 
              alt={info.getValue()}
              className="w-8 h-8 rounded-full mr-3 object-cover"
            />
            <div>
              <span className="text-sm font-medium text-gray-900 dark:text-white block">{info.getValue()}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">ID: {info.row.original.employeeId}</span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'leaveType',
        header: 'Leave Type',
        cell: info => <span className="text-sm text-gray-600 dark:text-gray-400">{info.getValue()}</span>,
      },
      {
        accessorKey: 'reason',
        header: 'Reason',
        cell: info => <span className="text-sm text-gray-600 dark:text-gray-400">{info.getValue()}</span>,
      },
      {
        accessorKey: 'days',
        header: 'No Of Days',
        cell: info => <span className="text-sm font-medium text-gray-900 dark:text-white">{info.getValue()}</span>,
      },
      {
        accessorKey: 'fromDate',
        header: 'From',
        cell: info => <span className="text-sm text-gray-600 dark:text-gray-400">{info.getValue()}</span>,
      },
      {
        accessorKey: 'toDate',
        header: 'To',
        cell: info => <span className="text-sm text-gray-600 dark:text-gray-400">{info.getValue()}</span>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: info => {
          const status = info.getValue();
          let statusClass = '';
          let statusIcon = null;
          
          if (status === 'approved') {
            statusClass = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            statusIcon = <CheckCircle className="w-3 h-3 mr-1" />;
          } else if (status === 'pending') {
            statusClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            statusIcon = <Clock className="w-3 h-3 mr-1" />;
          } else {
            statusClass = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            statusIcon = <XCircle className="w-3 h-3 mr-1" />;
          }
          
          return (
            <span className={`px-2.5 py-0.5 rounded-xs text-xs font-medium flex items-center ${statusClass}`}>
              {statusIcon}
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          );
        },
      },
     {
  id: 'actions',
  header: 'Actions',
  cell: info => {
    const status = info.row.original.status;
    const isApproved = status === 'approved';
    const isRejected = status === 'rejected';
    const isPending = status === 'pending';
    
    return (
      <div className="flex items-center gap-2">
          {/* Edit Button */}
           <button
  onMouseEnter={() => setHoveredAction(`${info.row.id}-edit`)}
  onMouseLeave={() => setHoveredAction(null)}
  onClick={() => router.push(`/hr/leave/requests/edit/${info.row.original.id}`)}
  className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 group relative"
  title="Edit"
>
  <Edit className="w-4 h-4" />
  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
    Edit
  </span>
</button>

          {/* Approve Button */}
        <button
          onMouseEnter={() => setHoveredAction(`${info.row.id}-approve`)}
          onMouseLeave={() => setHoveredAction(null)}
          onClick={() => handleApprove(info.row.original)}
          className={`p-2 rounded-lg transition-all duration-200 group relative ${
            isApproved 
              ? 'bg-green-100 text-green-400 cursor-not-allowed dark:bg-green-900/20' 
              : isRejected
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500'
              : 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50'
          }`}
          title={isApproved ? 'Already approved' : isRejected ? 'Cannot approve rejected request' : 'Approve'}
          disabled={isApproved || isRejected}
        >
          <CheckCircle className="w-4 h-4" />
          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            {isApproved ? 'Already approved' : isRejected ? 'Cannot approve' : 'Approve'}
          </span>
        </button>

        {/* Reject Button */}
        <button
          onMouseEnter={() => setHoveredAction(`${info.row.id}-reject`)}
          onMouseLeave={() => setHoveredAction(null)}
          onClick={() => openRejectModal(info.row.original)}
          className={`p-2 rounded-lg transition-all duration-200 group relative ${
            isRejected 
              ? 'bg-red-100 text-red-400 cursor-not-allowed dark:bg-red-900/20' 
              : isApproved
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500'
              : 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50'
          }`}
          title={isRejected ? 'Already rejected' : isApproved ? 'Cannot reject approved request' : 'Reject'}
          disabled={isRejected || isApproved}
        >
          <XCircle className="w-4 h-4" />
          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            {isRejected ? 'Already rejected' : isApproved ? 'Cannot reject' : 'Reject'}
          </span>
        </button>
      </div>
    );
  },
  enableSorting: false,
}
    ],
    []
  );

   // Helper function to parse date strings from the mock data
  const parseDate = (dateStr) => {
    const months = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };
    
    const parts = dateStr.split(' ');
    const day = parseInt(parts[0]);
    const month = months[parts[1]];
    const year = parseInt(parts[2]);
    
    return new Date(year, month, day);
  };

  // Apply all filters and return filtered data
  const filteredData = useMemo(() => {
    let result = [...data];
    
    // Apply global search filter
     if (globalFilter) {
      const searchTerm = globalFilter.toLowerCase();
      result = result.filter(request => 
        request.employeeName.toLowerCase().includes(searchTerm) ||
        request.leaveType.toLowerCase().includes(searchTerm) ||
        request.reason.toLowerCase().includes(searchTerm) ||
        request.id.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(request => request.status === statusFilter);
    }
    
    // Apply leave type filter
    if (leaveTypeFilter !== 'all') {
      result = result.filter(request => request.leaveType === leaveTypeFilter);
    }

     // Apply date range filter
    if (dateRange.length === 2) {
      const [startDate, endDate] = dateRange;
      result = result.filter(request => {
        const fromDate = parseDate(request.fromDate);
        const toDate = parseDate(request.toDate);
        
        // Check if the leave request overlaps with the selected date range
        return (fromDate <= endDate && toDate >= startDate);
      });
    }
    
    return result;
  }, [data, globalFilter, statusFilter, leaveTypeFilter, dateRange]);

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
    const uniqueStatuses = new Set(data.map(req => req.status));
    return ['all', ...Array.from(uniqueStatuses)];
  }, [data]);

  const leaveTypes = useMemo(() => {
    const uniqueLeaveTypes = new Set(data.map(req => req.leaveType));
    return ['all', ...Array.from(uniqueLeaveTypes)];
  }, [data]);

  // Clear all filters
 const clearFilters = () => {
    setStatusFilter('all');
    setLeaveTypeFilter('all');
    setDateRange([]);
    setGlobalFilter('');
  };

    // Handle actions
  const handleApprove = (request) => {
    setData(data.map(req => 
      req.id === request.id ? { ...req, status: 'approved' } : req
    ));
  };

  const openRejectModal = (request) => {
    setSelectedRequest(request);
    setRejectionReason('');
    setRejectModalOpen(true);
  };

  const closeRejectModal = () => {
    setRejectModalOpen(false);
    setSelectedRequest(null);
    setRejectionReason('');
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setData(data.map(req => 
      req.id === selectedRequest.id 
        ? { ...req, status: 'rejected', rejectionReason: rejectionReason.trim() } 
        : req
    ));
    
    closeRejectModal();
  };


  return (
    <div className="p-4 sm:p-6">

        {/* Filters Section */}
      <div className="mb-6">
        <LeaveRequestsFilters
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          leaveTypeFilter={leaveTypeFilter}
          setLeaveTypeFilter={setLeaveTypeFilter}
          dateRange={dateRange}
          setDateRange={setDateRange}
          statuses={statuses}
          leaveTypes={leaveTypes}
          onClearFilters={clearFilters}
        />
      </div>

       {/* Results Count */}
     {/* <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredData.length} of {defaultData.length} leave requests
        {(statusFilter !== 'all' || leaveTypeFilter !== 'all' || dateRange.length > 0 || globalFilter) && (
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
                      <td key={cell.id} className="px-3 py-3 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-3 py-8 text-center text-gray-500 dark:text-gray-400">
                    No leave requests found matching your filters.
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

        {/* Add the Edit Modal */}
      <EditLeaveModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        request={selectedRequest}
        onSave={handleSaveEdit}
      />

        {rejectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Reject Leave Request
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Request from: <span className="font-medium">{selectedRequest?.employeeName}</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Leave Type: <span className="font-medium">{selectedRequest?.leaveType}</span>
              </p>
            </div>
            
            <div className="mb-4">
              <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reason for Rejection
              </label>
              <textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Please provide a reason for rejecting this leave request..."
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={closeRejectModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}