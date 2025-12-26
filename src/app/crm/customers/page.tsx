'use client';

import { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Trash,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';

const customers = [
  {
    id: 1,
    name: 'Acme Corporation',
    contact: 'John Smith',
    email: 'john@acme.com',
    phone: '+1 (555) 123-4567',
    type: 'Client',
    status: 'Active',
    revenue: '$45,000',
    deals: 12,
    lastContact: '2024-01-15',
    location: 'New York, USA',
  },
  {
    id: 2,
    name: 'TechStart Inc',
    contact: 'Sarah Johnson',
    email: 'sarah@techstart.com',
    phone: '+1 (555) 234-5678',
    type: 'Lead',
    status: 'Active',
    revenue: '$38,500',
    deals: 9,
    lastContact: '2024-01-18',
    location: 'San Francisco, USA',
  },
  {
    id: 3,
    name: 'Global Solutions',
    contact: 'Michael Chen',
    email: 'michael@global.com',
    phone: '+1 (555) 345-6789',
    type: 'Client',
    status: 'Active',
    revenue: '$32,000',
    deals: 8,
    lastContact: '2024-01-20',
    location: 'London, UK',
  },
  {
    id: 4,
    name: 'Innovation Labs',
    contact: 'Emma Davis',
    email: 'emma@innovation.com',
    phone: '+1 (555) 456-7890',
    type: 'Client',
    status: 'Active',
    revenue: '$28,900',
    deals: 7,
    lastContact: '2024-01-22',
    location: 'Berlin, Germany',
  },
  {
    id: 5,
    name: 'Digital Dynamics',
    contact: 'James Wilson',
    email: 'james@digital.com',
    phone: '+1 (555) 567-8901',
    type: 'Vendor',
    status: 'Inactive',
    revenue: '$15,200',
    deals: 4,
    lastContact: '2023-12-10',
    location: 'Toronto, Canada',
  },
];

const stats = [
  {
    label: 'Total Customers',
    value: '2,543',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    label: 'Active Clients',
    value: '1,842',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-500',
  },
  {
    label: 'Total Revenue',
    value: '$1.2M',
    icon: DollarSign,
    color: 'from-purple-500 to-pink-500',
  },
];

export default function CustomersPage() {
  const [customersList, setCustomersList] = useState(customers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  // New Customer Form State
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    type: 'Client',
    location: '',
    notes: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddCustomer = () => {
    const customer = {
      id: customersList.length + 1,
      name: newCustomer.name || 'New Company',
      contact: newCustomer.contact || 'New Contact',
      email: newCustomer.email || 'email@example.com',
      phone: newCustomer.phone || '',
      type: newCustomer.type || 'Client',
      status: 'Active',
      revenue: '$0',
      deals: 0,
      lastContact: new Date().toISOString().split('T')[0],
      location: newCustomer.location || 'Unknown',
    };

    setCustomersList([...customersList, customer]);
    setIsDialogOpen(false);
    setNewCustomer({
      name: '',
      contact: '',
      email: '',
      phone: '',
      type: 'Client',
      location: '',
      notes: ''
    });
  };

  const filteredCustomers = customersList.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      selectedType === 'all' || customer.type === selectedType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900  dark:text-white mb-2">
            Customer Management
          </h1>
          <p className="text-slate-600  :text-slate-400">
            Manage your customer relationships and track interactions
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30">
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>
                Create a new customer profile with their information
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  placeholder="Acme Corporation"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Person</Label>
                <Input
                  id="contact"
                  placeholder="John Doe"
                  value={newCustomer.contact}
                  onChange={(e) => setNewCustomer({ ...newCustomer, contact: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@acme.com"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="+1 (555) 123-4567"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Customer Type</Label>
                <Select value={newCustomer.type} onValueChange={(val) => setNewCustomer({ ...newCustomer, type: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lead">Lead</SelectItem>
                    <SelectItem value="Client">Client</SelectItem>
                    <SelectItem value="Vendor">Vendor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="New York, USA"
                  value={newCustomer.location}
                  onChange={(e) => setNewCustomer({ ...newCustomer, location: e.target.value })}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional information about the customer..."
                  rows={3}
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                onClick={handleAddCustomer}
              >
                Create Customer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={stat.label}
            className="border-0 shadow-lg bg-white  :bg-slate-800 hover:shadow-xl transition-all duration-300"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600  :text-slate-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-slate-900  dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-14 h-14 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-lg bg-white  :bg-slate-800">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <CardTitle className="text-slate-900  :text-white">All Customers</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Lead">Leads</SelectItem>
                  <SelectItem value="Client">Clients</SelectItem>
                  <SelectItem value="Vendor">Vendors</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Last Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow
                    key={customer.id}
                    className="hover:bg-slate-50  :hover:bg-slate-700 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                            {customer.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-slate-900  :text-white">
                            {customer.name}
                          </p>
                          <div className="flex items-center text-xs text-slate-500  :text-slate-400">
                            <MapPin className="w-3 h-3 mr-1" />
                            {customer.location}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-900  :text-white">
                          {customer.contact}
                        </p>
                        <div className="flex items-center text-xs text-slate-500  :text-slate-400">
                          <Mail className="w-3 h-3 mr-1" />
                          {customer.email}
                        </div>
                        <div className="flex items-center text-xs text-slate-500  :text-slate-400">
                          <Phone className="w-3 h-3 mr-1" />
                          {customer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          customer.type === 'Client'
                            ? 'bg-blue-50  :bg-blue-950 text-blue-600  :text-blue-400 border-blue-200  :border-blue-800'
                            : customer.type === 'Lead'
                              ? 'bg-purple-50  :bg-purple-950 text-purple-600  :text-purple-400 border-purple-200  :border-purple-800'
                              : 'bg-orange-50  :bg-orange-950 text-orange-600  :text-orange-400 border-orange-200  :border-orange-800'
                        }
                      >
                        {customer.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          customer.status === 'Active'
                            ? 'bg-green-50  :bg-green-950 text-green-600  :text-green-400 border-green-200  :border-green-800'
                            : 'bg-gray-50  :bg-gray-950 text-gray-600  :text-gray-400 border-gray-200  :border-gray-800'
                        }
                      >
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-slate-900  :text-white">
                          {customer.revenue}
                        </p>
                        <p className="text-xs text-slate-500  :text-slate-400">
                          {customer.deals} deals
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-slate-600  dark:text-slate-400">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(customer.lastContact).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
