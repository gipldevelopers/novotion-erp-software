// src/app/(dashboard)/hr/assets/maintenance/page.js
"use client";
import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, Eye, Edit, Trash2, Calendar, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import Breadcrumb from '@/components/common/Breadcrumb';
import Link from 'next/link';

export default function MaintenanceHistory() {
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    search: ''
  });

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockRecords = [
      {
        id: 'MTN-001',
        assetId: 'AST-001',
        assetName: 'Dell Latitude 5420',
        maintenanceDate: '2023-06-15',
        maintenanceType: 'preventive',
        cost: 120,
        technician: 'Tech Solutions Inc.',
        description: 'Routine hardware check and cleaning',
        nextMaintenanceDate: '2023-09-15',
        status: 'completed',
        createdAt: '2023-06-15'
      },
      {
        id: 'MTN-002',
        assetId: 'AST-002',
        assetName: 'iPhone 13 Pro',
        maintenanceDate: '2023-07-20',
        maintenanceType: 'corrective',
        cost: 85,
        technician: 'Mobile Repair Center',
        description: 'Screen replacement',
        nextMaintenanceDate: '2024-01-20',
        status: 'completed',
        createdAt: '2023-07-20'
      },
      {
        id: 'MTN-003',
        assetId: 'AST-005',
        assetName: 'MacBook Pro 16"',
        maintenanceDate: '2023-09-10',
        maintenanceType: 'preventive',
        cost: 150,
        technician: 'Apple Authorized Service',
        description: 'Battery replacement and system diagnostics',
        nextMaintenanceDate: '2024-03-10',
        status: 'completed',
        createdAt: '2023-09-10'
      },
      {
        id: 'MTN-004',
        assetId: 'AST-001',
        assetName: 'Dell Latitude 5420',
        maintenanceDate: '2023-12-05',
        maintenanceType: 'preventive',
        cost: 0,
        technician: 'Internal IT Team',
        description: 'Scheduled software update and optimization',
        nextMaintenanceDate: '2024-03-05',
        status: 'scheduled',
        createdAt: '2023-11-20'
      }
    ];
    setMaintenanceRecords(mockRecords);
    setLoading(false);
  }, []);

  const filteredRecords = maintenanceRecords.filter(record => {
    if (filters.status !== 'all' && record.status !== filters.status) return false;
    if (filters.type !== 'all' && record.maintenanceType !== filters.type) return false;
    if (filters.search && 
        !record.assetName.toLowerCase().includes(filters.search.toLowerCase()) &&
        !record.technician.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const handleDeleteRecord = (recordId) => {
    if (confirm('Are you sure you want to delete this maintenance record?')) {
      setMaintenanceRecords(maintenanceRecords.filter(record => record.id !== recordId));
    }
  };

  const statusColors = {
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  };

  const typeColors = {
    preventive: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    corrective: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    emergency: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
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
              href="/hr/assets/maintenance/add"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
            >
              <Plus size={18} /> Add Record
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
                  placeholder="Search maintenance records..."
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
                <option value="completed">Completed</option>
                <option value="scheduled">Scheduled</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">All Types</option>
                <option value="preventive">Preventive</option>
                <option value="corrective">Corrective</option>
                <option value="emergency">Emergency</option>
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
                  Maintenance Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  Technician
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  Next Maintenance
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
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {record.assetName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {record.assetId}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {record.maintenanceDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeColors[record.maintenanceType]}`}>
                      {record.maintenanceType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {record.technician}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    ${record.cost}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {record.nextMaintenanceDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[record.status]}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                        <Eye className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/hr/assets/maintenance/edit/${record.id}`}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleDeleteRecord(record.id)}
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

        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No maintenance records found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {filters.search ? 'Try adjusting your search term' : 'Get started by adding a maintenance record'}
            </p>
            {!filters.search && (
              <div className="mt-6">
                <Link
                  href="/hr/assets/maintenance/add"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
                >
                  <Plus size={18} /> Add Record
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-400">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredRecords.length}</span> of{' '}
              <span className="font-medium">{filteredRecords.length}</span> results
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
    </div>
  );
}