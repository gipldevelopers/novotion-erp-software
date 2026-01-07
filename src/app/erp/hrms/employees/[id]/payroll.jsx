// Updated: 2025-12-27
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, DollarSign } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function EmployeePayroll({ payroll }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Payroll History</CardTitle>
                <CardDescription>Salary slips and payment status.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Month</TableHead>
                            <TableHead>Basic Salary</TableHead>
                            <TableHead>Net Salary</TableHead>
                            <TableHead>Payment Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Payslip</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payroll.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground">No payroll records found.</TableCell>
                            </TableRow>
                        ) : (
                            payroll.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell className="font-medium">{record.month}</TableCell>
                                    <TableCell>${record.basic.toLocaleString()}</TableCell>
                                    <TableCell className="text-green-600 font-bold">${record.netSalary.toLocaleString()}</TableCell>
                                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="border-green-500 text-green-500">
                                            {record.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">
                                            <Download className="mr-2 h-4 w-4" /> Download
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
