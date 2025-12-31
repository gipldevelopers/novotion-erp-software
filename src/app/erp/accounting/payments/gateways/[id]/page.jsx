'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    ArrowLeft,
    Save,
    Shield,
    Eye,
    EyeOff,
    ExternalLink,
    AlertCircle,
    Copy,
    Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { accountingService } from '@/services/accountingService';
import { toast } from 'sonner';

export default function GatewayConfigurationPage() {
    const router = useRouter();
    const { id } = useParams();
    const [gateway, setGateway] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showKey, setShowKey] = useState(false);
    const [showSecret, setShowSecret] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        loadGateway();
    }, [id]);

    const loadGateway = async () => {
        try {
            setLoading(true);
            const data = await accountingService.getPaymentGatewayById(id);
            if (data) {
                setGateway(data);
            } else {
                toast.error('Gateway not found');
                router.push('/erp/accounting/payments/gateways');
            }
        } catch (error) {
            console.error('Error loading gateway:', error);
            toast.error('Failed to load gateway configuration');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            await accountingService.updatePaymentGateway(id, gateway);
            toast.success('Configuration saved successfully');
            router.push('/erp/accounting/payments/gateways');
        } catch (error) {
            toast.error('Failed to save configuration');
        } finally {
            setSaving(false);
        }
    };

    const handleCopyWebhook = () => {
        navigator.clipboard.writeText(`https://api.novotion.com/webhooks/payments/${id}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success('Webhook URL copied');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const { name, status, config } = gateway || {};

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold tracking-tight">{name} Configuration</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant={status === 'active' ? 'default' : 'secondary'} className="uppercase text-[10px]">
                            {status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">• PCI-DSS Compliant</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button onClick={handleSave} disabled={saving}>
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        {/* API Credentials */}
                        <Card className="p-6 space-y-4">
                            <div className="flex items-center gap-2 border-b pb-4 mb-4">
                                <Shield className="h-5 w-5 text-primary" />
                                <h3 className="font-bold">API Credentials</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>API Key / Client ID</Label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Input
                                                type={showKey ? "text" : "password"}
                                                value={config?.apiKey || ''}
                                                onChange={(e) => setGateway({ ...gateway, config: { ...config, apiKey: e.target.value } })}
                                                placeholder={`Enter your ${name} API Key`}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-1 top-1 h-8 w-8"
                                                onClick={() => setShowKey(!showKey)}
                                            >
                                                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>API Secret / Secret Key</Label>
                                    <div className="relative">
                                        <Input
                                            type={showSecret ? "text" : "password"}
                                            value={config?.apiSecret || ''}
                                            onChange={(e) => setGateway({ ...gateway, config: { ...config, apiSecret: e.target.value } })}
                                            placeholder={`Enter your ${name} API Secret`}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-1 top-1 h-8 w-8"
                                            onClick={() => setShowSecret(!showSecret)}
                                        >
                                            {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Merchant Details */}
                        <Card className="p-6 space-y-4">
                            <h3 className="font-bold border-b pb-4 mb-4">Merchant Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Merchant ID</Label>
                                    <Input
                                        value={config?.merchantId || ''}
                                        onChange={(e) => setGateway({ ...gateway, config: { ...config, merchantId: e.target.value } })}
                                        placeholder="MID-123456"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Environment</Label>
                                    <select
                                        className="w-full h-10 px-3 rounded-md border bg-background text-sm"
                                        value={config?.environment || 'sandbox'}
                                        onChange={(e) => setGateway({ ...gateway, config: { ...config, environment: e.target.value } })}
                                    >
                                        <option value="sandbox">Sandbox / Test</option>
                                        <option value="production">Production / Live</option>
                                    </select>
                                </div>
                            </div>
                        </Card>

                        {/* Webhook Configuration */}
                        <Card className="p-6 space-y-4">
                            <div className="flex justify-between items-center border-b pb-4 mb-4">
                                <h3 className="font-bold">Webhook Configuration</h3>
                                <Badge variant="secondary">Highly Recommended</Badge>
                            </div>
                            <div className="space-y-4">
                                <p className="text-xs text-muted-foreground italic">
                                    Use the URL below to receive real-time payment updates from {name}.
                                </p>
                                <div className="flex gap-2">
                                    <Input readOnly value={`https://api.novotion.com/webhooks/payments/${id}`} className="bg-muted font-mono text-xs" />
                                    <Button type="button" variant="outline" size="icon" onClick={handleCopyWebhook}>
                                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>
                                <div className="space-y-2 pt-2">
                                    <Label>Webhook Secret (optional)</Label>
                                    <Input
                                        type="password"
                                        placeholder="Verification secret from gateway portal"
                                        value={config?.webhookSecret || ''}
                                        onChange={(e) => setGateway({ ...gateway, config: { ...config, webhookSecret: e.target.value } })}
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        {/* Status & Options */}
                        <Card className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Gateway Status</Label>
                                        <p className="text-[10px] text-muted-foreground">Toggle this integration</p>
                                    </div>
                                    <Switch
                                        checked={gateway.status === 'active'}
                                        onCheckedChange={(checked) => setGateway({ ...gateway, status: checked ? 'active' : 'inactive' })}
                                    />
                                </div>
                                <div className="flex items-center justify-between border-t pt-4">
                                    <div className="space-y-0.5">
                                        <Label>Auto-Reconcile</Label>
                                        <p className="text-[10px] text-muted-foreground">Match payments automatically</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </div>
                        </Card>

                        {/* Help Box */}
                        <Card className="p-6 bg-muted/20 space-y-3">
                            <div className="flex items-center gap-2 text-primary">
                                <AlertCircle className="h-4 w-4" />
                                <h4 className="font-bold text-sm">Need help?</h4>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Not sure where to find your credentials? Visit the {name} dashboard and navigate to API settings.
                            </p>
                            <Button variant="link" className="p-0 h-auto text-xs" asChild>
                                <a href="#" target="_blank" className="flex items-center">
                                    View Documentation <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                            </Button>
                        </Card>

                        {/* Supported Features */}
                        <Card className="p-6 space-y-4">
                            <h4 className="font-bold text-sm border-b pb-2">Supported Methods</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {['Credit Card', 'Debit Card', 'Netbanking', 'UPI', 'Wallets', 'EMI'].map(method => (
                                    <div key={method} className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                        <span className="text-xs">{method}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
}
