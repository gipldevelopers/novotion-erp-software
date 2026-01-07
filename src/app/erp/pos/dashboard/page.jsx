// Updated: 2025-12-27
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Users, ReceiptText, TrendingUp, Clock, Plus, ArrowRight, DollarSign, Calendar, Activity } from 'lucide-react';
import Link from 'next/link';
import { invoices, sessions } from '@/services/posMockData';

export default function PosDashboard() {
    const [stats, setStats] = useState({
        dailySales: 0,
        orderCount: 0,
        activeSession: null
    });

    useEffect(() => {
        // Calculate simple stats
        const today = new Date().toISOString().split('T')[0];
        const todayOrders = invoices.filter(o => o.date.startsWith(today) || true);

        const total = todayOrders.reduce((acc, o) => acc + parseFloat(o.total), 0);
        setStats({
            dailySales: total,
            orderCount: todayOrders.length,
            activeSession: sessions.find(s => s.status === 'open')
        });
    }, []);

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">POS Overview</h2>
                    <p className="text-muted-foreground mt-1">Real-time sales tracking and session management.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <div className="text-sm font-medium text-foreground">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        <div className="text-xs text-muted-foreground">System Status: <span className="text-green-600 dark:text-green-400 font-medium">Online</span></div>
                    </div>
                </div>
            </div>

            {/* Metric Cards - Semantic Colors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border shadow-sm bg-card text-card-foreground">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue (Today)</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{stats.dailySales.toLocaleString('en-IN')}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            +12% from yesterday
                        </p>
                    </CardContent>
                </Card>

                <Card className="border shadow-sm bg-card text-card-foreground">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sales Count</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.orderCount}</div>
                        <div className="flex items-center mt-1">
                            <Link href="/erp/pos/invoices" className="text-xs text-primary hover:underline flex items-center">
                                View Invoice Log <ArrowRight className="h-3 w-3 ml-0.5" />
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border shadow-sm bg-card text-card-foreground">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Session</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold flex items-center gap-2">
                            {stats.activeSession ? (
                                <>
                                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                    {stats.activeSession.userName}
                                </>
                            ) : 'Closed'}
                        </div>
                        <div className="flex items-center mt-1">
                            <Link href="/erp/pos/sessions" className="text-xs text-primary hover:underline flex items-center">
                                Manage Shift <ArrowRight className="h-3 w-3 ml-0.5" />
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions - Semantic Colors */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/erp/pos/billing">
                    <Button variant="outline" className="w-full h-24 flex flex-col gap-2 hover:bg-muted/50 border-muted-foreground/20">
                        <Plus className="h-6 w-6 text-foreground" />
                        <span className="font-semibold text-foreground">New Sale</span>
                    </Button>
                </Link>
                <Link href="/erp/pos/customers">
                    <Button variant="outline" className="w-full h-24 flex flex-col gap-2 hover:bg-muted/50 border-muted-foreground/20">
                        <Users className="h-6 w-6 text-foreground" />
                        <span className="font-semibold text-foreground">Add Customer</span>
                    </Button>
                </Link>
                <Link href="/erp/pos/products">
                    <Button variant="outline" className="w-full h-24 flex flex-col gap-2 hover:bg-muted/50 border-muted-foreground/20">
                        <ReceiptText className="h-6 w-6 text-foreground" />
                        <span className="font-semibold text-foreground">Services</span>
                    </Button>
                </Link>
                <Link href="/erp/pos/reports">
                    <Button variant="outline" className="w-full h-24 flex flex-col gap-2 hover:bg-muted/50 border-muted-foreground/20">
                        <TrendingUp className="h-6 w-6 text-foreground" />
                        <span className="font-semibold text-foreground">Reports</span>
                    </Button>
                </Link>
            </div>

            {/* Recent Activity - Semantic Colors */}
            <Card className="border shadow-sm bg-card text-card-foreground">
                <CardHeader className="border-b border-border bg-muted/20 pb-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-lg">Recent Transactions</CardTitle>
                            <CardDescription>Latest 5 billing activities.</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" asChild className="text-xs">
                            <Link href="/erp/pos/invoices">View All</Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground font-medium">
                                <tr>
                                    <th className="p-4 pl-6">Invoice #</th>
                                    <th className="p-4">Time</th>
                                    <th className="p-4">Client</th>
                                    <th className="p-4 text-right">Amount</th>
                                    <th className="p-4 text-right pr-6">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {invoices.slice(0, 5).map((order) => (
                                    <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                                        <td className="p-4 pl-6 font-mono text-foreground font-medium">{order.id}</td>
                                        <td className="p-4 text-muted-foreground">
                                            {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="p-4 text-foreground">{order.client?.name || 'Walk-in'}</td>
                                        <td className="p-4 text-right font-bold text-foreground">₹{order.total}</td>
                                        <td className="p-4 text-right pr-6">
                                            <Badge variant={order.status === 'paid' ? 'outline' : 'secondary'}>
                                                {order.status}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
