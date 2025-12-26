"use client";
import { useState, useEffect } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import {
    Users,
    Calendar,
    Clock,
    FileText,
    Gift,
    Bell,
    ArrowUpRight,
    UserCheck,
    Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { attendanceService } from '@/services/attendanceService';
import { leaveRequestService } from '@/services/leaveRequestService';
import { holidayService } from '@/services/holidayService';
import Link from 'next/link';

export default function EmployeeDashboard() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        attendance: { present: 0, late: 0 },
        leaves: { total: 12, approved: 0 },
        holidays: []
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                const [attendanceRes, leaveStats, holidays] = await Promise.all([
                    attendanceService.getMyAttendance(),
                    leaveRequestService.getLeaveStats(),
                    holidayService.getAllHolidays()
                ]);

                setDashboardData({
                    attendance: {
                        present: attendanceRes.data.filter(a => a.status === 'Present').length,
                        late: attendanceRes.data.filter(a => a.status === 'Late').length
                    },
                    leaves: {
                        total: 30 - leaveStats.approved, // Assuming 30 total
                        approved: leaveStats.approved
                    },
                    holidays: holidays.slice(0, 4)
                });
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const stats = [
        { title: "Available Leaves", value: dashboardData.leaves.total, sub: "Annual", icon: <Calendar />, color: "bg-blue-500" },
        { title: "Working Days", value: dashboardData.attendance.present, sub: "Present", icon: <UserCheck />, color: "bg-green-500" },
        { title: "Late Days", value: dashboardData.attendance.late, sub: "This Month", icon: <Clock />, color: "bg-yellow-500" },
        { title: "Pending Tasks", value: "8", sub: "Active", icon: <FileText />, color: "bg-purple-500" },
    ];

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-900 dark:to-blue-700 rounded-2xl p-8 text-white shadow-lg overflow-hidden relative">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'Employee'}! 👋</h1>
                    <p className="opacity-90 max-w-lg">Check your schedule, manage your leaves, and track your performance from your personal workspace.</p>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Users size={200} />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-lg text-white ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <span className="text-xs font-medium text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full flex items-center">
                                <ArrowUpRight size={12} className="mr-1" /> Stable
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title} ({stat.sub})</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activities */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Recent Activities</h2>
                        <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">View All</button>
                    </div>
                    <div className="space-y-6">
                        {[
                            { title: "Leave Request Approved", time: "2 hours ago", desc: "Your sick leave for next Monday has been approved.", icon: <Bell className="text-green-500" /> },
                            { title: "Performance Review", time: "Yesterday", desc: "HR has updated your quarterly performance review results.", icon: <ArrowUpRight className="text-blue-500" /> },
                            { title: "Team Meeting", time: "Yesterday", desc: "Invitation: Monthly team sync scheduled for tomorrow at 10 AM.", icon: <Users className="text-purple-500" /> },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                                <div className="flex-shrink-0 mt-1">{item.icon}</div>
                                <div>
                                    <h4 className="font-semibold text-sm">{item.title}</h4>
                                    <p className="text-xs text-gray-400 mb-1">{item.time}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Coming Holidays / Events */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Gift className="text-pink-500" /> Upcoming
                    </h2>
                    <div className="space-y-4">
                        {dashboardData.holidays.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-gray-50 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold">
                                        <span className="text-[10px] uppercase leading-none">{new Date(item.date).toLocaleString('default', { month: 'short' })}</span>
                                        <span className="text-lg leading-none">{new Date(item.date).getDate()}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm">{item.name}</h4>
                                        <p className="text-xs text-gray-400">{item.type}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Link
                        href="/hrms/employee/holiday"
                        className="block w-full text-center mt-6 py-2 border-2 border-gray-100 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                    >
                        View Full Calendar
                    </Link>
                </div>
            </div>
        </div>
    );
}
