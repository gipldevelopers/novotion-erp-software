'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { crmService } from '@/services/crmService';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { 
    FileText, 
    Search, 
    Filter, 
    Plus, 
    Clock, 
    AlertTriangle, 
    CheckCircle, 
    Calendar,
    DollarSign,
    Users,
    TrendingUp,
    Download,
    MoreHorizontal,
    Eye
} from 'lucide-react';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { format, differenceInDays, isAfter, isBefore } from 'date-fns';
import { toast } from 'sonner';

export default function ContractsPage() {
    const router = useRouter();
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'

    useEffect(() => {
        fetchContracts();
    }, []);

    const fetchContracts = async () => {
        try {
            const data = await crmService.getContracts();
            setContracts(data);
        } catch (error) {
            console.error('Failed to fetch contracts', error);
            toast.error('Failed to load contracts');
        } finally {
            setLoading(false);
        }
    };

    const getRenewalStatus = (endDate, status) => {
        const end = new Date(endDate);
        const now = new Date();
        const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
        
        if (status === 'Expired' || daysLeft < 0) {
            return { 
                label: 'Expired', 
                color: 'bg-red-500/10 text-red-600 border-red-200 hover:bg-red-500/20',
                icon: AlertTriangle,
                variant: 'destructive'
            };
        }
        
        if (daysLeft <= 7) {
            return { 
                label: `Expiring in ${daysLeft} days`, 
                color: 'bg-amber-500/10 text-amber-600 border-amber-200 hover:bg-amber-500/20',
                icon: AlertTriangle,
                variant: 'secondary'
            };
        }
        
        if (daysLeft <= 30) {
            return { 
                label: `Expires in ${daysLeft} days`, 
                color: 'bg-orange-500/10 text-orange-600 border-orange-200 hover:bg-orange-500/20',
                icon: Clock,
                variant: 'secondary'
            };
        }
        
        return { 
            label: 'Active', 
            color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200 hover:bg-emerald-500/20',
            icon: CheckCircle,
            variant: 'default'
        };
    };

    const getProgressPercentage = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const now = new Date();
        
        const totalDuration = end - start;
        const elapsed = now - start;
        
        if (totalDuration <= 0) return 0;
        return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
    };

    const stats = useMemo(() => {
        const now = new Date();
        return {
            total: contracts.length,
            active: contracts.filter(c => c.status === 'Active').length,
            expiringSoon: contracts.filter(c => {
                const daysLeft = differenceInDays(new Date(c.endDate), now);
                return c.status === 'Active' && daysLeft <= 30 && daysLeft > 0;
            }).length,
            totalValue: contracts.reduce((sum, c) => sum + c.value, 0),
            amcCount: contracts.filter(c => c.type === 'AMC').length,
        };
    }, [contracts]);

    const filteredContracts = contracts.filter(c => {
        const matchesFilter = filter === 'All' || c.status === filter || c.type === filter;
        const matchesSearch = c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.customerId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleDownloadContract = async (contractId, e) => {
        e.stopPropagation();
        toast.success('Downloading contract...');
        // Add download logic here
    };

    const handleRenewContract = async (contractId, e) => {
        e.stopPropagation();
        toast.info('Renewal workflow initiated');
        // Add renewal logic here
    };

    return (
        <div className="space-y-6 p-8">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Contracts & Agreements</h2>
                    <p className="text-muted-foreground">Manage service level agreements, AMCs, and legal documents</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toast.info('Export feature coming soon')}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Button 
                        onClick={() => router.push('/erp/crm/customers')}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        New Contract
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Contracts</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <Progress value={(stats.active / stats.total) * 100} className="h-1 mt-2" />
                        <p className="text-xs text-muted-foreground mt-2">{stats.active} active</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{stats.totalValue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Annual contract value</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                        <Clock className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.expiringSoon}</div>
                        <p className="text-xs text-muted-foreground">Within 30 days</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">AMC Contracts</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.amcCount}</div>
                        <p className="text-xs text-muted-foreground">Annual maintenance</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Renewal Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">92%</div>
                        <p className="text-xs text-muted-foreground">Average renewal success</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Card className="border-none shadow-sm bg-transparent">
                <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle>Contract Directory</CardTitle>
                            <CardDescription>
                                {filteredContracts.length} contract{filteredContracts.length !== 1 ? 's' : ''} found
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2 flex-1 sm:flex-initial sm:justify-end">
                            <div className="relative flex-1 sm:flex-initial sm:w-[250px]">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search contracts or customers..."
                                    className="pl-9 bg-background"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={filter} onValueChange={setFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <Filter className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Filter" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Contracts</SelectItem>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Expired">Expired</SelectItem>
                                    <SelectItem value="AMC">AMC</SelectItem>
                                    <SelectItem value="SLA">SLA</SelectItem>
                                    <SelectItem value="Project">Project</SelectItem>
                                    <SelectItem value="NDA">NDA</SelectItem>
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
                                    <TableHead className="w-[300px]">Contract Details</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Duration & Progress</TableHead>
                                    <TableHead className="text-right">Value</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Renewal</TableHead>
                                    <TableHead className="text-right w-[80px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-12">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                                                <span className="text-sm text-muted-foreground">Loading contracts...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredContracts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-12">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <FileText className="h-12 w-12 text-muted-foreground/50" />
                                                <div>
                                                    <h3 className="font-medium">No contracts found</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {searchTerm || filter !== 'All' 
                                                            ? 'Try adjusting your search or filter' 
                                                            : 'Get started by creating your first contract'}
                                                    </p>
                                                </div>
                                                {!searchTerm && filter === 'All' && (
                                                    <Button 
                                                        variant="outline" 
                                                        className="mt-2"
                                                        onClick={() => router.push('/erp/crm/customers')}
                                                    >
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        Create Contract
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredContracts.map((contract) => {
                                        const renewal = getRenewalStatus(contract.endDate, contract.status);
                                        const RenewalIcon = renewal.icon;
                                        const progress = getProgressPercentage(contract.startDate, contract.endDate);
                                        
                                        return (
                                            <TableRow 
                                                key={contract.id} 
                                                className="group cursor-pointer hover:bg-muted/30 transition-colors"
                                                onClick={() => router.push(`/erp/crm/customers/${contract.customerId}`)}
                                            >
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                                            <FileText className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium">{contract.title}</div>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <Badge variant="outline" className="text-xs">
                                                                    {contract.type}
                                                                </Badge>
                                                                <span className="text-xs text-muted-foreground">
                                                                    ID: {contract.id}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{contract.customerName || contract.customerId}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {contract.company || 'Individual'}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-2">
                                                        <div className="text-sm">
                                                            {format(new Date(contract.startDate), 'MMM d, yyyy')} → 
                                                            {format(new Date(contract.endDate), 'MMM d, yyyy')}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Progress value={progress} className="h-2" />
                                                            <span className="text-xs text-muted-foreground min-w-[40px]">
                                                                {Math.round(progress)}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="font-bold text-lg">₹{contract.value.toLocaleString()}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {contract.currency || 'INR'}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge 
                                                        variant={contract.status === 'Active' ? 'default' : 'secondary'}
                                                        className={contract.status === 'Active' 
                                                            ? 'bg-emerald-500 hover:bg-emerald-600' 
                                                            : ''}
                                                    >
                                                        {contract.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge 
                                                        variant="outline" 
                                                        className={`${renewal.color} flex w-fit items-center gap-1.5 font-medium`}
                                                    >
                                                        <RenewalIcon className="h-3 w-3" />
                                                        {renewal.label}
                                                    </Badge>
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
                                                            <DropdownMenuItem onClick={(e) => {
                                                                e.stopPropagation();
                                                                router.push(`/erp/crm/customers/${contract.customerId}`);
                                                            }}>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={(e) => handleDownloadContract(contract.id, e)}>
                                                                <Download className="mr-2 h-4 w-4" />
                                                                Download PDF
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem 
                                                                onClick={(e) => handleRenewContract(contract.id, e)}
                                                                className={renewal.label.includes('Expired') ? 'text-amber-600' : ''}
                                                            >
                                                                <Calendar className="mr-2 h-4 w-4" />
                                                                Renew Contract
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}