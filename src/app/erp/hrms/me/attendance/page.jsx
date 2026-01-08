'use client';

import React, { useEffect, useState } from 'react';
import { hrmsService } from '@/services/hrmsService';
import { useHRMSRole } from '@/hooks/useHRMSRole';
import { EmployeeProfileGuard } from '@/components/hrms/EmployeeProfileGuard';
import { AttendanceCalendar } from '@/components/hrms/AttendanceCalendar';
import { HRMSStats } from '@/components/hrms/HRMSStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Clock, TrendingUp, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MyAttendancePage() {
    const router = useRouter();
    const { employeeId } = useHRMSRole();
    const [attendanceData, setAttendanceData] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        present: 0,
        absent: 0,
        leave: 0,
        totalHours: 0,
    });

    useEffect(() => {
        if (employeeId) {
            loadAttendance();
        } else {
            setLoading(false);
        }
    }, [employeeId, currentMonth, currentYear]);

    const loadAttendance = async () => {
        try {
            const data = await hrmsService.getAttendanceCalendar(employeeId, currentMonth, currentYear);
            setAttendanceData(data);

            // Calculate stats
            const present = data.filter(a => a.status === 'Present').length;
            const absent = data.filter(a => a.status === 'Absent').length;
            const leave = data.filter(a => a.status === 'On Leave').length;
            const totalHours = data.reduce((sum, a) => sum + (parseFloat(a.hours) || 0), 0);

            setStats({ present, absent, leave, totalHours });
        } catch (error) {
            console.error('Failed to load attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMonthChange = (month, year) => {
        setCurrentMonth(month);
        setCurrentYear(year);
    };

    const handleExport = () => {
        // Export attendance data as CSV
        const csvData = attendanceData.map(record => ({
            'Date': record.date,
            'Check In': record.checkIn || '-',
            'Check Out': record.checkOut || '-',
            'Hours': record.hours || 0,
            'Status': record.status,
            'Work Mode': record.workMode || 'office',
        }));

        const csvContent = [
            Object.keys(csvData[0]).join(','),
            ...csvData.map(row => Object.values(row).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendance_${currentYear}_${currentMonth + 1}.csv`;
        a.click();
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
            </div>
        );
    }

    return (
        <EmployeeProfileGuard>
            <div className="p-8 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Attendance</h1>
                        <p className="text-muted-foreground mt-1">
                            Track your attendance and working hours
                        </p>
                    </div>
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <HRMSStats
                        title="Present Days"
                        value={stats.present}
                        subtitle="This month"
                        icon={Calendar}
                        trend="up"
                        trendValue={`${Math.round((stats.present / (stats.present + stats.absent + stats.leave)) * 100) || 0}%`}
                    />
                    <HRMSStats
                        title="Absent Days"
                        value={stats.absent}
                        subtitle="This month"
                        icon={Calendar}
                    />
                    <HRMSStats
                        title="Leave Days"
                        value={stats.leave}
                        subtitle="This month"
                        icon={Calendar}
                    />
                    <HRMSStats
                        title="Total Hours"
                        value={stats.totalHours.toFixed(1)}
                        subtitle="Hours worked"
                        icon={Clock}
                    />
                </div>

                {/* Calendar View */}
                <AttendanceCalendar
                    attendanceData={attendanceData}
                    month={currentMonth}
                    year={currentYear}
                    onMonthChange={handleMonthChange}
                />

                {/* Recent Attendance Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Attendance Records</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Check In</TableHead>
                                    <TableHead>Check Out</TableHead>
                                    <TableHead>Hours</TableHead>
                                    <TableHead>Work Mode</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {attendanceData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            No attendance records for this month
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    attendanceData.slice(0, 10).map((record) => (
                                        <TableRow key={record.id}>
                                            <TableCell className="font-medium">
                                                {new Date(record.date).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>{record.checkIn || '-'}</TableCell>
                                            <TableCell>{record.checkOut || '-'}</TableCell>
                                            <TableCell>{record.hours || 0}h</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize">
                                                    {record.workMode || 'office'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        record.status === 'Present' ? 'default' :
                                                            record.status === 'Absent' ? 'destructive' :
                                                                'secondary'
                                                    }
                                                >
                                                    {record.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </EmployeeProfileGuard>
    );
}
