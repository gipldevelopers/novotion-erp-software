'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Building2, Mail, Phone, MapPin, IndianRupee, MoreVertical, Edit, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { accountingService } from '@/services/accountingService';

export default function VendorsPage() {
    const router = useRouter();
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');

    useEffect(() => {
        loadVendors();
    }, []);

    const loadVendors = async () => {
        try {
            setLoading(true);
            const data = await accountingService.getVendors();
            setVendors(data);
        } catch (error) {
            console.error('Error loading vendors:', error);
        } finally {
            setLoading(false);
        }
    };

    const getFilteredVendors = () => {
        let filtered = vendors;

        if (filterCategory !== 'all') {
            filtered = filtered.filter(v => v.category === filterCategory);
        }

        if (searchQuery) {
            filtered = filtered.filter(v =>
                v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                v.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                v.gstin.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered;
    };

    const categories = ['all', ...new Set(vendors.map(v => v.category))];
    const filteredVendors = getFilteredVendors();

    const getTotalOutstanding = () => {
        return vendors.reduce((sum, v) => sum + v.outstandingAmount, 0);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading vendors...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Vendors</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your vendor database and track payments
                    </p>
                </div>
                <Button onClick={() => router.push('/erp/accounting/vendors/create')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vendor
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="text-sm text-muted-foreground">Total Vendors</div>
                    <div className="text-2xl font-bold">{vendors.length}</div>
                </Card>
                <Card className="p-4">
                    <div className="text-sm text-muted-foreground">Active Vendors</div>
                    <div className="text-2xl font-bold text-green-600">
                        {vendors.filter(v => v.status === 'active').length}
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-sm text-muted-foreground">Total Outstanding</div>
                    <div className="text-2xl font-bold text-red-600">
                        ₹{getTotalOutstanding().toLocaleString('en-IN')}
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-sm text-muted-foreground">Total Transactions</div>
                    <div className="text-2xl font-bold text-blue-600">
                        {vendors.reduce((sum, v) => sum + v.totalTransactions, 0)}
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <Card className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, email, or GSTIN..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {categories.map((cat) => (
                            <Button
                                key={cat}
                                variant={filterCategory === cat ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilterCategory(cat)}
                            >
                                {cat === 'all' ? 'All Categories' : cat}
                            </Button>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Vendor Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredVendors.map((vendor) => (
                    <Card key={vendor.id} className="p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-3">
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Building2 className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{vendor.name}</h3>
                                    <Badge variant="outline" className="mt-1">
                                        {vendor.category}
                                    </Badge>
                                </div>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => router.push(`/erp/accounting/vendors/${vendor.id}`)}>
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push(`/erp/accounting/vendors/${vendor.id}/edit`)}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                <span>{vendor.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="h-4 w-4" />
                                <span>{vendor.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span className="line-clamp-1">{vendor.address}</span>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-xs text-muted-foreground">GSTIN</div>
                                <div className="font-mono text-sm font-medium">{vendor.gstin}</div>
                            </div>
                            <div>
                                <div className="text-xs text-muted-foreground">State</div>
                                <div className="text-sm font-medium">{vendor.state}</div>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t flex items-center justify-between">
                            <div>
                                <div className="text-xs text-muted-foreground">Outstanding</div>
                                <div className={`text-lg font-bold ${vendor.outstandingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    ₹{vendor.outstandingAmount.toLocaleString('en-IN')}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-muted-foreground">Transactions</div>
                                <div className="text-lg font-bold">{vendor.totalTransactions}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-muted-foreground">Payment Terms</div>
                                <div className="text-sm font-medium">{vendor.paymentTerms}</div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => router.push(`/erp/accounting/vendors/${vendor.id}`)}
                            >
                                View Full Profile
                            </Button>
                        </div>
                    </Card>
                ))}

                {filteredVendors.length === 0 && (
                    <Card className="col-span-2 p-12 text-center">
                        <div className="text-muted-foreground">
                            <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium">No vendors found</p>
                            <p className="text-sm mt-2">Add your first vendor to start tracking expenses and payments</p>
                            <Button className="mt-4" onClick={() => router.push('/erp/accounting/vendors/create')}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Vendor
                            </Button>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
