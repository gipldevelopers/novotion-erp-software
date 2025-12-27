'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Filter, MoreHorizontal, FileText, Printer, Edit, Trash2, Download, Eye } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { invoices as mockInvoices, clients } from '@/services/posMockData';
import { InvoiceTemplate } from '../billing/InvoiceTemplate';

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const { hasPermission } = useAuthStore();

    useEffect(() => {
        const resolvedStaticInvoices = mockInvoices.map(order => {
            let client = order.client;
            if (!client && order.clientId) {
                client = clients.find(c => c.id === order.clientId);
            }
            if (!client) {
                client = { name: 'Unknown Client', gstin: '' };
            }
            return { ...order, client };
        });

        const generatedInvoices = Array.from({ length: 10 }).map((_, i) => ({
            id: `INV-2024-${(100 + i).toString()}`,
            invoiceNumber: `INV-2024-${(100 + i).toString()}`,
            date: new Date(Date.now() - i * 86400000).toISOString(),
            client: { name: i % 2 === 0 ? 'Acme Corp' : 'Walk-in Client', gstin: '29AAAAA0000A1Z5' },
            total: (Math.random() * 5000 + 1000).toFixed(0),
            status: i === 0 ? 'Pending' : 'paid',
            items: [{ name: 'Consulting', price: 1000, quantity: 1, description: 'Service Charge' }],
            subtotal: 1000,
            taxTotal: 180,
            discount: 0,
            amountPaid: (Math.random() * 5000 + 1000).toFixed(0),
            paymentMethod: 'UPI'
        }));

        setInvoices([...resolvedStaticInvoices, ...generatedInvoices]);
    }, []);

    const filteredInvoices = invoices.filter(inv => {
        const idMatch = inv.id ? inv.id.toLowerCase().includes(searchTerm.toLowerCase()) : false;
        const clientMatch = inv.client?.name ? inv.client.name.toLowerCase().includes(searchTerm.toLowerCase()) : false;
        return idMatch || clientMatch;
    });

    const handleDelete = (id) => {
        if (confirm('Delete invoice?')) {
            setInvoices(invoices.filter(i => i.id !== id));
        }
    };

    const handleEdit = (id) => {
        alert('Edit feature disabled in demo.');
    };

    const handleView = (invoice) => {
        const fullInvoice = {
            ...invoice,
            items: invoice.items || [],
            subtotal: invoice.subtotal || parseFloat(invoice.total) * 0.8,
            taxTotal: invoice.taxTotal || parseFloat(invoice.total) * 0.18,
            discount: invoice.discount || 0,
            amountPaid: parseFloat(invoice.amountPaid || invoice.total),
            paymentMethod: invoice.paymentMethod || 'Cash'
        };
        setSelectedInvoice(fullInvoice);
        setIsPreviewOpen(true);
    };

    const canEdit = hasPermission('invoices.edit');
    const canDelete = hasPermission('invoices.delete');

    return (
        <div className="p-8 space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Invoices</h2>
                    <p className="text-muted-foreground mt-1">Archive of all generated bills.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Export CSV</Button>
                </div>
            </div>

            <Card className="border shadow-sm bg-card text-card-foreground">
                <div className="p-4 border-b border-border flex justify-between items-center">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search invoice #..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="ghost" size="sm"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                            <TableHead className="pl-6">Invoice #</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredInvoices.map((inv) => (
                            <TableRow key={inv.id} className="hover:bg-muted/50">
                                <TableCell className="pl-6 font-medium font-mono text-foreground">
                                    {inv.id}
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                    {inv.date ? new Date(inv.date).toLocaleDateString() : 'N/A'}
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium text-sm text-foreground">
                                        {inv.customer?.name || 'Unknown'}
                                    </div>
                                </TableCell>
                                <TableCell className="font-bold text-foreground">
                                    ₹{parseFloat(inv.total || 0).toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={inv.status === 'Paid' ? 'outline' : 'secondary'}>
                                        {inv.status || 'Pending'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/50">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => handleView(inv)}>
                                                <Eye className="mr-2 h-4 w-4" /> View
                                            </DropdownMenuItem>
                                            {canEdit && (
                                                <DropdownMenuItem onClick={() => handleEdit(inv.id)}>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                            )}
                                            {canDelete && (
                                                <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => handleDelete(inv.id)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-none bg-background">
                    <DialogHeader className="p-4 bg-background border-b border-border sticky top-0 z-10 flex flex-row items-center justify-between">
                        <DialogTitle>Invoice Preview</DialogTitle>
                        <Button size="sm" variant="ghost" onClick={() => setIsPreviewOpen(false)}>Close</Button>
                    </DialogHeader>
                    <div className="p-8 flex justify-center bg-muted/20">
                        {selectedInvoice && (
                            <InvoiceTemplate
                                invoice={selectedInvoice}
                                company={{
                                    name: 'Novotion Tech Solutions',
                                    address: '123 Tech Park', city: 'Bangalore', state: 'KA', zip: '560001', gstin: '29ABCDE1234F1Z5'
                                }}
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
