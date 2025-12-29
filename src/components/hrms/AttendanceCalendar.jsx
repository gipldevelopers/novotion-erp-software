'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const STATUS_COLORS = {
    Present: 'bg-green-500 hover:bg-green-600',
    Absent: 'bg-red-500 hover:bg-red-600',
    'On Leave': 'bg-orange-500 hover:bg-orange-600',
    'Half Day': 'bg-yellow-500 hover:bg-yellow-600',
    Holiday: 'bg-purple-500 hover:bg-purple-600',
    Weekend: 'bg-gray-300 hover:bg-gray-400',
};

export function AttendanceCalendar({ attendanceData = [], month, year, onMonthChange }) {
    const [currentMonth, setCurrentMonth] = useState(month || new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(year || new Date().getFullYear());

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
        onMonthChange?.(currentMonth === 0 ? 11 : currentMonth - 1, currentMonth === 0 ? currentYear - 1 : currentYear);
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
        onMonthChange?.(currentMonth === 11 ? 0 : currentMonth + 1, currentMonth === 11 ? currentYear + 1 : currentYear);
    };

    const getAttendanceForDate = (day) => {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return attendanceData.find(a => a.date === dateStr);
    };

    const getStatusForDay = (day) => {
        const date = new Date(currentYear, currentMonth, day);
        const dayOfWeek = date.getDay();

        // Check if weekend
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            return 'Weekend';
        }

        const attendance = getAttendanceForDate(day);
        return attendance?.status || null;
    };

    // Calculate stats
    const stats = {
        present: attendanceData.filter(a => a.status === 'Present').length,
        absent: attendanceData.filter(a => a.status === 'Absent').length,
        leave: attendanceData.filter(a => a.status === 'On Leave').length,
        halfDay: attendanceData.filter(a => a.status === 'Half Day').length,
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Attendance Calendar</CardTitle>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="text-sm font-medium min-w-[150px] text-center">
                            {monthNames[currentMonth]} {currentYear}
                        </div>
                        <Button variant="outline" size="icon" onClick={handleNextMonth}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Stats Summary */}
                <div className="grid grid-cols-4 gap-2">
                    <div className="text-center p-2 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-2xl font-bold text-green-700">{stats.present}</div>
                        <div className="text-xs text-green-600">Present</div>
                    </div>
                    <div className="text-center p-2 bg-red-50 rounded-lg border border-red-200">
                        <div className="text-2xl font-bold text-red-700">{stats.absent}</div>
                        <div className="text-xs text-red-600">Absent</div>
                    </div>
                    <div className="text-center p-2 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="text-2xl font-bold text-orange-700">{stats.leave}</div>
                        <div className="text-xs text-orange-600">Leave</div>
                    </div>
                    <div className="text-center p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="text-2xl font-bold text-yellow-700">{stats.halfDay}</div>
                        <div className="text-xs text-yellow-600">Half Day</div>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                    {/* Day Headers */}
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="text-center text-xs font-semibold text-muted-foreground p-2">
                            {day}
                        </div>
                    ))}

                    {/* Empty cells for days before month starts */}
                    {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                        <div key={`empty-${index}`} className="aspect-square" />
                    ))}

                    {/* Calendar days */}
                    {Array.from({ length: daysInMonth }).map((_, index) => {
                        const day = index + 1;
                        const status = getStatusForDay(day);
                        const attendance = getAttendanceForDate(day);
                        const isToday =
                            day === new Date().getDate() &&
                            currentMonth === new Date().getMonth() &&
                            currentYear === new Date().getFullYear();

                        return (
                            <div
                                key={day}
                                className={`
                                    aspect-square p-1 rounded-lg border-2 transition-all cursor-pointer
                                    ${isToday ? 'border-primary' : 'border-transparent'}
                                    ${status ? STATUS_COLORS[status] : 'bg-gray-100 hover:bg-gray-200'}
                                    ${status ? 'text-white' : 'text-gray-700'}
                                `}
                                title={status || 'No data'}
                            >
                                <div className="flex flex-col items-center justify-center h-full">
                                    <div className="text-sm font-semibold">{day}</div>
                                    {attendance?.hours && (
                                        <div className="text-[10px] opacity-90">{attendance.hours}h</div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-3 pt-4 border-t">
                    {Object.entries(STATUS_COLORS).map(([status, color]) => (
                        <div key={status} className="flex items-center gap-2">
                            <div className={`h-3 w-3 rounded ${color}`} />
                            <span className="text-xs text-muted-foreground">{status}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
