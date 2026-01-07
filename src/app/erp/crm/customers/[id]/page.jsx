// app/erp/crm/customers/[id]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { crmService } from '@/services/crmService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
    ArrowLeft,
    Edit,
    Mail,
    Phone,
    Building2,
    MapPin,
    Globe,
    Activity,
    ShoppingCart,
    MessageSquare,
    Settings,
    MoreVertical,
    Download,
    Share2,
    Trash2,
    Plus,
    ChevronRight,
    Star,
    Target,
    DollarSign,
    FileCheck,
    FileText
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { format } from 'date-fns';

import CustomerInvoices from './Invoices';
import CustomerPayments from './Payments';
import CustomerActivity from './Activity';
import CustomerContracts from './Contracts';

export default function CustomerDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const customerId = params.id;

    const [customer, setCustomer] = useState(null);
    const [invoices, setInvoices] = useState([]);
    const [payments, setPayments] = useState([]);
    const [activities, setActivities] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (customerId) {
            fetchAllData();
        }
    }, [customerId]);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const [
                customerData,
                invoicesData,
                paymentsData,
                activitiesData,
                contractsData
            ] = await Promise.all([
                crmService.getCustomerById(customerId),
                crmService.getInvoicesByCustomer(customerId),
                crmService.getPaymentsByCustomer(customerId),
                crmService.getActivities(customerId),
                crmService.getContracts(customerId)
            ]);

            setCustomer(customerData);
            setInvoices(invoicesData || []);
            setPayments(paymentsData || []);
            setActivities(activitiesData || []);
            setContracts(contractsData || []);
        } catch (error) {
            console.error('Failed to fetch customer data', error);
            toast.error('Failed to load customer details');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this customer?')) return;

        try {
            await crmService.deleteCustomer(customerId);
            toast.success('Customer deleted successfully');
            router.push('/erp/crm/customers');
        } catch (error) {
            console.error('Failed to delete customer', error);
            toast.error('Failed to delete customer');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
            case 'Inactive': return 'bg-gray-500/10 text-gray-600 border-gray-200';
            case 'VIP': return 'bg-purple-500/10 text-purple-600 border-purple-200';
            default: return 'bg-blue-500/10 text-blue-600 border-blue-200';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-3 border-primary border-t-transparent"></div>
                    <p className="text-sm text-muted-foreground">Loading customer details...</p>
                </div>
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Customer not found</h2>
                    <p className="text-muted-foreground mt-2">The customer you're looking for doesn't exist.</p>
                </div>
                <Button onClick={() => router.push('/erp/crm/customers')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Customers
                </Button>
            </div>
        );
    }

    // Derive recent orders from invoices for Overview tab
    // (Assuming invoices can act as a proxy for orders in this simplified view)
    const recentOrders = invoices.slice(0, 3).map(inv => ({
        id: inv.id,
        date: inv.date,
        amount: inv.amount,
        status: inv.status === 'Paid' ? 'Delivered' : 'Processing', // Simple mapping
        items: inv.items?.length || 1
    }));

    const engagementScore = Math.min(100, (activities.length * 10) + (invoices.length * 5));

    return (
        <div className="min-h-screen bg-background p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push('/erp/crm/customers')}
                        className="hover:bg-accent"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-2 border-primary/10">
                            <AvatarFallback className="text-xl bg-primary/10 text-primary">
                                {customer.name?.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold tracking-tight">{customer.name}</h1>
                                <Badge variant="outline" className={getStatusColor(customer.status)}>
                                    {customer.status}
                                </Badge>
                                {customer.type === 'VIP' && (
                                    <Badge className="bg-purple-500/10 text-purple-600 border-purple-200">
                                        <Star className="h-3 w-3 mr-1" />
                                        VIP
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-muted-foreground">
                                <span>{customer.company}</span>
                                <Separator orientation="vertical" className="h-4" />
                                <span>ID: {customer.id}</span>
                                <Separator orientation="vertical" className="h-4" />
                                <span>Since {customer.joinDate ? format(new Date(customer.joinDate), 'MMM yyyy') : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Button onClick={() => router.push(`/erp/crm/customers/${customerId}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Order
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Send Message
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <FileCheck className="mr-2 h-4 w-4" />
                                Generate Invoice
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleDelete}
                                className="text-destructive focus:text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Customer
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                                <p className="text-2xl font-bold">₹{customer.totalSpent?.toLocaleString() || '0'}</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-emerald-500/30" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Lifetime value</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                                <p className="text-2xl font-bold">{invoices.length || 0}</p>
                            </div>
                            <ShoppingCart className="h-8 w-8 text-blue-500/30" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Based on invoices</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Avg. Order Value</p>
                                <p className="text-2xl font-bold">
                                    ₹{invoices.length ? Math.round(customer.totalSpent / invoices.length).toLocaleString() : '0'}
                                </p>
                            </div>
                            <Target className="h-8 w-8 text-purple-500/30" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Per transaction</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Last Activity</p>
                                <p className="text-2xl font-bold">
                                    {customer.lastActivity
                                        ? format(new Date(customer.lastActivity), 'MMM d')
                                        : 'Never'
                                    }
                                </p>
                            </div>
                            <Activity className="h-8 w-8 text-amber-500/30" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Recent interaction</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="orders">Orders</TabsTrigger>
                            <TabsTrigger value="contracts">Contracts</TabsTrigger>
                            <TabsTrigger value="activity">Activity</TabsTrigger>
                            <TabsTrigger value="documents">Documents</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-6 mt-6">
                            {/* Contact Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Contact Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                                    <Mail className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">Email</p>
                                                    <p className="text-muted-foreground">{customer.email}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                                    <Phone className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">Phone</p>
                                                    <p className="text-muted-foreground">{customer.phone || 'Not provided'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                                    <Building2 className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">Company</p>
                                                    <p className="text-muted-foreground">{customer.company}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                                    <Globe className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">Industry</p>
                                                    <p className="text-muted-foreground">{customer.industry || 'General'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {customer.address && (
                                        <div className="flex items-start gap-3 pt-4 border-t">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                                <MapPin className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Address</p>
                                                <p className="text-muted-foreground">{customer.address}</p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Recent Orders (from Invoices) */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Recent Invoices</CardTitle>
                                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('orders')}>
                                        View All
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {recentOrders.length > 0 ? (
                                            recentOrders.map((order) => (
                                                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                                    <div>
                                                        <p className="font-medium">Invoice #{order.id}</p>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <Badge variant="outline" className={order.status === 'Delivered' ? 'text-emerald-600 border-emerald-200' : 'text-blue-600 border-blue-200'}>
                                                                {order.status === 'Delivered' ? 'Paid' : 'Unpaid'}
                                                            </Badge>
                                                            <span className="text-sm text-muted-foreground">
                                                                {format(new Date(order.date), 'MMM d, yyyy')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold">₹{order.amount.toLocaleString()}</p>
                                                        <p className="text-sm text-muted-foreground">{order.items} items</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-muted-foreground text-sm">No recent invoices found.</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="orders" className="mt-6 space-y-6">
                            <CustomerInvoices invoices={invoices} />
                            <CustomerPayments payments={payments} />
                        </TabsContent>

                        <TabsContent value="contracts" className="mt-6">
                            <CustomerContracts contracts={contracts} />
                        </TabsContent>

                        <TabsContent value="activity" className="mt-6">
                            <CustomerActivity activity={activities} />
                        </TabsContent>

                        <TabsContent value="documents" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Documents</CardTitle>
                                    <CardDescription>Files and attachments related to this customer.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                    <FileText className="h-10 w-10 mb-3 opacity-20" />
                                    <p>No documents uploaded yet.</p>
                                    <Button variant="outline" className="mt-4">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Upload Document
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right Column - Quick Stats & Actions */}
                <div className="space-y-6">
                    {/* Customer Engagement */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Engagement Score</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold">{engagementScore}%</div>
                                    <p className="text-sm text-muted-foreground">
                                        {engagementScore > 70 ? 'Very Active' : 'Moderate Activity'}
                                    </p>
                                </div>
                                <Progress value={engagementScore} className="h-2" />
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="text-center">
                                        <div className="font-bold">{activities.length}</div>
                                        <div className="text-muted-foreground">Interactions</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold">{invoices.length}</div>
                                        <div className="text-muted-foreground">Orders</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button variant="outline" className="w-full justify-start">
                                <Plus className="mr-2 h-4 w-4" />
                                Create New Order
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Send Message
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <Mail className="mr-2 h-4 w-4" />
                                Email Invoice
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <Settings className="mr-2 h-4 w-4" />
                                Account Settings
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Notes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="text-sm text-muted-foreground">
                                    {customer.notes || 'No notes added yet.'}
                                </div>
                                <Button variant="ghost" size="sm" className="w-full">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Note
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Support Tickets */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Support Tickets</span>
                                <Badge variant="outline">2 Open</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="p-3 rounded-lg border bg-muted/30">
                                    <p className="font-medium text-sm">Payment issue</p>
                                    <p className="text-xs text-muted-foreground mt-1">Opened 2 days ago</p>
                                </div>
                                <div className="p-3 rounded-lg border bg-muted/30">
                                    <p className="font-medium text-sm">Feature request</p>
                                    <p className="text-xs text-muted-foreground mt-1">Opened 1 week ago</p>
                                </div>
                                <Button variant="ghost" size="sm" className="w-full">
                                    View All Tickets
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
