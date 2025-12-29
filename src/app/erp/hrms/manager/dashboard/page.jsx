'use client';

import React, { useEffect, useState } from 'react';
import { hrmsService } from '@/services/hrmsService';
import { useHRMSRole } from '@/hooks/useHRMSRole';
import { HRMSStats } from '@/components/hrms/HRMSStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
    Users,
    UserCheck,
    UserMinus,
    Clock,
    Check,
    X,
    Calendar,
    TrendingUp,
    ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ManagerDashboard() {
    const router = useRouter();
    const { employeeId, isManager } = useHRMSRole();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [approvalComments, setApprovalComments] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (!isManager) {
            router.push('/erp/hrms/me/dashboard');
            return;
        }
        loadDashboard();
    }, [employeeId, isManager]);

    const loadDashboard = async () => {
        try {
            const data = await hrmsService.getManagerDashboardData(employeeId);
            setDashboardData(data);
        } catch (error) {
            console.error('Failed to load manager dashboard:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!selectedLeave) return;
        setActionLoading(true);
        try {
            await hrmsService.approveLeave(selectedLeave.id, approvalComments);
            toast.success('Leave request approved');
            setSelectedLeave(null);
            setApprovalComments('');
            await loadDashboard();
        } catch (error) {
            toast.error('Failed to approve leave');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!selectedLeave) return;
        setActionLoading(true);
        try {
            await hrmsService.rejectLeave(selectedLeave.id, approvalComments);
            toast.success('Leave request rejected');
            setSelectedLeave(null);
            setApprovalComments('');
            await loadDashboard();
        } catch (error) {
            toast.error('Failed to reject leave');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                        <p className="text-muted-foreground">Loading team dashboard...</p>
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

    const { teamSize, presentToday, onLeaveToday, absentToday, pendingApprovals, teamMembers, pendingLeaveRequests, teamAttendance } = dashboardData;

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Team Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your team and approve requests
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <HRMSStats
                    title="Team Size"
                    value={teamSize}
                    subtitle="Total team members"
                    icon={Users}
                    onClick={() => router.push('/erp/hrms/manager/team')}
                />
                <HRMSStats
                    title="Present Today"
                    value={presentToday}
                    subtitle={`${Math.round((presentToday / teamSize) * 100)}% attendance`}
                    icon={UserCheck}
                    trend="up"
                    trendValue={`${presentToday}/${teamSize}`}
                    onClick={() => router.push('/erp/hrms/manager/attendance')}
                />
                <HRMSStats
                    title="On Leave Today"
                    value={onLeaveToday}
                    subtitle="Approved leaves"
                    icon={Calendar}
                    onClick={() => router.push('/erp/hrms/manager/attendance')}
                />
                <HRMSStats
                    title="Pending Approvals"
                    value={pendingApprovals}
                    subtitle="Requires action"
                    icon={Clock}
                    onClick={() => router.push('/erp/hrms/manager/approvals')}
                    className={pendingApprovals > 0 ? 'border-orange-300 bg-orange-50 dark:bg-orange-950/20' : ''}
                />
            </div>

            {/* Pending Leave Approvals */}
            {pendingLeaveRequests.length > 0 && (
                <Card className="border-orange-200">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-orange-600" />
                                Pending Leave Approvals ({pendingLeaveRequests.length})
                            </CardTitle>
                            <Link href="/erp/hrms/manager/approvals">
                                <Button variant="outline" size="sm">
                                    View All
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {pendingLeaveRequests.slice(0, 5).map((leave) => {
                                const employee = teamMembers.find(e => e.id === leave.employeeId);
                                return (
                                    <div key={leave.id} className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200">
                                        <div className="flex items-center gap-4">
                                            <Avatar>
                                                <AvatarImage src={employee?.avatar} />
                                                <AvatarFallback>
                                                    {employee?.firstName?.[0]}{employee?.lastName?.[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-semibold">
                                                    {employee?.firstName} {employee?.lastName}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {leave.type} • {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                                </div>
                                                <div className="text-sm italic mt-1">"{leave.reason}"</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                onClick={() => setSelectedLeave({ ...leave, action: 'approve' })}
                                            >
                                                <Check className="h-4 w-4 mr-1" />
                                                Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => setSelectedLeave({ ...leave, action: 'reject' })}
                                            >
                                                <X className="h-4 w-4 mr-1" />
                                                Reject
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Team Overview */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Team Members */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Team Members</CardTitle>
                            <Link href="/erp/hrms/manager/team">
                                <Button variant="outline" size="sm">
                                    View All
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {teamMembers.slice(0, 5).map((member) => {
                                const attendance = teamAttendance.find(a => a.employeeId === member.id);
                                return (
                                    <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={member.avatar} />
                                                <AvatarFallback>
                                                    {member.firstName[0]}{member.lastName[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">
                                                    {member.firstName} {member.lastName}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {member.designation}
                                                </div>
                                            </div>
                                        </div>
                                        <Badge
                                            variant={attendance?.status === 'Present' ? 'default' : 'secondary'}
                                            className={attendance?.status === 'Present' ? 'bg-green-600' : ''}
                                        >
                                            {attendance?.status || 'No Data'}
                                        </Badge>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Today's Attendance */}
                <Card>
                    <CardHeader>
                        <CardTitle>Today's Attendance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                        <UserCheck className="h-5 w-5 text-green-600 dark:text-green-300" />
                                    </div>
                                    <div>
                                        <div className="font-semibold">Present</div>
                                        <div className="text-sm text-muted-foreground">Clocked in today</div>
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-green-600">{presentToday}</div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                        <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-300" />
                                    </div>
                                    <div>
                                        <div className="font-semibold">On Leave</div>
                                        <div className="text-sm text-muted-foreground">Approved leaves</div>
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-orange-600">{onLeaveToday}</div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                                        <UserMinus className="h-5 w-5 text-red-600 dark:text-red-300" />
                                    </div>
                                    <div>
                                        <div className="font-semibold">Absent</div>
                                        <div className="text-sm text-muted-foreground">Not marked present</div>
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-red-600">{absentToday}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Approval Dialog */}
            <Dialog open={!!selectedLeave} onOpenChange={() => setSelectedLeave(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {selectedLeave?.action === 'approve' ? 'Approve' : 'Reject'} Leave Request
                        </DialogTitle>
                    </DialogHeader>
                    {selectedLeave && (
                        <div className="space-y-4">
                            <div className="p-4 bg-muted rounded-lg">
                                <div className="font-semibold mb-2">{selectedLeave.type}</div>
                                <div className="text-sm text-muted-foreground">
                                    {new Date(selectedLeave.startDate).toLocaleDateString()} - {new Date(selectedLeave.endDate).toLocaleDateString()}
                                </div>
                                <div className="text-sm mt-2 italic">"{selectedLeave.reason}"</div>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">
                                    Comments (Optional)
                                </label>
                                <Textarea
                                    value={approvalComments}
                                    onChange={(e) => setApprovalComments(e.target.value)}
                                    placeholder="Add any comments or feedback..."
                                    rows={3}
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setSelectedLeave(null)}
                            disabled={actionLoading}
                        >
                            Cancel
                        </Button>
                        {selectedLeave?.action === 'approve' ? (
                            <Button
                                onClick={handleApprove}
                                disabled={actionLoading}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                {actionLoading ? 'Approving...' : 'Approve Leave'}
                            </Button>
                        ) : (
                            <Button
                                onClick={handleReject}
                                disabled={actionLoading}
                                variant="destructive"
                            >
                                {actionLoading ? 'Rejecting...' : 'Reject Leave'}
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
