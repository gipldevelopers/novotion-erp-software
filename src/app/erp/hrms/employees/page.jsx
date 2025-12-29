// Updated: 2025-12-27
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { hrmsService } from '@/services/hrmsService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
    Plus, 
    Search, 
    MoreHorizontal, 
    Filter, 
    Users, 
    UserCheck, 
    Briefcase, 
    UserPlus, 
    LayoutGrid, 
    List,
    Building2,
    Clock
} from 'lucide-react';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function EmployeesPage() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('list');

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const data = await hrmsService.getEmployees();
                setEmployees(data);
            } catch (error) {
                console.error('Failed to fetch employees', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, []);

    const filteredEmployees = employees.filter((emp) =>
        emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = useMemo(() => {
        return {
            total: employees.length,
            active: employees.filter(e => e.status === 'Active').length,
            departments: new Set(employees.map(e => e.department)).size,
            newJoiners: employees.filter(e => {
                const joinDate = new Date(e.joinDate);
                const now = new Date();
                return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
            }).length
        };
    }, [employees]);

    return (
        <div className="space-y-6 p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Employees</h2>
                    <p className="text-muted-foreground">Manage your workforce directory and organization structure.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/erp/hrms/employees/create">
                        <Button className="bg-primary hover:bg-primary/90">
                            <Plus className="mr-2 h-4 w-4" /> Add Employee
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">Across all departments</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Status</CardTitle>
                        <UserCheck className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.active}</div>
                        <p className="text-xs text-muted-foreground">Currently active employees</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Departments</CardTitle>
                        <Building2 className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.departments}</div>
                        <p className="text-xs text-muted-foreground">Operational units</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">New Joiners</CardTitle>
                        <UserPlus className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{stats.newJoiners}</div>
                        <p className="text-xs text-muted-foreground">Joined this month</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm bg-transparent">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div className="flex items-center gap-2 flex-1">
                        <div className="relative w-full sm:w-[350px]">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, email, or dept..."
                                className="pl-9 bg-background"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="icon" className="bg-background">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                        <Button 
                            variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                            size="sm" 
                            onClick={() => setViewMode('list')}
                            className="h-8"
                        >
                            <List className="h-4 w-4 mr-2" /> List
                        </Button>
                        <Button 
                            variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                            size="sm" 
                            onClick={() => setViewMode('grid')}
                            className="h-8"
                        >
                            <LayoutGrid className="h-4 w-4 mr-2" /> Grid
                        </Button>
                    </div>
                </div>

                {viewMode === 'list' ? (
                    <div className="rounded-md border bg-card">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]"></TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Designation</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                                                Loading employees...
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredEmployees.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            No employees found matching your search.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredEmployees.map((emp) => (
                                        <TableRow key={emp.id} className="cursor-pointer hover:bg-muted/50 group">
                                            <TableCell>
                                                <Avatar>
                                                    <AvatarImage src={emp.avatar} alt={emp.firstName} />
                                                    <AvatarFallback>{emp.firstName[0]}{emp.lastName[0]}</AvatarFallback>
                                                </Avatar>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <Link href={`/erp/hrms/employees/${emp.id}`} className="hover:underline">
                                                    {emp.firstName} {emp.lastName}
                                                </Link>
                                                <div className="text-xs text-muted-foreground">{emp.email}</div>
                                            </TableCell>
                                            <TableCell>{emp.id}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{emp.department}</Badge>
                                            </TableCell>
                                            <TableCell>{emp.designation}</TableCell>
                                            <TableCell>
                                                <Badge variant={emp.status === 'Active' ? 'default' : 'secondary'} className={emp.status === 'Active' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                                                    {emp.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/erp/hrms/employees/${emp.id}`}>View Profile</Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/erp/hrms/employees/${emp.id}/edit`}>Edit Details</Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/erp/hrms/employees/hierarchy?focus=${emp.id}`}>View Hierarchy Tree</Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive">Terminate</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredEmployees.map((emp) => (
                            <Card key={emp.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <Badge variant={emp.status === 'Active' ? 'default' : 'secondary'} className={emp.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20' : ''}>
                                        {emp.status}
                                    </Badge>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link href={`/erp/hrms/employees/${emp.id}`}>View Profile</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href={`/erp/hrms/employees/${emp.id}/edit`}>Edit Details</Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center text-center pt-4">
                                    <Avatar className="h-20 w-20 mb-4 border-2 border-border">
                                        <AvatarImage src={emp.avatar} alt={emp.firstName} />
                                        <AvatarFallback className="text-xl">{emp.firstName[0]}{emp.lastName[0]}</AvatarFallback>
                                    </Avatar>
                                    <h3 className="font-semibold text-lg">{emp.firstName} {emp.lastName}</h3>
                                    <p className="text-sm text-muted-foreground mb-1">{emp.designation}</p>
                                    <Badge variant="outline" className="mb-4">{emp.department}</Badge>
                                    
                                    <div className="w-full grid grid-cols-2 gap-2 text-xs text-muted-foreground border-t pt-3 mt-2">
                                        <div className="flex flex-col items-center">
                                            <span className="font-medium text-foreground">{emp.id}</span>
                                            <span>ID</span>
                                        </div>
                                        <div className="flex flex-col items-center border-l">
                                            <span className="font-medium text-foreground">{new Date(emp.joinDate).getFullYear()}</span>
                                            <span>Joined</span>
                                        </div>
                                    </div>
                                    
                                    <Link href={`/erp/hrms/employees/${emp.id}`} className="w-full mt-4">
                                        <Button variant="secondary" className="w-full">View Profile</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}
