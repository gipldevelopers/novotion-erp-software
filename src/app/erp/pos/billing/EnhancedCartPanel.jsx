// Updated: 2025-12-27
'use client';

import React, { useState } from 'react';
import { usePosStore } from '@/stores/posStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Trash2, Minus, Plus, ShoppingCart, UserPlus, Percent, DollarSign, User, Tag, X } from 'lucide-react';
import { clients } from '@/services/posMockData';
import PaymentModal from './PaymentModal';

export default function EnhancedCartPanel() {
    const {
        cart,
        customer,
        invoiceDiscount,
        invoiceDiscountType,
        notes,
        removeFromCart,
        updateQuantity,
        updateItemDiscount,
        setInvoiceDiscount,
        setCustomer,
        setNotes,
        clearCart,
        getCartTotals,
    } = usePosStore();

    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
    const [editingItemDiscount, setEditingItemDiscount] = useState(null);
    const [showInvoiceDiscount, setShowInvoiceDiscount] = useState(false);

    const totals = getCartTotals();

    const handleRemoveCustomer = () => {
        setCustomer(null);
    };

    const handleSelectCustomer = (clientId) => {
        const selectedClient = clients.find(c => c.id === clientId);
        setCustomer(selectedClient);
        setIsCustomerDialogOpen(false);
    };

    return (
        <>
            <div className="w-[420px] flex flex-col h-full bg-muted/10 border-l border-border">
                {/* Header */}
                <div className="p-4 border-b border-border bg-card space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-base flex items-center gap-2 text-foreground">
                            <ShoppingCart className="h-4 w-4" /> Cart ({cart.length})
                        </h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={clearCart}
                            disabled={cart.length === 0}
                        >
                            <Trash2 className="h-3 w-3 mr-1" /> Clear
                        </Button>
                    </div>

                    {/* Customer Selection */}
                    {customer ? (
                        <div className="flex items-center justify-between p-2 bg-primary/10 rounded-md border border-primary/20">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                <User className="h-4 w-4 text-primary shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm text-foreground truncate">{customer.name}</div>
                                    {customer.gstin && (
                                        <div className="text-[10px] text-muted-foreground font-mono">{customer.gstin}</div>
                                    )}
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={handleRemoveCustomer}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="outline"
                            className="w-full justify-start border-dashed"
                            onClick={() => setIsCustomerDialogOpen(true)}
                        >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Select Customer
                        </Button>
                    )}
                </div>

                {/* Cart Items */}
                <ScrollArea className="flex-1 p-4">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground/40">
                            <ShoppingCart className="h-12 w-12 mb-2" />
                            <p className="text-sm font-medium">Cart is empty</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {cart.map((item) => (
                                <div key={item.id} className="bg-card rounded-md p-3 shadow-sm border border-border">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-foreground truncate">{item.name}</div>
                                            <div className="text-[10px] text-muted-foreground flex items-center gap-2 mt-0.5">
                                                <span>{item.sku}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <Tag className="h-2.5 w-2.5" />
                                                    {item.sacCode}
                                                </span>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0 text-destructive"
                                            onClick={() => removeFromCart(item.id)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>

                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <div className="text-xs text-muted-foreground">
                                            ₹{item.price.toLocaleString()} × {item.quantity}
                                        </div>
                                        <div className="flex items-center gap-1 bg-muted/50 rounded border border-border p-0.5">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="h-5 w-5 flex items-center justify-center hover:bg-background rounded text-foreground"
                                            >
                                                <Minus className="h-3 w-3" />
                                            </button>
                                            <span className="text-xs font-semibold w-8 text-center tabular-nums text-foreground">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="h-5 w-5 flex items-center justify-center hover:bg-background rounded text-foreground"
                                            >
                                                <Plus className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Item Discount */}
                                    {editingItemDiscount === item.id ? (
                                        <div className="flex items-center gap-2 mt-2 p-2 bg-muted/30 rounded">
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                className="h-7 text-xs"
                                                defaultValue={item.itemDiscount}
                                                onBlur={(e) => {
                                                    updateItemDiscount(item.id, parseFloat(e.target.value) || 0, item.itemDiscountType);
                                                    setEditingItemDiscount(null);
                                                }}
                                                autoFocus
                                            />
                                            <Select
                                                value={item.itemDiscountType}
                                                onValueChange={(value) => updateItemDiscount(item.id, item.itemDiscount, value)}
                                            >
                                                <SelectTrigger className="h-7 w-16 text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="percentage">%</SelectItem>
                                                    <SelectItem value="fixed">₹</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between text-xs mt-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 text-xs px-2"
                                                onClick={() => setEditingItemDiscount(item.id)}
                                            >
                                                <Percent className="h-3 w-3 mr-1" />
                                                {item.itemDiscount > 0
                                                    ? `Discount: ${item.itemDiscount}${item.itemDiscountType === 'percentage' ? '%' : '₹'}`
                                                    : 'Add Discount'}
                                            </Button>
                                            <div className="font-bold text-foreground">
                                                ₹{(item.price * item.quantity).toLocaleString()}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                {/* Totals Section */}
                <div className="p-4 bg-card border-t border-border space-y-3">
                    {/* Invoice Discount */}
                    {showInvoiceDiscount ? (
                        <div className="p-2 bg-muted/30 rounded space-y-2">
                            <Label className="text-xs">Invoice Discount</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    placeholder="0"
                                    className="h-8 text-sm"
                                    value={invoiceDiscount}
                                    onChange={(e) => setInvoiceDiscount(parseFloat(e.target.value) || 0, invoiceDiscountType)}
                                />
                                <Select
                                    value={invoiceDiscountType}
                                    onValueChange={(value) => setInvoiceDiscount(invoiceDiscount, value)}
                                >
                                    <SelectTrigger className="h-8 w-20 text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="percentage">%</SelectItem>
                                        <SelectItem value="fixed">₹</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => {
                                        setInvoiceDiscount(0, 'percentage');
                                        setShowInvoiceDiscount(false);
                                    }}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => setShowInvoiceDiscount(true)}
                            disabled={cart.length === 0}
                        >
                            <Percent className="h-3 w-3 mr-2" />
                            Add Invoice Discount
                        </Button>
                    )}

                    {/* Totals Breakdown */}
                    <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between text-muted-foreground">
                            <span>Subtotal</span>
                            <span>₹{totals.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </div>
                        {totals.itemDiscountTotal > 0 && (
                            <div className="flex justify-between text-green-600 dark:text-green-500">
                                <span>Item Discounts</span>
                                <span>-₹{totals.itemDiscountTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                        )}
                        {totals.invoiceDiscountAmount > 0 && (
                            <div className="flex justify-between text-green-600 dark:text-green-500">
                                <span>Invoice Discount</span>
                                <span>-₹{totals.invoiceDiscountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-muted-foreground">
                            <span>Tax (GST)</span>
                            <span>₹{totals.taxTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-end">
                        <div className="text-sm font-medium text-foreground">Total</div>
                        <div className="text-2xl font-bold text-foreground">
                            ₹{totals.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                    </div>

                    <Button
                        className="w-full h-11"
                        disabled={cart.length === 0}
                        onClick={() => setIsPaymentOpen(true)}
                    >
                        Proceed to Payment
                    </Button>
                </div>
            </div>

            {/* Customer Selection Dialog */}
            <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Select Customer</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-[400px]">
                        <div className="space-y-2">
                            {clients.map((client) => (
                                <div
                                    key={client.id}
                                    className="p-3 border border-border rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                                    onClick={() => handleSelectCustomer(client.id)}
                                >
                                    <div className="font-medium text-sm text-foreground">{client.name}</div>
                                    {client.phone && (
                                        <div className="text-xs text-muted-foreground mt-0.5">{client.phone}</div>
                                    )}
                                    {client.gstin && (
                                        <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                                            GSTIN: {client.gstin}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            {/* Payment Modal */}
            <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
                    <DialogTitle className="sr-only">Payment Processing</DialogTitle>
                    <PaymentModal totals={totals} onClose={() => setIsPaymentOpen(false)} />
                </DialogContent>
            </Dialog>
        </>
    );
}
