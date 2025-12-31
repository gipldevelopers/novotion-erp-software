'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Calendar,
    Clock,
    ArrowLeft,
    Edit,
    Play,
    Pause,
    Receipt,
    User,
    Mail,
    CheckCircle2,
    AlertCircle,
    Layout
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { accountingService } from '@/services/accountingService';
import { toast } from 'sonner';

export default function RecurringInvoiceDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoice = async () => {
            setLoading(true);
            try {
                const data = await accountingService.getRecurringInvoiceById(id);
                if (data) {
                    setInvoice(data);
                } else {
                    toast.error('Recurring invoice template not found');
                    router.push('/erp/accounting/invoices/recurring');
                }
            } catch (error) {
                console.error('Error fetching recurring invoice:', error);
                toast.error('Failed to load template details');
            } finally {
                setLoading(false);
            }
        };
        fetchInvoice();
    }, [id, router]);

    const handleToggleStatus = async () => {
        const newStatus = invoice.status === 'active' ? 'paused' : 'active';
        try {
            await accountingService.updateRecurringInvoice(id, { status: newStatus });
            setInvoice({ ...invoice, status: newStatus });
            toast.success(`Template ${newStatus === 'active' ? 'activated' : 'paused'} successfully`);
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <Skeleton className="h-10 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Skeleton className="h-64 md:col-span-2" />
                    <Skeleton className="h-64" />
                </div>
            </div>
        );
    }

    if (!invoice) return null;

    return (
        <div className="p-6 space-y-6 animate-fade-in bg-background">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight">{invoice.templateName}</h1>
                            <Badge variant={invoice.status === 'active' ? 'success' : 'warning'} className="capitalize">
                                {invoice.status === 'active' ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                                {invoice.status}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground mt-1 flex items-center gap-1">
                            <Layout className="h-4 w-4" />
                            Template ID: <span className="font-mono text-primary">{invoice.id}</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={handleToggleStatus}>
                        {invoice.status === 'active' ? (
                            <><Pause className="h-4 w-4 mr-2" /> Pause Template</>
                        ) : (
                            <><Play className="h-4 w-4 mr-2" /> Activate Template</>
                        )}
                    </Button>
                    <Button onClick={() => router.push(`/erp/accounting/invoices/recurring/${id}/edit`)}>
                        <Edit className="h-4 w-4 mr-2" /> Edit Template
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Details and Items */}
                <div className="md:col-span-2 space-y-6">
                    {/* Schedule Overview */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-primary" />
                                Schedule Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Frequency</p>
                                    <p className="text-sm font-bold capitalize">{invoice.frequency}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Next Generation</p>
                                    <p className="text-sm font-bold">{formatDate(invoice.nextGenerationDate)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Last Generated</p>
                                    <p className="text-sm font-bold">{formatDate(invoice.lastGeneratedDate)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Template Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Receipt className="h-5 w-5 text-primary" />
                                Items Breakdown
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="border rounded-lg overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/50 border-b">
                                        <tr>
                                            <th className="text-left p-4 font-bold">Item Description</th>
                                            <th className="text-center p-4 font-bold">Quantity</th>
                                            <th className="text-right p-4 font-bold">Rate</th>
                                            <th className="text-right p-4 font-bold">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {invoice.items.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-muted/30">
                                                <td className="p-4">
                                                    <div className="font-medium">{item.name}</div>
                                                    <div className="text-xs text-muted-foreground">{item.description || 'No description provided'}</div>
                                                </td>
                                                <td className="p-4 text-center">{item.quantity}</td>
                                                <td className="p-4 text-right">₹{item.rate?.toLocaleString('en-IN') || (item.amount / item.quantity).toLocaleString('en-IN')}</td>
                                                <td className="p-4 text-right font-bold">₹{item.amount.toLocaleString('en-IN')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-muted/20">
                                        <tr>
                                            <td colSpan="3" className="p-4 text-right font-bold">Total Forecast Amount</td>
                                            <td className="p-4 text-right font-black text-lg text-primary">₹{invoice.amount.toLocaleString('en-IN')}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Customer and Automation */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                Recipient Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Customer Name</p>
                                <p className="text-sm font-bold mt-1">{invoice.customer}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Delivery Email</p>
                                <p className="text-sm font-bold mt-1 flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    {invoice.email}
                                </p>
                            </div>
                            <div className="pt-4 border-t">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Auto-Send via Email</span>
                                    <Badge variant={invoice.autoSend ? "default" : "outline"}>
                                        {invoice.autoSend ? "Enabled" : "Disabled"}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-primary" />
                                Automation Logic
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                This template will automatically generate a new invoice every <strong>{invoice.frequency}</strong>.
                                {invoice.autoSend
                                    ? " The generated invoice will be sent to the customer's email address immediately upon creation."
                                    : " Invoices will be created as drafts and will require manual approval before being sent."
                                }
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
