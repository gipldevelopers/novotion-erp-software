'use client';

import React, { useEffect, useState } from 'react';
import { hrmsService } from '@/services/hrmsService';
import { useHRMSRole } from '@/hooks/useHRMSRole';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, FileText, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function MyPayslipsPage() {
    const router = useRouter();
    const { employeeId } = useHRMSRole();
    const [payslips, setPayslips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!employeeId) {
            router.push('/erp/hrms/dashboard');
            return;
        }
        loadPayslips();
    }, [employeeId]);

    const loadPayslips = async () => {
        try {
            const data = await hrmsService.getPayslips(employeeId);
            setPayslips(data);
        } catch (error) {
            console.error('Failed to load payslips:', error);
            toast.error('Failed to load payslips');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (payslip) => {
        toast.success(`Downloading payslip for ${payslip.month}`);
        // In a real app, this would download the actual PDF
    };

    const calculateYTD = () => {
        const ytdGross = payslips.reduce((sum, p) => sum + p.basic + p.allowances, 0);
        const ytdDeductions = payslips.reduce((sum, p) => sum + p.deductions, 0);
        const ytdNet = payslips.reduce((sum, p) => sum + p.netSalary, 0);
        return { ytdGross, ytdDeductions, ytdNet };
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
            </div>
        );
    }

    const ytd = calculateYTD();

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Payslips</h1>
                <p className="text-muted-foreground mt-1">
                    View and download your salary statements
                </p>
            </div>

            {/* YTD Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            YTD Gross Salary
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${ytd.ytdGross.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">Year to date</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            YTD Deductions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">-${ytd.ytdDeductions.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">Taxes & other deductions</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            YTD Net Salary
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">${ytd.ytdNet.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">Total received</p>
                    </CardContent>
                </Card>
            </div>

            {/* Payslips Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Salary Statements</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Month</TableHead>
                                <TableHead>Basic Salary</TableHead>
                                <TableHead>Allowances</TableHead>
                                <TableHead>Deductions</TableHead>
                                <TableHead>Net Salary</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payslips.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>No payslips available</p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                payslips.map((payslip) => (
                                    <TableRow key={payslip.id}>
                                        <TableCell className="font-medium">{payslip.month}</TableCell>
                                        <TableCell>${payslip.basic.toLocaleString()}</TableCell>
                                        <TableCell className="text-green-600">+${payslip.allowances.toLocaleString()}</TableCell>
                                        <TableCell className="text-red-600">-${payslip.deductions.toLocaleString()}</TableCell>
                                        <TableCell className="font-bold text-green-600">${payslip.netSalary.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={payslip.status === 'Paid' ? 'default' : 'outline'}>
                                                {payslip.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDownload(payslip)}
                                            >
                                                <Download className="h-4 w-4 mr-2" />
                                                Download
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Salary Breakdown for Latest Month */}
            {payslips.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Latest Salary Breakdown - {payslips[0].month}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <h3 className="font-semibold mb-3 text-green-700">Earnings</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-sm">Basic Salary</span>
                                            <span className="font-medium">${payslips[0].basic.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-sm">Allowances</span>
                                            <span className="font-medium">${payslips[0].allowances.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between py-2 font-bold text-green-700">
                                            <span>Gross Salary</span>
                                            <span>${(payslips[0].basic + payslips[0].allowances).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-3 text-red-700">Deductions</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-sm">Tax</span>
                                            <span className="font-medium">${Math.round(payslips[0].deductions * 0.7).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-sm">Other Deductions</span>
                                            <span className="font-medium">${Math.round(payslips[0].deductions * 0.3).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between py-2 font-bold text-red-700">
                                            <span>Total Deductions</span>
                                            <span>-${payslips[0].deductions.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold">Net Salary</span>
                                    <span className="text-2xl font-bold text-green-600">
                                        ${payslips[0].netSalary.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
