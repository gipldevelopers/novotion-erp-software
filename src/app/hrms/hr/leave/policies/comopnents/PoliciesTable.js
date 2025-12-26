"use client";
import { useState } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Edit, 
  Trash2, 
  MoreVertical,
  Eye,
  FileText,
  Calendar,
  Users,
  Clock,
  IndianRupee,
  CheckCircle,
  XCircle
} from 'lucide-react';
import PolicyStatusBadge from './PolicyStatusBadge';
import Link from 'next/link';

const PoliciesTable = ({ policies, onDeletePolicy, onStatusChange }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [actionMenu, setActionMenu] = useState(null);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedPolicies = [...policies].sort((a, b) => {
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

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <div className="ml-1 flex flex-col"><ChevronUp className="w-3 h-3 -mb-0.5 text-gray-400" /><ChevronDown className="w-3 h-3 -mt-0.5 text-gray-400" /></div>;
    }
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="ml-1 w-4 h-4 text-blue-500" /> : 
      <ChevronDown className="ml-1 w-4 h-4 text-blue-500" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getApplicableToLabel = (value) => {
    const mapping = {
      'all_employees': 'All Employees',
      'full_time': 'Full-time Only',
      'part_time': 'Part-time Only',
      'male_employees': 'Male Employees',
      'female_employees': 'Female Employees',
      'permanent': 'Permanent Staff',
      'contract': 'Contract Staff'
    };
    return mapping[value] || value;
  };

  const getAccrualMethodLabel = (value) => {
    const mapping = {
      'monthly': 'Monthly',
      'yearly': 'Yearly',
      'quarterly': 'Quarterly',
      'one_time': 'One-time',
      'hourly': 'Hourly'
    };
    return mapping[value] || value;
  };

  const handleStatusUpdate = (policyId, newStatus) => {
    onStatusChange(policyId, newStatus);
    setActionMenu(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center">
                Policy Name
                <SortIcon columnKey="name" />
              </div>
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('status')}
            >
              <div className="flex items-center">
                Status
                <SortIcon columnKey="status" />
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Applicable To
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Accrual
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Max Days
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('effectiveDate')}
            >
              <div className="flex items-center">
                Effective Date
                <SortIcon columnKey="effectiveDate" />
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {sortedPolicies.map((policy) => (
            <tr key={policy.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-6 py-4">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {policy.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {policy.description}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <PolicyStatusBadge status={policy.status} />
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                {getApplicableToLabel(policy.applicableTo)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                {getAccrualMethodLabel(policy.accrualMethod)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                {policy.maxAccrual} days
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                {formatDate(policy.effectiveDate)}
              </td>
              <td className="px-6 py-4 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/hr/leave/policies/edit/${policy.id}`}
                    className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    title="Edit Policy"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  
                  <div className="relative">
                    <button
                      onClick={() => setActionMenu(actionMenu === policy.id ? null : policy.id)}
                      className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                      title="More Actions"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    
                    {actionMenu === policy.id && (
                      <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                        <div className="py-1">
                          <button
                            onClick={() => handleStatusUpdate(policy.id, 'active')}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                            Mark Active
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(policy.id, 'draft')}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <FileText className="w-4 h-4 mr-2 text-blue-600" />
                            Mark Draft
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(policy.id, 'archived')}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <XCircle className="w-4 h-4 mr-2 text-red-600" />
                            Archive
                          </button>
                          <hr className="my-1 border-gray-200 dark:border-gray-700" />
                          <button
                            onClick={() => {
                              onDeletePolicy(policy.id);
                              setActionMenu(null);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {sortedPolicies.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No policies found</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default PoliciesTable;