'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
export const CreateInvoicePage = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [step, setStep] = useState(1);
    const [lineItems, setLineItems] = useState([
        { id: '1', description: '', quantity: 1, rate: 0 },
    ]);
    const addLineItem = () => {
        setLineItems([
            ...lineItems,
            { id: Date.now().toString(), description: '', quantity: 1, rate: 0 },
        ]);
    };
    const removeLineItem = (id) => {
        if (lineItems.length > 1) {
            setLineItems(lineItems.filter((item) => item.id !== id));
        }
    };
    const updateLineItem = (id, field, value) => {
        setLineItems(lineItems.map((item) => item.id === id ? { ...item, [field]: value } : item));
    };
    const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.rate, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    const handleCreate = () => {
        toast({
            title: 'Invoice Created',
            description: 'Invoice has been created successfully.',
        });
        router.push('/erp/accounting/invoices');
    };
    return (<div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5"/>
        </Button>
        <div className="page-header">
          <h1 className="page-title">Create Invoice</h1>
          <p className="page-description">Step {step} of 3</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (<div key={s} className="flex items-center">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${s === step
                ? 'bg-primary text-primary-foreground'
                : s < step
                    ? 'bg-success text-success-foreground'
                    : 'bg-muted text-muted-foreground'}`}>
              {s}
            </div>
            {s < 3 && (<div className={`w-16 h-1 mx-2 rounded ${s < step ? 'bg-success' : 'bg-muted'}`}/>)}
          </div>))}
      </div>

      {/* Step 1: Customer Info */}
      {step === 1 && (<Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Customer</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="acme">Acme Corp</SelectItem>
                    <SelectItem value="techstart">TechStart Inc</SelectItem>
                    <SelectItem value="global">Global Solutions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Invoice Number</Label>
                <Input placeholder="INV-009"/>
              </div>
              <div className="space-y-2">
                <Label>Invoice Date</Label>
                <Input type="date"/>
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input type="date"/>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setStep(2)}>Next</Button>
            </div>
          </CardContent>
        </Card>)}

      {/* Step 2: Line Items */}
      {step === 2 && (<Card>
          <CardHeader>
            <CardTitle>Line Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {lineItems.map((item, index) => (<div key={item.id} className="flex items-start gap-4">
                <div className="flex-1 space-y-2">
                  <Label>Description</Label>
                  <Input value={item.description} onChange={(e) => updateLineItem(item.id, 'description', e.target.value)} placeholder="Item description"/>
                </div>
                <div className="w-24 space-y-2">
                  <Label>Qty</Label>
                  <Input type="number" value={item.quantity} onChange={(e) => updateLineItem(item.id, 'quantity', Number(e.target.value))}/>
                </div>
                <div className="w-32 space-y-2">
                  <Label>Rate</Label>
                  <Input type="number" value={item.rate} onChange={(e) => updateLineItem(item.id, 'rate', Number(e.target.value))} placeholder="0.00"/>
                </div>
                <div className="w-32 space-y-2">
                  <Label>Amount</Label>
                  <div className="h-10 flex items-center font-medium">
                    ${(item.quantity * item.rate).toLocaleString()}
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="mt-8" onClick={() => removeLineItem(item.id)} disabled={lineItems.length === 1}>
                  <Trash2 className="h-4 w-4"/>
                </Button>
              </div>))}

            <Button variant="outline" onClick={addLineItem}>
              <Plus className="h-4 w-4 mr-2"/>
              Add Line Item
            </Button>

            <div className="flex justify-between items-end pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <div className="text-right space-y-1">
                <p className="text-sm text-muted-foreground">
                  Subtotal: ${subtotal.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Tax (10%): ${tax.toLocaleString()}
                </p>
                <p className="text-lg font-bold">
                  Total: ${total.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setStep(3)}>Next</Button>
            </div>
          </CardContent>
        </Card>)}

      {/* Step 3: Notes & Preview */}
      {step === 3 && (<Card>
          <CardHeader>
            <CardTitle>Additional Notes & Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea placeholder="Add any additional notes for the customer..." rows={4}/>
            </div>
            <div className="space-y-2">
              <Label>Terms & Conditions</Label>
              <Textarea placeholder="Payment terms, late fees, etc..." rows={3}/>
            </div>

            {/* Summary */}
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <h4 className="font-medium">Invoice Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Items:</span>
                <span>{lineItems.length}</span>
                <span className="text-muted-foreground">Subtotal:</span>
                <span>${subtotal.toLocaleString()}</span>
                <span className="text-muted-foreground">Tax:</span>
                <span>${tax.toLocaleString()}</span>
                <span className="font-medium">Total:</span>
                <span className="font-bold">${total.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <div className="flex gap-3">
                <Button variant="outline">Save as Draft</Button>
                <Button onClick={handleCreate}>Create Invoice</Button>
              </div>
            </div>
          </CardContent>
        </Card>)}
    </div>);
};
