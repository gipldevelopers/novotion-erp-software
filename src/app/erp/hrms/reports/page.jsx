'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileBarChart2 } from 'lucide-react';

export default function ReportsPage() {
    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">HR Reports</h2>
                    <p className="text-muted-foreground">Generate insights and export data.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {['Attendance Summary', 'Payroll Expense', 'Employee Retention', 'Leave Utilization', 'Performance Metrix'].map((report) => (
                    <Card key={report} className="hover:bg-muted/50 transition-colors cursor-pointer group">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileBarChart2 className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                {report}
                            </CardTitle>
                            <CardDescription>Monthly Report</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full">Generate PDF</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
