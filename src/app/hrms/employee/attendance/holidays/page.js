"use client";
import { useState } from "react";
import { Calendar, MapPin, Clock, Filter, Search } from "lucide-react";

// Mock holidays data
const mockHolidays = [
    {
        id: 1,
        name: "New Year's Day",
        date: "2025-01-01",
        day: "Wednesday",
        type: "National Holiday",
        description: "Celebration of the first day of the year",
        color: "bg-blue-500",
    },
    {
        id: 2,
        name: "Republic Day",
        date: "2025-01-26",
        day: "Sunday",
        type: "National Holiday",
        description: "Commemorates the adoption of the Constitution of India",
        color: "bg-orange-500",
    },
    {
        id: 3,
        name: "Holi",
        date: "2025-03-14",
        day: "Friday",
        type: "Festival Holiday",
        description: "Festival of colors and spring",
        color: "bg-pink-500",
    },
    {
        id: 4,
        name: "Good Friday",
        date: "2025-04-18",
        day: "Friday",
        type: "Religious Holiday",
        description: "Christian observance of the crucifixion of Jesus",
        color: "bg-purple-500",
    },
    {
        id: 5,
        name: "Independence Day",
        date: "2025-08-15",
        day: "Friday",
        type: "National Holiday",
        description: "Celebrates India's independence from British rule",
        color: "bg-green-500",
    },
    {
        id: 6,
        name: "Gandhi Jayanti",
        date: "2025-10-02",
        day: "Thursday",
        type: "National Holiday",
        description: "Birthday of Mahatma Gandhi",
        color: "bg-yellow-500",
    },
    {
        id: 7,
        name: "Diwali",
        date: "2025-10-20",
        day: "Monday",
        type: "Festival Holiday",
        description: "Festival of lights",
        color: "bg-amber-500",
    },
    {
        id: 8,
        name: "Christmas",
        date: "2025-12-25",
        day: "Thursday",
        type: "Religious Holiday",
        description: "Christian celebration of the birth of Jesus Christ",
        color: "bg-red-500",
    },
];

const holidayTypes = ["All", "National Holiday", "Festival Holiday", "Religious Holiday"];

export default function HolidaysPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("All");
    const [viewMode, setViewMode] = useState("grid"); // grid or list

    // Filter holidays based on search and type
    const filteredHolidays = mockHolidays.filter((holiday) => {
        const matchesSearch = holiday.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === "All" || holiday.type === selectedType;
        return matchesSearch && matchesType;
    });

    // Calculate upcoming holidays
    const today = new Date();
    const upcomingHolidays = mockHolidays.filter(
        (holiday) => new Date(holiday.date) >= today
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Company Holidays 2025
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        View all official holidays and plan your time off
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Total Holidays
                                </p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {mockHolidays.length}
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
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Upcoming Holidays
                                </p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {upcomingHolidays.length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Next Holiday
                                </p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {upcomingHolidays.length > 0
                                        ? upcomingHolidays[0].name
                                        : "No upcoming holidays"}
                                </p>
                                {upcomingHolidays.length > 0 && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {new Date(upcomingHolidays[0].date).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </p>
                                )}
                            </div>
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search holidays..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Type Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-400" />
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {holidayTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`px-4 py-2 rounded-lg transition-colors ${viewMode === "grid"
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                    }`}
                            >
                                Grid
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`px-4 py-2 rounded-lg transition-colors ${viewMode === "list"
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                    }`}
                            >
                                List
                            </button>
                        </div>
                    </div>
                </div>

                {/* Holidays Display */}
                {filteredHolidays.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
                        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            No holidays found matching your criteria
                        </p>
                    </div>
                ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredHolidays.map((holiday) => (
                            <div
                                key={holiday.id}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className={`h-2 ${holiday.color}`}></div>
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                                                {holiday.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {holiday.day}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {new Date(holiday.date).getDate()}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(holiday.date).toLocaleDateString("en-US", {
                                                    month: "short",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                            {holiday.type}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {holiday.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                            Holiday
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                            Day
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                            Description
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredHolidays.map((holiday) => (
                                        <tr
                                            key={holiday.id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className={`w-1 h-8 ${holiday.color} rounded-full mr-3`}></div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {new Date(holiday.date).toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        })}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    {holiday.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    {holiday.day}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                                    {holiday.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    {holiday.description}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
