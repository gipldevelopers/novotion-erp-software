'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Download, ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { reportService } from '@/services/reportService';
import { toast } from 'sonner';

export default function ProfitLossPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const result = await reportService.getProfitLoss();
                setData(result);
            } catch (error) {
                toast.error('Failed to generate Profit & Loss statement');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return <div className="p-8 text-center">Generating Statement...</div>;

    const formatCurrency = (val) => `₹${val.toLocaleString()}`;

    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Profit & Loss Statement</h1>
                        <p className="text-muted-foreground">For the period ending {new Date().toLocaleDateString()}</p>
                    </div>
                </div>
                <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export PDF</Button>
            </div>

            <Card className="p-8 space-y-8">
                {/* Income */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                        <h3 className="text-lg font-bold text-green-700">Income</h3>
                        <span className="text-lg font-bold text-green-700">{formatCurrency(data.income.total)}</span>
                    </div>
                    <div className="space-y-2">
                        {data.income.breakdown.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm hover:bg-muted/50 p-2 rounded">
                                <span>{item.account}</span>
                                <span>{formatCurrency(item.balance)}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Expenses */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                        <h3 className="text-lg font-bold text-red-700">Expenses</h3>
                        <span className="text-lg font-bold text-red-700">({formatCurrency(data.expense.total)})</span>
                    </div>
                    <div className="space-y-2">
                        {data.expense.breakdown.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm hover:bg-muted/50 p-2 rounded">
                                <span>{item.account}</span>
                                <span>{formatCurrency(item.balance)}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Net Profit */}
                <section className="pt-4 border-t-2 border-black/10">
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <h3 className="text-xl font-bold">Net Profit / (Loss)</h3>
                        <span className={`text-xl font-bold ${data.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {data.netProfit >= 0 ? formatCurrency(data.netProfit) : `(${formatCurrency(Math.abs(data.netProfit))})`}
                        </span>
                    </div>
                </section>
            </Card>
        </div>
    );
}
