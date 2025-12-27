// Updated: 2025-12-27
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Banknote, Smartphone, CreditCard, Wallet, CheckCircle } from 'lucide-react';
import { usePosStore } from '@/stores/posStore';
import { InvoiceTemplate } from './InvoiceTemplate';

export default function PaymentModal({ total, onClose }) {
    const [method, setMethod] = useState('cash');
    const [amountPaid, setAmountPaid] = useState('');
    const [processing, setProcessing] = useState(false);
    const [completedOrder, setCompletedOrder] = useState(null);

    const { cart, customer, getCartTotals, clearCart } = usePosStore();
    const { subtotal, discountTotal, taxTotal } = getCartTotals();

    const due = total;
    const change = Math.max(0, (parseFloat(amountPaid) || 0) - due);

    const handleQuickAmount = (amt) => setAmountPaid(amt.toString());

    const processPayment = async () => {
        setProcessing(true);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API

        const orderData = {
            id: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
            date: new Date().toISOString(),
            customer: customer || { name: 'Walk-in Client', details: '' },
            items: [...cart],
            subtotal,
            taxTotal,
            discount: discountTotal,
            total,
            amountPaid: parseFloat(amountPaid),
            paymentMethod: method,
            status: 'Paid'
        };

        setCompletedOrder(orderData);
        setProcessing(false);
        clearCart();
    };

    // Mock Company Data for Invoice
    const companyData = {
        name: 'Novotion Tech Solutions LLP',
        address: '123, Innovation Park, Sector 5',
        city: 'Bangalore',
        state: 'Karnataka',
        zip: '560001',
        gstin: '29ABCDE1234F1Z5'
    };

    if (completedOrder) {
        return (
            <div className="h-[80vh] overflow-y-auto bg-slate-100 p-8 flex flex-col items-center">
                <div className="flex items-center gap-2 text-green-600 mb-6 bg-white px-6 py-2 rounded-full shadow-sm animate-in fade-in slide-in-from-top-4">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-bold">Payment Successful & Invoice Generated</span>
                </div>

                <InvoiceTemplate invoice={completedOrder} company={companyData} />

                <div className="fixed bottom-8 flex gap-4">
                    <Button variant="outline" className="bg-white shadow-lg border-slate-300" onClick={onClose}>
                        Close & New Sale
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-[600px] bg-white">
            {/* Left: Payment Methods */}
            <div className="w-1/3 bg-slate-50 border-r p-6 space-y-6">
                <h3 className="font-semibold text-slate-900">Payment Method</h3>
                <div className="space-y-2">
                    <MethodButton active={method === 'cash'} onClick={() => setMethod('cash')} icon={Banknote} label="Cash" />
                    <MethodButton active={method === 'upi'} onClick={() => setMethod('upi')} icon={Smartphone} label="UPI / QR" />
                    <MethodButton active={method === 'card'} onClick={() => setMethod('card')} icon={CreditCard} label="Card" />
                    <MethodButton active={method === 'split'} onClick={() => setMethod('split')} icon={Wallet} label="Split Billing" />
                </div>
                <div className="pt-8 text-xs text-muted-foreground">
                    <p>Secure Transaction</p>
                    <p className="mt-1">Encrypted End-to-End</p>
                </div>
            </div>

            {/* Right: Amount & Action */}
            <div className="flex-1 p-8 flex flex-col">
                <div className="text-center space-y-2 mb-8 bg-slate-50 py-6 rounded-xl border border-slate-100">
                    <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Amount Due</div>
                    <div className="text-5xl font-extrabold tracking-tighter text-slate-900">₹{due.toFixed(2)}</div>
                </div>

                <div className="flex-1 space-y-8">
                    <div className="space-y-3">
                        <Label className="text-base">Tendered Amount</Label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">₹</span>
                            <Input
                                className="h-16 pl-12 text-3xl font-bold shadow-sm focus-visible:ring-indigo-500"
                                value={amountPaid}
                                onChange={(e) => setAmountPaid(e.target.value)}
                                placeholder="0.00"
                                autoFocus
                            />
                        </div>
                    </div>

                    {method === 'cash' && (
                        <div className="grid grid-cols-4 gap-3">
                            {[total, Math.ceil(total / 100) * 100, Math.ceil(total / 500) * 500, 2000].map((amt, i) => (
                                amt >= total && (
                                    <Button key={i} variant="outline" className="h-10 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700" onClick={() => handleQuickAmount(amt)}>
                                        ₹{amt}
                                    </Button>
                                )
                            ))}
                        </div>
                    )}

                    <div className="bg-slate-50 p-4 rounded-lg flex justify-between items-center border border-slate-100">
                        <span className="font-medium text-slate-600">Change Due:</span>
                        <span className="text-2xl font-bold text-green-600">₹{change.toFixed(2)}</span>
                    </div>
                </div>

                <Button
                    size="lg"
                    className="w-full h-16 text-xl mt-6 bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200"
                    onClick={processPayment}
                    disabled={parseFloat(amountPaid) < total || processing}
                >
                    {processing ? 'Processing...' : `Confirm & Generate Invoice`}
                </Button>
            </div>
        </div>
    );
}

function MethodButton({ active, onClick, icon: Icon, label }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-all duration-200 ${active
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-[1.02]'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                }`}
        >
            <Icon className={`h-5 w-5 ${active ? 'text-white' : 'text-slate-400'}`} />
            <span className="font-medium">{label}</span>
        </button>
    )
}
