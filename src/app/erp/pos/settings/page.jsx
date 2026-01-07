// Updated: 2025-12-27
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, FileText, DollarSign, Bell, Save, Keyboard } from 'lucide-react';
import { companyDetails } from '@/services/posMockData';

export default function SettingsPage() {
    const [company, setCompany] = useState(companyDetails);
    const [settings, setSettings] = useState({
        autoInvoiceNumber: true,
        printAfterPayment: false,
        requireCustomer: false,
        defaultTaxRate: 18,
        invoicePrefix: 'INV',
        enableKeyboardShortcuts: true,
        soundNotifications: false,
    });

    const handleSave = () => {
        // In real app, save to backend
        console.log('Saving settings...', { company, settings });
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Settings</h2>
                    <p className="text-muted-foreground mt-1">Configure your POS system preferences.</p>
                </div>
                <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
            </div>

            <Tabs defaultValue="company" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
                    <TabsTrigger value="company">
                        <Building2 className="h-4 w-4 mr-2" />
                        Company
                    </TabsTrigger>
                    <TabsTrigger value="invoice">
                        <FileText className="h-4 w-4 mr-2" />
                        Invoice
                    </TabsTrigger>
                    <TabsTrigger value="tax">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Tax
                    </TabsTrigger>
                    <TabsTrigger value="system">
                        <Keyboard className="h-4 w-4 mr-2" />
                        System
                    </TabsTrigger>
                </TabsList>

                {/* Company Settings */}
                <TabsContent value="company" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Company Information</CardTitle>
                            <CardDescription>Details that appear on invoices and receipts</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="company-name">Company Name</Label>
                                    <Input
                                        id="company-name"
                                        value={company.name}
                                        onChange={(e) => setCompany({ ...company, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gstin">GSTIN</Label>
                                    <Input
                                        id="gstin"
                                        className="font-mono"
                                        value={company.gstin}
                                        onChange={(e) => setCompany({ ...company, gstin: e.target.value.toUpperCase() })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    value={company.address}
                                    onChange={(e) => setCompany({ ...company, address: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        value={company.city}
                                        onChange={(e) => setCompany({ ...company, city: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="state">State</Label>
                                    <Input
                                        id="state"
                                        value={company.state}
                                        onChange={(e) => setCompany({ ...company, state: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="pincode">Pincode</Label>
                                    <Input
                                        id="pincode"
                                        value={company.pincode}
                                        onChange={(e) => setCompany({ ...company, pincode: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        value={company.phone}
                                        onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={company.email}
                                        onChange={(e) => setCompany({ ...company, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="pan">PAN</Label>
                                    <Input
                                        id="pan"
                                        className="font-mono"
                                        value={company.pan}
                                        onChange={(e) => setCompany({ ...company, pan: e.target.value.toUpperCase() })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Bank Details</CardTitle>
                            <CardDescription>Payment information for invoices</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="bank-name">Bank Name</Label>
                                    <Input
                                        id="bank-name"
                                        value={company.bankName}
                                        onChange={(e) => setCompany({ ...company, bankName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="account-number">Account Number</Label>
                                    <Input
                                        id="account-number"
                                        className="font-mono"
                                        value={company.accountNumber}
                                        onChange={(e) => setCompany({ ...company, accountNumber: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="ifsc">IFSC Code</Label>
                                    <Input
                                        id="ifsc"
                                        className="font-mono"
                                        value={company.ifscCode}
                                        onChange={(e) => setCompany({ ...company, ifscCode: e.target.value.toUpperCase() })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="branch">Branch</Label>
                                    <Input
                                        id="branch"
                                        value={company.branch}
                                        onChange={(e) => setCompany({ ...company, branch: e.target.value })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Invoice Settings */}
                <TabsContent value="invoice" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Invoice Configuration</CardTitle>
                            <CardDescription>Customize invoice generation and numbering</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Auto Invoice Numbering</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Automatically generate sequential invoice numbers
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.autoInvoiceNumber}
                                    onCheckedChange={(checked) =>
                                        setSettings({ ...settings, autoInvoiceNumber: checked })
                                    }
                                />
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <Label htmlFor="invoice-prefix">Invoice Prefix</Label>
                                <Input
                                    id="invoice-prefix"
                                    value={settings.invoicePrefix}
                                    onChange={(e) => setSettings({ ...settings, invoicePrefix: e.target.value })}
                                    placeholder="INV"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Example: {settings.invoicePrefix}-2024-0001
                                </p>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Print After Payment</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Automatically open print dialog after successful payment
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.printAfterPayment}
                                    onCheckedChange={(checked) =>
                                        setSettings({ ...settings, printAfterPayment: checked })
                                    }
                                />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Require Customer</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Make customer selection mandatory for all invoices
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.requireCustomer}
                                    onCheckedChange={(checked) =>
                                        setSettings({ ...settings, requireCustomer: checked })
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tax Settings */}
                <TabsContent value="tax" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tax Configuration</CardTitle>
                            <CardDescription>GST and tax calculation settings</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="default-tax">Default Tax Rate (%)</Label>
                                <Input
                                    id="default-tax"
                                    type="number"
                                    value={settings.defaultTaxRate}
                                    onChange={(e) =>
                                        setSettings({ ...settings, defaultTaxRate: parseFloat(e.target.value) })
                                    }
                                />
                                <p className="text-xs text-muted-foreground">
                                    Applied to services without specific tax rates
                                </p>
                            </div>

                            <div className="p-4 bg-muted/30 rounded-md space-y-2">
                                <h4 className="font-semibold text-sm">Tax Breakdown</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">CGST:</span>
                                        <span className="ml-2 font-semibold">{settings.defaultTaxRate / 2}%</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">SGST:</span>
                                        <span className="ml-2 font-semibold">{settings.defaultTaxRate / 2}%</span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-muted-foreground">IGST (Interstate):</span>
                                        <span className="ml-2 font-semibold">{settings.defaultTaxRate}%</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* System Settings */}
                <TabsContent value="system" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>System Preferences</CardTitle>
                            <CardDescription>General application settings</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Keyboard Shortcuts</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Enable keyboard shortcuts for faster operations
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.enableKeyboardShortcuts}
                                    onCheckedChange={(checked) =>
                                        setSettings({ ...settings, enableKeyboardShortcuts: checked })
                                    }
                                />
                            </div>

                            {settings.enableKeyboardShortcuts && (
                                <div className="p-4 bg-muted/30 rounded-md space-y-2">
                                    <h4 className="font-semibold text-sm mb-3">Available Shortcuts</h4>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">New Sale</span>
                                            <kbd className="px-2 py-1 bg-background border rounded text-xs font-mono">
                                                Ctrl + N
                                            </kbd>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Search Services</span>
                                            <kbd className="px-2 py-1 bg-background border rounded text-xs font-mono">
                                                Ctrl + K
                                            </kbd>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Add Customer</span>
                                            <kbd className="px-2 py-1 bg-background border rounded text-xs font-mono">
                                                Ctrl + U
                                            </kbd>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Payment</span>
                                            <kbd className="px-2 py-1 bg-background border rounded text-xs font-mono">
                                                Ctrl + P
                                            </kbd>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Sound Notifications</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Play sounds for successful transactions
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.soundNotifications}
                                    onCheckedChange={(checked) =>
                                        setSettings({ ...settings, soundNotifications: checked })
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
