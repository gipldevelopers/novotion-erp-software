'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Download, ArrowLeft, TrendingUp, Users, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { reportService } from '@/services/reportService';
import { toast } from 'sonner';

export default function RevenueReportPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const result = await reportService.getRevenueAnalysis();
                setData(result);
            } catch (error) {
                toast.error('Failed to generate report');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading Analytics...</div>;

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Revenue Analytics</h1>
                        <p className="text-muted-foreground">Sales performance and growth insights</p>
                    </div>
                </div>
                <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none shadow-lg">
                    <p className="text-indigo-100 font-medium">Total Revenue (YTD)</p>
                    <h3 className="text-3xl font-bold mt-2">₹{data.totalRevenue.toLocaleString()}</h3>
                    <div className="mt-4 flex items-center text-indigo-100 text-sm bg-white/10 w-fit px-2 py-1 rounded">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        +{data.growth}% vs last year
                    </div>
                </Card>

                <Card className="p-6 md:col-span-2">
                    <h3 className="font-semibold mb-4">Monthly Revenue Trend</h3>
                    <div className="flex items-end gap-2 h-40">
                        {data.monthly.map((m, i) => {
                            const max = Math.max(...data.monthly.map(x => x.amount));
                            const height = (m.amount / max) * 100;
                            return (
                                <div key={i} className="flex-1 flex flex-col justify-end group cursor-pointer">
                                    <div
                                        className="bg-indigo-600 rounded-t w-full opacity-80 group-hover:opacity-100 transition-all relative"
                                        style={{ height: `${height}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            ₹{m.amount / 1000}k
                                        </div>
                                    </div>
                                    <div className="text-xs text-center mt-2 text-muted-foreground">{m.month}</div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Users className="h-5 w-5 text-muted-foreground" />
                            Top Customers
                        </h3>
                    </div>
                    <div className="space-y-4">
                        {data.byCustomer.map((cust, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <span className="text-sm font-medium">{cust.name}</span>
                                <div className="flex items-center gap-3">
                                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${cust.percentage}%` }}></div>
                                    </div>
                                    <span className="text-sm font-bold w-20 text-right">₹{cust.amount.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Package className="h-5 w-5 text-muted-foreground" />
                            Revenue by Product
                        </h3>
                    </div>
                    <div className="space-y-4">
                        {data.byProduct.map((prod, i) => (
                            <div key={i} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium">{prod.name}</span>
                                    <span className="text-sm font-bold">₹{prod.amount.toLocaleString()}</span>
                                </div>
                                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(prod.amount / data.totalRevenue) * 100}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
