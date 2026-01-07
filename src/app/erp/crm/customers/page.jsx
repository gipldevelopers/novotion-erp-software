// Updated: 2025-12-27
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { crmService } from '@/services/crmService';
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
import { 
    Plus, 
    Search, 
    MoreHorizontal, 
    Eye, 
    Edit, 
    Trash, 
    Users, 
    Building2, 
    TrendingUp, 
    UserCheck,
    Mail,
    Phone,
    Filter,
    Download,
    DollarSign
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function CustomersPage() {
    const router = useRouter();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const data = await crmService.getCustomers();
                setCustomers(data);
            } catch (error) {
                console.error('Failed to fetch customers', error);
                toast.error('Failed to load customers');
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    const stats = useMemo(() => {
        return {
            total: customers.length,
            active: customers.filter(c => c.status === 'Active').length,
            totalValue: customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0),
            avgSpent: customers.length > 0 
                ? Math.round(customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0) / customers.length)
                : 0,
            newThisMonth: customers.filter(c => {
                const joinDate = new Date(c.createdAt || c.joinedAt);
                const now = new Date();
                return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
            }).length,
            vipCount: customers.filter(c => c.type === 'VIP' || c.totalSpent > 50000).length,
        };
    }, [customers]);

    const filteredCustomers = customers.filter(
        (c) =>
            (c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.phone?.includes(searchTerm)) &&
            (statusFilter === 'all' || c.status === statusFilter) &&
            (typeFilter === 'all' || c.type === typeFilter)
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200 hover:bg-emerald-500/20';
            case 'Inactive': return 'bg-gray-500/10 text-gray-600 border-gray-200 hover:bg-gray-500/20';
            case 'Pending': return 'bg-amber-500/10 text-amber-600 border-amber-200 hover:bg-amber-500/20';
            default: return 'bg-blue-500/10 text-blue-600 border-blue-200 hover:bg-blue-500/20';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'VIP': return '👑';
            case 'Enterprise': return '🏢';
            case 'Individual': return '👤';
            default: return '🏷️';
        }
    };

    const handleDeleteCustomer = async (customerId, customerName, e) => {
        e.stopPropagation();
        if (!confirm(`Are you sure you want to delete ${customerName}?`)) return;
        
        try {
            await crmService.deleteCustomer(customerId);
            toast.success('Customer deleted');
            setCustomers(customers.filter(c => c.id !== customerId));
        } catch (error) {
            console.error('Failed to delete customer', error);
            toast.error('Failed to delete customer');
        }
    };

    const handleExport = () => {
        toast.success('Exporting customer data...');
        // Add export logic here
    };

    return (
        <div className="space-y-6 p-8">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
                    <p className="text-muted-foreground">Manage your customer relationships and track engagement</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleExport}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Button onClick={() => router.push('/erp/crm/customers/create')}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Customer
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <Progress value={(stats.active / stats.total) * 100} className="h-1 mt-2" />
                        <p className="text-xs text-muted-foreground mt-2">{stats.active} active</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{stats.totalValue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Lifetime value</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">VIP Customers</CardTitle>
                        <UserCheck className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.vipCount}</div>
                        <p className="text-xs text-muted-foreground">High-value clients</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Spend</CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{stats.avgSpent.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Per customer</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">New This Month</CardTitle>
                        <Users className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{stats.newThisMonth}</div>
                        <p className="text-xs text-muted-foreground">Recent acquisitions</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Rate</CardTitle>
                        <Users className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}%
                        </div>
                        <p className="text-xs text-muted-foreground">Engagement rate</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Card className="border-none shadow-sm bg-transparent">
                <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle>Customer Directory</CardTitle>
                            <CardDescription>
                                {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? 's' : ''} found
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2 flex-1 sm:flex-initial sm:justify-end">
                            <div className="relative flex-1 sm:flex-initial sm:w-[250px]">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name, company, or email..."
                                    className="pl-9 bg-background"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[130px]">
                                    <Filter className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="w-[130px]">
                                    <Building2 className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="VIP">VIP</SelectItem>
                                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                                    <SelectItem value="Individual">Individual</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border bg-card overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30">
                                    <TableHead className="w-[300px]">Customer</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Total Spent</TableHead>
                                    <TableHead className="text-right w-[80px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                                                <span className="text-sm text-muted-foreground">Loading customers...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredCustomers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <Users className="h-12 w-12 text-muted-foreground/50" />
                                                <div>
                                                    <h3 className="font-medium">No customers found</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                                                            ? 'Try adjusting your search or filters' 
                                                            : 'Get started by adding your first customer'}
                                                    </p>
                                                </div>
                                                {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
                                                    <Button 
                                                        variant="outline" 
                                                        className="mt-2"
                                                        onClick={() => router.push('/erp/crm/customers/create')}
                                                    >
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        Add Customer
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredCustomers.map((customer) => (
                                        <TableRow 
                                            key={customer.id} 
                                            className="group cursor-pointer hover:bg-muted/30 transition-colors"
                                            onClick={() => router.push(`/erp/crm/customers/${customer.id}`)}
                                        >
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                                            {customer.name?.split(' ').map(n => n[0]).join('') || 'CU'}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium">{customer.name}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            ID: {customer.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="h-4 w-4 text-muted-foreground" />
                                                    <span>{customer.company || 'N/A'}</span>
                                                    {customer.type && (
                                                        <Badge variant="outline" className="ml-2 text-xs">
                                                            {getTypeIcon(customer.type)} {customer.type}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    {customer.email && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Mail className="h-3 w-3 text-muted-foreground" />
                                                            <span className="truncate">{customer.email}</span>
                                                        </div>
                                                    )}
                                                    {customer.phone && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Phone className="h-3 w-3 text-muted-foreground" />
                                                            <span>{customer.phone}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge 
                                                    variant="outline" 
                                                    className={`${getStatusColor(customer.status)} flex w-fit items-center gap-1.5 font-medium`}
                                                >
                                                    {customer.status === 'Active' && (
                                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                                    )}
                                                    {customer.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="font-bold text-lg">₹{customer.totalSpent?.toLocaleString() || '0'}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {customer.lastPurchase 
                                                        ? `Last: ${new Date(customer.lastPurchase).toLocaleDateString()}`
                                                        : 'No purchases'
                                                    }
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => router.push(`/erp/crm/customers/${customer.id}`)}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => router.push(`/erp/crm/customers/${customer.id}/edit`)}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit Customer
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem>
                                                            <DollarSign className="mr-2 h-4 w-4" />
                                                            Create Invoice
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Mail className="mr-2 h-4 w-4" />
                                                            Send Email
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem 
                                                            onClick={(e) => handleDeleteCustomer(customer.id, customer.name, e)}
                                                            className="text-destructive focus:text-destructive"
                                                        >
                                                            <Trash className="mr-2 h-4 w-4" />
                                                            Delete Customer
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}