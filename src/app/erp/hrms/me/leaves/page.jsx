'use client';

import React, { useEffect, useState } from 'react';
import { hrmsService } from '@/services/hrmsService';
import { useHRMSRole } from '@/hooks/useHRMSRole';
import { LeaveBalanceGrid } from '@/components/hrms/LeaveBalanceCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Plus, Check, X, Clock } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function MyLeavesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { employeeId } = useHRMSRole();
    const [leaveBalance, setLeaveBalance] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [requestData, setRequestData] = useState({
        employeeId: employeeId,
        type: searchParams.get('type') || 'Casual Leave',
        startDate: '',
        endDate: '',
        reason: ''
    });

    useEffect(() => {
        if (!employeeId) {
            router.push('/erp/hrms/dashboard');
            return;
        }
        loadData();

        // Auto-open dialog if type is specified in URL
        if (searchParams.get('type')) {
            setIsDialogOpen(true);
        }
    }, [employeeId]);

    const loadData = async () => {
        try {
            const [balance, leaveRecords] = await Promise.all([
                hrmsService.getLeaveBalance(employeeId),
                hrmsService.getLeavesByEmployee(employeeId)
            ]);
            setLeaveBalance(balance);
            setLeaves(leaveRecords);
        } catch (error) {
            console.error('Failed to load leave data:', error);
            toast.error('Failed to load leave data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitRequest = async (e) => {
        e.preventDefault();
        try {
            await hrmsService.createLeaveRequest(requestData);
            toast.success('Leave request submitted successfully');
            setIsDialogOpen(false);
            setRequestData({
                employeeId: employeeId,
                type: 'Casual Leave',
                startDate: '',
                endDate: '',
                reason: ''
            });
            await loadData();
        } catch (error) {
            toast.error('Failed to submit leave request');
        }
    };

    const handleRequestLeave = (leaveType) => {
        setRequestData({ ...requestData, type: leaveType });
        setIsDialogOpen(true);
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

    const pendingLeaves = leaves.filter(l => l.status === 'Pending');
    const approvedLeaves = leaves.filter(l => l.status === 'Approved');
    const rejectedLeaves = leaves.filter(l => l.status === 'Rejected');

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Leaves</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your leave requests and balance
                    </p>
                </div>
                <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Request Leave
                </Button>
            </div>

            {/* Leave Balance Section */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Leave Balance</h2>
                <LeaveBalanceGrid
                    leaveBalances={leaveBalance}
                    onRequestLeave={handleRequestLeave}
                />
            </div>

            {/* Leave Requests */}
            <Card>
                <CardHeader>
                    <CardTitle>My Leave Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="pending" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="pending">
                                Pending ({pendingLeaves.length})
                            </TabsTrigger>
                            <TabsTrigger value="approved">
                                Approved ({approvedLeaves.length})
                            </TabsTrigger>
                            <TabsTrigger value="rejected">
                                Rejected ({rejectedLeaves.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="pending" className="space-y-3">
                            {pendingLeaves.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No pending leave requests</p>
                                </div>
                            ) : (
                                pendingLeaves.map(leave => (
                                    <Card key={leave.id} className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div className="space-y-1">
                                                <div className="font-semibold">{leave.type}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}
                                                </div>
                                                <p className="text-sm italic">"{leave.reason}"</p>
                                            </div>
                                            <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
                                                <Clock className="h-3 w-3 mr-1" />
                                                Pending
                                            </Badge>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </TabsContent>

                        <TabsContent value="approved" className="space-y-3">
                            {approvedLeaves.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Check className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No approved leaves</p>
                                </div>
                            ) : (
                                approvedLeaves.map(leave => (
                                    <Card key={leave.id} className="border-green-200 bg-green-50 dark:bg-green-950/20">
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div className="space-y-1">
                                                <div className="font-semibold">{leave.type}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}
                                                </div>
                                                {leave.approverComments && (
                                                    <p className="text-sm italic text-green-700">"{leave.approverComments}"</p>
                                                )}
                                            </div>
                                            <Badge variant="default" className="bg-green-600">
                                                <Check className="h-3 w-3 mr-1" />
                                                Approved
                                            </Badge>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </TabsContent>

                        <TabsContent value="rejected" className="space-y-3">
                            {rejectedLeaves.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <X className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No rejected leaves</p>
                                </div>
                            ) : (
                                rejectedLeaves.map(leave => (
                                    <Card key={leave.id} className="border-red-200 bg-red-50 dark:bg-red-950/20">
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div className="space-y-1">
                                                <div className="font-semibold">{leave.type}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}
                                                </div>
                                                {leave.approverComments && (
                                                    <p className="text-sm italic text-red-700">"{leave.approverComments}"</p>
                                                )}
                                            </div>
                                            <Badge variant="destructive">
                                                <X className="h-3 w-3 mr-1" />
                                                Rejected
                                            </Badge>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Request Leave Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Request Leave</DialogTitle>
                        <DialogDescription>Submit your time off request for approval</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitRequest} className="space-y-4 pt-2">
                        <div className="grid gap-2">
                            <Label>Leave Type</Label>
                            <Select
                                value={requestData.type}
                                onValueChange={(val) => setRequestData({ ...requestData, type: val })}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Casual Leave">Casual Leave</SelectItem>
                                    <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                                    <SelectItem value="Earned Leave">Earned Leave</SelectItem>
                                    <SelectItem value="Emergency Leave">Emergency Leave</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Start Date</Label>
                                <Input
                                    type="date"
                                    value={requestData.startDate}
                                    onChange={(e) => setRequestData({ ...requestData, startDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>End Date</Label>
                                <Input
                                    type="date"
                                    value={requestData.endDate}
                                    onChange={(e) => setRequestData({ ...requestData, endDate: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Reason</Label>
                            <Textarea
                                value={requestData.reason}
                                onChange={(e) => setRequestData({ ...requestData, reason: e.target.value })}
                                placeholder="Please provide a reason for your leave request..."
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
