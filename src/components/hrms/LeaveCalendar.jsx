'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Leave Calendar Component - Shows organization-wide leave calendar
 * @param {Object} props
 * @param {Array} props.leaves - Array of leave objects with employeeId, startDate, endDate, type, status
 * @param {Array} props.employees - Array of employee objects
 * @param {Date} props.currentMonth - Current month to display
 * @param {Function} props.onMonthChange - Callback when month changes
 */
export function LeaveCalendar({ leaves = [], employees = [], currentMonth = new Date(), onMonthChange }) {
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { days, firstDay };
    };

    const { days, firstDay } = getDaysInMonth(currentMonth);
    const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const isDateInLeave = (day, leaveItem) => {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const start = new Date(leaveItem.startDate);
        const end = new Date(leaveItem.endDate);
        return date >= start && date <= end && leaveItem.status === 'Approved';
    };

    const getLeavesForDay = (day) => {
        return leaves.filter(leave => isDateInLeave(day, leave));
    };

    const getLeaveTypeColor = (type) => {
        const colors = {
            'Sick Leave': 'bg-red-100 text-red-700 border-red-200',
            'Casual Leave': 'bg-blue-100 text-blue-700 border-blue-200',
            'Annual Leave': 'bg-green-100 text-green-700 border-green-200',
            'Maternity Leave': 'bg-purple-100 text-purple-700 border-purple-200',
            'Paternity Leave': 'bg-indigo-100 text-indigo-700 border-indigo-200',
        };
        return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const handlePrevMonth = () => {
        const newDate = new Date(currentMonth);
        newDate.setMonth(newDate.getMonth() - 1);
        onMonthChange?.(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(currentMonth);
        newDate.setMonth(newDate.getMonth() + 1);
        onMonthChange?.(newDate);
    };

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const calendarDays = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        calendarDays.push(<div key={`empty-${i}`} className="min-h-24 border border-gray-200 bg-gray-50"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= days; day++) {
        const dayLeaves = getLeavesForDay(day);
        const isToday = new Date().getDate() === day &&
            new Date().getMonth() === currentMonth.getMonth() &&
            new Date().getFullYear() === currentMonth.getFullYear();

        calendarDays.push(
            <div
                key={day}
                className={`min-h-24 border border-gray-200 p-2 ${isToday ? 'bg-blue-50 border-blue-300' : 'bg-white'}`}
            >
                <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                    {day}
                </div>
                <div className="space-y-1">
                    {dayLeaves.slice(0, 3).map((leave, idx) => {
                        const employee = employees.find(e => e.id === leave.employeeId);
                        return (
                            <div
                                key={idx}
                                className={`text-xs px-2 py-1 rounded border ${getLeaveTypeColor(leave.type)} truncate`}
                                title={`${employee?.firstName} ${employee?.lastName} - ${leave.type}`}
                            >
                                {employee?.firstName?.[0]}{employee?.lastName?.[0]} - {leave.type.split(' ')[0]}
                            </div>
                        );
                    })}
                    {dayLeaves.length > 3 && (
                        <div className="text-xs text-gray-500 px-2">
                            +{dayLeaves.length - 3} more
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Leave Calendar</CardTitle>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handlePrevMonth}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium min-w-[150px] text-center">{monthName}</span>
                        <Button variant="outline" size="sm" onClick={handleNextMonth}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {/* Legend */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">Sick Leave</Badge>
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">Casual Leave</Badge>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">Annual Leave</Badge>
                    <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">Maternity</Badge>
                    <Badge variant="outline" className="bg-indigo-100 text-indigo-700 border-indigo-200">Paternity</Badge>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-0 border border-gray-200">
                    {/* Week day headers */}
                    {weekDays.map(day => (
                        <div key={day} className="bg-gray-100 border border-gray-200 p-2 text-center text-sm font-semibold text-gray-700">
                            {day}
                        </div>
                    ))}
                    {/* Calendar days */}
                    {calendarDays}
                </div>

                {/* Summary */}
                <div className="mt-4 text-sm text-muted-foreground">
                    Total leaves this month: {leaves.filter(l => {
                        const start = new Date(l.startDate);
                        const end = new Date(l.endDate);
                        return (start.getMonth() === currentMonth.getMonth() || end.getMonth() === currentMonth.getMonth())
                            && l.status === 'Approved';
                    }).length}
                </div>
            </CardContent>
        </Card>
    );
}
