'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, FileStack, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PendingActions({ invoices = [], expenses = [] }) {
    const pendingInvoices = invoices.filter(i => i.status === 'pending' || i.status === 'overdue').slice(0, 3);
    const pendingExpenses = expenses.filter(e => e.status === 'pending').slice(0, 3);

    return (
        <Card className="h-full flex flex-col">
            <div className="p-4 border-b">
                <h3 className="font-semibold text-sm">Attention Required</h3>
            </div>
            <div className="flex-1 p-0 overflow-hidden">
                {pendingExpenses.length > 0 && (
                    <div className="p-3 border-b bg-orange-50/50">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="h-4 w-4 text-orange-600" />
                            <span className="text-xs font-semibold text-orange-900">Pending Expense Approvals</span>
                        </div>
                        <div className="space-y-2">
                            {pendingExpenses.map(item => (
                                <div key={item.id} className="flex justify-between items-center bg-white p-2 rounded border border-orange-100 shadow-sm">
                                    <div className="text-xs truncate max-w-[120px]">
                                        <span className="font-medium block">{item.category}</span>
                                        <span className="text-muted-foreground">{item.merchant}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-bold text-xs">₹{item.totalAmount}</span>
                                        <Button size="sm" variant="ghost" className="h-5 text-[10px] px-2 ml-1 text-orange-600 hover:text-orange-700 hover:bg-orange-50">Review</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {pendingInvoices.length > 0 && (
                    <div className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                            <FileStack className="h-4 w-4 text-blue-600" />
                            <span className="text-xs font-semibold text-blue-900">Unpaid Invoices</span>
                        </div>
                        <div className="space-y-2">
                            {pendingInvoices.map(item => (
                                <div key={item.id} className="flex justify-between items-center p-2 rounded hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                                    <div className="text-xs">
                                        <span className="font-medium block">{item.customer}</span>
                                        <span className="text-[10px] text-muted-foreground">{item.id}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-bold text-xs">₹{item.amount?.toLocaleString()}</span>
                                        <span className="block text-[10px] text-red-500 font-medium capitalize">{item.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {pendingInvoices.length === 0 && pendingExpenses.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-6">
                        <CheckCircle2 className="h-8 w-8 mb-2 text-green-500" />
                        <p className="text-xs">All caught up!</p>
                    </div>
                )}
            </div>
        </Card>
    );
}
