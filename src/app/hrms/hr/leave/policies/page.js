"use client";
import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import Breadcrumb from '@/components/common/Breadcrumb';
import PoliciesHeader from './comopnents/PoliciesHeader';
import PoliciesTable from './comopnents/PoliciesTable';
import Link from 'next/link';

// Mock data for leave policies
const initialPolicies = [
  {
    id: 1,
    name: "Annual Leave Policy",
    description: "Standard annual leave policy for all employees",
    effectiveDate: "2023-01-01",
    status: "active",
    applicableTo: "all_employees",
    accrualMethod: "monthly",
    maxAccrual: 21,
    carryOverLimit: 5,
    encashment: true,
    requiresApproval: true,
    attachmentRequired: false,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "Sick Leave Policy",
    description: "Policy for sick leaves and medical appointments",
    effectiveDate: "2023-01-01",
    status: "active",
    applicableTo: "all_employees",
    accrualMethod: "monthly",
    maxAccrual: 14,
    carryOverLimit: 10,
    encashment: false,
    requiresApproval: false,
    attachmentRequired: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: 3,
    name: "Maternity Leave Policy",
    description: "Policy for maternity leave and childcare",
    effectiveDate: "2023-01-01",
    status: "active",
    applicableTo: "female_employees",
    accrualMethod: "one_time",
    maxAccrual: 90,
    carryOverLimit: 0,
    encashment: false,
    requiresApproval: true,
    attachmentRequired: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: 4,
    name: "Paternity Leave Policy",
    description: "Policy for paternity leave",
    effectiveDate: "2023-06-01",
    status: "draft",
    applicableTo: "male_employees",
    accrualMethod: "one_time",
    maxAccrual: 14,
    carryOverLimit: 0,
    encashment: false,
    requiresApproval: true,
    attachmentRequired: true,
    createdAt: "2023-05-15T00:00:00Z",
    updatedAt: "2023-05-15T00:00:00Z"
  },
  {
    id: 5,
    name: "Emergency Leave Policy",
    description: "Policy for emergency situations",
    effectiveDate: "2024-01-01",
    status: "pending",
    applicableTo: "all_employees",
    accrualMethod: "yearly",
    maxAccrual: 5,
    carryOverLimit: 0,
    encashment: false,
    requiresApproval: true,
    attachmentRequired: true,
    createdAt: "2023-11-01T00:00:00Z",
    updatedAt: "2023-11-01T00:00:00Z"
  }
];

export default function LeavePolicies() {
  const [policies, setPolicies] = useState(initialPolicies);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || policy.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDeletePolicy = (policyId) => {
    setPolicies(policies.filter(policy => policy.id !== policyId));
  };

  const handleStatusChange = (policyId, newStatus) => {
    setPolicies(policies.map(policy => 
      policy.id === policyId 
        ? { ...policy, status: newStatus, updatedAt: new Date().toISOString() }
        : policy
    ));
  };

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-6">
      <Breadcrumb
        pages={[
          { name: 'HR', href: '/hr' },
          { name: 'Leave', href: '/hr/leave' },
          { name: 'Policies', href: '#' },
        ]}
        rightContent={
          <Link
            href="/hr/leave/policies/add"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
          >
            <PlusCircle size={18} /> Add Policy
          </Link>
        }
      />

      <PoliciesHeader 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        totalPolicies={filteredPolicies.length}
      />
      
      <div className="mt-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <PoliciesTable 
          policies={filteredPolicies}
          onDeletePolicy={handleDeletePolicy}
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
}