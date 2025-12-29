// Updated: 2025-12-27
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { hrmsService } from '@/services/hrmsService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function CreateEmployeePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [loadingOptions, setLoadingOptions] = useState(true);
    const [departments, setDepartments] = useState([]);
    const [jobRoles, setJobRoles] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [isDeptDialogOpen, setIsDeptDialogOpen] = useState(false);
    const [newDeptName, setNewDeptName] = useState('');
    const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
    const [newRoleName, setNewRoleName] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: '',
        designation: '',
        salary: '',
        address: '',
        status: 'Onboarding',
        manager: ''
    });

    const managerOptions = useMemo(
        () => employees,
        [employees]
    );

    useEffect(() => {
        const loadOptions = async () => {
            setLoadingOptions(true);
            try {
                const [deptList, roleList, empList] = await Promise.all([
                    hrmsService.getDepartments(),
                    hrmsService.getJobRoles(),
                    hrmsService.getEmployees(),
                ]);
                setDepartments(deptList);
                setJobRoles(roleList);
                setEmployees(empList);
            } catch (e) {
                toast.error('Failed to load HR options');
            } finally {
                setLoadingOptions(false);
            }
        };
        loadOptions();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.department) {
            toast.error('Please select a department');
            return;
        }
        if (!formData.designation) {
            toast.error('Please select a role');
            return;
        }
        setIsLoading(true);
        try {
            await hrmsService.createEmployee({
                ...formData,
                salary: Number(formData.salary) || 0
            });
            toast.success("Employee created successfully");
            router.push('/erp/hrms/employees');
        } catch (error) {
            toast.error("Failed to create employee");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const openDeptDialog = () => {
        setNewDeptName('');
        setIsDeptDialogOpen(true);
    };

    const handleAddDepartment = async () => {
        try {
            const created = await hrmsService.addDepartment(newDeptName);
            if (!created) throw new Error('Create failed');
            const next = await hrmsService.getDepartments();
            setDepartments(next);
            setFormData((prev) => ({ ...prev, department: created.name }));
            toast.success('Department added');
            setIsDeptDialogOpen(false);
        } catch {
            toast.error('Failed to add department');
        }
    };

    const openRoleDialog = () => {
        setNewRoleName('');
        setIsRoleDialogOpen(true);
    };

    const handleAddRole = async () => {
        try {
            const created = await hrmsService.addJobRole(newRoleName);
            if (!created) throw new Error('Create failed');
            const next = await hrmsService.getJobRoles();
            setJobRoles(next);
            setFormData((prev) => ({ ...prev, designation: created.name }));
            toast.success('Role added');
            setIsRoleDialogOpen(false);
        } catch {
            toast.error('Failed to add role');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-3xl font-bold tracking-tight">Onboard New Employee</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Employee Details</CardTitle>
                    <CardDescription>Enter the personal and professional information.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                            </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="department">Department</Label>
                                    <Button type="button" variant="ghost" size="sm" onClick={openDeptDialog}>
                                        <Plus className="h-4 w-4 mr-1" /> Add
                                    </Button>
                                </div>
                                <Select value={formData.department} onValueChange={(val) => handleSelectChange('department', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map((d) => (
                                            <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="designation">Role</Label>
                                    <Button type="button" variant="ghost" size="sm" onClick={openRoleDialog}>
                                        <Plus className="h-4 w-4 mr-1" /> Add
                                    </Button>
                                </div>
                                <Select value={formData.designation} onValueChange={(val) => handleSelectChange('designation', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {jobRoles.map((r) => (
                                            <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="manager">Reporting Manager</Label>
                                <Select value={formData.manager || 'none'} onValueChange={(val) => handleSelectChange('manager', val === 'none' ? '' : val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Manager" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        {managerOptions.map((m) => (
                                            <SelectItem key={m.id} value={m.id}>{m.firstName} {m.lastName} ({m.id})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="salary">Annual Salary</Label>
                                <Input id="salary" name="salary" type="number" value={formData.salary} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={formData.status} onValueChange={(val) => handleSelectChange('status', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Onboarding">Onboarding</SelectItem>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Probation">Probation</SelectItem>
                                        <SelectItem value="Notice Period">Notice Period</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Options</Label>
                                <Input value={loadingOptions ? 'Loading options...' : 'Ready'} disabled />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" name="address" value={formData.address} onChange={handleChange} />
                        </div>

                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Employee
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            <Dialog open={isDeptDialogOpen} onOpenChange={setIsDeptDialogOpen}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle>Add department</DialogTitle>
                        <DialogDescription>Create a new department for HRMS.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-2 py-2">
                        <Label>Department name</Label>
                        <Input value={newDeptName} onChange={(e) => setNewDeptName(e.target.value)} placeholder="e.g. Customer Success" />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={() => setIsDeptDialogOpen(false)}>Cancel</Button>
                        <Button type="button" onClick={handleAddDepartment} disabled={!newDeptName.trim()}>
                            Add
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle>Add role</DialogTitle>
                        <DialogDescription>Create a new job role for HRMS.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-2 py-2">
                        <Label>Role name</Label>
                        <Input value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} placeholder="e.g. Senior Developer" />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={() => setIsRoleDialogOpen(false)}>Cancel</Button>
                        <Button type="button" onClick={handleAddRole} disabled={!newRoleName.trim()}>
                            Add
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
