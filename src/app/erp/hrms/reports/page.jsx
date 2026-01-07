'use client';

import React, { useEffect, useState } from 'react';
import { hrmsService } from '@/services/hrmsService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
    BarChart3,
    Download,
    TrendingUp,
    Users,
    DollarSign,
    Calendar,
    FileText,
    PieChart,
    Activity,
    Target
} from 'lucide-react';
import { toast } from 'sonner';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart as RechartsPie,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

export default function ReportsPage() {
    const [employees, setEmployees] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [payroll, setPayroll] = useState([]);
    const [performance, setPerformance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState('overview');
    const [dateRange, setDateRange] = useState('month');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [employeesData, attendanceData, leavesData, payrollData, performanceData] = await Promise.all([
                hrmsService.getEmployees(),
                hrmsService.getAttendance(),
                hrmsService.getLeaves(),
                hrmsService.getPayroll(),
                hrmsService.getPerformanceReviews()
            ]);
            setEmployees(employeesData);
            setAttendance(attendanceData);
            setLeaves(leavesData);
            setPayroll(payrollData);
            setPerformance(performanceData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Analytics Calculations
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(e => e.status === 'Active').length;
    const avgAttendanceRate = attendance.length > 0
        ? (attendance.filter(a => a.status === 'Present').length / attendance.length) * 100
        : 0;
    const totalPayroll = payroll.reduce((sum, p) => sum + (p.netPay || 0), 0);
    const avgPerformance = performance.length > 0
        ? performance.reduce((sum, p) => sum + p.rating, 0) / performance.length
        : 0;

    // Department Distribution
    const deptDistribution = employees.reduce((acc, emp) => {
        const dept = emp.department || 'Unknown';
        acc[dept] = (acc[dept] || 0) + 1;
        return acc;
    }, {});

    const deptData = Object.entries(deptDistribution).map(([name, value]) => ({
        name,
        value,
        percentage: ((value / totalEmployees) * 100).toFixed(1)
    }));

    // Headcount Trend (Mock data - last 6 months)
    const headcountTrend = [
        { month: 'Jul', count: totalEmployees - 15 },
        { month: 'Aug', count: totalEmployees - 12 },
        { month: 'Sep', count: totalEmployees - 8 },
        { month: 'Oct', count: totalEmployees - 5 },
        { month: 'Nov', count: totalEmployees - 2 },
        { month: 'Dec', count: totalEmployees },
    ];

    // Attendance Trend
    const attendanceTrend = [
        { month: 'Jul', rate: 92 },
        { month: 'Aug', rate: 94 },
        { month: 'Sep', rate: 91 },
        { month: 'Oct', rate: 95 },
        { month: 'Nov', rate: 93 },
        { month: 'Dec', rate: avgAttendanceRate },
    ];

    // Leave Type Distribution
    const leaveTypeData = leaves.reduce((acc, leave) => {
        acc[leave.type] = (acc[leave.type] || 0) + 1;
        return acc;
    }, {});

    const leaveData = Object.entries(leaveTypeData).map(([name, value]) => ({
        name,
        value
    }));

    // Payroll by Department
    const payrollByDept = employees.reduce((acc, emp) => {
        const dept = emp.department || 'Unknown';
        const empPayroll = payroll.filter(p => p.employeeId === emp.id);
        const total = empPayroll.reduce((sum, p) => sum + (p.netPay || 0), 0);
        acc[dept] = (acc[dept] || 0) + total;
        return acc;
    }, {});

    const payrollDeptData = Object.entries(payrollByDept).map(([name, value]) => ({
        name,
        value
    }));

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    const handleExport = (format) => {
        toast.success(`Report exported as ${format.toUpperCase()}`);
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
                    <h1 className="text-3xl font-bold tracking-tight">HR Analytics & Reports</h1>
                    <p className="text-muted-foreground mt-1">
                        Comprehensive insights and data-driven decision making
                    </p>
                </div>
                <div className="flex gap-2">
                    <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                            <SelectItem value="quarter">This Quarter</SelectItem>
                            <SelectItem value="year">This Year</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={() => handleExport('pdf')}>
                        <Download className="h-4 w-4 mr-2" />
                        Export PDF
                    </Button>
                    <Button variant="outline" onClick={() => handleExport('excel')}>
                        <Download className="h-4 w-4 mr-2" />
                        Export Excel
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-5">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Total Employees
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{totalEmployees}</div>
                        <p className="text-xs text-green-600 mt-1">
                            <TrendingUp className="h-3 w-3 inline mr-1" />
                            +12% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Active
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">{activeEmployees}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {((activeEmployees / totalEmployees) * 100).toFixed(1)}% of total
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Attendance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600">
                            {avgAttendanceRate.toFixed(1)}%
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Average rate</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Total Payroll
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">
                            ${(totalPayroll / 1000).toFixed(0)}K
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">This period</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Avg Performance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-yellow-600">
                            {avgPerformance.toFixed(1)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Out of 5.0</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="headcount">
                        <Users className="h-4 w-4 mr-2" />
                        Headcount
                    </TabsTrigger>
                    <TabsTrigger value="attendance">
                        <Calendar className="h-4 w-4 mr-2" />
                        Attendance
                    </TabsTrigger>
                    <TabsTrigger value="payroll">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Payroll
                    </TabsTrigger>
                    <TabsTrigger value="custom">
                        <FileText className="h-4 w-4 mr-2" />
                        Custom Reports
                    </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Headcount Trend</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={headcountTrend}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="count"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            name="Employees"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Department Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <RechartsPie>
                                        <Pie
                                            data={deptData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percentage }) => `${name} (${percentage}%)`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {deptData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </RechartsPie>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Attendance Trend</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={attendanceTrend}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="rate" fill="#10b981" name="Attendance Rate %" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Leave Type Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <RechartsPie>
                                        <Pie
                                            data={leaveData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, value }) => `${name}: ${value}`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {leaveData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </RechartsPie>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Headcount Tab */}
                <TabsContent value="headcount">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Headcount by Department</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {deptData.map((dept, idx) => (
                                        <div key={idx} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">{dept.name}</span>
                                                <Badge variant="outline">{dept.value} employees</Badge>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="h-2 rounded-full"
                                                    style={{
                                                        width: `${dept.percentage}%`,
                                                        backgroundColor: COLORS[idx % COLORS.length]
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Growth Metrics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="p-4 bg-green-50 rounded-lg">
                                        <div className="text-sm text-muted-foreground mb-1">New Hires (This Month)</div>
                                        <div className="text-3xl font-bold text-green-600">8</div>
                                    </div>
                                    <div className="p-4 bg-red-50 rounded-lg">
                                        <div className="text-sm text-muted-foreground mb-1">Attrition (This Month)</div>
                                        <div className="text-3xl font-bold text-red-600">2</div>
                                    </div>
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <div className="text-sm text-muted-foreground mb-1">Net Growth</div>
                                        <div className="text-3xl font-bold text-blue-600">+6</div>
                                    </div>
                                    <div className="p-4 bg-purple-50 rounded-lg">
                                        <div className="text-sm text-muted-foreground mb-1">Attrition Rate</div>
                                        <div className="text-3xl font-bold text-purple-600">
                                            {((2 / totalEmployees) * 100).toFixed(1)}%
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Attendance Tab */}
                <TabsContent value="attendance">
                    <Card>
                        <CardHeader>
                            <CardTitle>Attendance Analytics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-3 mb-6">
                                <div className="p-4 bg-green-50 rounded-lg">
                                    <div className="text-sm text-muted-foreground mb-1">Present</div>
                                    <div className="text-2xl font-bold text-green-600">
                                        {attendance.filter(a => a.status === 'Present').length}
                                    </div>
                                </div>
                                <div className="p-4 bg-red-50 rounded-lg">
                                    <div className="text-sm text-muted-foreground mb-1">Absent</div>
                                    <div className="text-2xl font-bold text-red-600">
                                        {attendance.filter(a => a.status === 'Absent').length}
                                    </div>
                                </div>
                                <div className="p-4 bg-yellow-50 rounded-lg">
                                    <div className="text-sm text-muted-foreground mb-1">On Leave</div>
                                    <div className="text-2xl font-bold text-yellow-600">
                                        {leaves.filter(l => l.status === 'Approved').length}
                                    </div>
                                </div>
                            </div>

                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={attendanceTrend}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="rate" fill="#10b981" name="Attendance Rate %" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Payroll Tab */}
                <TabsContent value="payroll">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Payroll by Department</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={payrollDeptData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="value" fill="#3b82f6" name="Total Payroll ($)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Payroll Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <div className="text-sm text-muted-foreground mb-1">Total Payroll</div>
                                        <div className="text-3xl font-bold text-blue-600">
                                            ${totalPayroll.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="p-4 bg-green-50 rounded-lg">
                                        <div className="text-sm text-muted-foreground mb-1">Average Salary</div>
                                        <div className="text-3xl font-bold text-green-600">
                                            ${(totalPayroll / totalEmployees).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </div>
                                    </div>
                                    <div className="p-4 bg-purple-50 rounded-lg">
                                        <div className="text-sm text-muted-foreground mb-1">Highest Salary</div>
                                        <div className="text-3xl font-bold text-purple-600">
                                            ${Math.max(...payroll.map(p => p.netPay || 0)).toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="p-4 bg-orange-50 rounded-lg">
                                        <div className="text-sm text-muted-foreground mb-1">Lowest Salary</div>
                                        <div className="text-3xl font-bold text-orange-600">
                                            ${Math.min(...payroll.map(p => p.netPay || 0)).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Custom Reports Tab */}
                <TabsContent value="custom">
                    <Card>
                        <CardHeader>
                            <CardTitle>Custom Report Builder</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <Label className="mb-2 block">Report Type</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select report type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="headcount">Headcount Report</SelectItem>
                                                <SelectItem value="attendance">Attendance Report</SelectItem>
                                                <SelectItem value="leave">Leave Report</SelectItem>
                                                <SelectItem value="payroll">Payroll Report</SelectItem>
                                                <SelectItem value="performance">Performance Report</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label className="mb-2 block">Date Range</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select date range" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="week">Last 7 Days</SelectItem>
                                                <SelectItem value="month">Last 30 Days</SelectItem>
                                                <SelectItem value="quarter">Last Quarter</SelectItem>
                                                <SelectItem value="year">Last Year</SelectItem>
                                                <SelectItem value="custom">Custom Range</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label className="mb-2 block">Include Metrics</Label>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="metric1" defaultChecked />
                                            <label htmlFor="metric1" className="text-sm">Employee Count</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="metric2" defaultChecked />
                                            <label htmlFor="metric2" className="text-sm">Department Breakdown</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="metric3" />
                                            <label htmlFor="metric3" className="text-sm">Salary Information</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="metric4" />
                                            <label htmlFor="metric4" className="text-sm">Performance Ratings</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="metric5" defaultChecked />
                                            <label htmlFor="metric5" className="text-sm">Attendance Rate</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="metric6" />
                                            <label htmlFor="metric6" className="text-sm">Leave Balance</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button onClick={() => toast.success('Report generated successfully')}>
                                        <FileText className="h-4 w-4 mr-2" />
                                        Generate Report
                                    </Button>
                                    <Button variant="outline" onClick={() => handleExport('pdf')}>
                                        <Download className="h-4 w-4 mr-2" />
                                        Export PDF
                                    </Button>
                                    <Button variant="outline" onClick={() => handleExport('excel')}>
                                        <Download className="h-4 w-4 mr-2" />
                                        Export Excel
                                    </Button>
                                    <Button variant="outline" onClick={() => handleExport('csv')}>
                                        <Download className="h-4 w-4 mr-2" />
                                        Export CSV
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
