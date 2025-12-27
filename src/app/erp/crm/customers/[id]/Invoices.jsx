'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';

export default function CustomerInvoices({ invoices }) {
    if (!invoices || invoices.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <FileText className="h-8 w-8 mb-2 opacity-50" />
                    <p>No invoices found for this customer.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Invoices</CardTitle>
                <CardDescription>Recent invoices generated.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Invoice ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((inv) => (
                            <TableRow key={inv.id}>
                                <TableCell className="font-medium">{inv.id}</TableCell>
                                <TableCell>{new Date(inv.date).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(inv.dueDate).toLocaleDateString()}</TableCell>
                                <TableCell>${inv.amount.toLocaleString()}</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant={inv.status === 'Paid' ? 'outline' : inv.status === 'Overdue' ? 'destructive' : 'default'} className={inv.status === 'Paid' ? 'border-green-600 text-green-600' : ''}>
                                        {inv.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
