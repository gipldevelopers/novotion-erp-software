'use client';

import React, { useState } from 'react';
import { usePosStore } from '@/stores/posStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Trash2, Minus, Plus, ShoppingCart, UserPlus, FileText, PauseCircle, Briefcase } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import PaymentModal from './payment';

export default function CartPanel() {
    const { cart, customer, removeFromCart, updateQuantity, clearCart, getCartTotals, addToCart } = usePosStore();
    const { subtotal, discountTotal, taxTotal, total } = getCartTotals();
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

    // Custom Ad-hoc Item State
    const [customItem, setCustomItem] = useState({ name: '', price: '' });

    const handleAddCustom = () => {
        if (!customItem.name || !customItem.price) return;
        const newItem = {
            id: `ADHOC-${Date.now()}`,
            name: customItem.name,
            price: parseFloat(customItem.price),
            type: 'Ad-hoc',
            quantity: 1,
            description: 'Custom Service Charge',
            duration: 'N/A'
        };
        addToCart(newItem);
        setCustomItem({ name: '', price: '' });
    };

    return (
        <>
            <div className="flex flex-col h-full bg-muted/10 border-l border-border">
                {/* Header */}
                <div className="p-4 border-b border-border bg-card space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-base flex items-center gap-2 text-foreground">
                            <ShoppingCart className="h-4 w-4" /> Current Invoice
                        </h2>
                        <Button variant="ghost" size="sm" className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10" onClick={clearCart} disabled={cart.length === 0}>
                            <Trash2 className="h-3 w-3 mr-1" /> Clear
                        </Button>
                    </div>

                    {/* Custom Service Input Row */}
                    <div className="flex gap-2">
                        <div className="flex-1 grid grid-cols-7 gap-2">
                            <Input
                                placeholder="Add Item..."
                                className="col-span-4 h-8 text-xs bg-muted/50"
                                value={customItem.name}
                                onChange={(e) => setCustomItem({ ...customItem, name: e.target.value })}
                            />
                            <div className="relative col-span-3">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold">₹</span>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    className="h-8 text-xs pl-5 bg-muted/50"
                                    value={customItem.price}
                                    onChange={(e) => setCustomItem({ ...customItem, price: e.target.value })}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
                                />
                            </div>
                        </div>
                        <Button size="sm" onClick={handleAddCustom} className="h-8 w-8 p-0" title="Add">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Customer Select */}
                    <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 justify-between font-normal border-dashed h-9 text-xs" size="sm">
                            {customer ? (
                                <>
                                    <span className="font-bold text-foreground">{customer.name}</span>
                                    <span className="text-muted-foreground text-[10px]">Client</span>
                                </>
                            ) : (
                                <span className="text-muted-foreground flex items-center"><UserPlus className="h-3 w-3 mr-2" /> Assign Client</span>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Cart Items */}
                <ScrollArea className="flex-1 p-4">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground/40 space-y-2">
                            <Briefcase className="h-10 w-10" />
                            <p className="text-sm font-medium text-muted-foreground">Cart is empty</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {cart.map((item) => (
                                <div key={item.id} className="bg-card rounded-md p-3 shadow-sm border border-border">
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="space-y-0.5">
                                            <div className="text-sm font-medium text-foreground line-clamp-2">{item.name}</div>
                                            <div className="text-[10px] text-muted-foreground">{item.type}</div>
                                        </div>
                                        <div className="text-sm font-bold text-foreground">₹{(item.price * item.quantity).toFixed(2)}</div>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="text-xs text-muted-foreground">
                                            ₹{item.price} each
                                        </div>
                                        <div className="flex items-center gap-1 bg-muted/50 rounded border border-border p-0.5">
                                            <button onClick={() => updateQuantity(item.id, -1)} className="h-5 w-5 flex items-center justify-center hover:bg-background rounded text-foreground">
                                                <Minus className="h-3 w-3" />
                                            </button>
                                            <span className="text-xs font-semibold w-6 text-center tabular-nums text-foreground">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="h-5 w-5 flex items-center justify-center hover:bg-background rounded text-foreground">
                                                <Plus className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                {/* Totals Section */}
                <div className="p-4 bg-card border-t border-border z-10">
                    <div className="space-y-1.5 text-xs mb-3">
                        <div className="flex justify-between text-muted-foreground">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        {discountTotal > 0 && (
                            <div className="flex justify-between text-green-600 dark:text-green-500">
                                <span>Discount</span>
                                <span>-₹{discountTotal.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-muted-foreground">
                            <span>Tax (18%)</span>
                            <span>₹{taxTotal.toFixed(2)}</span>
                        </div>
                    </div>

                    <Separator className="my-3" />

                    <div className="flex justify-between items-end mb-4">
                        <div className="text-sm font-medium text-foreground">Total</div>
                        <div className="text-2xl font-bold text-foreground">₹{total.toFixed(2)}</div>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                        <Button variant="outline" className="h-10" title="Draft">
                            <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" className="h-10" title="Hold">
                            <PauseCircle className="h-4 w-4" />
                        </Button>
                        <Button
                            className="col-span-2 h-10"
                            variant="default"
                            disabled={cart.length === 0}
                            onClick={() => setIsPaymentOpen(true)}
                        >
                            Charge ₹{total.toFixed(0)}
                        </Button>
                    </div>
                </div>
            </div>

            <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden border-none shadow-xl bg-background">
                    <DialogTitle className="sr-only">Payment Processing</DialogTitle>
                    <PaymentModal total={total} onClose={() => setIsPaymentOpen(false)} />
                </DialogContent>
            </Dialog>
        </>
    );
}
