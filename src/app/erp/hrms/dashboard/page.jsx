// Updated: 2025-12-27
'use client';

import { useEffect, useState } from 'react';
import { hrmsService } from '@/services/hrmsService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, UserCheck, UserMinus, TrendingUp, Calendar, DollarSign, Award, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function HRMSDashboard() {
    const router = useRouter();
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await hrmsService.getDashboardMetrics();
                setMetrics(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
            </div>
        );
    }

    if (!metrics) return <div className="p-8">Dashboard data unavailable.</div>;

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">HR Dashboard</h2>
                    <p className="text-muted-foreground">Overview of your organization's workforce</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/erp/hrms/employees">
                        <Button variant="outline">
                            <Users className="h-4 w-4 mr-2" />
                            Manage Employees
                        </Button>
                    </Link>
                    <Link href="/erp/hrms/employees/create">
                        <Button>
                            <Users className="h-4 w-4 mr-2" />
                            Add Employee
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/erp/hrms/employees')}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.totalEmployees}</div>
                        <p className="text-xs text-muted-foreground">
                            {metrics.activeEmployees} active employees
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/erp/hrms/attendance')}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{metrics.activeEmployees}</div>
                        <p className="text-xs text-muted-foreground">
                            {Math.round((metrics.activeEmployees / metrics.totalEmployees) * 100)}% of total
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/erp/hrms/leaves')}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">On Leave Today</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{metrics.onLeaveToday}</div>
                        <p className="text-xs text-muted-foreground">
                            Approved leaves
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/erp/hrms/employees')}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">New Hires</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{metrics.newHiresThisMonth}</div>
                        <p className="text-xs text-muted-foreground">
                            This month
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                        <Button variant="outline" className="justify-start h-auto py-4" onClick={() => router.push('/erp/hrms/attendance')}>
                            <div className="flex items-center gap-3 w-full">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <UserCheck className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                                </div>
                                <div className="text-left flex-1">
                                    <div className="font-semibold">Attendance</div>
                                    <div className="text-xs text-muted-foreground">Manage attendance</div>
                                </div>
                            </div>
                        </Button>

                        <Button variant="outline" className="justify-start h-auto py-4" onClick={() => router.push('/erp/hrms/leaves')}>
                            <div className="flex items-center gap-3 w-full">
                                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                    <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-300" />
                                </div>
                                <div className="text-left flex-1">
                                    <div className="font-semibold">Leave Requests</div>
                                    <div className="text-xs text-muted-foreground">Review requests</div>
                                </div>
                            </div>
                        </Button>

                        <Button variant="outline" className="justify-start h-auto py-4" onClick={() => router.push('/erp/hrms/payroll')}>
                            <div className="flex items-center gap-3 w-full">
                                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                    <DollarSign className="h-5 w-5 text-green-600 dark:text-green-300" />
                                </div>
                                <div className="text-left flex-1">
                                    <div className="font-semibold">Payroll</div>
                                    <div className="text-xs text-muted-foreground">Process payroll</div>
                                </div>
                            </div>
                        </Button>

                        <Button variant="outline" className="justify-start h-auto py-4" onClick={() => router.push('/erp/hrms/performance')}>
                            <div className="flex items-center gap-3 w-full">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                    <Award className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                                </div>
                                <div className="text-left flex-1">
                                    <div className="font-semibold">Performance</div>
                                    <div className="text-xs text-muted-foreground">Review performance</div>
                                </div>
                            </div>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Charts */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Attendance Trend (Last 5 Days)</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={metrics.attendanceTrend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="present" fill="#10b981" name="Present" />
                                <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                                <Bar dataKey="leave" fill="#f59e0b" name="On Leave" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Department Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={metrics.departmentHeadcount}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name}: ${value}`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {metrics.departmentHeadcount.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity / Alerts */}
            <Card className="border-orange-200">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-orange-600" />
                        <CardTitle>Action Required</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                            <div>
                                <div className="font-medium">Pending Leave Approvals</div>
                                <div className="text-sm text-muted-foreground">Review and approve pending leave requests</div>
                            </div>
                            <Link href="/erp/hrms/leaves">
                                <Button variant="outline" size="sm">
                                    Review
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                            <div>
                                <div className="font-medium">Onboarding Tasks</div>
                                <div className="text-sm text-muted-foreground">Complete onboarding for new hires</div>
                            </div>
                            <Link href="/erp/hrms/employees">
                                <Button variant="outline" size="sm">
                                    View
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
