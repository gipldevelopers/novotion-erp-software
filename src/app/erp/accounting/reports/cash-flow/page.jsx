'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Download, ArrowLeft, TrendingUp, TrendingDown, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { reportService } from '@/services/reportService';
import { exportToCSV } from '@/utils/exportUtils';
import { toast } from 'sonner';

export default function CashFlowPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const result = await reportService.getCashFlow();
                setData(result);
            } catch (error) {
                toast.error('Failed to generate Cash Flow Statement');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return <div className="p-8 text-center">Generating Cash Flow Statement...</div>;

    const formatCurrency = (val) => {
        const sign = val < 0 ? '-' : '';
        const absVal = Math.abs(val);
        return `${sign}₹${absVal.toLocaleString()}`;
    };

    const StatementSection = ({ title, data, color }) => (
        <Card className="p-6">
            <h3 className={`text-lg font-bold mb-4 flex items-center justify-between ${color}`}>
                {title}
                <span>{formatCurrency(data.net)}</span>
            </h3>
            <div className="space-y-4">
                {data.inflow.length > 0 && (
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Cash Inflow</p>
                        <ul className="space-y-2">
                            {data.inflow.map(item => (
                                <li key={item.id} className="flex justify-between text-sm">
                                    <span>{item.account}</span>
                                    <span className="font-mono text-green-600">{formatCurrency(item.amount)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {data.outflow.length > 0 && (
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2 pt-2 border-t">Cash Outflow</p>
                        <ul className="space-y-2">
                            {data.outflow.map(item => (
                                <li key={item.id} className="flex justify-between text-sm">
                                    <span>{item.account}</span>
                                    <span className="font-mono text-red-600">{formatCurrency(Math.abs(item.amount))}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </Card>
    );

    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Cash Flow Statement</h1>
                        <p className="text-muted-foreground">Direct Method • Period Ending {new Date().toLocaleDateString()}</p>
                    </div>
                </div>
                <Button variant="outline" onClick={() => {
                    if (data) exportToCSV([
                        { Label: 'Opening Balance', Amount: data.openingBalance },
                        { Label: 'Operating Net', Amount: data.operating.net },
                        { Label: 'Investing Net', Amount: data.investing.net },
                        { Label: 'Financing Net', Amount: data.financing.net },
                        { Label: 'Closing Balance', Amount: data.closingBalance }
                    ], 'CashFlowStatement');
                    toast.success('Cash Flow Statement exported');
                }}>
                    <Download className="h-4 w-4 mr-2" /> Export CSV
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="p-4 bg-muted/50">
                    <p className="text-sm font-medium text-muted-foreground">Opening Balance</p>
                    <p className="text-xl font-bold">{formatCurrency(data.openingBalance)}</p>
                </Card>
                <Card className="p-4 bg-primary/5 border-primary/20">
                    <p className="text-sm font-medium text-primary">Net Change</p>
                    <p className="text-xl font-bold">
                        {formatCurrency(data.operating.net + data.investing.net + data.financing.net)}
                    </p>
                </Card>
                <Card className="p-4 bg-green-50 text-green-700 border-green-200">
                    <p className="text-sm font-medium">Closing Balance</p>
                    <p className="text-xl font-bold">{formatCurrency(data.closingBalance)}</p>
                </Card>
            </div>

            <div className="space-y-6">
                <StatementSection title="Operating Activities" data={data.operating} color="text-blue-600" />
                <StatementSection title="Investing Activities" data={data.investing} color="text-purple-600" />
                <StatementSection title="Financing Activities" data={data.financing} color="text-orange-600" />
            </div>
        </div>
    );
}
