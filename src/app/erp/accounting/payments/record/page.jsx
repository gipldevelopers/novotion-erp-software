'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    CreditCard,
    Banknote,
    Landmark,
    Wallet,
    QrCode,
    Receipt,
    Calendar,
    CheckCircle2,
    X,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { accountingService } from '@/services/accountingService';
import { toast } from 'sonner';

export default function RecordPaymentPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [invoices, setInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState('');
    const [amount, setAmount] = useState('');
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
    const [paymentMode, setPaymentMode] = useState('bank_transfer');
    const [reference, setReference] = useState('');
    const [notes, setNotes] = useState('');
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);

    useEffect(() => {
        loadInvoices();
    }, []);

    const loadInvoices = async () => {
        const data = await accountingService.getInvoices();
        setInvoices(data.filter(inv => inv.status !== 'paid'));
    };

    const handleInvoiceChange = (invoiceId) => {
        setSelectedInvoice(invoiceId);
        const inv = invoices.find(i => i.id === invoiceId);
        if (inv) {
            setAmount(inv.amount.toString());
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            setIsSuccessOpen(true);
        } catch (error) {
            toast.error('Failed to record payment');
        } finally {
            setLoading(false);
        }
    };

    const paymentModes = [
        { id: 'bank_transfer', label: 'Bank Transfer', icon: Landmark },
        { id: 'credit_card', label: 'Credit/Debit Card', icon: CreditCard },
        { id: 'upi', label: 'UPI', icon: QrCode },
        { id: 'cash', label: 'Cash', icon: Banknote },
        { id: 'cheque', label: 'Cheque', icon: Receipt },
    ];

    const currentInvoice = invoices.find(i => i.id === selectedInvoice);

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Record Payment</h1>
                    <p className="text-muted-foreground mt-1">
                        Manually record a payment received from a customer
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <Card className="p-6 space-y-4">
                            <h3 className="font-bold border-b pb-4">Payment Details</h3>

                            <div className="space-y-2">
                                <Label>Select Invoice *</Label>
                                <Select value={selectedInvoice} onValueChange={handleInvoiceChange} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Search or select pending invoice..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {invoices.map(inv => (
                                            <SelectItem key={inv.id} value={inv.id}>
                                                {inv.number} - {inv.customer} (₹{inv.amount})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Amount Received (₹) *</Label>
                                    <Input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                        min="0"
                                        step="0.01"
                                    />
                                    {currentInvoice && amount < currentInvoice.amount && (
                                        <p className="text-xs text-yellow-600 font-medium flex items-center gap-1">
                                            Note: This is a partial payment. Remaining: ₹{currentInvoice.amount - amount}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label>Payment Date *</Label>
                                    <Input
                                        type="date"
                                        value={paymentDate}
                                        onChange={(e) => setPaymentDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 space-y-4">
                            <h3 className="font-bold border-b pb-4">Payment Mode</h3>
                            <RadioGroup value={paymentMode} onValueChange={setPaymentMode} className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {paymentModes.map(mode => {
                                    const Icon = mode.icon;
                                    return (
                                        <div key={mode.id}>
                                            <RadioGroupItem value={mode.id} id={mode.id} className="peer sr-only" />
                                            <Label
                                                htmlFor={mode.id}
                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary cursor-pointer"
                                            >
                                                <Icon className="mb-3 h-6 w-6" />
                                                {mode.label}
                                            </Label>
                                        </div>
                                    );
                                })}
                            </RadioGroup>

                            <div className="pt-4 space-y-4">
                                <div className="space-y-2">
                                    <Label>Reference Number / Transaction ID</Label>
                                    <Input
                                        value={reference}
                                        onChange={(e) => setReference(e.target.value)}
                                        placeholder="e.g. UPI/12345/..."
                                    />
                                </div>

                                {paymentMode === 'cheque' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Cheque Number</Label>
                                            <Input placeholder="######" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Bank Name</Label>
                                            <Input placeholder="e.g. HDFC" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>

                        <div className="flex gap-3 pt-4">
                            <Button type="submit" className="w-full" size="lg" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Recording...
                                    </>
                                ) : (
                                    'Record Payment'
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card className="p-6 space-y-4 bg-muted/20">
                            <h3 className="font-bold text-sm">Summary</h3>
                            {currentInvoice ? (
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Original Amount</span>
                                        <span className="font-medium">₹{currentInvoice.amount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Previously Paid</span>
                                        <span className="font-medium">₹0.00</span>
                                    </div>
                                    <div className="flex justify-between border-t border-dashed pt-2">
                                        <span className="text-muted-foreground">Amount Due</span>
                                        <span className="font-bold text-red-600">₹{currentInvoice.amount}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-green-100 dark:bg-green-900/20 p-2 rounded">
                                        <span className="font-bold text-green-700 dark:text-green-400">Paying Now</span>
                                        <span className="font-bold text-green-700 dark:text-green-400 text-lg">
                                            ₹{amount || '0'}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                    Select an invoice to view summary
                                </div>
                            )}
                        </Card>

                        <Card className="p-6 space-y-2">
                            <Label>Internal Notes</Label>
                            <Textarea
                                placeholder="Add any private notes about this payment..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="min-h-[100px]"
                            />
                        </Card>
                    </div>
                </div>
            </form>

            <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                        </div>
                        <DialogTitle className="text-center pt-4">Payment Recorded Successfully</DialogTitle>
                        <DialogDescription className="text-center text-center">
                            Transaction reference #{reference || 'N/A'} has been logged.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="bg-muted/30 p-4 rounded-lg space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Amount</span>
                            <span className="font-bold">₹{amount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Date</span>
                            <span>{paymentDate}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Mode</span>
                            <span className="capitalize">{paymentMode.replace('_', ' ')}</span>
                        </div>
                    </div>
                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <Button variant="outline" onClick={() => router.push('/erp/accounting/invoices')}>
                            Go to Invoices
                        </Button>
                        <Button onClick={() => {
                            setIsSuccessOpen(false);
                            setAmount('');
                            setReference('');
                            setSelectedInvoice('');
                            setNotes('');
                        }}>
                            Record Another
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
