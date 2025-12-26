"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Users, Filter, Info } from "lucide-react";

// Mock team members and their leaves
const teamMembers = [
    { id: 1, name: "John Doe", role: "Senior Developer", avatar: "JD", color: "bg-blue-500" },
    { id: 2, name: "Sarah Smith", role: "Product Manager", avatar: "SS", color: "bg-purple-500" },
    { id: 3, name: "Mike Johnson", role: "UI/UX Designer", avatar: "MJ", color: "bg-green-500" },
    { id: 4, name: "Emily Davis", role: "QA Engineer", avatar: "ED", color: "bg-pink-500" },
    { id: 5, name: "David Wilson", role: "Backend Developer", avatar: "DW", color: "bg-orange-500" },
    { id: 6, name: "Lisa Anderson", role: "Frontend Developer", avatar: "LA", color: "bg-teal-500" },
];

// Mock leave data for the team
const teamLeaves = [
    {
        id: 1,
        employeeId: 1,
        employeeName: "John Doe",
        startDate: "2025-01-06",
        endDate: "2025-01-08",
        type: "Annual Leave",
        status: "Approved",
    },
    {
        id: 2,
        employeeId: 2,
        employeeName: "Sarah Smith",
        startDate: "2025-01-10",
        endDate: "2025-01-12",
        type: "Sick Leave",
        status: "Approved",
    },
    {
        id: 3,
        employeeId: 3,
        employeeName: "Mike Johnson",
        startDate: "2025-01-15",
        endDate: "2025-01-17",
        type: "Casual Leave",
        status: "Pending",
    },
    {
        id: 4,
        employeeId: 1,
        employeeName: "John Doe",
        startDate: "2025-01-20",
        endDate: "2025-01-22",
        type: "Annual Leave",
        status: "Approved",
    },
    {
        id: 5,
        employeeId: 4,
        employeeName: "Emily Davis",
        startDate: "2025-01-25",
        endDate: "2025-01-26",
        type: "Casual Leave",
        status: "Approved",
    },
    {
        id: 6,
        employeeId: 5,
        employeeName: "David Wilson",
        startDate: "2025-01-13",
        endDate: "2025-01-14",
        type: "Sick Leave",
        status: "Approved",
    },
    {
        id: 7,
        employeeId: 6,
        employeeName: "Lisa Anderson",
        startDate: "2025-01-28",
        endDate: "2025-01-31",
        type: "Annual Leave",
        status: "Pending",
    },
];

const leaveTypeColors = {
    "Annual Leave": "bg-blue-500",
    "Sick Leave": "bg-red-500",
    "Casual Leave": "bg-green-500",
};

export default function TeamCalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1)); // January 2025
    const [selectedEmployee, setSelectedEmployee] = useState("All");
    const [selectedLeaveType, setSelectedLeaveType] = useState("All");

    // Get calendar data
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

    // Get first day of month and number of days
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    // Navigation functions
    const goToPreviousMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    // Check if a date has leaves
    const getLeavesForDate = (date) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
        return teamLeaves.filter((leave) => {
            const matchesEmployee = selectedEmployee === "All" || leave.employeeName === selectedEmployee;
            const matchesType = selectedLeaveType === "All" || leave.type === selectedLeaveType;
            const isInRange = dateStr >= leave.startDate && dateStr <= leave.endDate;
            return matchesEmployee && matchesType && isInRange;
        });
    };

    // Generate calendar days
    const calendarDays = [];

    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        calendarDays.push({
            date: daysInPrevMonth - i,
            isCurrentMonth: false,
            isPrevMonth: true,
        });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push({
            date: i,
            isCurrentMonth: true,
            isPrevMonth: false,
        });
    }

    // Next month days to fill the grid
    const remainingDays = 42 - calendarDays.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
        calendarDays.push({
            date: i,
            isCurrentMonth: false,
            isPrevMonth: false,
        });
    }

    // Check if date is today
    const isToday = (date) => {
        const today = new Date();
        return (
            date === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        );
    };

    // Get unique leave types
    const leaveTypes = ["All", ...new Set(teamLeaves.map((l) => l.type))];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Team Leave Calendar
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        View and track team members' leave schedules
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Team Members</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {teamMembers.length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Leaves</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {teamLeaves.length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">This Month</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {teamLeaves.filter((leave) => {
                                        const leaveMonth = new Date(leave.startDate).getMonth();
                                        return leaveMonth === month;
                                    }).length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                <Info className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Navigation */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        {/* Month Navigation */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={goToPreviousMonth}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </button>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white min-w-[200px] text-center">
                                {monthName}
                            </h2>
                            <button
                                onClick={goToNextMonth}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </button>
                            <button
                                onClick={goToToday}
                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
                            >
                                Today
                            </button>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-gray-400" />
                                <select
                                    value={selectedEmployee}
                                    onChange={(e) => setSelectedEmployee(e.target.value)}
                                    className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="All">All Employees</option>
                                    {teamMembers.map((member) => (
                                        <option key={member.id} value={member.name}>
                                            {member.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <select
                                value={selectedLeaveType}
                                onChange={(e) => setSelectedLeaveType(e.target.value)}
                                className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {leaveTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Calendar */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {/* Day headers */}
                    <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-700">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                            <div
                                key={day}
                                className="py-4 text-center text-sm font-semibold text-gray-600 dark:text-gray-300"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 divide-x divide-y divide-gray-200 dark:divide-gray-700">
                        {calendarDays.map((day, index) => {
                            const leaves = day.isCurrentMonth ? getLeavesForDate(day.date) : [];
                            const isTodayDate = day.isCurrentMonth && isToday(day.date);

                            return (
                                <div
                                    key={index}
                                    className={`min-h-[120px] p-2 ${!day.isCurrentMonth
                                            ? "bg-gray-50 dark:bg-gray-900"
                                            : "bg-white dark:bg-gray-800"
                                        } hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors`}
                                >
                                    <div
                                        className={`text-sm font-medium mb-2 ${!day.isCurrentMonth
                                                ? "text-gray-400 dark:text-gray-600"
                                                : isTodayDate
                                                    ? "text-white bg-blue-500 w-7 h-7 rounded-full flex items-center justify-center"
                                                    : "text-gray-900 dark:text-white"
                                            }`}
                                    >
                                        {day.date}
                                    </div>

                                    {/* Leave indicators */}
                                    <div className="space-y-1">
                                        {leaves.slice(0, 3).map((leave) => {
                                            const member = teamMembers.find(
                                                (m) => m.name === leave.employeeName
                                            );
                                            return (
                                                <div
                                                    key={leave.id}
                                                    className={`text-xs px-2 py-1 rounded ${leaveTypeColors[leave.type]
                                                        } text-white truncate cursor-pointer hover:opacity-80 transition-opacity`}
                                                    title={`${leave.employeeName} - ${leave.type}`}
                                                >
                                                    {member?.avatar} - {leave.type.split(" ")[0]}
                                                </div>
                                            );
                                        })}
                                        {leaves.length > 3 && (
                                            <div className="text-xs text-gray-500 dark:text-gray-400 px-2">
                                                +{leaves.length - 3} more
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Legend */}
                <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Leave Types
                    </h3>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-500 rounded"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Annual Leave</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-500 rounded"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Sick Leave</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-500 rounded"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Casual Leave</span>
                        </div>
                    </div>
                </div>

                {/* Team Members List */}
                <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Team Members
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {teamMembers.map((member) => (
                            <div
                                key={member.id}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                                <div
                                    className={`w-10 h-10 ${member.color} rounded-full flex items-center justify-center text-white font-semibold`}
                                >
                                    {member.avatar}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {member.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
