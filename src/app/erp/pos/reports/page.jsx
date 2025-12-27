'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, ShoppingCart, Users, Download, Calendar, BarChart3 } from 'lucide-react';
import { invoices, services, clients } from '@/services/posMockData';

export default function ReportsPage() {
    const [dateRange, setDateRange] = useState('all');
    const [reportType, setReportType] = useState('sales');

    // Filter invoices by date range
    const filteredInvoices = useMemo(() => {
        const now = new Date();
        return invoices.filter(inv => {
            const invDate = new Date(inv.date);
            switch (dateRange) {
                case 'today':
                    return invDate.toDateString() === now.toDateString();
                case 'week':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return invDate >= weekAgo;
                case 'month':
                    return invDate.getMonth() === now.getMonth() && invDate.getFullYear() === now.getFullYear();
                case 'year':
                    return invDate.getFullYear() === now.getFullYear();
                default:
                    return true;
            }
        });
    }, [dateRange]);

    // Calculate metrics
    const metrics = useMemo(() => {
        const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + parseFloat(inv.total), 0);
        const totalTax = filteredInvoices.reduce((sum, inv) => sum + parseFloat(inv.taxTotal), 0);
        const totalDiscount = filteredInvoices.reduce((sum, inv) => sum + parseFloat(inv.discount || 0), 0);
        const avgOrderValue = filteredInvoices.length > 0 ? totalRevenue / filteredInvoices.length : 0;

        return {
            totalRevenue,
            totalTax,
            totalDiscount,
            avgOrderValue,
            invoiceCount: filteredInvoices.length,
        };
    }, [filteredInvoices]);

    // Service-wise analysis
    const serviceAnalysis = useMemo(() => {
        const serviceMap = new Map();

        filteredInvoices.forEach(inv => {
            (inv.items || []).forEach(item => {
                const existing = serviceMap.get(item.serviceId) || {
                    name: item.name,
                    quantity: 0,
                    revenue: 0,
                    count: 0,
                };
                serviceMap.set(item.serviceId, {
                    ...existing,
                    quantity: existing.quantity + item.quantity,
                    revenue: existing.revenue + item.amount,
                    count: existing.count + 1,
                });
            });
        });

        return Array.from(serviceMap.entries())
            .map(([id, data]) => ({ id, ...data }))
            .sort((a, b) => b.revenue - a.revenue);
    }, [filteredInvoices]);

    // Client-wise analysis
    const clientAnalysis = useMemo(() => {
        const clientMap = new Map();

        filteredInvoices.forEach(inv => {
            const clientId = inv.clientId || inv.client?.id;
            const clientName = inv.client?.name || 'Walk-in';

            const existing = clientMap.get(clientId) || {
                name: clientName,
                revenue: 0,
                invoiceCount: 0,
            };

            clientMap.set(clientId, {
                ...existing,
                revenue: existing.revenue + parseFloat(inv.total),
                invoiceCount: existing.invoiceCount + 1,
            });
        });

        return Array.from(clientMap.entries())
            .map(([id, data]) => ({ id, ...data }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);
    }, [filteredInvoices]);

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Reports & Analytics</h2>
                    <p className="text-muted-foreground mt-1">Comprehensive business insights and performance metrics.</p>
                </div>
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Export Report
                </Button>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-[200px]">
                        <Calendar className="mr-2 h-4 w-4" />
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="year">This Year</SelectItem>
                        <SelectItem value="all">All Time</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger className="w-[200px]">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="sales">Sales Report</SelectItem>
                        <SelectItem value="services">Service Analysis</SelectItem>
                        <SelectItem value="clients">Client Analysis</SelectItem>
                        <SelectItem value="tax">Tax Report</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border shadow-sm bg-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{metrics.totalRevenue.toLocaleString('en-IN')}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {filteredInvoices.length} invoices
                        </p>
                    </CardContent>
                </Card>

                <Card className="border shadow-sm bg-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{metrics.avgOrderValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Per transaction
                        </p>
                    </CardContent>
                </Card>

                <Card className="border shadow-sm bg-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tax Collected</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{metrics.totalTax.toLocaleString('en-IN')}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            GST @ 18%
                        </p>
                    </CardContent>
                </Card>

                <Card className="border shadow-sm bg-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Discounts</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-500">
                            ₹{metrics.totalDiscount.toLocaleString('en-IN')}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Customer savings
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Report Content */}
            {reportType === 'sales' && (
                <Card className="border shadow-sm bg-card">
                    <CardHeader className="border-b border-border bg-muted/20">
                        <CardTitle>Sales Summary</CardTitle>
                        <CardDescription>Detailed breakdown of sales performance</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <div className="text-sm text-muted-foreground">Gross Revenue</div>
                                    <div className="text-2xl font-bold">
                                        ₹{(metrics.totalRevenue + metrics.totalDiscount).toLocaleString('en-IN')}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-sm text-muted-foreground">Net Revenue</div>
                                    <div className="text-2xl font-bold text-primary">
                                        ₹{metrics.totalRevenue.toLocaleString('en-IN')}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-sm text-muted-foreground">Revenue Before Tax</div>
                                    <div className="text-xl font-semibold">
                                        ₹{(metrics.totalRevenue - metrics.totalTax).toLocaleString('en-IN')}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-sm text-muted-foreground">Tax Liability</div>
                                    <div className="text-xl font-semibold">
                                        ₹{metrics.totalTax.toLocaleString('en-IN')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {reportType === 'services' && (
                <Card className="border shadow-sm bg-card">
                    <CardHeader className="border-b border-border bg-muted/20">
                        <CardTitle>Service-Wise Revenue</CardTitle>
                        <CardDescription>Performance analysis by service type</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                    <TableHead className="pl-6">Service Name</TableHead>
                                    <TableHead className="text-center">Quantity Sold</TableHead>
                                    <TableHead className="text-center">Times Ordered</TableHead>
                                    <TableHead className="text-right pr-6">Revenue</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {serviceAnalysis.map((service, index) => (
                                    <TableRow key={service.id} className="hover:bg-muted/50">
                                        <TableCell className="pl-6 font-medium text-foreground">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="shrink-0">#{index + 1}</Badge>
                                                {service.name}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center font-semibold">
                                            {service.quantity}
                                        </TableCell>
                                        <TableCell className="text-center text-muted-foreground">
                                            {service.count}
                                        </TableCell>
                                        <TableCell className="text-right pr-6 font-bold text-foreground">
                                            ₹{service.revenue.toLocaleString('en-IN')}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {reportType === 'clients' && (
                <Card className="border shadow-sm bg-card">
                    <CardHeader className="border-b border-border bg-muted/20">
                        <CardTitle>Top Clients by Revenue</CardTitle>
                        <CardDescription>Customer contribution analysis</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                    <TableHead className="pl-6">Client Name</TableHead>
                                    <TableHead className="text-center">Invoices</TableHead>
                                    <TableHead className="text-right">Avg Order Value</TableHead>
                                    <TableHead className="text-right pr-6">Total Revenue</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clientAnalysis.map((client, index) => (
                                    <TableRow key={client.id} className="hover:bg-muted/50">
                                        <TableCell className="pl-6 font-medium text-foreground">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="shrink-0">#{index + 1}</Badge>
                                                {client.name}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge>{client.invoiceCount}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-semibold text-muted-foreground">
                                            ₹{(client.revenue / client.invoiceCount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                        </TableCell>
                                        <TableCell className="text-right pr-6 font-bold text-foreground">
                                            ₹{client.revenue.toLocaleString('en-IN')}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {reportType === 'tax' && (
                <Card className="border shadow-sm bg-card">
                    <CardHeader className="border-b border-border bg-muted/20">
                        <CardTitle>Tax Report</CardTitle>
                        <CardDescription>GST collection and liability summary</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            <div className="grid grid-cols-3 gap-6">
                                <div className="p-4 bg-muted/30 rounded-md">
                                    <div className="text-sm text-muted-foreground mb-2">CGST (9%)</div>
                                    <div className="text-2xl font-bold">
                                        ₹{(metrics.totalTax / 2).toLocaleString('en-IN')}
                                    </div>
                                </div>
                                <div className="p-4 bg-muted/30 rounded-md">
                                    <div className="text-sm text-muted-foreground mb-2">SGST (9%)</div>
                                    <div className="text-2xl font-bold">
                                        ₹{(metrics.totalTax / 2).toLocaleString('en-IN')}
                                    </div>
                                </div>
                                <div className="p-4 bg-primary/10 rounded-md border border-primary/20">
                                    <div className="text-sm text-muted-foreground mb-2">Total GST</div>
                                    <div className="text-2xl font-bold text-primary">
                                        ₹{metrics.totalTax.toLocaleString('en-IN')}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Taxable Amount</span>
                                    <span className="font-semibold">
                                        ₹{(metrics.totalRevenue - metrics.totalTax).toLocaleString('en-IN')}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Tax Rate</span>
                                    <span className="font-semibold">18%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Number of Taxable Transactions</span>
                                    <span className="font-semibold">{filteredInvoices.length}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
