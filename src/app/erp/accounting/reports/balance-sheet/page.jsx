'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Download, ArrowLeft, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { reportService } from '@/services/reportService';
import { toast } from 'sonner';

export default function BalanceSheetPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const result = await reportService.getBalanceSheet();
                setData(result);
            } catch (error) {
                toast.error('Failed to generate Balance Sheet');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return <div className="p-8 text-center">Generating Balance Sheet...</div>;

    const formatCurrency = (val) => `₹${val.toLocaleString()}`;

    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Balance Sheet</h1>
                        <p className="text-muted-foreground">As on {new Date().toLocaleDateString()}</p>
                    </div>
                </div>
                <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export PDF</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Assets Side */}
                <Card className="p-6 h-full border-t-4 border-t-blue-500">
                    <h3 className="text-lg font-bold mb-4 border-b pb-2 flex items-center justify-between">
                        Assets
                        <span className="text-blue-600">{formatCurrency(data.assets.total)}</span>
                    </h3>
                    <div className="space-y-3">
                        {data.assets.items.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm p-2 hover:bg-muted/50 rounded">
                                <span>{item.account}</span>
                                <span className="font-mono">{formatCurrency(item.balance)}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Liabilities & Equity Side */}
                <div className="space-y-6">
                    <Card className="p-6 border-t-4 border-t-red-500">
                        <h3 className="text-lg font-bold mb-4 border-b pb-2 flex items-center justify-between">
                            Liabilities
                            <span className="text-red-600">{formatCurrency(data.liabilities.total)}</span>
                        </h3>
                        <div className="space-y-3">
                            {data.liabilities.items.map((item, i) => (
                                <div key={i} className="flex justify-between text-sm p-2 hover:bg-muted/50 rounded">
                                    <span>{item.account}</span>
                                    <span className="font-mono">{formatCurrency(item.balance)}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-6 border-t-4 border-t-green-500">
                        <h3 className="text-lg font-bold mb-4 border-b pb-2 flex items-center justify-between">
                            Equity
                            <span className="text-green-600">{formatCurrency(data.equity.total)}</span>
                        </h3>
                        <div className="space-y-3">
                            {data.equity.items.map((item, i) => (
                                <div key={i} className="flex justify-between text-sm p-2 hover:bg-muted/50 rounded">
                                    <span>{item.account}</span>
                                    <span className="font-mono">{formatCurrency(item.balance)}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-4 bg-slate-900 text-white">
                        <div className="flex justify-between font-bold">
                            <span>Total Liabilities & Equity</span>
                            <span>{formatCurrency(data.liabilities.total + data.equity.total)}</span>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
