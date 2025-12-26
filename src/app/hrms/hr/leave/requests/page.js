"use client";
import { PlusCircle } from 'lucide-react';
import LeaveRequestsTable from '../components/LeaveRequestsTable';
import LeaveRequestsStatsCards from '../components/LeaveRequestsStatsCards';
import Breadcrumb from '@/components/common/Breadcrumb';
import Link from 'next/link';

export default function LeaveRequests() {
  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-6">
      {/* Breadcrumb with Add Leave Request button */}
      <Breadcrumb
        pages={[
          { name: 'HR', href: '/hr' },
          { name: 'Leave', href: '/hr/leave' },
          { name: 'Requests', href: '#' },
        ]}
        rightContent={
          <Link
            href="/hr/leave/requests/add"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
          >
            <PlusCircle size={18} /> Add Leave Request
          </Link>
        }
      />

      <LeaveRequestsStatsCards />
      
      <div className="bg-white rounded-lg shadow dark:bg-gray-800 mt-6">
        <LeaveRequestsTable />
      </div>
    </div>
  );
}