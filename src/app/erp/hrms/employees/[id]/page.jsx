// Updated: 2025-12-27
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { hrmsService } from '@/services/hrmsService';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Briefcase, Calendar, Building, ChevronLeft, Edit } from 'lucide-react';
import EmployeeDocuments from './documents';
import EmployeeAttendance from './attendance';
import EmployeePayroll from './payroll';
import EmployeePerformance from './performance';
import EmployeeExit from './exit';

export default function EmployeeProfilePage() {
    const { id } = useParams();
    const router = useRouter();
    const [employee, setEmployee] = useState(null);
    const [data, setData] = useState({ documents: [], attendance: [], payroll: [], performance: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const [emp, docs, att, pay, perf] = await Promise.all([
                    hrmsService.getEmployeeById(id),
                    hrmsService.getDocuments(id),
                    hrmsService.getAttendance(), // Filtered client side below
                    hrmsService.getPayrollByEmployee(id),
                    hrmsService.getPerformanceReviews(id)
                ]);

                setEmployee(emp);
                setData({
                    documents: docs,
                    attendance: att.filter(a => a.employeeId === id),
                    payroll: pay,
                    performance: perf
                });
            } catch (error) {
                console.error('Failed to load profile', error);
            } finally {
                setLoading(false);
            }
        };
        if (id) loadProfile();
    }, [id]);

    if (loading) return <div className="p-8">Loading profile...</div>;
    if (!employee) return <div className="p-8">Employee not found.</div>;

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-6">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="-ml-2">
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                        <AvatarImage src={employee.avatar} />
                        <AvatarFallback className="text-3xl">{employee.firstName[0]}{employee.lastName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{employee.firstName} {employee.lastName}</h1>
                        <div className="flex items-center gap-2 text-muted-foreground mt-1">
                            <Briefcase className="h-4 w-4" />
                            <span>{employee.designation}</span>
                            <span>•</span>
                            <Building className="h-4 w-4" />
                            <span>{employee.department}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Edit className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                    <Badge className="text-sm px-3 py-1" variant={employee.status === 'Active' ? 'default' : 'secondary'}>
                        {employee.status}
                    </Badge>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                    <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3">Overview</TabsTrigger>
                    <TabsTrigger value="documents" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3">Documents</TabsTrigger>
                    <TabsTrigger value="attendance" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3">Attendance</TabsTrigger>
                    <TabsTrigger value="payroll" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3">Payroll</TabsTrigger>
                    <TabsTrigger value="performance" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3">Performance</TabsTrigger>
                    <TabsTrigger value="exit" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 text-destructive data-[state=active]:border-destructive">Exit</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{employee.email}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{employee.phone}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span>{employee.address}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Employment Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-muted-foreground">Employee ID</span>
                                    <span className="font-medium">{employee.id}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-muted-foreground">Joining Date</span>
                                    <span className="font-medium">{new Date(employee.joinDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-muted-foreground">Manager</span>
                                    <span className="font-medium">{employee.manager || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between pt-2">
                                    <span className="text-muted-foreground">Annual Salary</span>
                                    <span className="font-medium">${employee.salary.toLocaleString()}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="documents">
                    <EmployeeDocuments documents={data.documents} />
                </TabsContent>
                <TabsContent value="attendance">
                    <EmployeeAttendance attendance={data.attendance} />
                </TabsContent>
                <TabsContent value="payroll">
                    <EmployeePayroll payroll={data.payroll} />
                </TabsContent>
                <TabsContent value="performance">
                    <EmployeePerformance performance={data.performance} />
                </TabsContent>
                <TabsContent value="exit">
                    <EmployeeExit />
                </TabsContent>
            </Tabs>
        </div>
    );
}
