'use client';

import React, { useEffect, useState } from 'react';
import { hrmsService } from '@/services/hrmsService';
import { useHRMSRole } from '@/hooks/useHRMSRole';
import { ClockInWidget } from '@/components/hrms/ClockInWidget';
import { LeaveBalanceGrid } from '@/components/hrms/LeaveBalanceCard';
import { TimelineWidget } from '@/components/hrms/TimelineWidget';
import { HRMSStats } from '@/components/hrms/HRMSStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Calendar,
    Clock,
    TrendingUp,
    FileText,
    Star,
    ArrowRight,
    Download,
    CalendarDays
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function EmployeeDashboard() {
    const router = useRouter();
    const { employeeId, isEmployee } = useHRMSRole();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!employeeId) {
            router.push('/erp/hrms/dashboard');
            return;
        }
        loadDashboard();
    }, [employeeId]);

    const loadDashboard = async () => {
        try {
            const data = await hrmsService.getMyDashboardData(employeeId);
            setDashboardData(data);
        } catch (error) {
            console.error('Failed to load dashboard:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleClockIn = async (data) => {
        try {
            await hrmsService.clockIn(data);
            await loadDashboard();
        } catch (error) {
            throw error;
        }
    };

    const handleClockOut = async (data) => {
        try {
            await hrmsService.clockOut(data);
            await loadDashboard();
        } catch (error) {
            throw error;
        }
    };

    const handleRequestLeave = (leaveType) => {
        router.push(`/erp/hrms/me/leaves?type=${encodeURIComponent(leaveType)}`);
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                        <p className="text-muted-foreground">Loading your dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="p-8">
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Unable to load dashboard data</p>
                </div>
            </div>
        );
    }

    const { employee, leaveBalance, monthAttendance, pendingLeaves, recentActivities, upcomingLeaves } = dashboardData;

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Welcome back, {employee?.firstName}! 👋
                </h1>
                <p className="text-muted-foreground mt-1">
                    Here's what's happening with your work today
                </p>
            </div>

            {/* Quick Stats Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <HRMSStats
                    title="This Month Attendance"
                    value={`${monthAttendance.percentage}%`}
                    subtitle={`${monthAttendance.present} of ${monthAttendance.total} days`}
                    icon={Calendar}
                    trend={monthAttendance.percentage >= 90 ? 'up' : monthAttendance.percentage >= 75 ? 'neutral' : 'down'}
                    trendValue={`${monthAttendance.present} days`}
                    onClick={() => router.push('/erp/hrms/me/attendance')}
                />
                <HRMSStats
                    title="Pending Leave Requests"
                    value={pendingLeaves}
                    subtitle="Awaiting approval"
                    icon={Clock}
                    onClick={() => router.push('/erp/hrms/me/leaves')}
                />
                <HRMSStats
                    title="Upcoming Leaves"
                    value={upcomingLeaves.length}
                    subtitle="Approved leaves"
                    icon={CalendarDays}
                    onClick={() => router.push('/erp/hrms/me/leaves')}
                />
                <HRMSStats
                    title="Latest Payslip"
                    value={new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    subtitle="Click to download"
                    icon={FileText}
                    onClick={() => router.push('/erp/hrms/me/payslips')}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Clock In Widget - Prominent */}
                <div className="lg:col-span-1">
                    <ClockInWidget
                        employeeId={employeeId}
                        onClockIn={handleClockIn}
                        onClockOut={handleClockOut}
                    />
                </div>

                {/* Quick Actions Card */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <Button
                                    variant="outline"
                                    className="justify-start h-auto py-4"
                                    onClick={() => router.push('/erp/hrms/me/leaves')}
                                >
                                    <div className="flex items-center gap-3 w-full">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                            <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                                        </div>
                                        <div className="text-left flex-1">
                                            <div className="font-semibold">Request Leave</div>
                                            <div className="text-xs text-muted-foreground">Apply for time off</div>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </Button>

                                <Button
                                    variant="outline"
                                    className="justify-start h-auto py-4"
                                    onClick={() => router.push('/erp/hrms/me/attendance')}
                                >
                                    <div className="flex items-center gap-3 w-full">
                                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                            <Clock className="h-5 w-5 text-green-600 dark:text-green-300" />
                                        </div>
                                        <div className="text-left flex-1">
                                            <div className="font-semibold">View Attendance</div>
                                            <div className="text-xs text-muted-foreground">Check your records</div>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </Button>

                                <Button
                                    variant="outline"
                                    className="justify-start h-auto py-4"
                                    onClick={() => router.push('/erp/hrms/me/payslips')}
                                >
                                    <div className="flex items-center gap-3 w-full">
                                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                            <Download className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                                        </div>
                                        <div className="text-left flex-1">
                                            <div className="font-semibold">Download Payslip</div>
                                            <div className="text-xs text-muted-foreground">Get salary details</div>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </Button>

                                <Button
                                    variant="outline"
                                    className="justify-start h-auto py-4"
                                    onClick={() => router.push('/erp/hrms/me/performance')}
                                >
                                    <div className="flex items-center gap-3 w-full">
                                        <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                            <Star className="h-5 w-5 text-orange-600 dark:text-orange-300" />
                                        </div>
                                        <div className="text-left flex-1">
                                            <div className="font-semibold">My Performance</div>
                                            <div className="text-xs text-muted-foreground">View reviews & goals</div>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Leave Balance Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Leave Balance</h2>
                    <Link href="/erp/hrms/me/leaves">
                        <Button variant="outline" size="sm">
                            View All
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </Link>
                </div>
                <LeaveBalanceGrid
                    leaveBalances={leaveBalance}
                    onRequestLeave={handleRequestLeave}
                />
            </div>

            {/* Upcoming Leaves Alert */}
            {upcomingLeaves.length > 0 && (
                <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
                    <CardHeader>
                        <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2">
                            <CalendarDays className="h-5 w-5" />
                            Upcoming Approved Leaves
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {upcomingLeaves.map((leave, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg">
                                    <div>
                                        <div className="font-medium">{leave.type}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <Badge variant="default">Approved</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Recent Activity Timeline */}
            <TimelineWidget activities={recentActivities} maxItems={10} />
        </div>
    );
}
