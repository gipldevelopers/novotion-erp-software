"use client";

import { Users, UserCheck, UserX, Clock, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AttendanceStatsCards({ selectedDate }) {
  // Mock data - in a real app, this would come from props or API
  const [statsData, setStatsData] = useState({
    totalEmployees: 0,
    presentEmployees: 0,
    absentEmployees: 0,
    lateEmployees: 0,
    attendanceRate: 0
  });

  // Simulate data loading based on selected date
  useEffect(() => {
    const timer = setTimeout(() => {
      // Mock data that changes based on the selected date
      const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      const baseData = {
        totalEmployees: 1007,
        presentEmployees: isWeekend ? 120 : 854, // Fewer people on weekends
        absentEmployees: isWeekend ? 887 : 153,
        lateEmployees: isWeekend ? 15 : 67,
        attendanceRate: isWeekend ? 12.1 : 84.8
      };

      setStatsData(baseData);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [selectedDate]);

  const cards = [
    {
      title: "Total Employees",
      value: statsData.totalEmployees,
      icon: Users,
      iconBg: "bg-gradient-to-r from-gray-800 to-gray-600",
      iconColor: "text-white",
      growth: 2.5, // Overall growth rate
      growthColor: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      cardBg: "bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900",
      hoverEffect: "hover:shadow-lg hover:-translate-y-1 transition-all duration-300",
      description: "Total workforce count"
    },
    {
      title: "Present Today",
      value: statsData.presentEmployees,
      icon: UserCheck,
      iconBg: "bg-gradient-to-r from-green-500 to-green-400",
      iconColor: "text-white",
      growth: statsData.attendanceRate,
      growthColor: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      cardBg: "bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-gray-900",
      hoverEffect: "hover:shadow-lg hover:-translate-y-1 transition-all duration-300",
      description: "Employees marked present"
    },
    {
      title: "Absent Today",
      value: statsData.absentEmployees,
      icon: UserX,
      iconBg: "bg-gradient-to-r from-red-500 to-red-400",
      iconColor: "text-white",
      growth: (100 - statsData.attendanceRate),
      growthColor: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      cardBg: "bg-gradient-to-br from-white to-red-50 dark:from-gray-800 dark:to-gray-900",
      hoverEffect: "hover:shadow-lg hover:-translate-y-1 transition-all duration-300",
      description: "Employees not present"
    },
    {
      title: "Late Arrivals",
      value: statsData.lateEmployees,
      icon: Clock,
      iconBg: "bg-gradient-to-r from-yellow-500 to-yellow-400",
      iconColor: "text-white",
      growth: 8.3, // Late arrival rate
      growthColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      cardBg: "bg-gradient-to-br from-white to-yellow-50 dark:from-gray-800 dark:to-gray-900",
      hoverEffect: "hover:shadow-lg hover:-translate-y-1 transition-all duration-300",
      description: "Employees arrived late"
    }
  ];

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="mb-8">
      {/* Date Display */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Attendance Overview for {formatDate(selectedDate)}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {selectedDate.toDateString() === new Date().toDateString() 
            ? "Today's attendance records" 
            : "Past attendance data"}
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((card, index) => (
          <div 
            key={index} 
            className={`rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 sm:p-4 md:p-6 cursor-pointer ${card.cardBg} ${card.hoverEffect}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center overflow-hidden">
                <div className={`${card.iconBg} rounded-lg sm:rounded-xl p-2 sm:p-3 mr-3 sm:mr-4 shadow-md`}>
                  <card.icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] xs:text-xs font-semibold text-gray-600 dark:text-gray-300 mb-0.5 xs:mb-1 uppercase tracking-wide truncate">
                    {card.title}
                  </p>
                  <h4 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-800 dark:text-white truncate">
                    {card.value.toLocaleString()}
                  </h4>
                  <p className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
            {/* <div className="flex items-center mt-2 sm:mt-4">
              <span className={`${card.growthColor} text-[10px] xs:text-xs font-medium px-2 py-0.5 xs:px-2.5 xs:py-1 rounded-full flex items-center`}>
                <TrendingUp className="h-2.5 w-2.5 xs:h-3 xs:w-3 mr-0.5 xs:mr-1" />
                {card.growth}%
              </span>
              <span className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400 ml-1 xs:ml-2 truncate">
                {index === 0 ? "from last month" : "of total"}
              </span>
            </div> */}
          </div>
        ))}
      </div>

      {/* Summary Row */}
      {/* <div className="mt-6 p-4 bg-blue-50 rounded-lg dark:bg-blue-900/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
              Overall Attendance Rate
            </p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">
              {statsData.attendanceRate}%
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-500">
              {statsData.presentEmployees} / {statsData.totalEmployees} employees
            </p>
          </div>
        </div>
      </div> */}
    </div>
  );
}