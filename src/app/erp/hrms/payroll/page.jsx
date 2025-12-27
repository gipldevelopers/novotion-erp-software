// Updated: 2025-12-27
'use client';

import React, { useEffect, useState } from 'react';
import { hrmsService } from '@/services/hrmsService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, PlayCircle } from 'lucide-react';

export default function PayrollPage() {
    const [payroll, setPayroll] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayroll = async () => {
            try {
                const data = await hrmsService.getPayroll();
                setPayroll(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPayroll();
    }, []);

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Payroll</h2>
                    <p className="text-muted-foreground">Process and view salary disbursements.</p>
                </div>
                <Button>
                    <PlayCircle className="mr-2 h-4 w-4" /> Run Payroll (Nov 2024)
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Payout</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$125,430</div>
                        <p className="text-xs text-muted-foreground">For November 2024</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending Processing</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">3 Employees</div>
                        <p className="text-xs text-muted-foreground">Review required</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Salary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$9,200</div>
                        <p className="text-xs text-muted-foreground">Per employee</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Disbursement History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee ID</TableHead>
                                <TableHead>Month</TableHead>
                                <TableHead>Basic</TableHead>
                                <TableHead>Allowances</TableHead>
                                <TableHead>Deductions</TableHead>
                                <TableHead>Net Pay</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={8} className="text-center py-6">Loading data...</TableCell></TableRow>
                            ) : payroll.length === 0 ? (
                                <TableRow><TableCell colSpan={8} className="text-center py-6">No records found.</TableCell></TableRow>
                            ) : (
                                payroll.map((record) => (
                                    <TableRow key={record.id}>
                                        <TableCell className="font-medium">{record.employeeId}</TableCell>
                                        <TableCell>{record.month}</TableCell>
                                        <TableCell>${record.basic.toLocaleString()}</TableCell>
                                        <TableCell>${record.allowances.toLocaleString()}</TableCell>
                                        <TableCell className="text-red-500">-${record.deductions.toLocaleString()}</TableCell>
                                        <TableCell className="font-bold text-green-600">${record.netSalary.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={record.status === 'Paid' ? 'default' : 'outline'}>{record.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
