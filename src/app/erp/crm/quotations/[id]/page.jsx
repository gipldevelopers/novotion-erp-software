'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Printer, Mail, Copy, CheckCircle, XCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { crmService } from '@/services/crmService';
import { accountingService } from '@/services/accountingService';
import { useToast } from '@/hooks/use-toast';

export default function QuotationDetailPage() {
    const router = useRouter();
    const { id } = useParams();
    const { toast } = useToast();
    const [quotation, setQuotation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [converting, setConverting] = useState(false);

    useEffect(() => {
        const fetchQuotation = async () => {
            const data = await crmService.getQuotationById(id);
            if (data) {
                setQuotation(data);
            } else {
                toast({ title: "Error", description: "Quotation not found", variant: "destructive" });
                router.push('/erp/crm/quotations');
            }
            setLoading(false);
        };
        fetchQuotation();
    }, [id, router]);

    const handlePrint = () => {
        window.print();
    };

    const handleRevision = async () => {
        toast({ title: "Info", description: "Revision feature requires backend support. Logic placeholder." });
    };

    const handleConvertToInvoice = async () => {
        if (!quotation) return;
        setConverting(true);
        try {
            // 1. Create Invoice in Accounting
            const invoiceData = {
                customerId: quotation.customerId,
                customer: quotation.customerName,
                date: new Date().toISOString(),
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 days
                items: quotation.items,
                subtotal: quotation.subtotal || quotation.totalAmount, // Fallback if subtotal missing
                total: quotation.totalAmount,
                status: 'Unpaid',
                source: `Quotation #${quotation.id}`
            };

            const newInvoice = await accountingService.createInvoice(invoiceData);

            // 2. Update Quotation Status
            await crmService.updateQuotationStatus(quotation.id, 'Invoiced');

            // 3. Update Local State
            setQuotation({ ...quotation, status: 'Invoiced' });

            toast({
                title: "Success",
                description: `Invoice ${newInvoice.number} created successfully.`,
                action: <Button variant="outline" size="sm" onClick={() => router.push('/erp/accounting/invoices')}>View Invoice</Button>
            });
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to convert to invoice", variant: "destructive" });
        } finally {
            setConverting(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading quotation details...</div>;
    if (!quotation) return null;

    return (
        <div className="space-y-6 max-w-4xl mx-auto print:max-w-none print:p-0">
            {/* Action Bar - Hidden in Print */}
            <div className="flex justify-between items-center print:hidden">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <div className="flex gap-2">
                    {quotation.status !== 'Invoiced' && (
                        <Button variant="default" onClick={handleConvertToInvoice} disabled={converting}>
                            {converting ? <CheckCircle className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                            Convert to Invoice
                        </Button>
                    )}
                    <Button variant="outline" onClick={handleRevision}>
                        <Copy className="h-4 w-4 mr-2" /> Revise (v{quotation.version})
                    </Button>
                    <Button onClick={handlePrint}>
                        <Printer className="h-4 w-4 mr-2" /> Print / PDF
                    </Button>
                </div>
            </div>

            {/* Printable Area */}
            <Card className="print:shadow-none print:border-none">
                <CardHeader className="flex flex-row justify-between items-start border-b pb-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <CardTitle className="text-3xl">Quotation</CardTitle>
                            <Badge variant="outline" className="text-lg px-3 py-1 bg-gray-100 print:hidden">
                                {quotation.status}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground">#{quotation.id}</p>
                    </div>
                    <div className="text-right space-y-1">
                        <h3 className="font-bold text-lg">Novotion ERP Services</h3>
                        <p className="text-sm text-muted-foreground">123 Business Park, Tech City</p>
                        <p className="text-sm text-muted-foreground">support@novotion.com | +91 98765 43210</p>
                    </div>
                </CardHeader>

                <CardContent className="pt-6 space-y-8">
                    {/* Client & Date Info */}
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-2">Bill To</h4>
                            <p className="font-bold text-lg">{quotation.customerName}</p>
                            {/* In real app, fetch address from customer details */}
                            <p className="text-sm text-gray-600">Refer Customer ID: {quotation.customerId}</p>
                        </div>
                        <div className="text-right space-y-2">
                            <div className="flex justify-between md:justify-end gap-8">
                                <span className="text-muted-foreground">Date:</span>
                                <span className="font-medium">{new Date(quotation.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between md:justify-end gap-8">
                                <span className="text-muted-foreground">Valid Until:</span>
                                <span className="font-medium">{quotation.validUntil ? new Date(quotation.validUntil).toLocaleDateString() : 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="w-[50%]">Item Description</TableHead>
                                <TableHead className="text-center">Qty</TableHead>
                                <TableHead className="text-right">Rate</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {quotation.items.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <p className="font-medium">{item.description}</p>
                                        <p className="text-xs text-muted-foreground">HSN: 998311</p>
                                    </TableCell>
                                    <TableCell className="text-center">{item.quantity}</TableCell>
                                    <TableCell className="text-right">₹{item.rate.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">₹{item.qty ? item.qty * item.rate : item.amount?.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Totals */}
                    <div className="flex justify-end">
                        <div className="w-64 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>₹{quotation.subtotal?.toLocaleString() || quotation.totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">GST (18%)</span>
                                <span>₹{(quotation.taxTotal || (quotation.totalAmount * 0.18)).toLocaleString()}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>₹{quotation.totalAmount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Terms */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 text-sm">Terms & Conditions</h4>
                        <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans">
                            {quotation.terms || "Standard terms apply."}
                        </pre>
                    </div>
                </CardContent>

                {/* Footer - Print Only */}
                <div className="hidden print:block text-center text-xs text-muted-foreground mt-8 pt-8 border-t">
                    <p>This is a computer-generated quotation and does not require a signature.</p>
                </div>
            </Card>
        </div>
    );
}
