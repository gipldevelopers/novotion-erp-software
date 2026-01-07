'use client';

import React, { useEffect, useState } from 'react';
import { hrmsService } from '@/services/hrmsService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, TrendingUp, Users, Calendar, Download, FileText, PieChart } from 'lucide-react';
import { toast } from 'sonner';

export default function PayrollPage() {
    const [payroll, setPayroll] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [payrollData, employeesData] = await Promise.all([
                hrmsService.getPayroll(),
                hrmsService.getEmployees()
            ]);
            setPayroll(payrollData);
            setEmployees(employeesData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getEmployeeName = (employeeId) => {
        const employee = employees.find(e => e.id === employeeId);
        return employee ? `${employee.firstName} ${employee.lastName}` : employeeId;
    };

    const getEmployeeDesignation = (employeeId) => {
        const employee = employees.find(e => e.id === employeeId);
        return employee?.designation || 'N/A';
    };

    // Calculate stats
    const totalPayout = payroll.reduce((sum, p) => sum + (p.netPay || 0), 0);
    const avgSalary = payroll.length > 0 ? totalPayout / payroll.length : 0;
    const pendingPayroll = payroll.filter(p => p.status === 'Pending').length;
    const processedPayroll = payroll.filter(p => p.status === 'Paid').length;

    // Department-wise breakdown
    const deptBreakdown = payroll.reduce((acc, p) => {
        const employee = employees.find(e => e.id === p.employeeId);
        const dept = employee?.department || 'Unknown';
        if (!acc[dept]) {
            acc[dept] = { count: 0, total: 0 };
        }
        acc[dept].count += 1;
        acc[dept].total += p.netPay || 0;
        return acc;
    }, {});

    const handleGeneratePayslip = (payrollId) => {
        toast.success('Payslip generated successfully');
    };

    const handleProcessPayroll = () => {
        toast.success('Payroll processing initiated');
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

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Payroll Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage employee salaries, process payroll, and generate reports
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                    </Button>
                    <Button onClick={handleProcessPayroll}>
                        <DollarSign className="h-4 w-4 mr-2" />
                        Process Payroll
                    </Button>
                </div>
            </div>

            {/* Period Selector */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Payroll Period:</span>
                        </div>
                        <Select value={selectedMonth.toString()} onValueChange={(v) => setSelectedMonth(parseInt(v))}>
                            <SelectTrigger className="w-40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {months.map((month, idx) => (
                                    <SelectItem key={idx} value={idx.toString()}>
                                        {month}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[2024, 2025, 2026].map(year => (
                                    <SelectItem key={year} value={year.toString()}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Payout
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">
                            ${totalPayout.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {months[selectedMonth]} {selectedYear}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Average Salary
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600">
                            ${avgSalary.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Per employee</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Pending Processing
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-600">{pendingPayroll}</div>
                        <p className="text-xs text-muted-foreground mt-1">Requires action</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Processed
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{processedPayroll}</div>
                        <p className="text-xs text-muted-foreground mt-1">Completed</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="employees">
                        <Users className="h-4 w-4 mr-2" />
                        Employee Payroll
                    </TabsTrigger>
                    <TabsTrigger value="departments">
                        <PieChart className="h-4 w-4 mr-2" />
                        Department Breakdown
                    </TabsTrigger>
                    <TabsTrigger value="tax">
                        <FileText className="h-4 w-4 mr-2" />
                        Tax Summary
                    </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Salary Components</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {payroll.slice(0, 1).map(p => (
                                        <div key={p.id} className="space-y-3">
                                            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                                <span className="font-medium">Basic Pay</span>
                                                <span className="text-lg font-bold text-blue-600">
                                                    ${p.basicPay?.toLocaleString() || 0}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                                <span className="font-medium">Allowances</span>
                                                <span className="text-lg font-bold text-green-600">
                                                    +${p.allowances?.toLocaleString() || 0}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                                                <span className="font-medium">Deductions</span>
                                                <span className="text-lg font-bold text-red-600">
                                                    -${p.deductions?.toLocaleString() || 0}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg border-2 border-gray-300">
                                                <span className="font-bold">Net Pay</span>
                                                <span className="text-2xl font-bold">
                                                    ${p.netPay?.toLocaleString() || 0}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    <p className="text-xs text-muted-foreground text-center">
                                        Sample breakdown from first employee
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Payroll Trends</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Total Employees</span>
                                        <span className="text-2xl font-bold">{payroll.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Total Payout</span>
                                        <span className="text-2xl font-bold text-green-600">
                                            ${totalPayout.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Avg Deductions</span>
                                        <span className="text-xl font-bold text-red-600">
                                            ${(payroll.reduce((sum, p) => sum + (p.deductions || 0), 0) / payroll.length).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </span>
                                    </div>
                                    <div className="pt-4 border-t">
                                        <div className="flex items-center gap-2 text-sm text-green-600">
                                            <TrendingUp className="h-4 w-4" />
                                            <span>+5.2% from last month</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Employee Payroll Tab */}
                <TabsContent value="employees">
                    <Card>
                        <CardHeader>
                            <CardTitle>Employee Payroll Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {payroll.map(p => (
                                    <div key={p.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="flex-1">
                                            <div className="font-semibold">{getEmployeeName(p.employeeId)}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {getEmployeeDesignation(p.employeeId)}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <div className="text-sm text-muted-foreground">Net Pay</div>
                                                <div className="text-lg font-bold">
                                                    ${p.netPay?.toLocaleString() || 0}
                                                </div>
                                            </div>
                                            <Badge variant={p.status === 'Paid' ? 'default' : 'secondary'}>
                                                {p.status}
                                            </Badge>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleGeneratePayslip(p.id)}
                                            >
                                                <FileText className="h-4 w-4 mr-1" />
                                                Payslip
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Department Breakdown Tab */}
                <TabsContent value="departments">
                    <Card>
                        <CardHeader>
                            <CardTitle>Department-wise Payroll</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {Object.entries(deptBreakdown).map(([dept, data]) => (
                                    <div key={dept} className="p-4 border rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold">{dept}</span>
                                            <Badge variant="outline">{data.count} employees</Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Total Payout</span>
                                            <span className="text-xl font-bold text-green-600">
                                                ${data.total.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="mt-2">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-primary h-2 rounded-full"
                                                    style={{ width: `${(data.total / totalPayout) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tax Summary Tab */}
                <TabsContent value="tax">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tax Deductions Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <div className="text-sm text-muted-foreground mb-1">Total Tax Deducted</div>
                                        <div className="text-2xl font-bold text-blue-600">
                                            ${payroll.reduce((sum, p) => sum + (p.deductions || 0) * 0.3, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </div>
                                    </div>
                                    <div className="p-4 bg-green-50 rounded-lg">
                                        <div className="text-sm text-muted-foreground mb-1">Social Security</div>
                                        <div className="text-2xl font-bold text-green-600">
                                            ${payroll.reduce((sum, p) => sum + (p.deductions || 0) * 0.5, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </div>
                                    </div>
                                    <div className="p-4 bg-purple-50 rounded-lg">
                                        <div className="text-sm text-muted-foreground mb-1">Other Deductions</div>
                                        <div className="text-2xl font-bold text-purple-600">
                                            ${payroll.reduce((sum, p) => sum + (p.deductions || 0) * 0.2, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <h4 className="font-semibold mb-3">Tax Compliance</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                                            <span className="text-sm">Form W-2 Generated</span>
                                            <Badge className="bg-green-600">Complete</Badge>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                                            <span className="text-sm">Quarterly Tax Filing</span>
                                            <Badge className="bg-green-600">Up to Date</Badge>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                                            <span className="text-sm">Annual Tax Report</span>
                                            <Badge className="bg-yellow-600">Pending</Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
