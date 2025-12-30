'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Plus, Trash2, Save, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { crmService } from '@/services/crmService';
import { useToast } from '@/hooks/use-toast';

export default function CreateQuotationPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        customerId: '',
        customerName: '', // Will be set automatically
        date: new Date().toISOString().split('T')[0],
        validUntil: '',
        items: [{ id: 1, description: '', quantity: 1, rate: 0, tax: 18, amount: 0 }],
        notes: 'Thank you for your business!',
        terms: '1. 50% Advance payment.\n2. Balance on completion.\n3. Taxes as applicable.'
    });

    useEffect(() => {
        const fetchCustomers = async () => {
            const data = await crmService.getCustomers();
            setCustomers(data);
        };
        fetchCustomers();
    }, []);

    const handleCustomerChange = (value) => {
        const customer = customers.find(c => c.id === value);
        setFormData(prev => ({
            ...prev,
            customerId: value,
            customerName: customer ? customer.name : ''
        }));
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;

        // Recalculate amount
        if (field === 'quantity' || field === 'rate') {
            const qty = parseFloat(newItems[index].quantity) || 0;
            const rate = parseFloat(newItems[index].rate) || 0;
            newItems[index].amount = qty * rate;
        }

        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { id: Date.now(), description: '', quantity: 1, rate: 0, tax: 18, amount: 0 }]
        }));
    };

    const removeItem = (index) => {
        if (formData.items.length === 1) return;
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, items: newItems }));
    };

    // Calculations
    const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = formData.items.reduce((sum, item) => sum + (item.amount * (item.tax / 100)), 0);
    const totalAmount = subtotal + taxAmount;

    const handleSubmit = async (status = 'Draft') => {
        if (!formData.customerId) {
            toast({ title: "Error", description: "Please select a customer", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            await crmService.createQuotation({
                ...formData,
                status,
                totalAmount,
                subtotal,
                taxTotal: taxAmount
            });
            toast({ title: "Success", description: "Quotation created successfully" });
            router.push('/erp/crm/quotations');
        } catch (error) {
            toast({ title: "Error", description: "Failed to create quotation", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">New Quotation</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    {/* Client Details */}
                    <Card>
                        <CardHeader><CardTitle>Client & Dates</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Select Customer</Label>
                                <Select onValueChange={handleCustomerChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a customer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {customers.map(c => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Quotation Date</Label>
                                <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Valid Until</Label>
                                <Input type="date" value={formData.validUntil} onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Line Items */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Services / Products</CardTitle>
                            <Button variant="outline" size="sm" onClick={addItem}><Plus className="h-4 w-4 mr-2" /> Add Item</Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[40%]">Description</TableHead>
                                        <TableHead className="w-[15%]">Qty</TableHead>
                                        <TableHead className="w-[20%]">Rate</TableHead>
                                        <TableHead className="w-[15%]">Amount</TableHead>
                                        <TableHead className="w-[10%]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {formData.items.map((item, index) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <Input
                                                    placeholder="Item description"
                                                    value={item.description}
                                                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    value={item.rate}
                                                    onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="py-2 px-3 bg-secondary/20 rounded font-medium">
                                                    ₹{item.amount.toLocaleString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" onClick={() => removeItem(index)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Terms */}
                    <Card>
                        <CardHeader><CardTitle>Terms & Notes</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Notes for Client</Label>
                                <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Terms & Conditions</Label>
                                <Textarea className="h-32 font-mono text-sm" value={formData.terms} onChange={(e) => setFormData({ ...formData, terms: e.target.value })} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Summary Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">GST (18%)</span>
                                <span>₹{taxAmount.toLocaleString()}</span>
                            </div>
                            <div className="border-t pt-4 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>₹{totalAmount.toLocaleString()}</span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-3">
                            <Button className="w-full" onClick={() => handleSubmit('Sent')} disabled={loading}>
                                <Send className="h-4 w-4 mr-2" /> Save & Send
                            </Button>
                            <Button variant="outline" className="w-full" onClick={() => handleSubmit('Draft')} disabled={loading}>
                                <Save className="h-4 w-4 mr-2" /> Save as Draft
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
