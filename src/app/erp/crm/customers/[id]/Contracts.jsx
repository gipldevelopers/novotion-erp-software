// app/erp/crm/customers/[id]/Contracts.jsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Shield } from 'lucide-react';
import { format } from 'date-fns';

export default function CustomerContracts({ contracts }) {
    if (!contracts || contracts.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <Shield className="h-8 w-8 mb-2 opacity-50" />
                    <p>No active contracts.</p>
                    <Button variant="outline" size="sm" className="mt-4">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Contract
                    </Button>
                </CardContent>
            </Card>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
            case 'Expired': return 'bg-red-500/10 text-red-600 border-red-200';
            case 'Draft': return 'bg-gray-500/10 text-gray-600 border-gray-200';
            default: return 'bg-blue-500/10 text-blue-600 border-blue-200';
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Contracts & AMC</CardTitle>
                    <CardDescription>Active service agreements and contracts.</CardDescription>
                </div>
                <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    New Contract
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Contract ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {contracts.map((contract) => (
                            <TableRow key={contract.id}>
                                <TableCell className="font-medium">{contract.id}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        {contract.title}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm">
                                        {format(new Date(contract.startDate), 'MMM d, yyyy')} - {format(new Date(contract.endDate), 'MMM d, yyyy')}
                                    </div>
                                </TableCell>
                                <TableCell>₹{contract.value.toLocaleString()}</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant="outline" className={getStatusColor(contract.status)}>
                                        {contract.status}
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
