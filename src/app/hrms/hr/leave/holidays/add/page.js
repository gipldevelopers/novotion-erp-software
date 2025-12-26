"use client";
import Breadcrumb from '@/components/common/Breadcrumb';
import HolidayForm from '../components/HolidayForm';

export default function AddHolidayPage() {
  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-6">
      <Breadcrumb
        pages={[
          { name: 'HR', href: '/hr' },
          { name: 'Leave', href: '/hr/leave' },
          { name: 'Holidays', href: '/hr/leave/holidays' },
          { name: 'Add Holiday', href: '#' },
        ]}
        rightContent={null}
      />
      
      <div className="bg-white rounded-lg shadow dark:bg-gray-800 mt-6">
        <HolidayForm />
      </div>
    </div>
  );
}