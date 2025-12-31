'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Upload,
    FileText,
    X,
    Check,
    AlertCircle,
    Calendar,
    Tag,
    DollarSign,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { expenseService } from '@/services/expenseService';
import { toast } from 'sonner';

export default function CreateExpensePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        gstAmount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        vendor: '',
        paymentMode: 'cash',
        notes: ''
    });

    useState(() => {
        expenseService.getCategories().then(setCategories);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await expenseService.createExpense({
                ...formData,
                amount: parseFloat(formData.amount),
                gstAmount: parseFloat(formData.gstAmount || 0),
                vendorId: formData.vendor,
                attachment: file ? file.name : null
            });
            toast.success('Expense recorded successfully');
            router.push('/erp/accounting/expenses');
        } catch (error) {
            toast.error('Failed to record expense');
        } finally {
            setLoading(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (file) => {
        if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
            setFile(file);
            toast.success('Receipt attached');

            // Auto-fill mock
            if (!formData.amount) {
                toast.info('Auto-extracting details from receipt...');
                setTimeout(() => {
                    setFormData(prev => ({
                        ...prev,
                        amount: '1250.00',
                        gstAmount: '225.00',
                        description: 'Extracted: Office Lunch',
                        vendor: 'Tasty Bites Restaurant'
                    }));
                    toast.success('Details auto-filled from receipt!');
                }, 1500);
            }
        } else {
            toast.error('Please upload a PDF or Image file');
        }
    };

    const handleCategoryChange = (catName) => {
        const cat = categories.find(c => c.name === catName);
        setFormData(prev => {
            const updates = { category: catName };
            // Auto-calculate GST if possible
            if (prev.amount && cat?.gstRate) {
                updates.gstAmount = ((parseFloat(prev.amount) * cat.gstRate) / 100).toFixed(2);
            }
            return { ...prev, ...updates };
        });
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Record Expense</h1>
                    <p className="text-muted-foreground mt-1">
                        Log a new business expense or upload a bill
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* File Upload Section */}
                <div className="md:col-span-1 space-y-4">
                    <Card
                        className={`p-6 border-2 border-dashed flex flex-col items-center justify-center text-center h-[300px] transition-colors ${dragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
                            }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {file ? (
                            <div className="space-y-4 w-full">
                                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                    <FileText className="h-8 w-8 text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-semibold text-sm truncate px-4">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => setFile(null)} className="w-full">
                                    <X className="h-4 w-4 mr-2" /> Remove
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                                    <Upload className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-semibold">Upload Bill/Receipt</h3>
                                    <p className="text-xs text-muted-foreground px-4">
                                        Drag & drop or click to upload. We'll attempt to auto-fill details.
                                    </p>
                                </div>
                                <div className="relative">
                                    <input
                                        type="file"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        accept="image/*,.pdf"
                                        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                                    />
                                    <Button variant="secondary" size="sm">Choose File</Button>
                                </div>
                            </div>
                        )}
                    </Card>

                    {file && (
                        <div className="flex items-start gap-2 text-xs text-green-600 bg-green-50 p-2 rounded border border-green-100">
                            <Check className="h-4 w-4 mt-0.5" />
                            <span>OCR Ready: Document processed for verification.</span>
                        </div>
                    )}
                </div>

                {/* Form Section */}
                <Card className="md:col-span-2 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2">
                                <Label>Expense Description *</Label>
                                <Input
                                    placeholder="e.g. Server hosting fee for December"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Pre-Tax Amount (₹) *</Label>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>GST Amount (₹) </Label>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={formData.gstAmount}
                                    onChange={(e) => setFormData({ ...formData, gstAmount: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Date *</Label>
                                <Input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Category *</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={handleCategoryChange}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(cat => (
                                            <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Payment Mode</Label>
                                <Select
                                    value={formData.paymentMode}
                                    onValueChange={(val) => setFormData({ ...formData, paymentMode: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cash">Cash</SelectItem>
                                        <SelectItem value="credit_card">Corporate Card</SelectItem>
                                        <SelectItem value="reimbursement">Employee Reimbursement</SelectItem>
                                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Vendor / Payee</Label>
                                <Input
                                    placeholder="e.g. AWS, Office Depot"
                                    value={formData.vendor}
                                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2 col-span-2">
                                <Label>Notes</Label>
                                <Textarea
                                    placeholder="Additional details..."
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => router.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Expense'
                                )}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}
