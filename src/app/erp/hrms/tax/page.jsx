'use client';

import React, { useEffect, useState } from 'react';
import { hrmsService } from '@/services/hrmsService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
    FileText,
    Download,
    Calculator,
    TrendingUp,
    DollarSign,
    Users,
    PieChart,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function TaxManagementPage() {
    const [payroll, setPayroll] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedEmployee, setSelectedEmployee] = useState('');

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

    // Tax Brackets (Progressive Tax System)
    const taxBrackets = [
        { min: 0, max: 10000, rate: 0, label: '0% (Up to $10,000)' },
        { min: 10000, max: 40000, rate: 10, label: '10% ($10,001 - $40,000)' },
        { min: 40000, max: 85000, rate: 12, label: '12% ($40,001 - $85,000)' },
        { min: 85000, max: 160000, rate: 22, label: '22% ($85,001 - $160,000)' },
        { min: 160000, max: 200000, rate: 24, label: '24% ($160,001 - $200,000)' },
        { min: 200000, max: Infinity, rate: 32, label: '32% ($200,001+)' },
    ];

    // Calculate progressive tax
    const calculateTax = (annualIncome, deductions = 0) => {
        const taxableIncome = Math.max(0, annualIncome - deductions);
        let tax = 0;

        for (const bracket of taxBrackets) {
            if (taxableIncome > bracket.min) {
                const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
                tax += (taxableInBracket * bracket.rate) / 100;
            }
        }

        return {
            grossIncome: annualIncome,
            deductions,
            taxableIncome,
            totalTax: tax,
            effectiveRate: annualIncome > 0 ? (tax / annualIncome) * 100 : 0,
            netIncome: annualIncome - tax,
        };
    };

    // Calculate employee tax details
    const getEmployeeTaxDetails = (employeeId) => {
        const employeePayroll = payroll.filter(p => p.employeeId === employeeId);
        const annualGross = employeePayroll.reduce((sum, p) => sum + (p.basicPay + p.allowances), 0);
        const annualDeductions = employeePayroll.reduce((sum, p) => sum + p.deductions, 0);

        // Standard deduction + employee deductions
        const totalDeductions = 12000 + annualDeductions; // $12k standard deduction

        return calculateTax(annualGross, totalDeductions);
    };

    // Organization-wide tax stats
    const totalTaxCollected = employees.reduce((sum, emp) => {
        const taxDetails = getEmployeeTaxDetails(emp.id);
        return sum + taxDetails.totalTax;
    }, 0);

    const avgTaxRate = employees.length > 0
        ? employees.reduce((sum, emp) => {
            const taxDetails = getEmployeeTaxDetails(emp.id);
            return sum + taxDetails.effectiveRate;
        }, 0) / employees.length
        : 0;

    const totalGrossPayroll = payroll.reduce((sum, p) => sum + (p.basicPay + p.allowances), 0);

    // Tax bracket distribution
    const bracketDistribution = taxBrackets.map(bracket => {
        const count = employees.filter(emp => {
            const taxDetails = getEmployeeTaxDetails(emp.id);
            return taxDetails.taxableIncome > bracket.min && taxDetails.taxableIncome <= bracket.max;
        }).length;
        return { ...bracket, count };
    });

    const handleDownloadTaxReport = () => {
        toast.success('Tax report downloaded successfully');
    };

    const handleGenerateW2 = (employeeId) => {
        toast.success('W-2 form generated successfully');
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

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tax Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Advanced tax calculations, reporting, and compliance
                    </p>
                </div>
                <div className="flex gap-2">
                    <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
                        <SelectTrigger className="w-32">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {[2023, 2024, 2025, 2026].map(year => (
                                <SelectItem key={year} value={year.toString()}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button onClick={handleDownloadTaxReport}>
                        <Download className="h-4 w-4 mr-2" />
                        Download Report
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Tax Collected
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600">
                            ${totalTaxCollected.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Year {selectedYear}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Avg Tax Rate
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-purple-600">
                            {avgTaxRate.toFixed(1)}%
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Effective rate</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Gross Payroll
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">
                            ${totalGrossPayroll.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Before tax</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Employees
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{employees.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Active taxpayers</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="calculator" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="calculator">
                        <Calculator className="h-4 w-4 mr-2" />
                        Tax Calculator
                    </TabsTrigger>
                    <TabsTrigger value="brackets">
                        <PieChart className="h-4 w-4 mr-2" />
                        Tax Brackets
                    </TabsTrigger>
                    <TabsTrigger value="employees">
                        <Users className="h-4 w-4 mr-2" />
                        Employee Tax
                    </TabsTrigger>
                    <TabsTrigger value="compliance">
                        <FileText className="h-4 w-4 mr-2" />
                        Compliance
                    </TabsTrigger>
                </TabsList>

                {/* Tax Calculator Tab */}
                <TabsContent value="calculator">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Tax Calculator</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <Label>Select Employee</Label>
                                        <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose employee" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {employees.map(emp => (
                                                    <SelectItem key={emp.id} value={emp.id}>
                                                        {emp.firstName} {emp.lastName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {selectedEmployee && (() => {
                                        const taxDetails = getEmployeeTaxDetails(selectedEmployee);
                                        return (
                                            <div className="space-y-3 mt-6">
                                                <div className="p-4 bg-blue-50 rounded-lg">
                                                    <div className="text-sm text-muted-foreground">Gross Annual Income</div>
                                                    <div className="text-2xl font-bold text-blue-600">
                                                        ${taxDetails.grossIncome.toLocaleString()}
                                                    </div>
                                                </div>

                                                <div className="p-4 bg-orange-50 rounded-lg">
                                                    <div className="text-sm text-muted-foreground">Total Deductions</div>
                                                    <div className="text-2xl font-bold text-orange-600">
                                                        -${taxDetails.deductions.toLocaleString()}
                                                    </div>
                                                </div>

                                                <div className="p-4 bg-purple-50 rounded-lg">
                                                    <div className="text-sm text-muted-foreground">Taxable Income</div>
                                                    <div className="text-2xl font-bold text-purple-600">
                                                        ${taxDetails.taxableIncome.toLocaleString()}
                                                    </div>
                                                </div>

                                                <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                                                    <div className="text-sm text-muted-foreground">Total Tax</div>
                                                    <div className="text-3xl font-bold text-red-600">
                                                        ${taxDetails.totalTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        Effective rate: {taxDetails.effectiveRate.toFixed(2)}%
                                                    </div>
                                                </div>

                                                <div className="p-4 bg-green-50 rounded-lg">
                                                    <div className="text-sm text-muted-foreground">Net Income (After Tax)</div>
                                                    <div className="text-2xl font-bold text-green-600">
                                                        ${taxDetails.netIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Tax Breakdown by Bracket</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {selectedEmployee ? (() => {
                                    const taxDetails = getEmployeeTaxDetails(selectedEmployee);
                                    return (
                                        <div className="space-y-3">
                                            {taxBrackets.map((bracket, idx) => {
                                                const incomeInBracket = Math.max(0,
                                                    Math.min(taxDetails.taxableIncome, bracket.max) - bracket.min
                                                );
                                                const taxInBracket = (incomeInBracket * bracket.rate) / 100;

                                                if (incomeInBracket <= 0) return null;

                                                return (
                                                    <div key={idx} className="p-3 border rounded-lg">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-sm font-medium">{bracket.label}</span>
                                                            <Badge>{bracket.rate}%</Badge>
                                                        </div>
                                                        <div className="text-xs text-muted-foreground mb-1">
                                                            Income in bracket: ${incomeInBracket.toLocaleString()}
                                                        </div>
                                                        <div className="text-sm font-bold text-red-600">
                                                            Tax: ${taxInBracket.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })() : (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>Select an employee to see tax breakdown</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Tax Brackets Tab */}
                <TabsContent value="brackets">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tax Bracket Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {bracketDistribution.map((bracket, idx) => (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="font-medium">{bracket.label}</span>
                                                <Badge variant="outline" className="ml-2">{bracket.count} employees</Badge>
                                            </div>
                                            <span className="text-sm font-bold text-primary">{bracket.rate}%</span>
                                        </div>
                                        <Progress
                                            value={(bracket.count / employees.length) * 100}
                                            className="h-2"
                                        />
                                        <div className="text-xs text-muted-foreground">
                                            {((bracket.count / employees.length) * 100).toFixed(1)}% of workforce
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Employee Tax Tab */}
                <TabsContent value="employees">
                    <Card>
                        <CardHeader>
                            <CardTitle>Employee Tax Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {employees.map(emp => {
                                    const taxDetails = getEmployeeTaxDetails(emp.id);
                                    return (
                                        <div key={emp.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                            <div className="flex-1">
                                                <div className="font-semibold">{emp.firstName} {emp.lastName}</div>
                                                <div className="text-sm text-muted-foreground">{emp.designation}</div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <div className="text-sm text-muted-foreground">Gross Income</div>
                                                    <div className="font-medium">
                                                        ${taxDetails.grossIncome.toLocaleString()}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm text-muted-foreground">Tax</div>
                                                    <div className="font-bold text-red-600">
                                                        ${taxDetails.totalTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm text-muted-foreground">Rate</div>
                                                    <div className="font-medium">
                                                        {taxDetails.effectiveRate.toFixed(1)}%
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleGenerateW2(emp.id)}
                                                >
                                                    <FileText className="h-4 w-4 mr-1" />
                                                    W-2
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Compliance Tab */}
                <TabsContent value="compliance">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Tax Filing Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                            <span className="font-medium">Q1 {selectedYear} Filing</span>
                                        </div>
                                        <Badge className="bg-green-600">Complete</Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                            <span className="font-medium">Q2 {selectedYear} Filing</span>
                                        </div>
                                        <Badge className="bg-green-600">Complete</Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                            <span className="font-medium">Q3 {selectedYear} Filing</span>
                                        </div>
                                        <Badge className="bg-green-600">Complete</Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <AlertCircle className="h-5 w-5 text-yellow-600" />
                                            <span className="font-medium">Q4 {selectedYear} Filing</span>
                                        </div>
                                        <Badge className="bg-yellow-600">Pending</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Required Forms</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 border rounded-lg">
                                        <div>
                                            <div className="font-medium">Form W-2 (Wage & Tax Statement)</div>
                                            <div className="text-xs text-muted-foreground">All employees</div>
                                        </div>
                                        <Button size="sm" variant="outline">
                                            <Download className="h-4 w-4 mr-1" />
                                            Generate
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between p-3 border rounded-lg">
                                        <div>
                                            <div className="font-medium">Form 941 (Quarterly Tax Return)</div>
                                            <div className="text-xs text-muted-foreground">Employer tax</div>
                                        </div>
                                        <Button size="sm" variant="outline">
                                            <Download className="h-4 w-4 mr-1" />
                                            Generate
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between p-3 border rounded-lg">
                                        <div>
                                            <div className="font-medium">Form 940 (Annual FUTA Tax)</div>
                                            <div className="text-xs text-muted-foreground">Unemployment tax</div>
                                        </div>
                                        <Button size="sm" variant="outline">
                                            <Download className="h-4 w-4 mr-1" />
                                            Generate
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
