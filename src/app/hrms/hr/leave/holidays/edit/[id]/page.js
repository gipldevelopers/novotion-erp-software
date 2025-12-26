"use client";
import { useParams } from 'next/navigation';
import Breadcrumb from '@/components/common/Breadcrumb';
import HolidayForm from '../../components/HolidayForm';

// Mock data - replace with actual API call
const getHolidayData = (id) => {
  const holidays = [
    {
      id: 1,
      name: "New Year's Day",
      date: "2025-01-01",
      type: "national",
      description: "Celebration of the new year",
      isRecurring: true,
      applicableTo: "all",
      country: "India",
      state: "All",
      image: "/images/holidays/new-year.jpg",
      color: "#3b82f6"
    },
    {
      id: 2,
      name: "Republic Day",
      date: "2025-01-26",
      type: "national",
      description: "Celebration of India's constitution",
      isRecurring: true,
      applicableTo: "all",
      country: "India",
      state: "All",
      image: "/images/holidays/republic-day.jpg",
      color: "#ff9933"
    },
    // ... other holidays
  ];
  return holidays.find(holiday => holiday.id === parseInt(id));
};

export default function EditHolidayPage() {
  const params = useParams();
  const holiday = getHolidayData(params.id);

  if (!holiday) {
    return (
      <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-6">
        <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">Holiday not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-6">
      <Breadcrumb
        pages={[
          { name: 'HR', href: '/hr' },
          { name: 'Leave', href: '/hr/leave' },
          { name: 'Holidays', href: '/hr/leave/holidays' },
          { name: 'Edit Holiday', href: '#' },
        ]}
        rightContent={null}
      />
      
      <div className="bg-white rounded-lg shadow dark:bg-gray-800 mt-6">
        <HolidayForm holiday={holiday} isEdit={true} />
      </div>
    </div>
  );
}