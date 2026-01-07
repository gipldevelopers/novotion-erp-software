'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Plus, 
    FileText, 
    Search, 
    Filter, 
    Download, 
    MoreHorizontal, 
    Eye, 
    Send, 
    Clock,
    CheckCircle,
    Calendar,
    XCircle,
    Edit,
    Copy,
    Printer,
    Mail,
    TrendingUp,
    DollarSign,
    Users,
    FileCheck,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { crmService } from '@/services/crmService';
import { format, differenceInDays } from 'date-fns';
import { toast } from 'sonner';

export default function QuotationsPage() {
    const router = useRouter();
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');

    useEffect(() => {
        fetchQuotations();
    }, []);

    const fetchQuotations = async () => {
        try {
            const data = await crmService.getQuotations();
            setQuotations(data);
        } catch (error) {
            console.error("Failed to fetch quotations", error);
            toast.error('Failed to load quotations');
        } finally {
            setLoading(false);
        }
    };

    const stats = useMemo(() => {
        const now = new Date();
        return {
            total: quotations.length,
            accepted: quotations.filter(q => q.status === 'Accepted').length,
            pending: quotations.filter(q => q.status === 'Sent' || q.status === 'Draft').length,
            totalValue: quotations.reduce((sum, q) => sum + q.totalAmount, 0),
            conversionRate: quotations.length > 0 
                ? Math.round((quotations.filter(q => q.status === 'Accepted').length / quotations.length) * 100)
                : 0,
            expiringSoon: quotations.filter(q => {
                if (!q.expiryDate) return false;
                const daysLeft = differenceInDays(new Date(q.expiryDate), now);
                return q.status === 'Sent' && daysLeft <= 3 && daysLeft >= 0;
            }).length,
        };
    }, [quotations]);

    const getStatusConfig = (status) => {
        switch (status) {
            case 'Draft': 
                return { 
                    color: 'bg-gray-500/10 text-gray-600 border-gray-200 hover:bg-gray-500/20',
                    icon: FileText,
                    label: 'Draft'
                };
            case 'Sent': 
                return { 
                    color: 'bg-blue-500/10 text-blue-600 border-blue-200 hover:bg-blue-500/20',
                    icon: Send,
                    label: 'Sent'
                };
            case 'Accepted': 
                return { 
                    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200 hover:bg-emerald-500/20',
                    icon: CheckCircle,
                    label: 'Accepted'
                };
            case 'Rejected': 
                return { 
                    color: 'bg-red-500/10 text-red-600 border-red-200 hover:bg-red-500/20',
                    icon: XCircle,
                    label: 'Rejected'
                };
            case 'Expired': 
                return { 
                    color: 'bg-amber-500/10 text-amber-600 border-amber-200 hover:bg-amber-500/20',
                    icon: Clock,
                    label: 'Expired'
                };
            default: 
                return { 
                    color: 'bg-gray-500/10 text-gray-600 border-gray-200 hover:bg-gray-500/20',
                    icon: FileText,
                    label: status
                };
        }
    };

    const getExpiryStatus = (expiryDate, status) => {
        if (!expiryDate || status !== 'Sent') return null;
        const now = new Date();
        const daysLeft = differenceInDays(new Date(expiryDate), now);
        
        if (daysLeft < 0) {
            return { label: 'Expired', color: 'text-amber-600', icon: AlertCircle };
        }
        if (daysLeft <= 3) {
            return { label: `Expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`, color: 'text-amber-600', icon: Clock };
        }
        if (daysLeft <= 7) {
            return { label: `Expires in ${daysLeft} days`, color: 'text-blue-600', icon: Clock };
        }
        return null;
    };

    const filteredQuotations = quotations.filter(q => {
        const matchesSearch = q.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.company?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
        
        let matchesDate = true;
        const now = new Date();
        const quoteDate = new Date(q.date);
        
        switch (dateFilter) {
            case 'today':
                matchesDate = format(quoteDate, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');
                break;
            case 'week':
                const weekAgo = new Date(now.setDate(now.getDate() - 7));
                matchesDate = quoteDate >= weekAgo;
                break;
            case 'month':
                const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
                matchesDate = quoteDate >= monthAgo;
                break;
            default:
                matchesDate = true;
        }
        
        return matchesSearch && matchesStatus && matchesDate;
    });

    const handleDuplicate = async (quoteId, e) => {
        e.stopPropagation();
        toast.success('Duplicating quotation...');
        // Add duplication logic here
    };

    const handleSendEmail = async (quoteId, e) => {
        e.stopPropagation();
        toast.success('Sending quotation via email...');
        // Add email sending logic here
    };

    const handleDownloadPDF = async (quoteId, e) => {
        e.stopPropagation();
        toast.success('Generating PDF...');
        // Add PDF generation logic here
    };

    return (
        <div className="space-y-6 p-8">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Quotations & Proposals</h2>
                    <p className="text-muted-foreground">Manage service proposals, estimates, and sales quotations</p>
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
                    <Button onClick={() => router.push('/erp/crm/quotations/create')}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Quotation
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <Progress value={stats.conversionRate} className="h-1 mt-2" />
                        <p className="text-xs text-muted-foreground mt-2">{stats.conversionRate}% conversion rate</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{stats.totalValue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Total quotation value</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Accepted</CardTitle>
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.accepted}</div>
                        <p className="text-xs text-muted-foreground">Converted to orders</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pending}</div>
                        <p className="text-xs text-muted-foreground">Awaiting response</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.expiringSoon}</div>
                        <p className="text-xs text-muted-foreground">Within 3 days</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions & Filters */}
            <Card className="border-none shadow-sm bg-transparent">
                <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle>Quotation Directory</CardTitle>
                            <CardDescription>
                                {filteredQuotations.length} quotation{filteredQuotations.length !== 1 ? 's' : ''} found
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2 flex-1 sm:flex-initial sm:justify-end">
                            <div className="relative flex-1 sm:flex-initial sm:w-[250px]">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search quotations or customers..."
                                    className="pl-9 bg-background"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[140px]">
                                    <Filter className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="Draft">Draft</SelectItem>
                                    <SelectItem value="Sent">Sent</SelectItem>
                                    <SelectItem value="Accepted">Accepted</SelectItem>
                                    <SelectItem value="Rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={dateFilter} onValueChange={setDateFilter}>
                                <SelectTrigger className="w-[140px]">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Date Range" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Time</SelectItem>
                                    <SelectItem value="today">Today</SelectItem>
                                    <SelectItem value="week">Last 7 Days</SelectItem>
                                    <SelectItem value="month">Last 30 Days</SelectItem>
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
                                    <TableHead className="w-[300px]">Quotation Details</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Date & Validity</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right w-[80px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                                                <span className="text-sm text-muted-foreground">Loading quotations...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredQuotations.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <FileText className="h-12 w-12 text-muted-foreground/50" />
                                                <div>
                                                    <h3 className="font-medium">No quotations found</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {searchQuery || statusFilter !== 'all' 
                                                            ? 'Try adjusting your search or filters' 
                                                            : 'Get started by creating your first quotation'}
                                                    </p>
                                                </div>
                                                {!searchQuery && statusFilter === 'all' && (
                                                    <Button 
                                                        variant="outline" 
                                                        className="mt-2"
                                                        onClick={() => router.push('/erp/crm/quotations/create')}
                                                    >
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        Create Quotation
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredQuotations.map((quote) => {
                                        const statusConfig = getStatusConfig(quote.status);
                                        const StatusIcon = statusConfig.icon;
                                        const expiryStatus = getExpiryStatus(quote.expiryDate, quote.status);
                                        
                                        return (
                                            <TableRow 
                                                key={quote.id} 
                                                className="group cursor-pointer hover:bg-muted/30 transition-colors"
                                                onClick={() => router.push(`/erp/crm/quotations/${quote.id}`)}
                                            >
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                                                            quote.status === 'Accepted' ? 'bg-emerald-500/10' :
                                                            quote.status === 'Sent' ? 'bg-blue-500/10' :
                                                            'bg-gray-500/10'
                                                        }`}>
                                                            <FileText className={`h-5 w-5 ${
                                                                quote.status === 'Accepted' ? 'text-emerald-600' :
                                                                quote.status === 'Sent' ? 'text-blue-600' :
                                                                'text-gray-600'
                                                            }`} />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium">{quote.id}</div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {quote.title || 'Service Quotation'}
                                                            </div>
                                                            {expiryStatus && (
                                                                <div className="flex items-center gap-1 mt-1">
                                                                    <expiryStatus.icon className={`h-3 w-3 ${expiryStatus.color}`} />
                                                                    <span className={`text-xs ${expiryStatus.color}`}>
                                                                        {expiryStatus.label}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{quote.customerName}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {quote.company || 'Individual'}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="text-sm">
                                                            {format(new Date(quote.date), 'MMM d, yyyy')}
                                                        </div>
                                                        {quote.expiryDate && (
                                                            <div className="text-xs text-muted-foreground">
                                                                Valid until: {format(new Date(quote.expiryDate), 'MMM d')}
                                                            </div>
                                                        )}
                                                        <div className="text-xs">
                                                            Version {quote.version || '1.0'}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="font-bold text-lg">₹{quote.totalAmount.toLocaleString()}</div>
                                                    {quote.taxAmount && (
                                                        <div className="text-xs text-muted-foreground">
                                                            + ₹{quote.taxAmount.toLocaleString()} tax
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge 
                                                        variant="outline" 
                                                        className={`${statusConfig.color} flex w-fit items-center gap-1.5 font-medium`}
                                                    >
                                                        <StatusIcon className="h-3 w-3" />
                                                        {statusConfig.label}
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
                                                                router.push(`/erp/crm/quotations/${quote.id}`);
                                                            }}>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={(e) => {
                                                                e.stopPropagation();
                                                                router.push(`/erp/crm/quotations/${quote.id}/edit`);
                                                            }}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={(e) => handleDuplicate(quote.id, e)}>
                                                                <Copy className="mr-2 h-4 w-4" />
                                                                Duplicate
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={(e) => handleSendEmail(quote.id, e)}>
                                                                <Send className="mr-2 h-4 w-4" />
                                                                Send via Email
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={(e) => handleDownloadPDF(quote.id, e)}>
                                                                <Download className="mr-2 h-4 w-4" />
                                                                Download PDF
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Printer className="mr-2 h-4 w-4" />
                                                                Print
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

            {/* Quick Stats Footer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-muted/30 border-none">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">Pending Approval</p>
                                <p className="text-xs text-muted-foreground">Requires follow-up</p>
                            </div>
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-600">
                                {quotations.filter(q => q.status === 'Sent').length}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-muted/30 border-none">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">Average Quote Value</p>
                                <p className="text-xs text-muted-foreground">All quotations</p>
                            </div>
                            <div className="font-bold">
                                ₹{quotations.length > 0 ? Math.round(stats.totalValue / quotations.length).toLocaleString() : '0'}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-muted/30 border-none">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">Response Time</p>
                                <p className="text-xs text-muted-foreground">Average 3.2 days</p>
                            </div>
                            <Clock className="h-5 w-5 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}