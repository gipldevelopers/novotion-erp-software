'use client';

import React, { useEffect, useState } from 'react';
import { hrmsService } from '@/services/hrmsService';
import { LeaveCalendar } from '@/components/hrms/LeaveCalendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Check, X, Clock, Plus, Calendar, TrendingUp, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function LeavesPage() {
    const [leaves, setLeaves] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [requestData, setRequestData] = useState({
        employeeId: '',
        type: 'Casual Leave',
        startDate: '',
        endDate: '',
        reason: ''
    });

    const fetchData = async () => {
        try {
            const [leavesData, employeesData] = await Promise.all([
                hrmsService.getLeaves(),
                hrmsService.getEmployees()
            ]);
            setLeaves(leavesData);
            setEmployees(employeesData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAction = async (id, action, comments = '') => {
        try {
            if (action === 'Approved') {
                await hrmsService.approveLeave(id, comments);
            } else {
                await hrmsService.rejectLeave(id, comments);
            }
            toast.success(`Leave request ${action.toLowerCase()}`);
            fetchData();
        } catch (error) {
            toast.error('Failed to update leave');
        }
    };

    const handleSubmitRequest = async (e) => {
        e.preventDefault();
        try {
            await hrmsService.createLeaveRequest(requestData);
            toast.success("Leave request submitted successfully");
            setIsDialogOpen(false);
            setRequestData({
                employeeId: '',
                type: 'Casual Leave',
                startDate: '',
                endDate: '',
                reason: ''
            });
            fetchData();
        } catch (error) {
            toast.error("Failed to submit request");
        }
    };

    const getEmployeeName = (employeeId) => {
        const employee = employees.find(e => e.id === employeeId);
        return employee ? `${employee.firstName} ${employee.lastName}` : employeeId;
    };

    // Analytics
    const pendingCount = leaves.filter(l => l.status === 'Pending').length;
    const approvedCount = leaves.filter(l => l.status === 'Approved').length;
    const rejectedCount = leaves.filter(l => l.status === 'Rejected').length;

    const leaveTypeStats = leaves.reduce((acc, leave) => {
        acc[leave.type] = (acc[leave.type] || 0) + 1;
        return acc;
    }, {});

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
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Leave Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage employee leave requests and view organization calendar
                    </p>
                </div>
                <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Leave Request
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Pending Approvals
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-600">{pendingCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Requires action</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Approved Leaves
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">{approvedCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">This month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Rejected Leaves
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-600">{rejectedCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">This month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Requests
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{leaves.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">All time</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="calendar" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="calendar">
                        <Calendar className="h-4 w-4 mr-2" />
                        Calendar View
                    </TabsTrigger>
                    <TabsTrigger value="pending">
                        <Clock className="h-4 w-4 mr-2" />
                        Pending ({pendingCount})
                    </TabsTrigger>
                    <TabsTrigger value="approved">
                        <Check className="h-4 w-4 mr-2" />
                        Approved ({approvedCount})
                    </TabsTrigger>
                    <TabsTrigger value="analytics">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Analytics
                    </TabsTrigger>
                </TabsList>

                {/* Calendar Tab */}
                <TabsContent value="calendar">
                    <LeaveCalendar
                        leaves={leaves}
                        employees={employees}
                        currentMonth={currentMonth}
                        onMonthChange={setCurrentMonth}
                    />
                </TabsContent>

                {/* Pending Tab */}
                <TabsContent value="pending">
                    <div className="space-y-4">
                        {leaves.filter(l => l.status === 'Pending').length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center text-muted-foreground">
                                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No pending leave requests</p>
                                </CardContent>
                            </Card>
                        ) : (
                            leaves.filter(l => l.status === 'Pending').map(leave => (
                                <Card key={leave.id} className="border-l-4 border-l-orange-500">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-3 flex-1">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-semibold text-lg">{getEmployeeName(leave.employeeId)}</span>
                                                    <Badge variant="secondary" className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
                                                        {leave.type}
                                                    </Badge>
                                                    <Badge variant="outline" className="border-orange-300 dark:border-orange-700">
                                                        Pending
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</span>
                                                </div>
                                                <div className="p-3 bg-muted/50 rounded-lg border">
                                                    <p className="text-sm italic">"{leave.reason}"</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 ml-4">
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                    onClick={() => handleAction(leave.id, 'Approved')}
                                                >
                                                    <Check className="h-4 w-4 mr-1" />
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleAction(leave.id, 'Rejected')}
                                                >
                                                    <X className="h-4 w-4 mr-1" />
                                                    Reject
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </TabsContent>

                {/* Approved Tab */}
                <TabsContent value="approved">
                    <div className="space-y-4">
                        {leaves.filter(l => l.status === 'Approved').map(leave => (
                            <Card key={leave.id} className="border-green-200">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">{getEmployeeName(leave.employeeId)}</span>
                                                <Badge variant="outline">{leave.type}</Badge>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <Badge className="bg-green-600">
                                            <Check className="h-3 w-3 mr-1" />
                                            Approved
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Leave Type Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {Object.entries(leaveTypeStats).map(([type, count]) => (
                                        <div key={type} className="flex items-center justify-between">
                                            <span className="text-sm">{type}</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-primary h-2 rounded-full"
                                                        style={{ width: `${(count / leaves.length) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-medium w-8">{count}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Leave Status Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                                        <span className="font-medium">Pending</span>
                                        <span className="text-2xl font-bold text-orange-600">{pendingCount}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                        <span className="font-medium">Approved</span>
                                        <span className="text-2xl font-bold text-green-600">{approvedCount}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                        <span className="font-medium">Rejected</span>
                                        <span className="text-2xl font-bold text-red-600">{rejectedCount}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* New Leave Request Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>New Leave Request</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmitRequest} className="space-y-4">
                        <div>
                            <Label>Employee</Label>
                            <Select
                                value={requestData.employeeId}
                                onValueChange={(value) => setRequestData({ ...requestData, employeeId: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select employee" />
                                </SelectTrigger>
                                <SelectContent>
                                    {employees.map(emp => (
                                        <SelectItem key={emp.id} value={emp.id}>
                                            {emp.firstName} {emp.lastName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Leave Type</Label>
                            <Select
                                value={requestData.type}
                                onValueChange={(value) => setRequestData({ ...requestData, type: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                                    <SelectItem value="Casual Leave">Casual Leave</SelectItem>
                                    <SelectItem value="Annual Leave">Annual Leave</SelectItem>
                                    <SelectItem value="Maternity Leave">Maternity Leave</SelectItem>
                                    <SelectItem value="Paternity Leave">Paternity Leave</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Start Date</Label>
                                <Input
                                    type="date"
                                    value={requestData.startDate}
                                    onChange={(e) => setRequestData({ ...requestData, startDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label>End Date</Label>
                                <Input
                                    type="date"
                                    value={requestData.endDate}
                                    onChange={(e) => setRequestData({ ...requestData, endDate: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <Label>Reason</Label>
                            <Textarea
                                value={requestData.reason}
                                onChange={(e) => setRequestData({ ...requestData, reason: e.target.value })}
                                placeholder="Enter reason for leave..."
                                required
                            />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Submit Request</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
