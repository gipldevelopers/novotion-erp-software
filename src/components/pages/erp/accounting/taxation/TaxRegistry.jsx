'use client';

import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Globe,
    RefreshCw,
    ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { taxationService } from '@/services/taxationService';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/erp/DataTable';

export const TaxRegistry = () => {
    const [taxes, setTaxes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTax, setCurrentTax] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        region: '',
        rate: '',
        type: 'Percentage',
        category: '',
        description: ''
    });

    useEffect(() => {
        fetchTaxes();
    }, []);

    const fetchTaxes = async () => {
        setLoading(true);
        try {
            const data = await taxationService.getTaxRegistry();
            setTaxes(data);
        } catch (error) {
            toast.error('Failed to fetch tax rates');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            name: '',
            code: '',
            region: '',
            rate: '',
            type: 'Percentage',
            category: '',
            description: ''
        });
        setCurrentTax(null);
        setIsEditing(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await taxationService.updateTaxRate(currentTax.id, {
                    ...formData,
                    rate: parseFloat(formData.rate)
                });
                toast.success('Tax rate updated successfully');
            } else {
                await taxationService.addTaxRate({
                    ...formData,
                    rate: parseFloat(formData.rate)
                });
                toast.success('Tax rate added successfully');
            }
            setIsAddDialogOpen(false);
            resetForm();
            fetchTaxes();
        } catch (error) {
            toast.error(isEditing ? 'Failed to update tax rate' : 'Failed to add tax rate');
        }
    };

    const handleEdit = (tax) => {
        // Use setTimeout to ensure the DropdownMenu closes fully before opening the Dialog
        // This prevents Radix UI from locking pointer-events on the body
        setTimeout(() => {
            setCurrentTax(tax);
            setFormData({
                name: tax.name,
                code: tax.code,
                region: tax.region,
                rate: tax.rate.toString(),
                type: tax.type,
                category: tax.category,
                description: tax.description
            });
            setIsEditing(true);
            setIsAddDialogOpen(true);
        }, 0);
    };

    const handleDelete = async (id) => {
        // Use setTimeout to escape the Radix event loop before showing a blocking confirm()
        setTimeout(async () => {
            if (confirm('Are you sure you want to delete this tax rate?')) {
                try {
                    await taxationService.deleteTaxRate(id);
                    toast.success('Tax rate deleted');
                    fetchTaxes();
                } catch (error) {
                    toast.error('Failed to delete tax rate');
                }
            }
        }, 0);
    };

    const columns = [
        {
            key: 'name',
            header: 'Tax Name',
            render: (item) => (
                <div className="flex flex-col">
                    <span className="font-semibold">{item.name}</span>
                    <span className="text-xs text-muted-foreground font-mono">{item.code}</span>
                </div>
            )
        },
        {
            key: 'region',
            header: 'Region/Country',
            render: (item) => (
                <div className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{item.region}</span>
                </div>
            )
        },
        {
            key: 'rate',
            header: 'Rate',
            render: (item) => (
                <Badge variant="secondary" className="font-bold">
                    {item.rate}{item.type === 'Percentage' ? '%' : ''}
                </Badge>
            )
        },
        {
            key: 'category',
            header: 'Category',
            render: (item) => (
                <Badge variant="outline">{item.category}</Badge>
            )
        },
        {
            key: 'status',
            header: 'Status',
            render: (item) => (
                <Badge variant={item.status === 'active' ? 'success' : 'secondary'}>
                    {item.status}
                </Badge>
            )
        },
        {
            key: 'actions',
            header: '',
            className: 'text-right',
            render: (item) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(item)}>
                            <Edit className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(item.id)}
                        >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    ];

    const filteredTaxes = taxes.filter(tax =>
        tax.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tax.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tax.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search taxes, countries..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={fetchTaxes} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                        setIsAddDialogOpen(open);
                        if (!open) {
                            resetForm();
                            // Force-restore pointer events just in case Radix cleanup fails
                            document.body.style.pointerEvents = 'auto';
                        }
                    }}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all">
                                <Plus className="h-4 w-4 mr-2" /> Add Tax Rate
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <form onSubmit={handleSubmit}>
                                <DialogHeader>
                                    <DialogTitle>{isEditing ? 'Edit Tax Rate' : 'New Global Tax Rate'}</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Tax Name</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                placeholder="e.g. VAT, Sales Tax"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="code">Tax Code</Label>
                                            <Input
                                                id="code"
                                                name="code"
                                                placeholder="e.g. VAT-20"
                                                value={formData.code}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="region">Region / Country</Label>
                                        <Input
                                            id="region"
                                            name="region"
                                            placeholder="e.g. United Kingdom"
                                            value={formData.region}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="rate">Tax Rate (%)</Label>
                                            <Input
                                                id="rate"
                                                name="rate"
                                                type="number"
                                                step="0.001"
                                                placeholder="0.00"
                                                value={formData.rate}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="type">Calculation Type</Label>
                                            <Select
                                                value={formData.type}
                                                onValueChange={(val) => handleSelectChange('type', val)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Percentage">Percentage (%)</SelectItem>
                                                    <SelectItem value="Fixed">Fixed Amount</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Input
                                            id="category"
                                            name="category"
                                            placeholder="e.g. Value Added Tax, Customs"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Input
                                            id="description"
                                            name="description"
                                            placeholder="Optional description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">
                                        {isEditing ? 'Save Changes' : 'Add Tax Rate'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card className="overflow-hidden border-none shadow-xl bg-card/50 backdrop-blur-sm">
                <CardHeader className="bg-primary/5 pb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">Global Tax Registry</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Manage tax rates for international compliance
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="p-6 space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full rounded-xl" />
                            ))}
                        </div>
                    ) : (
                        <DataTable
                            data={filteredTaxes}
                            columns={columns}
                            searchable={false}
                            pagination
                            pageSize={10}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
