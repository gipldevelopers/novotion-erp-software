'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Wallet } from 'lucide-react';

export default function CustomerPayments({ payments }) {
    if (!payments || payments.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <Wallet className="h-8 w-8 mb-2 opacity-50" />
                    <p>No payment history available.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Records of received payments.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Payment ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Invoice</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payments.map((pay) => (
                            <TableRow key={pay.id}>
                                <TableCell className="font-medium">{pay.id}</TableCell>
                                <TableCell>{new Date(pay.date).toLocaleDateString()}</TableCell>
                                <TableCell>{pay.method}</TableCell>
                                <TableCell>{pay.invoiceId}</TableCell>
                                <TableCell className="text-right font-medium text-green-600">+${pay.amount.toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
