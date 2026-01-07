'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownLeft, FileText, Receipt, Landmark } from 'lucide-react';

export function RecentTransactions({ invoices = [], expenses = [], payments = [] }) {
    // Combine and sort by date descending
    const allTransactions = [
        ...invoices.map(i => ({ ...i, type: 'invoice', date: i.createdAt || i.date, amount: i.amount })),
        ...expenses.map(e => ({ ...e, type: 'expense', date: e.createdAt || e.date, amount: e.totalAmount })),
        ...payments.map(p => ({ ...p, type: 'payment', date: p.date, amount: p.amount }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5); // Take top 5

    const getIcon = (type) => {
        switch (type) {
            case 'invoice': return <FileText className="h-4 w-4 text-blue-600" />;
            case 'expense': return <Receipt className="h-4 w-4 text-red-600" />;
            case 'payment': return <Landmark className="h-4 w-4 text-green-600" />;
            default: return <FileText className="h-4 w-4" />;
        }
    };

    const getColors = (type) => {
        switch (type) {
            case 'invoice': return 'bg-blue-50 border-blue-100';
            case 'expense': return 'bg-red-50 border-red-100';
            case 'payment': return 'bg-green-50 border-green-100';
            default: return 'bg-gray-50';
        }
    };

    return (
        <Card className="p-6 h-full">
            <div className="mb-6">
                <h3 className="font-semibold">Recent Activity</h3>
                <p className="text-sm text-muted-foreground">Latest financial events</p>
            </div>

            <div className="space-y-4">
                {allTransactions.map((tx, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-full border ${getColors(tx.type)}`}>
                                {getIcon(tx.type)}
                            </div>
                            <div>
                                <div className="font-medium text-sm flex items-center gap-2">
                                    {tx.type === 'invoice' && (tx.customer || 'Unknown Customer')}
                                    {tx.type === 'expense' && (tx.vendor || tx.category || 'Expense')}
                                    {tx.type === 'payment' && 'Payment Received'}

                                    <Badge variant="secondary" className="text-[10px] h-5 capitalize bg-muted/60 text-muted-foreground border-none">
                                        {tx.type}
                                    </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {new Date(tx.date).toLocaleDateString()}
                                    {tx.number && ` • ${tx.number}`}
                                </div>
                            </div>
                        </div>
                        <div className={`font-bold text-sm ${tx.type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                            {tx.type === 'expense' ? '-' : '+'}₹{tx.amount.toLocaleString()}
                        </div>
                    </div>
                ))}
            </div>
            {allTransactions.length === 0 && (
                <div className="text-center py-6 text-muted-foreground text-sm">
                    No recent transactions
                </div>
            )}
        </Card>
    );
}
