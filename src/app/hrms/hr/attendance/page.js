// src/app/(dashboard)/hr/employees/page.js
"use client";
import Breadcrumb from '@/components/common/Breadcrumb';
import AttendanceStatsCards from './components/AttendanceStatsCards';
import { useState } from 'react';
import AttendanceTable from './components/AttendanceTable';
import BreadcrumbRightContent from './components/BreadcrumbRightContent';

export default function AttendanceDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-4 sm:p-6">
      {/* Breadcrumb with Date Filter and Actions */}
      <Breadcrumb
        title="Attendance Dashboard"
        subtitle="Overview of today's attendance statistics and patterns"
        rightContent={
          <BreadcrumbRightContent 
            selectedDate={selectedDate} 
            setSelectedDate={setSelectedDate} 
          />
        }
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Attendance Stats Cards */}
          <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-6">
            <AttendanceStatsCards selectedDate={selectedDate} />
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow dark:bg-gray-800">
        <AttendanceTable />
      </div>
    </div>
  );
}