'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Download, ArrowLeft, PieChart, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { reportService } from '@/services/reportService';
import { toast } from 'sonner';

export default function ExpenseReportPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const result = await reportService.getExpenseAnalysis();
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
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Expense Analysis</h1>
                        <p className="text-muted-foreground">Spending breakdown and vendor insights</p>
                    </div>
                </div>
                <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 h-full">
                    <h3 className="font-semibold mb-6 flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-muted-foreground" />
                        Category Breakdown
                    </h3>
                    <div className="space-y-4">
                        {data.breakdown.map((item, i) => (
                            <div key={i} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">{item.category}</span>
                                    <span className="text-muted-foreground">{item.percentage}%</span>
                                </div>
                                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-red-500 rounded-full"
                                        style={{ width: `${item.percentage}%`, opacity: 1 - (i * 0.1) }}
                                    ></div>
                                </div>
                                <div className="text-right text-xs font-bold text-red-600">
                                    ₹{item.amount.toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card className="p-6 bg-red-50 text-red-900 border-red-100">
                        <p className="text-sm font-medium">Total Expenses</p>
                        <h3 className="text-3xl font-bold mt-1">₹{data.totalExpense.toLocaleString()}</h3>
                    </Card>

                    <Card className="p-6">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                            Top Vendors
                        </h3>
                        <div className="space-y-3">
                            {data.topVendors.map((vendor, i) => (
                                <div key={i} className="flex justify-between items-center p-3 border rounded-lg bg-muted/20">
                                    <span className="font-medium text-sm">{vendor.name}</span>
                                    <span className="font-bold text-sm">₹{vendor.amount.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
