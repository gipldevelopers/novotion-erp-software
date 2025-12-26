// src/app/(dashboard)/hr/payroll/components/PayrollStatsCards.js
"use client";

import { IndianRupee, Users, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PayrollStatsCards() {
  const [statsData, setStatsData] = useState({
    totalPayroll: 0,
    employeesPaid: 0,
    pendingPayments: 0,
    averageSalary: 0,
    totalGrowth: 0
  });

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setStatsData({
        totalPayroll: 125000,
        employeesPaid: 854,
        pendingPayments: 23,
        averageSalary: 4500,
        totalGrowth: 12.5
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const cards = [
    {
      title: "Total Payroll",
      value: `$${statsData.totalPayroll.toLocaleString()}`,
      icon: IndianRupee,
      iconBg: "bg-gradient-to-r from-green-500 to-green-400",
      iconColor: "text-white",
      growth: statsData.totalGrowth,
      growthColor: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      cardBg: "bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-gray-900",
      hoverEffect: "hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    },
    {
      title: "Employees Paid",
      value: statsData.employeesPaid,
      icon: Users,
      iconBg: "bg-gradient-to-r from-blue-500 to-blue-400",
      iconColor: "text-white",
      growth: 8.2,
      growthColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      cardBg: "bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900",
      hoverEffect: "hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    },
    {
      title: "Pending Payments",
      value: statsData.pendingPayments,
      icon: Clock,
      iconBg: "bg-gradient-to-r from-yellow-500 to-yellow-400",
      iconColor: "text-white",
      growth: -3.1,
      growthColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      cardBg: "bg-gradient-to-br from-white to-yellow-50 dark:from-gray-800 dark:to-gray-900",
      hoverEffect: "hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    },
    {
      title: "Average Salary",
      value: `$${statsData.averageSalary.toLocaleString()}`,
      icon: CheckCircle,
      iconBg: "bg-gradient-to-r from-purple-500 to-purple-400",
      iconColor: "text-white",
      growth: 5.7,
      growthColor: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      cardBg: "bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-900",
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
              </div>
            </div>
          </div>
          <div className="flex items-center mt-2 sm:mt-4">
            <span className={`${card.growthColor} text-[10px] xs:text-xs font-medium px-2 py-0.5 xs:px-2.5 xs:py-1 rounded-full flex items-center`}>
              <TrendingUp className="h-2.5 w-2.5 xs:h-3 xs:w-3 mr-0.5 xs:mr-1" />
              {card.growth > 0 ? '+' : ''}{card.growth}%
            </span>
            <span className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400 ml-1 xs:ml-2 truncate">
              from last month
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}