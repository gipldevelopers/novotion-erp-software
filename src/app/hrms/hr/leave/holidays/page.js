"use client";
import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import Breadcrumb from '@/components/common/Breadcrumb';
import HolidaysHeader from './components/HolidaysHeader';
import HolidaysCalendar from './components/HolidaysCalendar';
import HolidaysList from './components/HolidaysList';
import Link from 'next/link';

// Mock data for holidays (Indian festivals + standard holidays)
const initialHolidays = [
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
  {
    id: 3,
    name: "Holi",
    date: "2025-03-14",
    type: "religious",
    description: "Festival of colors",
    isRecurring: true,
    applicableTo: "all",
    country: "India",
    state: "All",
    image: "/images/holidays/holi.jpg",
    color: "#dc2626"
  },
  {
    id: 4,
    name: "Eid al-Fitr",
    date: "2025-03-31",
    type: "religious",
    description: "End of Ramadan",
    isRecurring: true,
    applicableTo: "all",
    country: "India",
    state: "All",
    image: "/images/holidays/eid.jpg",
    color: "#10b981"
  },
  {
    id: 5,
    name: "Independence Day",
    date: "2025-08-15",
    type: "national",
    description: "India's independence from British rule",
    isRecurring: true,
    applicableTo: "all",
    country: "India",
    state: "All",
    image: "/images/holidays/independence-day.jpg",
    color: "#ff9933"
  },
  {
    id: 6,
    name: "Ganesh Chaturthi",
    date: "2025-08-29",
    type: "religious",
    description: "Birth of Lord Ganesha",
    isRecurring: true,
    applicableTo: "regional",
    country: "India",
    state: "Maharashtra, Goa, Karnataka",
    image: "/images/holidays/ganesh-chaturthi.jpg",
    color: "#8b5cf6"
  },
  {
    id: 7,
    name: "Dussehra",
    date: "2025-09-22",
    type: "religious",
    description: "Victory of good over evil",
    isRecurring: true,
    applicableTo: "all",
    country: "India",
    state: "All",
    image: "/images/holidays/dussehra.jpg",
    color: "#f59e0b"
  },
  {
    id: 8,
    name: "Diwali",
    date: "2025-10-23",
    type: "religious",
    description: "Festival of lights",
    isRecurring: true,
    applicableTo: "all",
    country: "India",
    state: "All",
    image: "/images/holidays/diwali.jpg",
    color: "#f59e0b"
  },
  {
    id: 9,
    name: "Christmas",
    date: "2025-12-25",
    type: "religious",
    description: "Celebration of Christmas",
    isRecurring: true,
    applicableTo: "all",
    country: "India",
    state: "All",
    image: "/images/holidays/christmas.jpg",
    color: "#dc2626"
  },
  {
    id: 10,
    name: "Makar Sankranti",
    date: "2025-01-14",
    type: "religious",
    description: "Harvest festival",
    isRecurring: true,
    applicableTo: "regional",
    country: "India",
    state: "Gujarat, Maharashtra, Karnataka",
    image: "/images/holidays/sankranti.jpg",
    color: "#6366f1"
  }
];

export default function Holidays() {
  const [holidays, setHolidays] = useState(initialHolidays);
  const [view, setView] = useState('list'); // 'calendar' or 'list'
  const [yearFilter, setYearFilter] = useState(2025);
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredHolidays = holidays.filter(holiday => {
    const holidayYear = new Date(holiday.date).getFullYear();
    const matchesYear = holidayYear === yearFilter;
    const matchesType = typeFilter === 'all' || holiday.type === typeFilter;
    
    return matchesYear && matchesType;
  });

  const handleDeleteHoliday = (holidayId) => {
    setHolidays(holidays.filter(holiday => holiday.id !== holidayId));
  };

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-6">
      <Breadcrumb
        pages={[
          { name: 'HR', href: '/hr' },
          { name: 'Leave', href: '/hr/leave' },
          { name: 'Holidays', href: '#' },
        ]}
        rightContent={
          <Link
            href="/hr/leave/holidays/add"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
          >
            <PlusCircle size={18} /> Add Holiday
          </Link>
        }
      />

      <HolidaysHeader 
        view={view}
        onViewChange={setView}
        yearFilter={yearFilter}
        onYearFilterChange={setYearFilter}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        totalHolidays={filteredHolidays.length}
      />
      
      <div className="mt-6 bg-white rounded-lg shadow dark:bg-gray-800">
        {view === 'calendar' ? (
          <HolidaysCalendar holidays={filteredHolidays} />
        ) : (
          <HolidaysList 
            holidays={filteredHolidays}
            onDeleteHoliday={handleDeleteHoliday}
          />
        )}
      </div>
    </div>
  );
}