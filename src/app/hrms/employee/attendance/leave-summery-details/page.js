"use client";
import { useState } from "react";
import {
    Calendar,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Filter,
    Download,
    PieChart,
} from "lucide-react";

// Mock leave data
const leaveBalance = [
    {
        id: 1,
        type: "Annual Leave",
        total: 20,
        used: 8,
        pending: 2,
        available: 10,
        color: "bg-blue-500",
        icon: Calendar,
    },
    {
        id: 2,
        type: "Sick Leave",
        total: 12,
        used: 3,
        pending: 0,
        available: 9,
        color: "bg-red-500",
        icon: AlertCircle,
    },
    {
        id: 3,
        type: "Casual Leave",
        total: 10,
        used: 5,
        pending: 1,
        available: 4,
        color: "bg-green-500",
        icon: Clock,
    },
    {
        id: 4,
        type: "Maternity/Paternity Leave",
        total: 90,
        used: 0,
        pending: 0,
        available: 90,
        color: "bg-purple-500",
        icon: Calendar,
    },
];

const leaveHistory = [
    {
        id: 1,
        type: "Annual Leave",
        startDate: "2024-12-20",
        endDate: "2024-12-24",
        days: 5,
        status: "Approved",
        reason: "Family vacation",
        appliedOn: "2024-12-01",
        approvedBy: "John Manager",
    },
    {
        id: 2,
        type: "Sick Leave",
        startDate: "2024-11-15",
        endDate: "2024-11-16",
        days: 2,
        status: "Approved",
        reason: "Medical appointment",
        appliedOn: "2024-11-14",
        approvedBy: "John Manager",
    },
    {
        id: 3,
        type: "Casual Leave",
        startDate: "2025-01-10",
        endDate: "2025-01-10",
        days: 1,
        status: "Pending",
        reason: "Personal work",
        appliedOn: "2024-12-26",
        approvedBy: "-",
    },
    {
        id: 4,
        type: "Annual Leave",
        startDate: "2024-10-05",
        endDate: "2024-10-07",
        days: 3,
        status: "Approved",
        reason: "Wedding ceremony",
        appliedOn: "2024-09-20",
        approvedBy: "John Manager",
    },
    {
        id: 5,
        type: "Casual Leave",
        startDate: "2024-09-12",
        endDate: "2024-09-13",
        days: 2,
        status: "Rejected",
        reason: "Personal emergency",
        appliedOn: "2024-09-11",
        approvedBy: "John Manager",
    },
    {
        id: 6,
        type: "Sick Leave",
        startDate: "2024-08-22",
        endDate: "2024-08-22",
        days: 1,
        status: "Approved",
        reason: "Fever",
        appliedOn: "2024-08-22",
        approvedBy: "John Manager",
    },
];

const statusConfig = {
    Approved: {
        color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        icon: CheckCircle,
    },
    Pending: {
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        icon: Clock,
    },
    Rejected: {
        color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        icon: XCircle,
    },
};

export default function LeaveSummaryDetailsPage() {
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [selectedType, setSelectedType] = useState("All");

    // Calculate totals
    const totalLeaves = leaveBalance.reduce((sum, leave) => sum + leave.total, 0);
    const totalUsed = leaveBalance.reduce((sum, leave) => sum + leave.used, 0);
    const totalPending = leaveBalance.reduce((sum, leave) => sum + leave.pending, 0);
    const totalAvailable = leaveBalance.reduce((sum, leave) => sum + leave.available, 0);

    // Filter leave history
    const filteredHistory = leaveHistory.filter((leave) => {
        const matchesStatus = selectedStatus === "All" || leave.status === selectedStatus;
        const matchesType = selectedType === "All" || leave.type === selectedType;
        return matchesStatus && matchesType;
    });

    const leaveTypes = ["All", ...new Set(leaveHistory.map((l) => l.type))];
    const statuses = ["All", "Approved", "Pending", "Rejected"];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Leave Summary & Details
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Track your leave balance and history
                        </p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>
                </div>

                {/* Overall Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Total Leaves
                                </p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {totalLeaves}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Used</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {totalUsed}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pending</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {totalPending}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Available
                                </p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {totalAvailable}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Leave Balance Cards */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Leave Balance by Type
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {leaveBalance.map((leave) => {
                            const Icon = leave.icon;
                            const usagePercentage = (leave.used / leave.total) * 100;

                            return (
                                <div
                                    key={leave.id}
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                                >
                                    <div className={`h-2 ${leave.color}`}></div>
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <Icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {leave.available}
                                            </span>
                                        </div>
                                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                                            {leave.type}
                                        </h3>
                                        <div className="space-y-2 text-xs">
                                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                                <span>Total:</span>
                                                <span className="font-medium">{leave.total}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                                <span>Used:</span>
                                                <span className="font-medium">{leave.used}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                                <span>Pending:</span>
                                                <span className="font-medium">{leave.pending}</span>
                                            </div>
                                        </div>
                                        {/* Progress Bar */}
                                        <div className="mt-4">
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${leave.color} transition-all duration-300`}
                                                    style={{ width: `${usagePercentage}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {usagePercentage.toFixed(0)}% used
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Leave History */}
                <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Leave History
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-gray-400" />
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {leaveTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                            Leave Type
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                            Duration
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                            Days
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                            Reason
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                            Applied On
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                            Approved By
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredHistory.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                                            >
                                                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                                <p>No leave records found</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredHistory.map((leave) => {
                                            const StatusIcon = statusConfig[leave.status].icon;
                                            return (
                                                <tr
                                                    key={leave.id}
                                                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {leave.type}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                                            {new Date(leave.startDate).toLocaleDateString("en-US", {
                                                                month: "short",
                                                                day: "numeric",
                                                            })}{" "}
                                                            -{" "}
                                                            {new Date(leave.endDate).toLocaleDateString("en-US", {
                                                                month: "short",
                                                                day: "numeric",
                                                                year: "numeric",
                                                            })}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {leave.days} {leave.days === 1 ? "day" : "days"}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${statusConfig[leave.status].color
                                                                }`}
                                                        >
                                                            <StatusIcon className="w-3 h-3" />
                                                            {leave.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                                                            {leave.reason}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                                            {new Date(leave.appliedOn).toLocaleDateString("en-US", {
                                                                month: "short",
                                                                day: "numeric",
                                                                year: "numeric",
                                                            })}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                                            {leave.approvedBy}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
