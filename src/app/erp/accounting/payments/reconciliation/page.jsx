'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    RefreshCw,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    ArrowRightLeft,
    Download,
    Filter,
    ArrowRight,
    PlayCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

export default function ReconciliationPage() {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [reconciling, setReconciling] = useState(false);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        // Initialize mock data
        setTransactions([
            { id: 'TXN-001', date: '2025-12-30', description: 'Payment from Acme Corp', amount: 25000, source: 'Razorpay', status: 'matched', invoice: 'INV-2025-001' },
            { id: 'TXN-002', date: '2025-12-29', description: 'STRIPE TRANSFER REF 492', amount: 12400, source: 'Bank', status: 'unmatched', invoice: null },
            { id: 'TXN-003', date: '2025-12-29', description: 'Credit from Global IT', amount: 8000, source: 'Stripe', status: 'matched', invoice: 'INV-2025-004' },
            { id: 'TXN-004', date: '2025-12-28', description: 'CASH DEPOSIT BRANCH 4', amount: 5000, source: 'Cash', status: 'suggested', invoice: 'INV-2025-009' },
            { id: 'TXN-005', date: '2025-12-28', description: 'Payment for Services', amount: 15500, source: 'Razorpay', status: 'matched', invoice: 'INV-2025-012' },
        ]);
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleRunReconciliation = () => {
        setReconciling(true);
        setProgress(0);

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setReconciling(false);
                    // Automatically "suggest" the unmatched one for demonstration
                    setTransactions(prevTxns => prevTxns.map(t =>
                        t.id === 'TXN-002' ? { ...t, status: 'suggested', invoice: 'INV-2025-015' } : t
                    ));
                    toast.success('Reconciliation complete! New suggestions found.');
                    return 100;
                }
                return prev + 5;
            });
        }, 100);
    };

    const handleApproveMatch = (txnId) => {
        setTransactions(prev => prev.map(txn =>
            txn.id === txnId ? { ...txn, status: 'matched' } : txn
        ));
        toast.success(`Transaction ${txnId} reconciled successfully`);
    };

    const handleManualMatch = (txnId) => {
        // In a real app, this would open a dialog to select an invoice
        const invoiceNum = prompt("Enter Invoice Number to match:");
        if (invoiceNum) {
            setTransactions(prev => prev.map(txn =>
                txn.id === txnId ? { ...txn, status: 'matched', invoice: invoiceNum } : txn
            ));
            toast.success(`Transaction ${txnId} matched to ${invoiceNum}`);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Payment Reconciliation</h1>
                    <p className="text-muted-foreground mt-1">
                        Match bank statements and gateway transfers with your invoices
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                    </Button>
                    <Button onClick={handleRunReconciliation} disabled={reconciling}>
                        {reconciling ? (
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <PlayCircle className="h-4 w-4 mr-2" />
                        )}
                        Run Auto-Reconcile
                    </Button>
                </div>
            </div>

            {reconciling && (
                <Card className="p-6 space-y-4 bg-muted/30 border-primary/20">
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <p className="text-sm font-bold">Automated Matching in Progress...</p>
                            <p className="text-xs text-muted-foreground">Analyzing transactions from gateways and bank accounts</p>
                        </div>
                        <span className="text-sm font-mono font-bold text-primary">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-4 border-l-4 border-l-blue-500">
                    <p className="text-xs text-muted-foreground uppercase font-bold">Total Entries</p>
                    <h3 className="text-2xl font-bold mt-1">{transactions.length}</h3>
                </Card>
                <Card className="p-4 border-l-4 border-l-green-500">
                    <p className="text-xs text-muted-foreground uppercase font-bold">Matched</p>
                    <h3 className="text-2xl font-bold mt-1">{transactions.filter(t => t.status === 'matched').length}</h3>
                </Card>
                <Card className="p-4 border-l-4 border-l-yellow-500">
                    <p className="text-xs text-muted-foreground uppercase font-bold">Suggestions</p>
                    <h3 className="text-2xl font-bold mt-1">{transactions.filter(t => t.status === 'suggested').length}</h3>
                </Card>
                <Card className="p-4 border-l-4 border-l-red-500">
                    <p className="text-xs text-muted-foreground uppercase font-bold">Unmatched</p>
                    <h3 className="text-2xl font-bold mt-1">{transactions.filter(t => t.status === 'unmatched').length}</h3>
                </Card>
            </div>

            <Tabs defaultValue="all" className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <TabsList>
                        <TabsTrigger value="all">All ({transactions.length})</TabsTrigger>
                        <TabsTrigger value="unmatched" className="relative text-red-600">
                            Unmatched
                            {transactions.filter(t => t.status === 'unmatched').length > 0 && (
                                <Badge className="ml-2 h-4 w-4 p-0 flex items-center justify-center bg-red-500">
                                    {transactions.filter(t => t.status === 'unmatched').length}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="suggested" className="text-yellow-600">
                            Suggested
                            {transactions.filter(t => t.status === 'suggested').length > 0 && (
                                <Badge className="ml-2 h-4 w-4 p-0 flex items-center justify-center bg-yellow-500">
                                    {transactions.filter(t => t.status === 'suggested').length}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="matched" className="text-green-600">Matched</TabsTrigger>
                    </TabsList>

                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search references..." className="pl-9 h-9" />
                        </div>
                        <Button variant="outline" size="icon" className="h-9 w-9">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <TabsContent value="all" className="space-y-4">
                    <Card>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/50 border-b">
                                    <tr>
                                        <th className="p-4 font-bold">Date & ID</th>
                                        <th className="p-4 font-bold">Description</th>
                                        <th className="p-4 font-bold">Source</th>
                                        <th className="p-4 font-bold">Amount</th>
                                        <th className="p-4 font-bold">Matched To</th>
                                        <th className="p-4 font-bold">Status</th>
                                        <th className="p-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {transactions.map((txn) => (
                                        <tr key={txn.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="p-4">
                                                <div className="font-medium">{txn.date}</div>
                                                <div className="text-[10px] text-muted-foreground font-mono">{txn.id}</div>
                                            </td>
                                            <td className="p-4 text-xs font-medium max-w-[200px] truncate">{txn.description}</td>
                                            <td className="p-4">
                                                <Badge variant="outline" className="text-[10px] uppercase font-bold">{txn.source}</Badge>
                                            </td>
                                            <td className="p-4 font-bold">₹{txn.amount.toLocaleString('en-IN')}</td>
                                            <td className="p-4">
                                                {txn.invoice ? (
                                                    <div className="flex items-center gap-1.5 text-blue-600 font-bold hover:underline cursor-pointer">
                                                        <ArrowRightLeft className="h-3 w-3" />
                                                        {txn.invoice}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground italic text-xs">No link found</span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                {txn.status === 'matched' && (
                                                    <div className="flex items-center gap-1.5 text-green-600 font-bold">
                                                        <CheckCircle2 className="h-4 w-4" />
                                                        <span>Matched</span>
                                                    </div>
                                                )}
                                                {txn.status === 'suggested' && (
                                                    <div className="flex items-center gap-1.5 text-yellow-600 font-bold">
                                                        <AlertTriangle className="h-4 w-4" />
                                                        <span>Suggested</span>
                                                    </div>
                                                )}
                                                {txn.status === 'unmatched' && (
                                                    <div className="flex items-center gap-1.5 text-red-500 font-bold">
                                                        <XCircle className="h-4 w-4" />
                                                        <span>Unmatched</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4 text-right">
                                                {txn.status === 'suggested' ? (
                                                    <Button variant="default" size="sm" className="h-8 bg-green-600 hover:bg-green-700" onClick={() => handleApproveMatch(txn.id)}>
                                                        Approve
                                                        <CheckCircle2 className="h-3 w-3 ml-2" />
                                                    </Button>
                                                ) : txn.status === 'unmatched' ? (
                                                    <Button variant="outline" size="sm" className="h-8 border-primary text-primary hover:bg-primary/5" onClick={() => handleManualMatch(txn.id)}>
                                                        Match
                                                        <ArrowRight className="h-3 w-3 ml-2" />
                                                    </Button>
                                                ) : (
                                                    <Button variant="ghost" size="sm" className="h-8" disabled>
                                                        Reconciled
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>

            <Card className="p-6 bg-muted/10 border-dashed space-y-4">
                <div className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 text-primary" />
                    <h3 className="font-bold">Automated Bank Sync</h3>
                </div>
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <p className="text-sm text-muted-foreground flex-1">
                        Connect your bank account to automatically import statements twice a day.
                        We support 200+ major banks in India via secure OAuth.
                    </p>
                    <Button variant="default" className="bg-slate-900">Connect Bank Account</Button>
                </div>
            </Card>
        </div>
    );
}
