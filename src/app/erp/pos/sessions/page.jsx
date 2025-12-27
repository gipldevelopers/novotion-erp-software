'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, DollarSign, TrendingUp, AlertCircle, CheckCircle2, XCircle, PlayCircle, StopCircle } from 'lucide-react';
import { sessions as mockSessions } from '@/services/posMockData';
import { usePosStore } from '@/stores/posStore';

export default function SessionsPage() {
    const [sessions, setSessions] = useState(mockSessions);
    const [isOpenDialogOpen, setIsOpenDialogOpen] = useState(false);
    const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);
    const [openingCash, setOpeningCash] = useState('5000');
    const [closingCash, setClosingCash] = useState('');
    const { currentSession, openSession, closeSession } = usePosStore();

    const activeSession = sessions.find(s => s.status === 'open');

    const handleOpenSession = () => {
        const newSession = {
            id: `SES-${Date.now()}`,
            userId: 'admin',
            userName: 'Current User',
            openedAt: new Date().toISOString(),
            closedAt: null,
            openingCash: parseFloat(openingCash),
            closingCash: null,
            expectedCash: null,
            variance: null,
            totalSales: 0,
            invoiceCount: 0,
            status: 'open',
        };
        setSessions([newSession, ...sessions]);
        openSession(newSession);
        setIsOpenDialogOpen(false);
        setOpeningCash('5000');
    };

    const handleCloseSession = () => {
        if (!activeSession) return;

        const closingAmount = parseFloat(closingCash);
        const expectedAmount = activeSession.openingCash + activeSession.totalSales;
        const variance = closingAmount - expectedAmount;

        const updatedSession = {
            ...activeSession,
            closedAt: new Date().toISOString(),
            closingCash: closingAmount,
            expectedCash: expectedAmount,
            variance: variance,
            status: 'closed',
        };

        setSessions(sessions.map(s => s.id === activeSession.id ? updatedSession : s));
        closeSession();
        setIsCloseDialogOpen(false);
        setClosingCash('');
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Cash Sessions</h2>
                    <p className="text-muted-foreground mt-1">Manage cash register sessions and reconciliation.</p>
                </div>
                {activeSession ? (
                    <Button variant="destructive" onClick={() => setIsCloseDialogOpen(true)}>
                        <StopCircle className="mr-2 h-4 w-4" /> Close Session
                    </Button>
                ) : (
                    <Button onClick={() => setIsOpenDialogOpen(true)}>
                        <PlayCircle className="mr-2 h-4 w-4" /> Open Session
                    </Button>
                )}
            </div>

            {/* Active Session Card */}
            {activeSession && (
                <Card className="border-2 border-primary shadow-lg bg-card">
                    <CardHeader className="bg-primary/5 border-b border-primary/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                                    Active Session
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    Started {new Date(activeSession.openedAt).toLocaleString('en-IN')}
                                </CardDescription>
                            </div>
                            <Badge className="bg-green-600 hover:bg-green-700">Live</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <div className="text-sm text-muted-foreground">Opening Cash</div>
                                <div className="text-2xl font-bold text-foreground">
                                    ₹{activeSession.openingCash.toLocaleString('en-IN')}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-sm text-muted-foreground">Sales Today</div>
                                <div className="text-2xl font-bold text-green-600 dark:text-green-500">
                                    ₹{activeSession.totalSales.toLocaleString('en-IN')}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-sm text-muted-foreground">Invoices</div>
                                <div className="text-2xl font-bold text-foreground">
                                    {activeSession.invoiceCount}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-sm text-muted-foreground">Expected Cash</div>
                                <div className="text-2xl font-bold text-primary">
                                    ₹{(activeSession.openingCash + activeSession.totalSales).toLocaleString('en-IN')}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Session History */}
            <Card className="border shadow-sm bg-card">
                <CardHeader className="border-b border-border bg-muted/20">
                    <CardTitle>Session History</CardTitle>
                    <CardDescription>Past cash register sessions and reconciliation records</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                                <TableHead className="pl-6">Session ID</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Opened</TableHead>
                                <TableHead>Closed</TableHead>
                                <TableHead className="text-right">Opening</TableHead>
                                <TableHead className="text-right">Sales</TableHead>
                                <TableHead className="text-right">Expected</TableHead>
                                <TableHead className="text-right">Actual</TableHead>
                                <TableHead className="text-right">Variance</TableHead>
                                <TableHead className="text-right pr-6">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sessions.map((session) => (
                                <TableRow key={session.id} className="hover:bg-muted/50">
                                    <TableCell className="pl-6 font-mono text-sm font-medium text-foreground">
                                        {session.id}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {session.userName}
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {new Date(session.openedAt).toLocaleString('en-IN')}
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {session.closedAt ? new Date(session.closedAt).toLocaleString('en-IN') : '-'}
                                    </TableCell>
                                    <TableCell className="text-right font-semibold text-foreground">
                                        ₹{session.openingCash.toLocaleString('en-IN')}
                                    </TableCell>
                                    <TableCell className="text-right font-semibold text-green-600 dark:text-green-500">
                                        ₹{session.totalSales.toLocaleString('en-IN')}
                                    </TableCell>
                                    <TableCell className="text-right font-semibold text-foreground">
                                        {session.expectedCash !== null
                                            ? `₹${session.expectedCash.toLocaleString('en-IN')}`
                                            : '-'}
                                    </TableCell>
                                    <TableCell className="text-right font-semibold text-foreground">
                                        {session.closingCash !== null
                                            ? `₹${session.closingCash.toLocaleString('en-IN')}`
                                            : '-'}
                                    </TableCell>
                                    <TableCell className="text-right font-bold">
                                        {session.variance !== null ? (
                                            <span className={session.variance === 0
                                                ? 'text-green-600 dark:text-green-500'
                                                : session.variance > 0
                                                    ? 'text-blue-600 dark:text-blue-500'
                                                    : 'text-red-600 dark:text-red-500'
                                            }>
                                                {session.variance > 0 ? '+' : ''}₹{session.variance.toLocaleString('en-IN')}
                                            </span>
                                        ) : '-'}
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        {session.status === 'open' ? (
                                            <Badge className="bg-green-600 hover:bg-green-700">
                                                <Clock className="h-3 w-3 mr-1" /> Open
                                            </Badge>
                                        ) : session.variance === 0 ? (
                                            <Badge variant="outline" className="text-green-600 border-green-600">
                                                <CheckCircle2 className="h-3 w-3 mr-1" /> Balanced
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                                                <AlertCircle className="h-3 w-3 mr-1" /> Variance
                                            </Badge>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Open Session Dialog */}
            <Dialog open={isOpenDialogOpen} onOpenChange={setIsOpenDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Open Cash Session</DialogTitle>
                        <DialogDescription>
                            Start a new cash register session by entering the opening cash amount.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="opening-cash">Opening Cash Amount</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">
                                    ₹
                                </span>
                                <Input
                                    id="opening-cash"
                                    type="number"
                                    step="0.01"
                                    className="pl-7 h-12 text-lg font-semibold"
                                    value={openingCash}
                                    onChange={(e) => setOpeningCash(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Count the cash in the register before starting the session
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOpenDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleOpenSession} disabled={!openingCash || parseFloat(openingCash) < 0}>
                            <PlayCircle className="h-4 w-4 mr-2" />
                            Open Session
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Close Session Dialog */}
            <Dialog open={isCloseDialogOpen} onOpenChange={setIsCloseDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Close Cash Session</DialogTitle>
                        <DialogDescription>
                            Count the cash in the register and enter the closing amount for reconciliation.
                        </DialogDescription>
                    </DialogHeader>
                    {activeSession && (
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-md">
                                <div>
                                    <div className="text-xs text-muted-foreground">Opening Cash</div>
                                    <div className="text-lg font-bold">₹{activeSession.openingCash.toLocaleString('en-IN')}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">Total Sales</div>
                                    <div className="text-lg font-bold text-green-600">
                                        +₹{activeSession.totalSales.toLocaleString('en-IN')}
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <div className="text-xs text-muted-foreground">Expected Cash</div>
                                    <div className="text-2xl font-bold text-primary">
                                        ₹{(activeSession.openingCash + activeSession.totalSales).toLocaleString('en-IN')}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="closing-cash">Actual Closing Cash</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">
                                        ₹
                                    </span>
                                    <Input
                                        id="closing-cash"
                                        type="number"
                                        step="0.01"
                                        className="pl-7 h-12 text-lg font-semibold"
                                        value={closingCash}
                                        onChange={(e) => setClosingCash(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                {closingCash && (
                                    <div className="mt-2 p-3 bg-muted/50 rounded-md">
                                        <div className="text-xs text-muted-foreground mb-1">Variance</div>
                                        <div className={`text-xl font-bold ${parseFloat(closingCash) - (activeSession.openingCash + activeSession.totalSales) === 0
                                                ? 'text-green-600'
                                                : parseFloat(closingCash) - (activeSession.openingCash + activeSession.totalSales) > 0
                                                    ? 'text-blue-600'
                                                    : 'text-red-600'
                                            }`}>
                                            {parseFloat(closingCash) - (activeSession.openingCash + activeSession.totalSales) > 0 ? '+' : ''}
                                            ₹{(parseFloat(closingCash) - (activeSession.openingCash + activeSession.totalSales)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCloseDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleCloseSession}
                            disabled={!closingCash || parseFloat(closingCash) < 0}
                        >
                            <StopCircle className="h-4 w-4 mr-2" />
                            Close Session
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
