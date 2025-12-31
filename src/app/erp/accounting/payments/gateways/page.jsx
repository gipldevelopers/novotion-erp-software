'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    CreditCard,
    Settings,
    ShieldCheck,
    ExternalLink,
    ToggleLeft,
    ToggleRight,
    AlertCircle,
    CheckCircle2,
    Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { accountingService } from '@/services/accountingService';
import { toast } from 'sonner';

export default function PaymentGatewaysPage() {
    const router = useRouter();
    const [gateways, setGateways] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadGateways();
    }, []);

    const loadGateways = async () => {
        try {
            setLoading(true);
            const data = await accountingService.getPaymentGateways();
            setGateways(data);
        } catch (error) {
            console.error('Error loading gateways:', error);
            toast.error('Failed to load payment gateways');
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
            await accountingService.updatePaymentGateway(id, { status: newStatus });

            setGateways(prev => prev.map(gw =>
                gw.id === id ? { ...gw, status: newStatus } : gw
            ));

            toast.success(`${gateways.find(g => g.id === id).name} ${newStatus === 'active' ? 'enabled' : 'disabled'}`);
        } catch (error) {
            toast.error('Failed to update status');
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
                    <h1 className="text-3xl font-bold tracking-tight">Payment Gateways</h1>
                    <p className="text-muted-foreground mt-1">
                        Connect and manage payment providers for your business
                    </p>
                </div>
                <Badge variant="outline" className="px-3 py-1 flex gap-2 items-center text-sm">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    PCI-DSS Level 1 Compliant
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gateways.map((gateway) => (
                    <Card key={gateway.id} className="relative overflow-hidden flex flex-col border-2 transition-all hover:border-primary/50 group">
                        {/* Status Strip */}
                        <div className={`h-1.5 w-full ${gateway.status === 'active' ? 'bg-green-500' : 'bg-muted'}`} />

                        <div className="p-6 space-y-4 flex-1">
                            <div className="flex justify-between items-start">
                                <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center overflow-hidden border">
                                    {/* Mock Logo Placeholder */}
                                    <span className="text-xl font-bold text-primary italic">
                                        {gateway.name.substring(0, 2).toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={gateway.status === 'active'}
                                        onCheckedChange={() => handleToggle(gateway.id, gateway.status)}
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold">{gateway.name}</h3>
                                <div className="flex gap-2 mt-1">
                                    {gateway.modes?.map(mode => (
                                        <Badge key={mode} variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                                            {mode}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {gateway.name === 'Razorpay' && 'India\'s largest payment ecosystem with UPI, Cards, and Netbanking support.'}
                                {gateway.name === 'Stripe' && 'Global payments infrastructure for online businesses of all sizes.'}
                                {gateway.name === 'PayU' && 'Leader in online payment orchestration with industry leading success rates.'}
                                {gateway.name === 'Cashfree' && 'Collect payments and manage payouts at scale effortlessly.'}
                            </p>

                            <div className="space-y-2 pt-4 border-t border-dashed">
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Transaction Fee</span>
                                    <span className="font-medium">{gateway.config?.transactionFee || '2% + GST'}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Settlement Cycle</span>
                                    <span className="font-medium">{gateway.config?.settlement || 'T+2 Days'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-muted/30 border-t flex gap-2">
                            <Button variant="outline" className="w-full text-xs h-9 bg-background" onClick={() => router.push(`/erp/accounting/payments/gateways/${gateway.id}`)}>
                                <Settings className="h-3.5 w-3.5 mr-2" />
                                Configure
                            </Button>
                            <Button variant="ghost" size="icon" className="h-9 w-9 border" asChild>
                                <a href="#" target="_blank">
                                    <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                            </Button>
                        </div>
                    </Card>
                ))}

                {/* Add New Integration Mock */}
                <Card className="border-2 border-dashed flex flex-col items-center justify-center p-8 bg-muted/5 group hover:bg-muted/10 transition-all cursor-pointer">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <CreditCard className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                        <h4 className="font-bold">Add Custom Integration</h4>
                        <p className="text-sm text-muted-foreground mt-1 max-w-[200px]">
                            Connect your own custom payment gateway or merchant account via API
                        </p>
                    </div>
                    <Button variant="outline" className="mt-6">
                        Request Integration
                    </Button>
                </Card>
            </div>

            {/* Security Notice */}
            <Card className="p-4 bg-blue-50/50 border-blue-100 flex gap-4 items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="space-y-1">
                    <h5 className="font-bold text-blue-900 text-sm">Security & Encryption</h5>
                    <p className="text-xs text-blue-800 leading-relaxed">
                        Your payment gateway credentials (API Keys, Secrets) are encrypted using AES-256-GCM before storage.
                        We never store sensitive cardholder data on our servers. All transactions follow strict 3D-Secure 2.0 protocols.
                    </p>
                </div>
            </Card>

            {/* Recent Transactions Snippet */}
            <Card>
                <div className="p-4 border-b flex justify-between items-center bg-muted/10">
                    <div className="flex items-center gap-2">
                        <Coins className="h-4 w-4 text-primary" />
                        <h3 className="font-bold">Gateway Health & Performance</h3>
                    </div>
                    <Badge variant="outline" className="font-normal text-xs">
                        Last 24 Hours
                    </Badge>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Success Rate</p>
                        <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold">98.4%</span>
                            <span className="text-[10px] text-green-600 font-bold mb-1 flex items-center">
                                <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
                                +0.2%
                            </span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-[98.4%]" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Avg. Latency</p>
                        <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold">142ms</span>
                            <span className="text-[10px] text-green-600 font-bold mb-1 flex items-center">
                                -12ms
                            </span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[85%]" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total Volume</p>
                        <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold">₹12.4L</span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 w-[60%]" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Active Disputes</p>
                        <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold">2</span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500 w-[10%]" />
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

// Reuse from lucide
function Coins({ className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <circle cx="8" cy="8" r="6" />
            <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
            <path d="M7 6h1v4" />
            <path d="m16.71 13.88.07.41a.5.5 0 0 0 .39.39l.41.07a.5.5 0 0 0 .39-.39l.07-.41a.5.5 0 0 0-.39-.39l-.41-.07a.5.5 0 0 0-.39.39Z" />
            <path d="m15.58 15.58.07.41a.5.5 0 0 0 .39.39l.41.07a.5.5 0 0 0 .39-.39l.07-.41a.5.5 0 0 0-.39-.39l-.41-.07a.5.5 0 0 0-.39.39Z" />
        </svg>
    );
}

function TrendingUp({ className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
        </svg>
    );
}
