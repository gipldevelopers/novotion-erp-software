// Updated: 2025-12-27
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { usePosStore } from '@/stores/posStore';
import { paymentMethods } from '@/services/posMockData';
import { Banknote, CreditCard, Smartphone, Building, FileText, CheckCircle2, Printer } from 'lucide-react';
import { InvoiceTemplate } from './InvoiceTemplate';

const iconMap = {
    banknote: Banknote,
    'credit-card': CreditCard,
    smartphone: Smartphone,
    building: Building,
    'file-text': FileText,
};

export default function PaymentModal({ totals, onClose }) {
    const { cart, customer, invoiceDiscount, invoiceDiscountType, clearCart } = usePosStore();
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [amountTendered, setAmountTendered] = useState(totals.total.toString());
    const [paymentComplete, setPaymentComplete] = useState(false);
    const [generatedInvoice, setGeneratedInvoice] = useState(null);

    const change = parseFloat(amountTendered) - totals.total;
    const isValidPayment = parseFloat(amountTendered) >= totals.total;

    const handleCompletePayment = () => {
        const invoice = {
            id: `INV-${Date.now()}`,
            invoiceNumber: `INV-2024-${Math.floor(Math.random() * 10000)}`,
            date: new Date().toISOString(),
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            client: customer || { name: 'Walk-in Client', gstin: '' },
            items: cart.map(item => ({
                serviceId: item.id,
                name: item.name,
                description: item.description,
                sacCode: item.sacCode,
                quantity: item.quantity,
                rate: item.price,
                amount: item.price * item.quantity,
                taxRate: item.taxRate,
                taxAmount: ((item.price * item.quantity) * item.taxRate) / 100,
            })),
            subtotal: totals.subtotal,
            discount: totals.itemDiscountTotal + totals.invoiceDiscountAmount,
            taxTotal: totals.taxTotal,
            total: totals.total,
            amountPaid: parseFloat(amountTendered),
            balance: Math.max(0, totals.total - parseFloat(amountTendered)),
            status: parseFloat(amountTendered) >= totals.total ? 'paid' : 'partial',
            paymentMethod: paymentMethods.find(pm => pm.id === paymentMethod)?.name || 'Cash',
            notes: '',
        };

        setGeneratedInvoice(invoice);
        setPaymentComplete(true);
    };

    const handlePrintAndClose = () => {
        window.print();
        clearCart();
        onClose();
    };

    if (paymentComplete && generatedInvoice) {
        return (
            <div className="p-6 bg-background max-h-[85vh] overflow-y-auto">
                <div className="text-center mb-6 print:hidden">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
                        <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h2>
                    <p className="text-muted-foreground">Invoice has been generated</p>
                </div>

                <div className="mb-6 print:hidden">
                    <InvoiceTemplate invoice={generatedInvoice} />
                </div>

                <div className="print:hidden flex gap-3 justify-center">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                    <Button onClick={handlePrintAndClose}>
                        <Printer className="h-4 w-4 mr-2" />
                        Print Invoice
                    </Button>
                </div>

                <div className="hidden print:block">
                    <InvoiceTemplate invoice={generatedInvoice} />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-border shrink-0">
                <h2 className="text-2xl font-bold text-foreground mb-2">Payment</h2>
                <p className="text-muted-foreground">Complete the transaction</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <div>
                            <Label className="text-sm font-medium mb-3 block">Payment Method</Label>
                            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                                <div className="space-y-2">
                                    {paymentMethods.map((method) => {
                                        const Icon = iconMap[method.icon];
                                        return (
                                            <div
                                                key={method.id}
                                                className={`flex items-center space-x-3 p-3 rounded-md border transition-colors cursor-pointer ${paymentMethod === method.id
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-border hover:bg-muted/50'
                                                    }`}
                                                onClick={() => setPaymentMethod(method.id)}
                                            >
                                                <RadioGroupItem value={method.id} id={method.id} />
                                                <Icon className="h-4 w-4 text-muted-foreground" />
                                                <Label htmlFor={method.id} className="flex-1 cursor-pointer font-normal">
                                                    {method.name}
                                                </Label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </RadioGroup>
                        </div>

                        <div>
                            <Label htmlFor="amount" className="text-sm font-medium mb-2 block">
                                Amount Tendered
                            </Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">
                                    ₹
                                </span>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    className="pl-7 h-12 text-lg font-semibold"
                                    value={amountTendered}
                                    onChange={(e) => setAmountTendered(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            {paymentMethod === 'cash' && (
                                <div className="grid grid-cols-4 gap-2 mt-3">
                                    {[100, 200, 500, 2000].map((amount) => (
                                        <Button
                                            key={amount}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setAmountTendered(amount.toString())}
                                        >
                                            ₹{amount}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {change >= 0 && parseFloat(amountTendered) > 0 && (
                            <div className="p-4 bg-muted/50 rounded-md">
                                <div className="text-sm text-muted-foreground mb-1">Change</div>
                                <div className="text-2xl font-bold text-foreground">
                                    ₹{change.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-muted/30 rounded-md">
                            <h3 className="font-semibold text-sm text-foreground mb-3">Order Summary</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Items</span>
                                    <span className="text-foreground">{cart.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="text-foreground">
                                        ₹{totals.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                                {(totals.itemDiscountTotal + totals.invoiceDiscountAmount) > 0 && (
                                    <div className="flex justify-between text-green-600 dark:text-green-500">
                                        <span>Discount</span>
                                        <span>
                                            -₹{(totals.itemDiscountTotal + totals.invoiceDiscountAmount).toLocaleString('en-IN', {
                                                minimumFractionDigits: 2,
                                            })}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tax (GST)</span>
                                    <span className="text-foreground">
                                        ₹{totals.taxTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between text-base font-bold">
                                    <span className="text-foreground">Total</span>
                                    <span className="text-foreground">
                                        ₹{totals.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {customer && (
                            <div className="p-4 bg-muted/30 rounded-md">
                                <h3 className="font-semibold text-sm text-foreground mb-2">Customer</h3>
                                <div className="text-sm">
                                    <div className="font-medium text-foreground">{customer.name}</div>
                                    {customer.phone && (
                                        <div className="text-muted-foreground text-xs mt-1">{customer.phone}</div>
                                    )}
                                    {customer.gstin && (
                                        <div className="text-muted-foreground text-xs font-mono mt-1">
                                            GSTIN: {customer.gstin}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex gap-3 justify-end p-6 border-t border-border bg-background shrink-0">
                <Button variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button onClick={handleCompletePayment} disabled={!isValidPayment} size="lg">
                    Complete Payment
                </Button>
            </div>
        </div>
    );
}
