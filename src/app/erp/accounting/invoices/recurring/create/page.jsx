'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Plus,
    Trash2,
    Save,
    Calendar,
    RefreshCw,
    User,
    Mail,
    CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { accountingService } from '@/services/accountingService';
import { toast } from 'sonner';

export default function CreateRecurringInvoicePage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [invoice, setInvoice] = useState({
        templateName: '',
        customer: '',
        email: '',
        frequency: 'monthly',
        amount: 0,
        status: 'active',
        nextGenerationDate: new Date().toISOString().split('T')[0],
        lastGeneratedDate: new Date().toISOString().split('T')[0],
        autoSend: true,
        items: [
            { id: Date.now().toString(), name: '', quantity: 1, rate: 0, amount: 0 }
        ]
    });

    const addLineItem = () => {
        setInvoice({
            ...invoice,
            items: [
                ...invoice.items,
                { id: Date.now().toString(), name: '', quantity: 1, rate: 0, amount: 0 }
            ]
        });
    };

    const removeLineItem = (itemId) => {
        if (invoice.items.length > 1) {
            setInvoice({
                ...invoice,
                items: invoice.items.filter((item) => item.id !== itemId)
            });
        }
    };

    const updateLineItem = (itemId, field, value) => {
        const newItems = invoice.items.map((item) => {
            if (item.id === itemId) {
                const updatedItem = { ...item, [field]: value };
                if (field === 'quantity' || field === 'rate') {
                    updatedItem.amount = updatedItem.quantity * (updatedItem.rate || 0);
                }
                return updatedItem;
            }
            return item;
        });
        setInvoice({ ...invoice, items: newItems });
    };

    const handleSave = async () => {
        if (!invoice.templateName || !invoice.customer || !invoice.email) {
            toast.error('Please fill in all required fields');
            return;
        }

        setSaving(true);
        try {
            const totalAmount = invoice.items.reduce((sum, item) => sum + (item.amount || 0), 0);
            const templateData = {
                ...invoice,
                amount: totalAmount,
                // Clean up IDs for mock storage
                items: invoice.items.map(({ id, ...rest }) => rest)
            };

            await accountingService.createRecurringInvoice(templateData);
            toast.success('Recurring template created successfully');
            router.push('/erp/accounting/invoices/recurring');
        } catch (error) {
            toast.error('Failed to create template');
        } finally {
            setSaving(false);
        }
    };

    const subtotal = invoice.items.reduce((sum, item) => sum + (item.amount || 0), 0);

    return (
        <div className="p-6 space-y-6 animate-fade-in bg-background">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Create Recurring Template</h1>
                        <p className="text-muted-foreground mt-1">Set up a new automated billing cycle</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90">
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? 'Creating...' : 'Create Template'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Configuration */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <RefreshCw className="h-5 w-5 text-primary" />
                                Template Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Template Name *</Label>
                                    <Input
                                        placeholder="e.g., Monthly SaaS Subscription"
                                        value={invoice.templateName}
                                        onChange={(e) => setInvoice({ ...invoice, templateName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Frequency</Label>
                                    <Select
                                        value={invoice.frequency}
                                        onValueChange={(val) => setInvoice({ ...invoice, frequency: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="monthly">Monthly</SelectItem>
                                            <SelectItem value="quarterly">Quarterly</SelectItem>
                                            <SelectItem value="yearly">Yearly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>First Generation Date</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="date"
                                            className="pl-10"
                                            value={invoice.nextGenerationDate}
                                            onChange={(e) => setInvoice({ ...invoice, nextGenerationDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-end pb-2">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="autoSend"
                                            checked={invoice.autoSend}
                                            onCheckedChange={(checked) => setInvoice({ ...invoice, autoSend: checked })}
                                        />
                                        <Label htmlFor="autoSend" className="cursor-pointer">Automatically send via email</Label>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Line Items */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Plus className="h-5 w-5 text-primary" />
                                Template Items
                            </CardTitle>
                            <Button variant="outline" size="sm" onClick={addLineItem}>
                                <Plus className="h-4 w-4 mr-2" /> Add Item
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="border rounded-lg">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/50 border-b">
                                        <tr>
                                            <th className="text-left p-3 font-bold">Description</th>
                                            <th className="w-24 text-center p-3 font-bold">Qty</th>
                                            <th className="w-32 text-right p-3 font-bold">Rate</th>
                                            <th className="w-32 text-right p-3 font-bold">Amount</th>
                                            <th className="w-12 p-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {invoice.items.map((item) => (
                                            <tr key={item.id}>
                                                <td className="p-2">
                                                    <Input
                                                        value={item.name}
                                                        onChange={(e) => updateLineItem(item.id, 'name', e.target.value)}
                                                        placeholder="Service or Product name"
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <Input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => updateLineItem(item.id, 'quantity', Number(e.target.value))}
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <Input
                                                        type="number"
                                                        value={item.rate}
                                                        onChange={(e) => updateLineItem(item.id, 'rate', Number(e.target.value))}
                                                        placeholder="0.00"
                                                    />
                                                </td>
                                                <td className="p-2 text-right font-medium">
                                                    ₹{item.amount?.toLocaleString('en-IN')}
                                                </td>
                                                <td className="p-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeLineItem(item.id)}
                                                        disabled={invoice.items.length === 1}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-end p-2 bg-muted/20 rounded-lg">
                                <div className="text-right space-y-1">
                                    <p className="text-sm text-muted-foreground">Total Template Value</p>
                                    <p className="text-2xl font-black text-primary">₹{subtotal.toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Customer Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                Customer Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Select Customer *</Label>
                                <Select
                                    onValueChange={(val) => setInvoice({ ...invoice, customer: val.replace('-', ' ').toUpperCase() })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose recipient" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="acme-corp">Acme Corp</SelectItem>
                                        <SelectItem value="techstart-inc">TechStart Inc</SelectItem>
                                        <SelectItem value="global-solutions">Global Solutions</SelectItem>
                                        <SelectItem value="skyline-media">Skyline Media</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Billing Email *</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        className="pl-10"
                                        placeholder="customer@example.com"
                                        value={invoice.email}
                                        onChange={(e) => setInvoice({ ...invoice, email: e.target.value })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Guidance */}
                    <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="pt-6 space-y-3">
                            <div className="flex items-center gap-2 text-primary">
                                <CheckCircle2 className="h-4 w-4" />
                                <span className="font-bold text-sm text-primary-dark">Pro Tip</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Once created, this template will automatically generate its first invoice on the **First Generation Date** and continue every **{invoice.frequency}** thereafter.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
