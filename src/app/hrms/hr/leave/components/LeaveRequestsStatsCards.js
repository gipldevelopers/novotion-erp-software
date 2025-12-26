"use client";

import { Calendar, UserCheck, Clock, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function LeaveRequestsStatsCards() {
  // Mock data - in a real app, this would come from props or API
  const [statsData, setStatsData] = useState({
    todayPresent: 18,
    totalEmployees: 60,
    todayLeaves: 5,
    unplannedLeaves: 0,
    pendingLeaves: 6,
    attendanceRate: 85.7
  });

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setStatsData({
        todayPresent: 18,
        totalEmployees: 60,
        todayLeaves: 5,
        unplannedLeaves: 0,
        pendingLeaves: 6,
        attendanceRate: 85.7
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const cards = [
    {
      title: "Today's Attendance",
      value: `${statsData.todayPresent}/${statsData.totalEmployees}`,
      subtitle: "Present/Total Employees",
      icon: UserCheck,
      iconBg: "bg-gradient-to-r from-green-500 to-green-400",
      iconColor: "text-white",
      growth: statsData.attendanceRate,
      growthText: `${statsData.attendanceRate}% Attendance Rate`,
      trend: "up",
      growthColor: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      cardBg: "bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-gray-900",
      hoverEffect: "hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    },
    {
      title: "Today Leaves",
      value: statsData.todayLeaves,
      subtitle: "Planned Time Off",
      icon: Calendar,
      iconBg: "bg-gradient-to-r from-blue-500 to-blue-400",
      iconColor: "text-white",
      growth: 12.5,
      growthText: "+12.5% from yesterday",
      trend: "up",
      growthColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      cardBg: "bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900",
      hoverEffect: "hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    },
    {
      title: "Unplanned Leaves",
      value: statsData.unplannedLeaves,
      subtitle: "Emergency Time Off",
      icon: AlertCircle,
      iconBg: "bg-gradient-to-r from-red-500 to-red-400",
      iconColor: "text-white",
      growth: -25.0,
      growthText: "-25.0% from last week",
      trend: "down",
      growthColor: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      cardBg: "bg-gradient-to-br from-white to-red-50 dark:from-gray-800 dark:to-gray-900",
      hoverEffect: "hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    },
    {
      title: "Pending Leaves",
      value: statsData.pendingLeaves,
      subtitle: "Awaiting Approval",
      icon: Clock,
      iconBg: "bg-gradient-to-r from-yellow-500 to-yellow-400",
      iconColor: "text-white",
      growth: 20.0,
      growthText: "+20.0% from yesterday",
      trend: "up",
      growthColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      cardBg: "bg-gradient-to-br from-white to-yellow-50 dark:from-gray-800 dark:to-gray-900",
      hoverEffect: "hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
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
                  {card.value}
                </h4>
                <p className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                  {card.subtitle}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center mt-2 sm:mt-4">
            <span className={`${card.growthColor} text-[10px] xs:text-xs font-medium px-2 py-0.5 xs:px-2.5 xs:py-1 rounded-full flex items-center`}>
              {card.trend === 'up' ? (
                <TrendingUp className="h-2.5 w-2.5 xs:h-3 xs:w-3 mr-0.5 xs:mr-1" />
              ) : (
                <TrendingDown className="h-2.5 w-2.5 xs:h-3 xs:w-3 mr-0.5 xs:mr-1" />
              )}
              {card.growth > 0 ? '+' : ''}{card.growth}%
            </span>
            <span className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400 ml-1 xs:ml-2 truncate">
              {card.growthText}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}