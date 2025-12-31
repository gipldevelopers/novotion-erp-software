'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Edit,
    Building2,
    Mail,
    Phone,
    MapPin,
    IndianRupee,
    Calendar,
    Globe,
    CreditCard,
    History,
    FileText,
    TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { accountingService } from '@/services/accountingService';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function VendorProfilePage({ params }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const id = resolvedParams.id;

    const [loading, setLoading] = useState(true);
    const [vendor, setVendor] = useState(null);

    useEffect(() => {
        loadVendor();
    }, [id]);

    const loadVendor = async () => {
        try {
            setLoading(true);
            const data = await accountingService.getVendorById(id);
            if (data) {
                setVendor(data);
            } else {
                router.push('/erp/accounting/vendors');
            }
        } catch (error) {
            console.error('Error loading vendor:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 max-w-7xl mx-auto space-y-6">
                <Skeleton className="h-12 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Skeleton className="h-64 col-span-1" />
                    <Skeleton className="h-64 col-span-2" />
                </div>
            </div>
        );
    }

    if (!vendor) return null;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Building2 className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-3xl font-bold">{vendor.name}</h1>
                                <Badge className={vendor.status === 'active' ? 'bg-green-500' : 'bg-slate-500'}>
                                    {vendor.status}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground font-mono text-sm uppercase tracking-wider mt-1">
                                {vendor.id} • {vendor.category}
                            </p>
                        </div>
                    </div>
                </div>
                <Button onClick={() => router.push(`/erp/accounting/vendors/${id}/edit`)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Contact & Status */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Contact Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Mail className="h-4 w-4 text-muted-foreground mt-1" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Email Address</p>
                                    <p className="font-medium">{vendor.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="h-4 w-4 text-muted-foreground mt-1" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Phone Number</p>
                                    <p className="font-medium">{vendor.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Office Address</p>
                                    <p className="font-medium">{vendor.address}</p>
                                    <p className="text-sm text-muted-foreground mt-1">{vendor.state}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-primary">Financial Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Total Outstanding</p>
                                <div className="text-3xl font-bold text-red-600">
                                    ₹{vendor.outstandingAmount?.toLocaleString('en-IN') || '0'}
                                </div>
                            </div>
                            <div className="pt-4 border-t flex justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground">Transactions</p>
                                    <p className="font-bold text-lg">{vendor.totalTransactions}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground">Growth</p>
                                    <div className="flex items-center gap-1 text-green-600 font-bold justify-end">
                                        <TrendingUp className="h-4 w-4" />
                                        <span>+12%</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Details Tabs */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="overview" className="space-y-4">
                        <TabsList className="bg-transparent border-b rounded-none w-full justify-start h-auto p-0 gap-6">
                            <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2">
                                <Globe className="h-4 w-4 mr-2" />
                                Business Information
                            </TabsTrigger>
                            <TabsTrigger value="transactions" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2">
                                <History className="h-4 w-4 mr-2" />
                                Recent Transactions
                            </TabsTrigger>
                            <TabsTrigger value="banking" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2">
                                <CreditCard className="h-4 w-4 mr-2" />
                                Banking Details
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="animate-in fade-in-50 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm font-semibold uppercase">GST Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 font-mono">
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="text-muted-foreground">GSTIN</span>
                                            <span className="font-bold">{vendor.gstin || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="text-muted-foreground">Status</span>
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Verified</Badge>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="text-muted-foreground">Last Filing</span>
                                            <span className="font-medium">Nov 2024</span>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm font-semibold uppercase">Commercials</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex justify-between border-b pb-2 text-sm">
                                            <span className="text-muted-foreground">Payment Terms</span>
                                            <span className="font-medium">{vendor.paymentTerms}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2 text-sm">
                                            <span className="text-muted-foreground">Currency</span>
                                            <span className="font-medium">INR - Indian Rupee</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2 text-sm">
                                            <span className="text-muted-foreground">Credit Limit</span>
                                            <span className="font-medium font-mono text-primary">₹5,00,000</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="banking">
                            <Card>
                                <CardContent className="p-8 text-center space-y-4">
                                    <div className="mx-auto h-16 w-16 rounded-full bg-primary/5 flex items-center justify-center">
                                        <CreditCard className="h-8 w-8 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{vendor.bankName || 'HDFC Bank'}</h3>
                                        <p className="text-sm text-muted-foreground font-mono mt-1">A/C: {vendor.accountNumber || '********1234'}</p>
                                        <p className="text-sm text-muted-foreground font-mono mt-1">IFSC: {vendor.ifscCode || 'HDFC0001234'}</p>
                                    </div>
                                    <Badge variant="secondary" className="px-4 py-1">Primary Settlement Account</Badge>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="transactions">
                            <div className="text-center py-12 bg-slate-50 border-2 border-dashed rounded-xl">
                                <FileText className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                                <h3 className="font-medium">No recent transactions shown</h3>
                                <p className="text-sm text-muted-foreground px-12">Transaction history for this vendor will be automatically populated here once you start generating bills or recording payments.</p>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
