'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Link as LinkIcon, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function EmployeeLinkingPage() {
    const { user: currentUser, token, checkAuth } = useAuthStore();
    const [users, setUsers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [linking, setLinking] = useState({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [usersRes, employeesRes] = await Promise.all([
                fetch('http://localhost:5050/api/admin/users', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch('http://localhost:5050/api/hrms/employees', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            const usersData = await usersRes.json();
            const employeesData = await employeesRes.json();

            if (usersData.success) setUsers(usersData.users);
            if (employeesData.success) setEmployees(employeesData.employees);
        } catch (error) {
            console.error('Failed to load data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleLinkEmployee = async (userId, employeeId) => {
        setLinking(prev => ({ ...prev, [userId]: true }));
        try {
            const response = await fetch(`http://localhost:5050/api/admin/users/${userId}/link-employee`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ employeeId })
            });

            const data = await response.json();
            if (data.success) {
                toast.success('Employee linked successfully');
                if (userId === currentUser?.id) {
                    await checkAuth(); // Refresh self if linking own account
                }
                loadData();
            } else {
                toast.error(data.message || 'Failed to link employee');
            }
        } catch (error) {
            console.error('Failed to link employee:', error);
            toast.error('Failed to link employee');
        } finally {
            setLinking(prev => ({ ...prev, [userId]: false }));
        }
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
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Employee Linking</h2>
                <p className="text-muted-foreground">Link user accounts to employee profiles</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        User-Employee Mapping
                    </CardTitle>
                    <CardDescription>
                        Assign employee profiles to user accounts to grant HRMS access
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Current Employee</TableHead>
                                <TableHead>Link to Employee</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => {
                                const linkedEmployee = employees.find(e => e.id === user.employeeId);
                                return (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{user.role?.name || 'No Role'}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            {linkedEmployee ? (
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                    <span>{linkedEmployee.firstName} {linkedEmployee.lastName}</span>
                                                    <Badge variant="secondary">{linkedEmployee.id}</Badge>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <XCircle className="h-4 w-4" />
                                                    <span>Not linked</span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Select
                                                    onValueChange={(value) => handleLinkEmployee(user.id, value)}
                                                    disabled={linking[user.id]}
                                                >
                                                    <SelectTrigger className="w-[250px]">
                                                        <SelectValue placeholder="Select employee..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {employees.map((emp) => {
                                                            const isAlreadyLinked = users.some(u => u.employeeId === emp.id && u.id !== user.id);
                                                            return (
                                                                <SelectItem key={emp.id} value={emp.id} disabled={isAlreadyLinked}>
                                                                    {emp.firstName} {emp.lastName} ({emp.id})
                                                                    {isAlreadyLinked && " - [Already Linked]"}
                                                                </SelectItem>
                                                            );
                                                        })}
                                                    </SelectContent>
                                                </Select>
                                                {linking[user.id] && (
                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {user.employeeId ? (
                                                <Badge className="bg-green-500">Linked</Badge>
                                            ) : (
                                                <Badge variant="secondary">Pending</Badge>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
