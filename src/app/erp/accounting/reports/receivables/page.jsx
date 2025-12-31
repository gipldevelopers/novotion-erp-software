'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Download, ArrowLeft, Filter, Search, Calendar, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { reportService } from '@/services/reportService';
import { exportToCSV } from '@/utils/exportUtils';
import { toast } from 'sonner';

export default function AgedReceivablesPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const result = await reportService.getAgedReceivables();
                setData(result);
            } catch (error) {
                toast.error('Failed to generate report');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading Report...</div>;

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Aged Receivables</h1>
                        <p className="text-muted-foreground">Outstanding invoices by aging buckets</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><Filter className="h-4 w-4 mr-2" /> Filter</Button>
                    <Button variant="outline" onClick={() => {
                        if (data && data.customers) {
                            const exportData = data.customers.map(c => ({
                                Name: c.name,
                                Total: c.amount,
                                Current: c.buckets.current,
                                '1-30 Days': c.buckets.b30,
                                '31-60 Days': c.buckets.b60,
                                '90+ Days': c.buckets.b90
                            }));
                            exportToCSV(exportData, 'AgedReceivables');
                            toast.success('Report exported');
                        }
                    }}>
                        <Download className="h-4 w-4 mr-2" /> Export
                    </Button>
                </div>
            </div>

            {/* Summary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {data.buckets.map((bucket, i) => (
                    <Card key={i} className="p-4 border-l-4" style={{ borderLeftColor: i === 3 ? 'red' : 'transparent' }}>
                        <p className="text-sm text-muted-foreground font-medium mb-1">{bucket.range}</p>
                        <div className="flex items-baseline justify-between">
                            <h3 className={`text-2xl font-bold ${bucket.color}`}>₹{bucket.amount.toLocaleString()}</h3>
                            <span className="text-xs bg-muted px-2 py-1 rounded-full">{bucket.count} Invoices</span>
                        </div>
                    </Card>
                ))}
            </div>

            <Card className="p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search customer..." className="pl-9" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 border-b">
                            <tr>
                                <th className="p-4 font-medium">Customer Name</th>
                                <th className="p-4 text-right">Current</th>
                                <th className="p-4 text-right min-w-[100px]">1-30 Days</th>
                                <th className="p-4 text-right min-w-[100px]">31-60 Days</th>
                                <th className="p-4 text-right min-w-[100px]">61-90 Days</th>
                                <th className="p-4 text-right min-w-[100px] text-red-600 font-bold">90+ Days</th>
                                <th className="p-4 text-right font-bold bg-muted/20">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {data.customers.map((cust) => (
                                <tr key={cust.id} className="hover:bg-muted/30">
                                    <td className="p-4 font-medium">
                                        <div>{cust.name}</div>
                                        <div className="text-xs text-muted-foreground">{cust.id}</div>
                                    </td>
                                    <td className="p-4 text-right text-muted-foreground">₹{cust.buckets.current.toLocaleString()}</td>
                                    <td className="p-4 text-right">₹{cust.buckets.b30.toLocaleString()}</td>
                                    <td className="p-4 text-right">₹{cust.buckets.b60.toLocaleString()}</td>
                                    <td className="p-4 text-right">₹{cust.buckets.b60.toLocaleString()}</td>
                                    <td className="p-4 text-right text-red-600 font-medium">
                                        {cust.buckets.b90 > 0 && <AlertTriangle className="h-3 w-3 inline mr-1" />}
                                        ₹{cust.buckets.b90.toLocaleString()}
                                    </td>
                                    <td className="p-4 text-right font-bold bg-muted/10">₹{cust.amount.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
