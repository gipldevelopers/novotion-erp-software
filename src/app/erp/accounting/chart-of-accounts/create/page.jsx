'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { accountingService } from '@/services/accountingService';

export default function CreateAccountPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        type: 'Asset',
        category: '',
        parentId: null,
        balance: 0,
        isGroup: false,
    });

    useEffect(() => {
        loadAccounts();
    }, []);

    const loadAccounts = async () => {
        try {
            const data = await accountingService.getChartOfAccounts();
            setAccounts(data);
        } catch (error) {
            console.error('Error loading accounts:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Calculate level based on parent
            let level = 0;
            if (formData.parentId) {
                const parent = accounts.find(a => a.id === formData.parentId);
                level = parent ? parent.level + 1 : 0;
            }

            await accountingService.createAccount({
                ...formData,
                level,
                balance: parseFloat(formData.balance) || 0,
            });

            router.push('/erp/accounting/chart-of-accounts');
        } catch (error) {
            console.error('Error creating account:', error);
        } finally {
            setLoading(false);
        }
    };

    const accountTypes = ['Asset', 'Liability', 'Income', 'Expense'];

    const getParentAccounts = () => {
        return accounts.filter(acc =>
            acc.isGroup && acc.type === formData.type
        );
    };

    const getCategoryOptions = () => {
        const categories = {
            Asset: ['Cash', 'Bank', 'Receivable', 'Fixed Asset', 'Group'],
            Liability: ['Payable', 'Tax Payable', 'Loan', 'Group'],
            Income: ['Revenue', 'Other Income', 'Group'],
            Expense: ['Payroll', 'Rent', 'Utilities', 'Supplies', 'Marketing', 'Group'],
        };
        return categories[formData.type] || [];
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Create New Account</h1>
                    <p className="text-muted-foreground mt-1">
                        Add a new account to your chart of accounts
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
                <Card className="p-6 space-y-6">
                    {/* Account Type */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="type">Account Type *</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) => setFormData({ ...formData, type: value, parentId: null })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {accountTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category *</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => setFormData({ ...formData, category: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {getCategoryOptions().map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Account Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="code">Account Code *</Label>
                            <Input
                                id="code"
                                placeholder="e.g., 1105"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Account Name *</Label>
                            <Input
                                id="name"
                                placeholder="e.g., Petty Cash"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {/* Parent Account */}
                    <div className="space-y-2">
                        <Label htmlFor="parent">Parent Account (Optional)</Label>
                        <Select
                            value={formData.parentId || 'none'}
                            onValueChange={(value) => setFormData({ ...formData, parentId: value === 'none' ? null : value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select parent account" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None (Top Level)</SelectItem>
                                {getParentAccounts().map((acc) => (
                                    <SelectItem key={acc.id} value={acc.id}>
                                        {acc.code} - {acc.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                            Select a parent group to create a sub-account
                        </p>
                    </div>

                    {/* Group Account Checkbox */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isGroup"
                            checked={formData.isGroup}
                            onCheckedChange={(checked) => setFormData({ ...formData, isGroup: checked })}
                        />
                        <Label htmlFor="isGroup" className="cursor-pointer">
                            This is a group account (can have sub-accounts)
                        </Label>
                    </div>

                    {/* Opening Balance */}
                    {!formData.isGroup && (
                        <div className="space-y-2">
                            <Label htmlFor="balance">Opening Balance</Label>
                            <Input
                                id="balance"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={formData.balance}
                                onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                            />
                            <p className="text-sm text-muted-foreground">
                                Enter the opening balance for this account
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Create Account
                                </>
                            )}
                        </Button>
                    </div>
                </Card>
            </form>
        </div>
    );
}
