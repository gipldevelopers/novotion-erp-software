// Updated: 2025-12-27
'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, User, Phone, Mail, TrendingUp, Star, MapPin } from 'lucide-react';
import { clients, invoices } from '@/services/posMockData';
import { usePosStore } from '@/stores/posStore';
import { Button } from '@/components/ui/button';

export default function CustomersPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [clientList, setClientList] = useState(clients);
    const [newClient, setNewClient] = useState({
        name: '',
        email: '',
        phone: '',
        gstin: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        notes: ''
    });

    const customerStats = useMemo(() => {
        const stats = {};
        clientList.forEach(c => {
            stats[c.id] = { totalSpend: 0, orderCount: 0, lastVisit: null };
        });
        invoices.forEach(order => {
            const cId = order.clientId || order.client?.id;
            if (cId && stats[cId]) {
                stats[cId].totalSpend += parseFloat(order.total);
                stats[cId].orderCount += 1;
                const orderDate = new Date(order.date);
                if (!stats[cId].lastVisit || orderDate > stats[cId].lastVisit) {
                    stats[cId].lastVisit = orderDate;
                }
            }
        });
        return stats;
    }, [clientList]);

    const filteredCustomers = clientList.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.gstin?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddClient = () => {
        const client = {
            id: `CLT-${Date.now()}`,
            ...newClient,
            balance: 0,
            totalSpent: 0,
            lastVisit: null,
            createdAt: new Date().toISOString()
        };
        setClientList([...clientList, client]);
        setNewClient({
            name: '',
            email: '',
            phone: '',
            gstin: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            notes: ''
        });
        setIsAddOpen(false);
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Clients</h2>
                    <p className="text-muted-foreground mt-1">Directory of all registered customers.</p>
                </div>
                <Button onClick={() => setIsAddOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Client
                </Button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border shadow-sm bg-card text-card-foreground">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{clientList.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Active customer base</p>
                    </CardContent>
                </Card>

                <Card className="border shadow-sm bg-card text-card-foreground">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ₹{Object.values(customerStats).reduce((sum, s) => sum + s.totalSpend, 0).toLocaleString('en-IN')}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Lifetime customer value</p>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name, phone, email, or GSTIN..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Clients Table */}
            <Card className="border shadow-sm bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                            <TableHead className="pl-6">Name</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>GSTIN</TableHead>
                            <TableHead className="text-right">Spend</TableHead>
                            <TableHead className="text-center">Orders</TableHead>
                            <TableHead>Last Visit</TableHead>
                            <TableHead className="text-right pr-6">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCustomers.map((c) => {
                            const stat = customerStats[c.id] || { totalSpend: 0, orderCount: 0, lastVisit: null };
                            return (
                                <TableRow key={c.id} className="hover:bg-muted/50">
                                    <TableCell className="pl-6 font-medium text-foreground">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <User className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <div className="font-semibold">{c.name}</div>
                                                {c.email && <div className="text-xs text-muted-foreground">{c.email}</div>}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {c.phone || '-'}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {c.city && c.state ? (
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {c.city}, {c.state}
                                            </div>
                                        ) : '-'}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        {c.gstin || '-'}
                                    </TableCell>
                                    <TableCell className="text-right font-semibold text-foreground">
                                        ₹{stat.totalSpend.toLocaleString('en-IN')}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline">{stat.orderCount}</Badge>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {stat.lastVisit ? stat.lastVisit.toLocaleDateString() : '-'}
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                usePosStore.getState().setCustomer(c);
                                                router.push('/erp/pos/billing');
                                            }}
                                        >
                                            Create Invoice
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Card>

            {/* Add Client Dialog */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-foreground">Add New Client</DialogTitle>
                        <DialogDescription>Create a new customer profile with complete details.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-foreground">Basic Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name *</Label>
                                    <Input
                                        id="name"
                                        placeholder="John Doe"
                                        value={newClient.name}
                                        onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        placeholder="+91 98765 43210"
                                        value={newClient.phone}
                                        onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        value={newClient.email}
                                        onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gstin">GSTIN</Label>
                                    <Input
                                        id="gstin"
                                        placeholder="29AAAAA0000A1Z5"
                                        className="font-mono"
                                        value={newClient.gstin}
                                        onChange={(e) => setNewClient({ ...newClient, gstin: e.target.value.toUpperCase() })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-foreground">Address Details</h3>
                            <div className="space-y-2">
                                <Label htmlFor="address">Street Address</Label>
                                <Input
                                    id="address"
                                    placeholder="123 Main Street"
                                    value={newClient.address}
                                    onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        placeholder="Bangalore"
                                        value={newClient.city}
                                        onChange={(e) => setNewClient({ ...newClient, city: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="state">State</Label>
                                    <Input
                                        id="state"
                                        placeholder="Karnataka"
                                        value={newClient.state}
                                        onChange={(e) => setNewClient({ ...newClient, state: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="pincode">Pincode</Label>
                                    <Input
                                        id="pincode"
                                        placeholder="560001"
                                        value={newClient.pincode}
                                        onChange={(e) => setNewClient({ ...newClient, pincode: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                placeholder="Additional information about the client..."
                                rows={3}
                                value={newClient.notes}
                                onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddClient} disabled={!newClient.name}>
                            Add Client
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
