'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { hrmsService } from '@/services/hrmsService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Loader2, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function EditEmployeePage() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [employee, setEmployee] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [jobRoles, setJobRoles] = useState([]);
    const [allEmployees, setAllEmployees] = useState([]);
    const [isDeptDialogOpen, setIsDeptDialogOpen] = useState(false);
    const [newDeptName, setNewDeptName] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: '',
        designation: '',
        salary: '',
        address: '',
        status: 'Active',
        manager: '',
    });

    const managerOptions = useMemo(
        () => allEmployees.filter((e) => e.id !== id),
        [allEmployees, id]
    );

    const load = async () => {
        setLoading(true);
        try {
            const [emp, deptList, roleList, emps] = await Promise.all([
                hrmsService.getEmployeeById(id),
                hrmsService.getDepartments(),
                hrmsService.getJobRoles(),
                hrmsService.getEmployees(),
            ]);

            setEmployee(emp);
            setDepartments(deptList);
            setJobRoles(roleList);
            setAllEmployees(emps);

            if (emp) {
                setFormData({
                    firstName: emp.firstName || '',
                    lastName: emp.lastName || '',
                    email: emp.email || '',
                    phone: emp.phone || '',
                    department: emp.department || '',
                    designation: emp.designation || '',
                    salary: String(emp.salary ?? ''),
                    address: emp.address || '',
                    status: emp.status || 'Active',
                    manager: emp.manager || '',
                });
            }
        } catch (e) {
            toast.error('Failed to load employee');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!id) return;
        load();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const updated = await hrmsService.updateEmployee(id, {
                ...formData,
                salary: Number(formData.salary) || 0,
            });
            if (!updated) throw new Error('Update failed');
            toast.success('Employee updated');
            router.push(`/erp/hrms/employees/${id}`);
        } catch (err) {
            toast.error('Failed to update employee');
        } finally {
            setSaving(false);
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

    const handleAddRoleToList = async () => {
        const name = formData.designation?.trim();
        if (!name) return;
        try {
            await hrmsService.addJobRole(name);
            const next = await hrmsService.getJobRoles();
            setJobRoles(next);
            toast.success('Role added');
        } catch {
            toast.error('Failed to add role');
        }
    };

    if (loading) return <div className="p-8">Loading employee...</div>;
    if (!employee) return <div className="p-8">Employee not found.</div>;

    return (
        <div className="max-w-4xl mx-auto p-8 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Edit Employee</h2>
                    <p className="text-muted-foreground">Update employee profile and reporting details.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Employee Details</CardTitle>
                    <CardDescription>Edit the personal and professional information.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSave}>
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
                                    <Button type="button" variant="ghost" size="sm" onClick={handleAddRoleToList}>
                                        <Plus className="h-4 w-4 mr-1" /> Save
                                    </Button>
                                </div>
                                <Input id="designation" name="designation" list="role-options" value={formData.designation} onChange={handleChange} required />
                                <datalist id="role-options">
                                    {jobRoles.map((r) => (
                                        <option key={r.id} value={r.name} />
                                    ))}
                                </datalist>
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
                                        <SelectItem value="Resigned">Resigned</SelectItem>
                                        <SelectItem value="Terminated">Terminated</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="salary">Annual Salary</Label>
                                <Input id="salary" name="salary" type="number" value={formData.salary} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Joining Date</Label>
                                <Input value={employee.joinDate || ''} disabled />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" name="address" value={formData.address} onChange={handleChange} />
                        </div>

                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" disabled={saving}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
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
        </div>
    );
}
