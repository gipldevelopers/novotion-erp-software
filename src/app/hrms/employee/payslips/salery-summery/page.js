"use client";
import { useState } from "react";
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Download,
    Calendar,
    CreditCard,
    PieChart,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";

// Mock salary data
const currentSalary = {
    month: "December 2024",
    basicSalary: 50000,
    earnings: {
        hra: 15000,
        conveyance: 3000,
        medical: 2000,
        specialAllowance: 5000,
        bonus: 10000,
    },
    deductions: {
        providentFund: 6000,
        professionalTax: 200,
        incomeTax: 8000,
        insurance: 1500,
    },
    netSalary: 69300,
    paymentDate: "2024-12-28",
    paymentStatus: "Processed",
};

const salaryHistory = [
    {
        month: "November 2024",
        basicSalary: 50000,
        grossSalary: 85000,
        deductions: 15700,
        netSalary: 69300,
        paymentDate: "2024-11-28",
        status: "Paid",
    },
    {
        month: "October 2024",
        basicSalary: 50000,
        grossSalary: 75000,
        deductions: 15700,
        netSalary: 59300,
        paymentDate: "2024-10-28",
        status: "Paid",
    },
    {
        month: "September 2024",
        basicSalary: 50000,
        grossSalary: 75000,
        deductions: 15700,
        netSalary: 59300,
        paymentDate: "2024-09-28",
        status: "Paid",
    },
    {
        month: "August 2024",
        basicSalary: 50000,
        grossSalary: 75000,
        deductions: 15700,
        netSalary: 59300,
        paymentDate: "2024-08-28",
        status: "Paid",
    },
    {
        month: "July 2024",
        basicSalary: 50000,
        grossSalary: 75000,
        deductions: 15700,
        netSalary: 59300,
        paymentDate: "2024-07-28",
        status: "Paid",
    },
    {
        month: "June 2024",
        basicSalary: 50000,
        grossSalary: 75000,
        deductions: 15700,
        netSalary: 59300,
        paymentDate: "2024-06-28",
        status: "Paid",
    },
];

// Calculate totals
const totalEarnings = Object.values(currentSalary.earnings).reduce((a, b) => a + b, 0);
const totalDeductions = Object.values(currentSalary.deductions).reduce((a, b) => a + b, 0);
const grossSalary = currentSalary.basicSalary + totalEarnings;

// YTD calculations
const ytdGross = salaryHistory.reduce((sum, month) => sum + month.grossSalary, 0) + grossSalary;
const ytdNet = salaryHistory.reduce((sum, month) => sum + month.netSalary, 0) + currentSalary.netSalary;
const ytdDeductions = salaryHistory.reduce((sum, month) => sum + month.deductions, 0) + totalDeductions;

export default function SalarySummaryPage() {
    const [selectedPeriod, setSelectedPeriod] = useState("current");

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Salary Summary
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            View your salary breakdown and payment history
                        </p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                        Download Payslip
                    </button>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <ArrowUpRight className="w-5 h-5 opacity-80" />
                        </div>
                        <p className="text-sm opacity-90 mb-1">Net Salary</p>
                        <p className="text-3xl font-bold">{formatCurrency(currentSalary.netSalary)}</p>
                        <p className="text-xs opacity-75 mt-2">{currentSalary.month}</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Gross Salary</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {formatCurrency(grossSalary)}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                                <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Deductions</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {formatCurrency(totalDeductions)}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Payment Date</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {new Date(currentSalary.paymentDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </p>
                    </div>
                </div>

                {/* YTD Summary */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                        Year to Date (2024)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Gross</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {formatCurrency(ytdGross)}
                            </p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Deductions</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {formatCurrency(ytdDeductions)}
                            </p>
                        </div>
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">Total Net Pay</p>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {formatCurrency(ytdNet)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Current Month Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Earnings */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="bg-green-50 dark:bg-green-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Earnings
                                </h3>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        Basic Salary
                                    </span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {formatCurrency(currentSalary.basicSalary)}
                                    </span>
                                </div>
                                {Object.entries(currentSalary.earnings).map(([key, value]) => (
                                    <div
                                        key={key}
                                        className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700"
                                    >
                                        <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                                            {key.replace(/([A-Z])/g, " $1").trim()}
                                        </span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            {formatCurrency(value)}
                                        </span>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-base font-semibold text-gray-900 dark:text-white">
                                        Gross Salary
                                    </span>
                                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                        {formatCurrency(grossSalary)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Deductions */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="bg-red-50 dark:bg-red-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2">
                                <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Deductions
                                </h3>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {Object.entries(currentSalary.deductions).map(([key, value]) => (
                                    <div
                                        key={key}
                                        className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700"
                                    >
                                        <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                                            {key.replace(/([A-Z])/g, " $1").trim()}
                                        </span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            {formatCurrency(value)}
                                        </span>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-base font-semibold text-gray-900 dark:text-white">
                                        Total Deductions
                                    </span>
                                    <span className="text-lg font-bold text-red-600 dark:text-red-400">
                                        {formatCurrency(totalDeductions)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Net Pay Summary */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 shadow-lg mb-8 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <p className="text-sm opacity-90 mb-2">Net Salary for {currentSalary.month}</p>
                            <p className="text-4xl font-bold">{formatCurrency(currentSalary.netSalary)}</p>
                            <p className="text-sm opacity-75 mt-2">
                                Gross: {formatCurrency(grossSalary)} - Deductions:{" "}
                                {formatCurrency(totalDeductions)}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                <CreditCard className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-sm opacity-90">Status</p>
                                <p className="text-lg font-semibold">{currentSalary.paymentStatus}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment History */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Payment History
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Month
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Basic Salary
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Gross Salary
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Deductions
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Net Salary
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Payment Date
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {salaryHistory.map((record, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {record.month}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {formatCurrency(record.basicSalary)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {formatCurrency(record.grossSalary)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-red-600 dark:text-red-400">
                                                {formatCurrency(record.deductions)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                                                {formatCurrency(record.netSalary)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {new Date(record.paymentDate).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                {record.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
