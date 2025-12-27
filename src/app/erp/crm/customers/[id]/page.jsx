'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { crmService } from '@/services/crmService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Mail, Phone, MapPin, Building, CreditCard, Loader2 } from 'lucide-react';
import CustomerInvoices from './Invoices';
import CustomerPayments from './Payments';
import CustomerActivity from './Activity';

export default function CustomerDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [customer, setCustomer] = useState(null);
    const [data, setData] = useState({ invoices: [], payments: [], activity: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cust, inv, pay, act] = await Promise.all([
                    crmService.getCustomerById(id),
                    crmService.getInvoicesByCustomer(id),
                    crmService.getPaymentsByCustomer(id),
                    crmService.getActivities(id)
                ]);
                setCustomer(cust);
                setData({ invoices: inv, payments: pay, activity: act });
            } catch (error) {
                console.error('Failed to fetch customer data', error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchData();
    }, [id]);

    if (loading) {
        return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    if (!customer) {
        return <div className="p-8 text-center">Customer not found</div>;
    }

    return (
        <div className="space-y-6 p-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{customer.name}</h2>
                    <p className="text-muted-foreground">{customer.company}</p>
                </div>
                <Badge className="ml-auto" variant={customer.status === 'Active' ? 'default' : 'secondary'}>{customer.status}</Badge>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="invoices">Invoices</TabsTrigger>
                    <TabsTrigger value="payments">Payments</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${customer.totalSpent.toLocaleString()}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Customer Type</CardTitle>
                                <Building className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{customer.type}</div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{customer.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{customer.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{customer.address}</span>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="invoices">
                    <CustomerInvoices invoices={data.invoices} />
                </TabsContent>

                <TabsContent value="payments">
                    <CustomerPayments payments={data.payments} />
                </TabsContent>

                <TabsContent value="activity">
                    <CustomerActivity activity={data.activity} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
