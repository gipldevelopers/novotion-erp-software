'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Coins,
    FileText,
    Landmark,
    TrendingUp,
    Calendar,
    ArrowRight,
    AlertCircle,
    CheckCircle2,
    Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { taxationService } from '@/services/taxationService';
import { toast } from 'sonner';
import { TaxRegistry } from '@/components/pages/erp/accounting/taxation/TaxRegistry';

export default function TaxationDashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [gstSummary, setGstSummary] = useState(null);
    const [tdsRecords, setTdsRecords] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const date = new Date();
            // Get current month data mock
            const gstr3b = await taxationService.getGSTR3BData(date.getMonth() + 1, date.getFullYear());
            const tds = await taxationService.getTDSRecords();

            setGstSummary(gstr3b);
            setTdsRecords(tds);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load taxation data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const currentPeriod = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Taxation & Compliance</h1>
                    <p className="text-muted-foreground mt-1">
                        GST Returns, TDS Management, and Tax Liability Overview
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Tax Report
                    </Button>
                    <Button>
                        <Coins className="h-4 w-4 mr-2" />
                        Pay Tax
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total GST Payable (This Month)</p>
                            <h3 className="text-2xl font-bold mt-2 text-blue-900 dark:text-blue-100">
                                ₹{gstSummary?.payment?.taxPayable?.toLocaleString() || '0'}
                            </h3>
                        </div>
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <Coins className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                        <AlertCircle className="h-3 w-3" />
                        Due by 20th {currentPeriod}
                    </div>
                </Card>

                <Card className="p-6 bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Input Tax Credit (ITC)</p>
                            <h3 className="text-2xl font-bold mt-2 text-purple-900 dark:text-purple-100">
                                ₹{(gstSummary?.itc?.igst + gstSummary?.itc?.cgst + gstSummary?.itc?.sgst)?.toLocaleString() || '0'}
                            </h3>
                        </div>
                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-purple-600 dark:text-purple-400">
                        Available for offset
                    </div>
                </Card>

                <Card className="p-6 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-amber-600 dark:text-amber-400">TDS Pending Deposit</p>
                            <h3 className="text-2xl font-bold mt-2 text-amber-900 dark:text-amber-100">
                                ₹{tdsRecords.filter(r => r.status === 'pending').reduce((s, r) => s + r.tdsAmount, 0).toLocaleString()}
                            </h3>
                        </div>
                        <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                            <Landmark className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
                        <AlertCircle className="h-3 w-3" />
                        Due by 7th next month
                    </div>
                </Card>
            </div>

            {/* Modules */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="registry">Tax Registry</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* GST Section */}
                        <Card className="p-6 space-y-4 shadow-md hover:shadow-lg transition-shadow border-none bg-card/50 backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">Goods & Services Tax (GST)</h3>
                                        <p className="text-sm text-muted-foreground">Manage monthly returns</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors flex items-center justify-between" onClick={() => router.push('/erp/accounting/taxation/gst/gstr1')}>
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <div className="font-medium">GSTR-1</div>
                                            <div className="text-xs text-muted-foreground">Details of outward supplies</div>
                                        </div>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors flex items-center justify-between" onClick={() => router.push('/erp/accounting/taxation/gst/gstr3b')}>
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <div className="font-medium">GSTR-3B</div>
                                            <div className="text-xs text-muted-foreground">Monthly summary return</div>
                                        </div>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </div>
                        </Card>

                        {/* TDS Section */}
                        <Card className="p-6 space-y-4 shadow-md hover:shadow-lg transition-shadow border-none bg-card/50 backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                        <Landmark className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">Tax Deducted at Source (TDS)</h3>
                                        <p className="text-sm text-muted-foreground">Deductions & Challans</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => router.push('/erp/accounting/taxation/tds')}>
                                    View All <ArrowRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {tdsRecords.slice(0, 3).map(record => (
                                    <div key={record.id} className="flex items-center justify-between text-sm p-2 hover:bg-muted rounded">
                                        <div>
                                            <div className="font-medium">{record.deductee}</div>
                                            <div className="text-xs text-muted-foreground">{new Date(record.paymentDate).toLocaleDateString()} • {record.section}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-red-600">₹{record.tdsAmount.toLocaleString()}</div>
                                            <Badge variant={record.status === 'deposited' ? 'outline' : 'secondary'} className="text-[10px] h-5">
                                                {record.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                                {tdsRecords.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No recent TDS records</p>}
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="registry" className="pt-2">
                    <TaxRegistry />
                </TabsContent>
            </Tabs>
        </div>
    );
}
