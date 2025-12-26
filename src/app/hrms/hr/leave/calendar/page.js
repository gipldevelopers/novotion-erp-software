"use client";
import { useState, useMemo } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import LeaveCalendarHeader from './components/LeaveCalendarHeader';
import FullPageCalendar from './components/FullPageCalendar';
import CalendarFilters from './components/CalendarFilters';
import LeaveDetailsModal from './components/LeaveDetailsModal';
import QuickStats from './components/QuickStats';

// Enhanced mock data for leave calendar
const initialLeaves = [
  {
    id: 1,
    employeeId: 'EMP001',
    employeeName: 'Sarah Johnson',
    department: 'Engineering',
    position: 'Senior Developer',
    leaveType: 'Annual Leave',
    startDate: '2024-01-15',
    endDate: '2024-01-19',
    status: 'approved',
    days: 5,
    reason: 'Family vacation to Hawaii',
    color: '#3b82f6',
    halfDay: false,
    attachment: true,
    emergencyContact: '+1-555-0123'
  },
  {
    id: 2,
    employeeId: 'EMP002',
    employeeName: 'Michael Chen',
    department: 'Sales',
    position: 'Sales Manager',
    leaveType: 'Sick Leave',
    startDate: '2024-01-18',
    endDate: '2024-01-20',
    status: 'approved',
    days: 3,
    reason: 'Medical appointment and recovery',
    color: '#10b981',
    halfDay: false,
    attachment: true,
    doctorNote: true
  },
  {
    id: 3,
    employeeId: 'EMP003',
    employeeName: 'Emily Rodriguez',
    department: 'Marketing',
    position: 'Marketing Director',
    leaveType: 'Maternity Leave',
    startDate: '2024-01-22',
    endDate: '2024-04-22',
    status: 'approved',
    days: 90,
    reason: 'Childbirth and parental leave',
    color: '#8b5cf6',
    halfDay: false,
    attachment: true
  },
  {
    id: 4,
    employeeId: 'EMP004',
    employeeName: 'David Kim',
    department: 'Engineering',
    position: 'Frontend Developer',
    leaveType: 'Emergency Leave',
    startDate: '2024-01-10',
    endDate: '2024-01-11',
    status: 'pending',
    days: 2,
    reason: 'Family emergency - father hospitalized',
    color: '#f59e0b',
    halfDay: false,
    urgent: true
  },
  {
    id: 5,
    employeeId: 'EMP005',
    employeeName: 'Lisa Wang',
    department: 'HR',
    position: 'HR Manager',
    leaveType: 'Annual Leave',
    startDate: '2024-01-25',
    endDate: '2024-02-02',
    status: 'approved',
    days: 9,
    reason: 'International holiday trip to Japan',
    color: '#3b82f6',
    halfDay: false,
    attachment: false
  },
  {
    id: 6,
    employeeId: 'EMP006',
    employeeName: 'Robert Wilson',
    department: 'Finance',
    position: 'Financial Analyst',
    leaveType: 'Sick Leave',
    startDate: '2025-09-09',
    endDate: '2025-09-09',
    status: 'approved',
    days: 3,
    reason: 'Seasonal flu and fever',
    color: '#10b981',
    halfDay: false,
    doctorNote: true
  },
  {
    id: 7,
    employeeId: 'EMP007',
    employeeName: 'Jennifer Lee',
    department: 'Operations',
    position: 'Operations Manager',
    leaveType: 'Unpaid Leave',
     startDate: '2025-09-09',
    endDate: '2025-09-09',
    status: 'pending',
    days: 8,
    reason: 'Personal reasons and family matters',
    color: '#6b7280',
    halfDay: false
  },
  {
    id: 8,
    employeeId: 'EMP008',
    employeeName: 'Daniel Thomas',
    department: 'Engineering',
    position: 'DevOps Engineer',
    leaveType: 'Annual Leave',
    startDate: '2024-01-12',
    endDate: '2024-01-12',
    status: 'approved',
    days: 1,
    reason: 'Personal day off',
    color: '#3b82f6',
    halfDay: true,
    halfDayType: 'first_half'
  },
  {
    id: 9,
    employeeId: 'EMP009',
    employeeName: 'Amanda Taylor',
    department: 'Sales',
    position: 'Sales Executive',
    leaveType: 'Sick Leave',
    startDate: '2024-01-05',
    endDate: '2024-01-05',
    status: 'approved',
    days: 1,
    reason: 'Dental appointment',
    color: '#10b981',
    halfDay: true,
    halfDayType: 'second_half'
  },
  {
    id: 10,
    employeeId: 'EMP010',
    employeeName: 'Christopher Brown',
    department: 'Marketing',
    position: 'Content Writer',
    leaveType: 'Work From Home',
    startDate: '2024-01-17',
    endDate: '2024-01-17',
    status: 'approved',
    days: 1,
    reason: 'Home maintenance work',
    color: '#6366f1',
    halfDay: false,
    wfh: true
  }
];

export default function LeaveCalendar() {
  const [filters, setFilters] = useState({
    view: 'month',
    department: 'all',
    status: 'all',
    leaveType: 'all',
    employee: 'all'
  });
  
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleLeaveClick = (leave) => {
    setSelectedLeave(leave);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLeave(null);
  };

  const handleStatusUpdate = (leaveId, newStatus) => {
    // In a real app, you would update the leave status via API
    console.log(`Updating leave ${leaveId} to status: ${newStatus}`);
    setIsModalOpen(false);
  };

  const filteredLeaves = useMemo(() => {
    return initialLeaves.filter(leave => {
      const matchesDepartment = filters.department === 'all' || leave.department === filters.department;
      const matchesStatus = filters.status === 'all' || leave.status === filters.status;
      const matchesLeaveType = filters.leaveType === 'all' || leave.leaveType === filters.leaveType;
      const matchesSearch = searchTerm === '' || 
        leave.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesDepartment && matchesStatus && matchesLeaveType && matchesSearch;
    });
  }, [filters, searchTerm]);

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-6">
      <Breadcrumb
        pages={[
          { name: 'HR', href: '/hr' },
          { name: 'Leave', href: '/hr/leave' },
          { name: 'Calendar', href: '#' },
        ]}
      />

      <LeaveCalendarHeader 
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        view={filters.view}
        onViewChange={(view) => setFilters({ ...filters, view })}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      <QuickStats leaves={filteredLeaves} />
      
      <div className="mt-6">
        <CalendarFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
          leaves={initialLeaves}
        />
      </div>

      <div className="mt-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <FullPageCalendar
          leaves={filteredLeaves}
          currentDate={currentDate}
          view={filters.view}
          onLeaveClick={handleLeaveClick}
          onDateChange={setCurrentDate}
        />
      </div>

      {isModalOpen && selectedLeave && (
        <LeaveDetailsModal
          leave={selectedLeave}
          onClose={handleCloseModal}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}