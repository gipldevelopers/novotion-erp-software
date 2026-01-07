// Updated: 2025-12-27
'use client';

import React, { useMemo, useState } from 'react';
import { hrmsService } from '@/services/hrmsService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function EmployeeExit({ employeeId, employeeStatus, exit, onChange }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [mode, setMode] = useState('Resigned');
    const [reason, setReason] = useState('');
    const [lastWorkingDay, setLastWorkingDay] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);

    const isOffboarded = employeeStatus === 'Resigned' || employeeStatus === 'Terminated';

    const statusText = useMemo(() => {
        if (!exit) return null;
        return `${exit.status}${exit.lastWorkingDay ? ` • LWD: ${exit.lastWorkingDay}` : ''}`;
    }, [exit]);

    const openDialog = (nextMode) => {
        setMode(nextMode);
        setReason('');
        setNotes('');
        setLastWorkingDay(new Date().toISOString().split('T')[0]);
        setDialogOpen(true);
    };

    const handleConfirm = async () => {
        setSaving(true);
        try {
            const updated = await hrmsService.offboardEmployee(employeeId, { status: mode, reason, lastWorkingDay, notes });
            if (!updated) throw new Error('Failed');
            toast.success(`Employee ${mode.toLowerCase()} processed`);
            setDialogOpen(false);
            if (typeof onChange === 'function') await onChange();
        } catch {
            toast.error('Failed to process offboarding');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card className="border-destructive/50">
            <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" /> Offboarding Zone
                </CardTitle>
                <CardDescription>Manage employee resignation and termination.</CardDescription>
            </CardHeader>
            <CardContent>
                {isOffboarded && (
                    <div className="mb-4 rounded-md border border-destructive/20 bg-destructive/10 p-4">
                        <div className="font-semibold text-destructive">Offboarding completed</div>
                        <div className="text-sm text-muted-foreground mt-1">{statusText}</div>
                    </div>
                )}
                <p className="text-sm text-muted-foreground mb-4">
                    Initiating the offboarding process will trigger a series of tasks including asset recovery, exit interview scheduling, and account deactivation. This action should only be taken when an employee has formally resigned or is being terminated.
                </p>
                <div className="bg-destructive/10 p-4 rounded-md border border-destructive/20">
                    <h4 className="font-semibold text-destructive mb-2">Danger Zone</h4>
                    <div className="flex gap-4">
                        <Button variant="destructive" disabled={isOffboarded} onClick={() => openDialog('Terminated')}>Initiate Termination</Button>
                        <Button variant="outline" disabled={isOffboarded} className="text-destructive hover:bg-destructive/10" onClick={() => openDialog('Resigned')}>Process Resignation</Button>
                    </div>
                </div>
            </CardContent>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[560px]">
                    <DialogHeader>
                        <DialogTitle>{mode === 'Terminated' ? 'Terminate employee' : 'Process resignation'}</DialogTitle>
                        <DialogDescription>Update status and capture exit details.</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-2">
                        <div className="grid gap-2">
                            <Label>Last working day</Label>
                            <Input type="date" value={lastWorkingDay} onChange={(e) => setLastWorkingDay(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Reason</Label>
                            <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder={mode === 'Terminated' ? 'Policy violation, performance, ...' : 'Personal, better opportunity, ...'} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Notes</Label>
                            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes for HR records" />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" type="button" disabled={saving} onClick={handleConfirm}>
                            {saving ? 'Processing...' : 'Confirm'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
