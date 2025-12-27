// Updated: 2025-12-27
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const data = [
    { name: 'Jan', Sales: 4000, Leads: 2400 },
    { name: 'Feb', Sales: 3000, Leads: 1398 },
    { name: 'Mar', Sales: 2000, Leads: 9800 },
    { name: 'Apr', Sales: 2780, Leads: 3908 },
    { name: 'May', Sales: 1890, Leads: 4800 },
    { name: 'Jun', Sales: 2390, Leads: 3800 },
];

export default function ReportsPage() {
    return (
        <div className="space-y-6 p-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">CRM Analysis</h2>
                <p className="text-muted-foreground">Deep dive into your sales and customer data.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Sales vs Leads</CardTitle>
                        <CardDescription>Comparative analysis for H1 2024</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{ fill: 'transparent' }} />
                                <Legend />
                                <Bar dataKey="Sales" fill="#8884d8" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Leads" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Customer Growth</CardTitle>
                        <CardDescription>New customers acquired per month</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                        Details chart pending...
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Revenue by Source</CardTitle>
                        <CardDescription>Which channels drive the most value</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                        Details chart pending...
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
