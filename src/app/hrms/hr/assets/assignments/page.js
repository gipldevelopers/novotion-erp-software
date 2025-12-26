// src/app/(dashboard)/hr/assets/assignments/page.js
"use client";
import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, Eye, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import Breadcrumb from '@/components/common/Breadcrumb';
import Link from 'next/link';
import ReturnAssetModal from './components/ReturnAssetModal';

export default function AssetAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    search: ''
  });

  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockAssignments = [
      {
        id: 'ASN-001',
        assetId: 'AST-001',
        assetName: 'Dell Latitude 5420',
        assetCategory: 'Laptop',
        employeeId: 'Emp-010',
        employeeName: 'Lori Broaddus',
        assignedDate: '2023-01-20',
        expectedReturnDate: '2024-01-19',
        actualReturnDate: '',
        conditionAssigned: 'excellent',
        conditionReturned: '',
        status: 'active',
        notes: 'Assigned for remote work'
      },
      {
        id: 'ASN-002',
        assetId: 'AST-002',
        assetName: 'iPhone 13 Pro',
        assetCategory: 'Mobile Phone',
        employeeId: 'Emp-011',
        employeeName: 'John Smith',
        assignedDate: '2023-02-15',
        expectedReturnDate: '2024-02-14',
        actualReturnDate: '',
        conditionAssigned: 'good',
        conditionReturned: '',
        status: 'active',
        notes: 'For business communications'
      },
      {
        id: 'ASN-003',
        assetId: 'AST-005',
        assetName: 'MacBook Pro 16"',
        assetCategory: 'Laptop',
        employeeId: 'Emp-012',
        employeeName: 'Sarah Johnson',
        assignedDate: '2022-11-10',
        expectedReturnDate: '2023-11-09',
        actualReturnDate: '2023-06-15',
        conditionAssigned: 'excellent',
        conditionReturned: 'good',
        status: 'returned',
        notes: 'Returned upon promotion and new device assignment'
      }
    ];
    setAssignments(mockAssignments);
    setLoading(false);
  }, []);

  const filteredAssignments = assignments.filter(assignment => {
    if (filters.status !== 'all' && assignment.status !== filters.status) return false;
    if (filters.search && 
        !assignment.assetName.toLowerCase().includes(filters.search.toLowerCase()) &&
        !assignment.employeeName.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

//   const handleReturnAsset = (assignmentId) => {
//     if (confirm('Are you sure you want to mark this asset as returned?')) {
//       setAssignments(assignments.map(assignment => 
//         assignment.id === assignmentId 
//           ? { ...assignment, status: 'returned', actualReturnDate: new Date().toISOString().split('T')[0] }
//           : assignment
//       ));
//     }
//   };

  const handleDeleteAssignment = (assignmentId) => {
    if (confirm('Are you sure you want to delete this assignment record?')) {
      setAssignments(assignments.filter(assignment => assignment.id !== assignmentId));
    }
  };

  const handleOpenReturnModal = (assignment) => {
    setSelectedAssignment(assignment);
    setReturnModalOpen(true);
  };

  const handleReturnAsset = (assignmentId, returnData) => {
    setAssignments(assignments.map(assignment => 
      assignment.id === assignmentId 
        ? { 
            ...assignment, 
            status: 'returned', 
            actualReturnDate: returnData.returnDate,
            conditionReturned: returnData.conditionReturned,
            notes: returnData.notes ? `${assignment.notes}\nReturn notes: ${returnData.notes}` : assignment.notes
          }
        : assignment
    ));
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    returned: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-4 sm:p-6">
        <Breadcrumb />
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-4 sm:p-6">
      <Breadcrumb
        rightContent={
          <div className="flex gap-2">
            <Link
              href="/hr/assets/assignments/assign"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
            >
              <Plus size={18} /> Assign Asset
            </Link>
            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700">
              <Download size={18} /> Export
            </button>
          </div>
        }
      />

      <div className="bg-white rounded-lg shadow dark:bg-gray-800">
        {/* Filters */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search assignments..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="returned">Returned</option>
                <option value="overdue">Overdue</option>
              </select>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  Asset
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  Assigned Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  Expected Return
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  Condition
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {filteredAssignments.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {assignment.assetName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {assignment.assetCategory}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {assignment.employeeName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {assignment.employeeId}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {assignment.assignedDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {assignment.expectedReturnDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      {assignment.conditionAssigned}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[assignment.status]}`}>
                      {assignment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                        <Eye className="w-4 h-4" />
                      </button>
                      {assignment.status === 'active' && (
                        <button 
                          onClick={() => handleOpenReturnModal(assignment)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          title="Mark as returned"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteAssignment(assignment.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAssignments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No assignments found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {filters.search ? 'Try adjusting your search term' : 'Get started by assigning an asset to an employee'}
            </p>
            {!filters.search && (
              <div className="mt-6">
                <Link
                  href="/hr/assets/assignments/assign"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
                >
                  <Plus size={18} /> Assign Asset
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-400">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredAssignments.length}</span> of{' '}
              <span className="font-medium">{filteredAssignments.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600">
                Previous
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

       <ReturnAssetModal
        assignment={selectedAssignment}
        isOpen={returnModalOpen}
        onClose={() => setReturnModalOpen(false)}
        onReturn={handleReturnAsset}
        />
    </div>
  );
}