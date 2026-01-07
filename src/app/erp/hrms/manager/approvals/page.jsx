'use client';

import React, { useEffect, useState } from 'react';
import { hrmsService } from '@/services/hrmsService';
import { useHRMSRole } from '@/hooks/useHRMSRole';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, Clock, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function ManagerApprovalsPage() {
    const router = useRouter();
    const { employeeId, isManager } = useHRMSRole();
    const [leaves, setLeaves] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [approvalComments, setApprovalComments] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (!isManager) {
            router.push('/erp/hrms/me/dashboard');
            return;
        }
        loadData();
    }, [employeeId, isManager]);

    const loadData = async () => {
        try {
            const [members, allLeaves] = await Promise.all([
                hrmsService.getTeamMembers(employeeId),
                hrmsService.getLeaves()
            ]);

            setTeamMembers(members);
            const teamIds = members.map(m => m.id);
            const teamLeaves = allLeaves.filter(l => teamIds.includes(l.employeeId));
            setLeaves(teamLeaves);
        } catch (error) {
            console.error('Failed to load approvals:', error);
            toast.error('Failed to load approval data');
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
            await loadData();
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
            await loadData();
        } catch (error) {
            toast.error('Failed to reject leave');
        } finally {
            setActionLoading(false);
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

    const pendingLeaves = leaves.filter(l => l.status === 'Pending');
    const approvedLeaves = leaves.filter(l => l.status === 'Approved');
    const rejectedLeaves = leaves.filter(l => l.status === 'Rejected');

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Approvals</h1>
                <p className="text-muted-foreground mt-1">
                    Review and approve team leave requests
                </p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Pending Approvals
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-600">{pendingLeaves.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Approved This Month
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">{approvedLeaves.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Rejected This Month
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-600">{rejectedLeaves.length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Approvals Tabs */}
            <Card>
                <CardHeader>
                    <CardTitle>Leave Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="pending" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="pending">
                                <Clock className="h-4 w-4 mr-2" />
                                Pending ({pendingLeaves.length})
                            </TabsTrigger>
                            <TabsTrigger value="approved">
                                <Check className="h-4 w-4 mr-2" />
                                Approved ({approvedLeaves.length})
                            </TabsTrigger>
                            <TabsTrigger value="rejected">
                                <X className="h-4 w-4 mr-2" />
                                Rejected ({rejectedLeaves.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="pending" className="space-y-3">
                            {pendingLeaves.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No pending approvals</p>
                                </div>
                            ) : (
                                pendingLeaves.map((leave) => (
                                    <Card key={leave.id} className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-start gap-3 flex-1">
                                                    <Avatar>
                                                        <AvatarImage src={getEmployeeAvatar(leave.employeeId)} />
                                                        <AvatarFallback>
                                                            {getEmployeeName(leave.employeeId).split(' ').map(n => n[0]).join('')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <div className="font-semibold">{getEmployeeName(leave.employeeId)}</div>
                                                        <div className="text-sm text-muted-foreground mt-1">
                                                            <Badge variant="outline" className="mr-2">{leave.type}</Badge>
                                                            <Calendar className="h-3 w-3 inline mr-1" />
                                                            {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                                        </div>
                                                        <p className="text-sm italic mt-2 text-gray-700">"{leave.reason}"</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700"
                                                        onClick={() => setSelectedLeave({ ...leave, action: 'approve' })}
                                                    >
                                                        <Check className="h-4 w-4 mr-1" />
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => setSelectedLeave({ ...leave, action: 'reject' })}
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
                        </TabsContent>

                        <TabsContent value="approved" className="space-y-3">
                            {approvedLeaves.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Check className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No approved leaves</p>
                                </div>
                            ) : (
                                approvedLeaves.map((leave) => (
                                    <Card key={leave.id} className="border-green-200 bg-green-50 dark:bg-green-950/20">
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={getEmployeeAvatar(leave.employeeId)} />
                                                        <AvatarFallback>
                                                            {getEmployeeName(leave.employeeId).split(' ').map(n => n[0]).join('')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-semibold">{getEmployeeName(leave.employeeId)}</div>
                                                        <div className="text-sm text-muted-foreground mt-1">
                                                            <Badge variant="outline" className="mr-2">{leave.type}</Badge>
                                                            {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                                        </div>
                                                        {leave.approverComments && (
                                                            <p className="text-sm italic mt-2 text-green-700">
                                                                Your comment: "{leave.approverComments}"
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <Badge className="bg-green-600">
                                                    <Check className="h-3 w-3 mr-1" />
                                                    Approved
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </TabsContent>

                        <TabsContent value="rejected" className="space-y-3">
                            {rejectedLeaves.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <X className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No rejected leaves</p>
                                </div>
                            ) : (
                                rejectedLeaves.map((leave) => (
                                    <Card key={leave.id} className="border-red-200 bg-red-50 dark:bg-red-950/20">
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={getEmployeeAvatar(leave.employeeId)} />
                                                        <AvatarFallback>
                                                            {getEmployeeName(leave.employeeId).split(' ').map(n => n[0]).join('')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-semibold">{getEmployeeName(leave.employeeId)}</div>
                                                        <div className="text-sm text-muted-foreground mt-1">
                                                            <Badge variant="outline" className="mr-2">{leave.type}</Badge>
                                                            {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                                        </div>
                                                        {leave.approverComments && (
                                                            <p className="text-sm italic mt-2 text-red-700">
                                                                Your comment: "{leave.approverComments}"
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <Badge variant="destructive">
                                                    <X className="h-3 w-3 mr-1" />
                                                    Rejected
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

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
                                <div className="font-semibold mb-2">
                                    {getEmployeeName(selectedLeave.employeeId)} - {selectedLeave.type}
                                </div>
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
