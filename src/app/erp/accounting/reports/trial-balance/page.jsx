'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Download, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { reportService } from '@/services/reportService';
import { toast } from 'sonner';

export default function TrialBalancePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const result = await reportService.getTrialBalance();
                setData(result);
            } catch (error) {
                toast.error('Failed to generate Trial Balance');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return <div className="p-8 text-center">Generating Trial Balance...</div>;

    const totalDebit = data.reduce((sum, item) => sum + item.debit, 0);
    const totalCredit = data.reduce((sum, item) => sum + item.credit, 0);

    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Trial Balance</h1>
                        <p className="text-muted-foreground">List of all ledger balances</p>
                    </div>
                </div>
                <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export CSV</Button>
            </div>

            <Card className="p-6">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50 border-b font-medium">
                        <tr>
                            <th className="p-4 text-left">Account Name</th>
                            <th className="p-4 text-right">Debit Balance</th>
                            <th className="p-4 text-right">Credit Balance</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {data.map((row, i) => (
                            <tr key={i} className="hover:bg-muted/30">
                                <td className="p-4 font-medium">{row.account}</td>
                                <td className="p-4 text-right font-mono text-muted-foreground">
                                    {row.debit > 0 ? `₹${row.debit.toLocaleString()}` : '-'}
                                </td>
                                <td className="p-4 text-right font-mono text-muted-foreground">
                                    {row.credit > 0 ? `₹${row.credit.toLocaleString()}` : '-'}
                                </td>
                            </tr>
                        ))}
                        <tr className="bg-slate-900 text-white font-bold">
                            <td className="p-4">Totals</td>
                            <td className="p-4 text-right">₹{totalDebit.toLocaleString()}</td>
                            <td className="p-4 text-right">₹{totalCredit.toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>
            </Card>
        </div>
    );
}
