'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Download,
    Calendar,
    ArrowLeft,
    FileText,
    Users,
    ShoppingCart,
    Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { taxationService } from '@/services/taxationService';
import { toast } from 'sonner';

export default function GSTR1Page() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [month, setMonth] = useState(new Date().getMonth() + 1); // 1-12
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        loadData();
    }, [month, year]);

    const loadData = async () => {
        try {
            setLoading(true);
            const result = await taxationService.getGSTR1Data(month, year);
            setData(result);
        } catch (error) {
            toast.error('Failed to load GSTR-1 data');
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

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">GSTR-1: Outward Supplies</h1>
                    <p className="text-muted-foreground">{data.period}</p>
                </div>
                <div className="ml-auto flex gap-2">
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download JSON
                    </Button>
                    <Button>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Summary
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 bg-primary/5 border-primary/20">
                    <p className="text-sm font-medium text-primary">Total Taxable Value</p>
                    <h3 className="text-2xl font-bold">₹{data.summary.totalTaxableValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</h3>
                </Card>
                <Card className="p-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Tax Liability</p>
                    <h3 className="text-2xl font-bold">₹{data.summary.totalTaxLiability.toLocaleString(undefined, { maximumFractionDigits: 2 })}</h3>
                </Card>
                <Card className="p-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Invoices (B2B)</p>
                    <h3 className="text-2xl font-bold">{data.summary.b2bCount}</h3>
                </Card>
                <Card className="p-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Invoices (B2C)</p>
                    <h3 className="text-2xl font-bold">{data.summary.b2clCount + data.summary.b2csCount}</h3>
                </Card>
            </div>

            {/* Detailed View */}
            <Card className="p-6">
                <Tabs defaultValue="b2b">
                    <div className="flex items-center justify-between mb-4">
                        <TabsList>
                            <TabsTrigger value="b2b">B2B Invoices</TabsTrigger>
                            <TabsTrigger value="b2cl">B2C Large</TabsTrigger>
                            <TabsTrigger value="b2cs">B2C Small</TabsTrigger>
                        </TabsList>

                        <div className="flex gap-2">
                            <select
                                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                                value={month}
                                onChange={(e) => setMonth(parseInt(e.target.value))}
                            >
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {new Date(0, i).toLocaleString('default', { month: 'short' })}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                                value={year}
                                onChange={(e) => setYear(parseInt(e.target.value))}
                            >
                                <option value="2024">2024</option>
                                <option value="2025">2025</option>
                            </select>
                        </div>
                    </div>

                    <TabsContent value="b2b">
                        <InvoiceTable invoices={data.details.b2b} type="B2B" />
                    </TabsContent>
                    <TabsContent value="b2cl">
                        <InvoiceTable invoices={data.details.b2cl} type="B2C Large" />
                    </TabsContent>
                    <TabsContent value="b2cs">
                        <InvoiceTable invoices={data.details.b2cs} type="B2C Small" />
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    );
}

function InvoiceTable({ invoices, type }) {
    if (!invoices.length) {
        return (
            <div className="text-center py-12 text-muted-foreground border rounded-md">
                No {type} invoices found for this period.
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 font-medium">
                    <tr>
                        <th className="p-3">GSTIN/UIN</th>
                        <th className="p-3">Receiver Name</th>
                        <th className="p-3">Invoice No</th>
                        <th className="p-3">Date</th>
                        <th className="p-3 text-right">Invoice Value</th>
                        <th className="p-3 text-right">Taxable Value</th>
                        <th className="p-3 text-right">Tax Amount</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {invoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-muted/50">
                            <td className="p-3 font-mono text-xs">{inv.customerGstin || '-'}</td>
                            <td className="p-3 font-medium">{inv.customer}</td>
                            <td className="p-3">{inv.number}</td>
                            <td className="p-3">{new Date(inv.createdAt).toLocaleDateString()}</td>
                            <td className="p-3 text-right">₹{inv.amount.toLocaleString()}</td>
                            <td className="p-3 text-right">
                                ₹{(inv.amount / 1.18).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </td>
                            <td className="p-3 text-right text-red-600">
                                ₹{(inv.amount - (inv.amount / 1.18)).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
