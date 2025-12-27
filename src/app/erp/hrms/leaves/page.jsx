'use client';

import React, { useEffect, useState } from 'react';
import { hrmsService } from '@/services/hrmsService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Check, X, Clock, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function LeavesPage() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [requestData, setRequestData] = useState({
        employeeId: 'EMP-001', // Default to current user mock
        type: 'Casual Leave',
        startDate: '',
        endDate: '',
        reason: ''
    });

    const fetchLeaves = async () => {
        try {
            const data = await hrmsService.getLeaves();
            setLeaves(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const handleAction = (id, action) => {
        setLeaves(leaves.map(l => l.id === id ? { ...l, status: action } : l));
        toast.success(`Leave request ${action.toLowerCase()}ed.`);
    };

    const handleSubmitRequest = async (e) => {
        e.preventDefault();
        try {
            await hrmsService.createLeaveRequest(requestData);
            toast.success("Leave request submitted successfully");
            setIsDialogOpen(false);
            fetchLeaves();
        } catch (error) {
            toast.error("Failed to submit request");
        }
    };

    const PendingLeaves = () => (
        <div className="space-y-4">
            {leaves.filter(l => l.status === 'Pending').map(leave => (
                <Card key={leave.id}>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="font-semibold">{leave.employeeId} - {leave.type}</div>
                            <div className="text-sm text-muted-foreground">
                                {new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}
                            </div>
                            <p className="text-sm italic">"{leave.reason}"</p>
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleAction(leave.id, 'Approved')}>
                                <Check className="mr-1 h-4 w-4" /> Approve
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleAction(leave.id, 'Rejected')}>
                                <X className="mr-1 h-4 w-4" /> Reject
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
            {leaves.filter(l => l.status === 'Pending').length === 0 && (
                <div className="text-center py-8 text-muted-foreground">No pending requests.</div>
            )}
        </div>
    );

    const HistoryLeaves = () => (
        <div className="space-y-4">
            {leaves.filter(l => l.status !== 'Pending').map(leave => (
                <Card key={leave.id}>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="font-semibold flex items-center gap-2">
                                {leave.employeeId} <span className="text-muted-foreground">•</span> {leave.type}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}
                            </div>
                        </div>
                        <Badge variant={leave.status === 'Approved' ? 'default' : 'destructive'}>
                            {leave.status}
                        </Badge>
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Leave Management</h2>
                    <p className="text-muted-foreground">Review and manage time-off requests.</p>
                </div>
                <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> New Request
                </Button>
            </div>

            <Tabs defaultValue="pending" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="pending">Pending Requests</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                <TabsContent value="pending">
                    <PendingLeaves />
                </TabsContent>
                <TabsContent value="history">
                    <HistoryLeaves />
                </TabsContent>
            </Tabs>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Request Leave</DialogTitle>
                        <DialogDescription>Submit your time off request for approval.</DialogDescription>
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
                                    <SelectItem value="Emergency Leave">Emergency Leave</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Start Date</Label>
                                <Input type="date" value={requestData.startDate} onChange={(e) => setRequestData({ ...requestData, startDate: e.target.value })} required />
                            </div>
                            <div className="grid gap-2">
                                <Label>End Date</Label>
                                <Input type="date" value={requestData.endDate} onChange={(e) => setRequestData({ ...requestData, endDate: e.target.value })} required />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Reason</Label>
                            <Textarea value={requestData.reason} onChange={(e) => setRequestData({ ...requestData, reason: e.target.value })} required />
                        </div>
                        <DialogFooter>
                            <Button type="submit">Submit Request</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
