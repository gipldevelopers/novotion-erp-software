'use client';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download, Send, Edit, Trash2, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PermissionGuard } from '@/components/erp/PermissionGuard';
const mockInvoice = {
    id: '1',
    number: 'INV-001',
    status: 'paid',
    createdAt: '2024-01-01',
    dueDate: '2024-01-15',
    paidAt: '2024-01-14',
    customer: {
        name: 'Acme Corp',
        email: 'billing@acme.com',
        address: '123 Business Ave, Suite 100, New York, NY 10001',
        phone: '+1 (555) 123-4567',
    },
    items: [
        { description: 'Web Development Services', quantity: 40, rate: 100 },
        { description: 'UI/UX Design', quantity: 20, rate: 80 },
        { description: 'Server Hosting (Monthly)', quantity: 1, rate: 200 },
    ],
    subtotal: 5800,
    tax: 580,
    total: 6380,
    notes: 'Thank you for your business!',
};
const statusColors = {
    paid: 'bg-success/10 text-success border-success/20',
    pending: 'bg-warning/10 text-warning border-warning/20',
    overdue: 'bg-destructive/10 text-destructive border-destructive/20',
    draft: 'bg-muted text-muted-foreground border-border',
};
export const InvoiceDetailPage = () => {
    const { id } = useParams();
    const router = useRouter();
    return (<div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5"/>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="page-title">{mockInvoice.number}</h1>
              <Badge variant="outline" className={statusColors[mockInvoice.status]}>
                {mockInvoice.status.charAt(0).toUpperCase() + mockInvoice.status.slice(1)}
              </Badge>
            </div>
            <p className="text-muted-foreground">Invoice ID: {id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Printer className="h-4 w-4"/>
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2"/>
            Download
          </Button>
          <PermissionGuard permission="invoices.create">
            <Button variant="outline">
              <Send className="h-4 w-4 mr-2"/>
              Send
            </Button>
          </PermissionGuard>
          <PermissionGuard permission="invoices.edit">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2"/>
              Edit
            </Button>
          </PermissionGuard>
          <PermissionGuard permission="invoices.delete">
            <Button variant="destructive" size="icon">
              <Trash2 className="h-4 w-4"/>
            </Button>
          </PermissionGuard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Details */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-bold text-primary">ERP System</h2>
                <p className="text-muted-foreground">Your Company Address</p>
                <p className="text-muted-foreground">contact@company.com</p>
              </div>
              <div className="text-right">
                <h3 className="text-xl font-bold">INVOICE</h3>
                <p className="text-muted-foreground">{mockInvoice.number}</p>
              </div>
            </div>

            <Separator className="my-6"/>

            {/* Bill To */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Bill To</h4>
                <p className="font-medium">{mockInvoice.customer.name}</p>
                <p className="text-sm text-muted-foreground">{mockInvoice.customer.address}</p>
                <p className="text-sm text-muted-foreground">{mockInvoice.customer.email}</p>
                <p className="text-sm text-muted-foreground">{mockInvoice.customer.phone}</p>
              </div>
              <div className="text-right">
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Date: </span>
                    {mockInvoice.createdAt}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Due Date: </span>
                    {mockInvoice.dueDate}
                  </p>
                  {mockInvoice.paidAt && (<p className="text-sm">
                      <span className="text-muted-foreground">Paid: </span>
                      {mockInvoice.paidAt}
                    </p>)}
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="border border-border rounded-lg overflow-hidden mb-6">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">Description</th>
                    <th className="text-center p-4 font-medium">Qty</th>
                    <th className="text-right p-4 font-medium">Rate</th>
                    <th className="text-right p-4 font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {mockInvoice.items.map((item, index) => (<tr key={index} className="border-t border-border">
                      <td className="p-4">{item.description}</td>
                      <td className="p-4 text-center">{item.quantity}</td>
                      <td className="p-4 text-right">${item.rate}</td>
                      <td className="p-4 text-right font-medium">
                        ${(item.quantity * item.rate).toLocaleString()}
                      </td>
                    </tr>))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${mockInvoice.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span>${mockInvoice.tax.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${mockInvoice.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {mockInvoice.notes && (<>
                <Separator className="my-6"/>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Notes</h4>
                  <p className="text-sm">{mockInvoice.notes}</p>
                </div>
              </>)}
          </CardContent>
        </Card>

        {/* Activity & Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Invoice Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="outline" className={statusColors[mockInvoice.status]}>
                  {mockInvoice.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{mockInvoice.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Due</span>
                <span>{mockInvoice.dueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-bold">${mockInvoice.total.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="h-2 w-2 rounded-full bg-success mt-2"/>
                  <div>
                    <p className="text-sm font-medium">Payment received</p>
                    <p className="text-xs text-muted-foreground">Jan 14, 2024</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2"/>
                  <div>
                    <p className="text-sm font-medium">Invoice sent</p>
                    <p className="text-xs text-muted-foreground">Jan 1, 2024</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground mt-2"/>
                  <div>
                    <p className="text-sm font-medium">Invoice created</p>
                    <p className="text-xs text-muted-foreground">Jan 1, 2024</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>);
};
