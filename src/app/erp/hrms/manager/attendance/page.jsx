'use client';

import React, { useEffect, useState } from 'react';
import { hrmsService } from '@/services/hrmsService';
import { useHRMSRole } from '@/hooks/useHRMSRole';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Users, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ManagerAttendancePage() {
    const router = useRouter();
    const { employeeId, isManager } = useHRMSRole();
    const [teamMembers, setTeamMembers] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isManager) {
            router.push('/erp/hrms/me/dashboard');
            return;
        }
        loadData();
    }, [employeeId, isManager]);

    const loadData = async () => {
        try {
            const [members, attendance] = await Promise.all([
                hrmsService.getTeamMembers(employeeId),
                hrmsService.getAttendance()
            ]);

            setTeamMembers(members);
            const teamIds = members.map(m => m.id);
            const today = new Date().toISOString().split('T')[0];
            const todayAttendance = attendance.filter(a =>
                teamIds.includes(a.employeeId) && a.date === today
            );
            setAttendanceData(todayAttendance);
        } catch (error) {
            console.error('Failed to load attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    const getEmployeeName = (employeeId) => {
        const employee = teamMembers.find(m => m.id === employeeId);
        return employee ? `${employee.firstName} ${employee.lastName}` : employeeId;
    };

    const getEmployeeAvatar = (employeeId) => {
        const employee = teamMembers.find(m => m.id === employeeId);
        return employee?.avatar;
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

    const presentCount = attendanceData.filter(a => a.status === 'Present').length;
    const absentCount = teamMembers.length - presentCount;
    const avgHours = attendanceData.reduce((sum, a) => sum + (parseFloat(a.hours) || 0), 0) / (attendanceData.length || 1);

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Team Attendance</h1>
                <p className="text-muted-foreground mt-1">
                    Monitor your team's attendance and working hours
                </p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Team Size
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{teamMembers.length}</div>
                        <p className="text-xs text-muted-foreground">Total members</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Present Today
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">{presentCount}</div>
                        <p className="text-xs text-muted-foreground">
                            {Math.round((presentCount / teamMembers.length) * 100)}% attendance
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Absent Today
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-600">{absentCount}</div>
                        <p className="text-xs text-muted-foreground">Not marked present</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Avg Hours
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600">{avgHours.toFixed(1)}</div>
                        <p className="text-xs text-muted-foreground">Average today</p>
                    </CardContent>
                </Card>
            </div>

            {/* Today's Attendance */}
            <Card>
                <CardHeader>
                    <CardTitle>Today's Attendance - {new Date().toLocaleDateString()}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {teamMembers.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No team members found</p>
                            </div>
                        ) : (
                            teamMembers.map((member) => {
                                const attendance = attendanceData.find(a => a.employeeId === member.id);
                                return (
                                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <Avatar>
                                                <AvatarImage src={member.avatar} />
                                                <AvatarFallback>
                                                    {member.firstName[0]}{member.lastName[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-semibold">
                                                    {member.firstName} {member.lastName}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {member.designation}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {attendance ? (
                                                <>
                                                    <div className="text-right">
                                                        <div className="text-sm font-medium">
                                                            {attendance.checkIn || '-'} - {attendance.checkOut || 'In Progress'}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {attendance.hours ? `${attendance.hours}h worked` : 'Clocked in'}
                                                        </div>
                                                    </div>
                                                    <Badge variant="default" className="bg-green-600">
                                                        Present
                                                    </Badge>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="text-right">
                                                        <div className="text-sm text-muted-foreground">
                                                            No attendance record
                                                        </div>
                                                    </div>
                                                    <Badge variant="secondary">
                                                        Absent
                                                    </Badge>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
