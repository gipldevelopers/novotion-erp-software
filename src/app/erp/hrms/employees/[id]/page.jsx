// Updated: 2025-12-27
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { hrmsService } from '@/services/hrmsService';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Briefcase, Building, ChevronLeft, Edit, MoreHorizontal } from 'lucide-react';
import EmployeeDocuments from './documents';
import EmployeeAttendance from './attendance';
import EmployeePayroll from './payroll';
import EmployeePerformance from './performance';
import EmployeeExit from './exit';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function EmployeeProfilePage() {
    const { id } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const defaultTab = searchParams.get('tab') || 'overview';
    const [employee, setEmployee] = useState(null);
    const [data, setData] = useState({ documents: [], attendance: [], payroll: [], performance: [] });
    const [loading, setLoading] = useState(true);
    const [managerName, setManagerName] = useState('N/A');
    const [directReports, setDirectReports] = useState([]);

    const loadProfile = async () => {
        try {
            const [emp, docs, att, pay, perf, allEmployees] = await Promise.all([
                hrmsService.getEmployeeById(id),
                hrmsService.getDocuments(id),
                hrmsService.getAttendance({ employeeId: id }),
                hrmsService.getPayrollByEmployee(id),
                hrmsService.getPerformanceReviews(id),
                hrmsService.getEmployees(),
            ]);

            setEmployee(emp);
            setData({
                documents: docs,
                attendance: att,
                payroll: pay,
                performance: perf
            });

            const mgr = emp?.manager ? allEmployees.find((e) => e.id === emp.manager) : null;
            setManagerName(mgr ? `${mgr.firstName} ${mgr.lastName}` : 'N/A');
            setDirectReports(allEmployees.filter((e) => e.manager === id));
        } catch (error) {
            console.error('Failed to load profile', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        loadProfile();
    }, [id]);

    if (loading) return <div className="p-8">Loading profile...</div>;
    if (!employee) return <div className="p-8">Employee not found.</div>;

    const onboardingTasks = employee.onboarding?.tasks || [];
    const onboardingCompleted = employee.onboarding?.completedAt;

    const handleToggleTask = async (taskId, done) => {
        try {
            const updated = await hrmsService.updateOnboardingTask(id, taskId, done);
            if (!updated) throw new Error('Failed');
            setEmployee(updated);
        } catch {
            toast.error('Failed to update onboarding task');
        }
    };

    const handleCompleteOnboarding = async () => {
        try {
            const updated = await hrmsService.completeOnboarding(id);
            if (!updated) throw new Error('Failed');
            setEmployee(updated);
            toast.success('Onboarding completed');
        } catch {
            toast.error('Failed to complete onboarding');
        }
    };

    const statusOptions = [
        'Onboarding',
        'Probation',
        'Active',
        'Notice Period',
        'Resigned',
        'Terminated',
    ];

    const handleSetStatus = async (nextStatus) => {
        if (!nextStatus || nextStatus === employee.status) return;
        try {
            const updated = await hrmsService.updateEmployee(id, { status: nextStatus });
            if (!updated) throw new Error('Failed');
            setEmployee(updated);
            toast.success('Status updated');
        } catch {
            toast.error('Failed to update status');
        }
    };

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
                    <Button variant="outline" onClick={() => router.push(`/erp/hrms/employees/${id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-[220px]">
                            <DropdownMenuLabel>Employee actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => router.push(`/erp/hrms/employees/${id}?tab=overview`)}>
                                Onboarding
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/erp/hrms/employees/${id}?tab=exit`)}>
                                Offboarding
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/erp/hrms/employees/hierarchy?focus=${id}`)}>
                                Reporting hierarchy
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/erp/hrms/employees/${id}/edit`)}>
                                Role & department
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    Employee status
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent className="min-w-[200px]">
                                    <DropdownMenuRadioGroup value={employee.status} onValueChange={handleSetStatus}>
                                        {statusOptions.map((s) => (
                                            <DropdownMenuRadioItem key={s} value={s}>
                                                {s}
                                            </DropdownMenuRadioItem>
                                        ))}
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Badge className="text-sm px-3 py-1" variant={employee.status === 'Active' ? 'default' : 'secondary'}>
                        {employee.status}
                    </Badge>
                </div>
            </div>

            <Tabs defaultValue={defaultTab} className="space-y-6">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                    <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3">Overview</TabsTrigger>
                    <TabsTrigger value="documents" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3">Documents</TabsTrigger>
                    <TabsTrigger value="attendance" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3">Attendance</TabsTrigger>
                    <TabsTrigger value="payroll" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3">Payroll</TabsTrigger>
                    <TabsTrigger value="performance" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3">Performance</TabsTrigger>
                    <TabsTrigger value="exit" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 text-destructive data-[state=active]:border-destructive">Exit</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    {(employee.status === 'Onboarding' || employee.status === 'Probation') && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Onboarding</CardTitle>
                                <div className="flex items-center gap-2">
                                    {onboardingCompleted ? (
                                        <Badge variant="secondary">Completed {onboardingCompleted}</Badge>
                                    ) : (
                                        <Button size="sm" onClick={handleCompleteOnboarding}>Mark Onboarded</Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {onboardingTasks.length === 0 ? (
                                    <div className="text-sm text-muted-foreground">No onboarding checklist available.</div>
                                ) : (
                                    onboardingTasks.map((t) => (
                                        <div key={t.id} className="flex items-center gap-3">
                                            <Checkbox checked={!!t.done} onCheckedChange={(v) => handleToggleTask(t.id, !!v)} />
                                            <div className="text-sm">{t.title}</div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    )}
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
                                    <span className="font-medium">{managerName}</span>
                                </div>
                                <div className="flex justify-between pt-2">
                                    <span className="text-muted-foreground">Annual Salary</span>
                                    <span className="font-medium">${employee.salary.toLocaleString()}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Reporting</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {directReports.length === 0 ? (
                                <div className="text-sm text-muted-foreground">No direct reports.</div>
                            ) : (
                                <div className="space-y-2">
                                    {directReports.map((e) => (
                                        <div key={e.id} className="flex items-center justify-between rounded-md border p-3">
                                            <div className="text-sm font-medium">{e.firstName} {e.lastName}</div>
                                            <Button variant="outline" size="sm" onClick={() => router.push(`/erp/hrms/employees/${e.id}`)}>View</Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="pt-4">
                                <Button variant="outline" onClick={() => router.push(`/erp/hrms/employees/hierarchy?focus=${id}`)}>
                                    View Hierarchy Tree
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="documents">
                    <EmployeeDocuments employeeId={id} documents={data.documents} onChange={async () => {
                        const docs = await hrmsService.getDocuments(id);
                        setData((prev) => ({ ...prev, documents: docs }));
                    }} />
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
                    <EmployeeExit employeeId={id} employeeStatus={employee.status} exit={employee.exit} onChange={loadProfile} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
