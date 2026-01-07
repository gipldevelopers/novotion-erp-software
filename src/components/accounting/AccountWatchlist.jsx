'use client';

import { Card } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownLeft, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AccountWatchlist({ accounts = [] }) {
    // Mock data if real data isn't fully linked yet
    const watchlist = accounts.length > 0 ? accounts : [
        { name: 'HDFC Bank - Main', type: 'Asset', balance: 1250000, change: +12.5 },
        { name: 'Petty Cash', type: 'Asset', balance: 45000, change: -5.2 },
        { name: 'GST Payable', type: 'Liability', balance: 180000, change: +2.1 },
        { name: 'Sales Revenue', type: 'Income', balance: 8500000, change: +15.8 },
    ];

    return (
        <Card className="h-full">
            <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold text-sm">Account Watchlist</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </div>
            <div className="divide-y">
                {watchlist.map((account, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div>
                            <p className="font-medium text-sm">{account.name}</p>
                            <p className="text-xs text-muted-foreground">{account.type}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-medium text-sm">₹{account.balance.toLocaleString()}</p>
                            <p className={`text-[10px] flex items-center justify-end ${account.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {account.change >= 0 ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownLeft className="h-3 w-3 mr-0.5" />}
                                {Math.abs(account.change)}%
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-2">
                <Button variant="ghost" size="sm" className="w-full text-xs h-8 text-muted-foreground">Add Account</Button>
            </div>
        </Card>
    );
}
