'use client';

import { useRouter } from 'next/navigation';
import {
    BarChart3,
    TrendingUp,
    Scale,
    FileSpreadsheet,
    ArrowRight,
    PieChart,
    Calendar,
    DollarSign
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ReportsDashboardPage() {
    const router = useRouter();

    const reports = [
        {
            category: 'Financial Statements',
            items: [
                {
                    title: 'Profit & Loss',
                    description: 'Income, expenses, and net profit for a period',
                    icon: TrendingUp,
                    color: 'text-green-600 bg-green-100',
                    href: '/erp/accounting/reports/profit-loss',
                    status: 'Ready'
                },
                {
                    title: 'Balance Sheet',
                    description: 'Assets, liabilities, and equity overview',
                    icon: Scale,
                    color: 'text-blue-600 bg-blue-100',
                    href: '/erp/accounting/reports/balance-sheet',
                    status: 'Ready'
                },
                {
                    title: 'Trial Balance',
                    description: 'List of all general ledger account balances',
                    icon: FileSpreadsheet,
                    color: 'text-purple-600 bg-purple-100',
                    href: '/erp/accounting/reports/trial-balance',
                    status: 'Audit Ready'
                }
            ]
        },
        {
            category: 'Taxation',
            items: [
                {
                    title: 'GSTR-1 Summary',
                    description: 'Outward supplies and tax liability details',
                    icon: BarChart3,
                    color: 'text-orange-600 bg-orange-100',
                    href: '/erp/accounting/taxation/gst/gstr1',
                    status: 'Monthly'
                },
                {
                    title: 'GSTR-3B View',
                    description: 'Monthly self-declaration summary return',
                    icon: PieChart,
                    color: 'text-indigo-600 bg-indigo-100',
                    href: '/erp/accounting/taxation/gst/gstr3b',
                    status: 'Monthly'
                }
            ]
        },
        {
            category: 'Advanced Analysis',
            items: [
                {
                    title: 'Cash Flow',
                    description: 'Inflow and outflow of cash (Direct Method)',
                    icon: DollarSign,
                    color: 'text-emerald-600 bg-emerald-100',
                    href: '/erp/accounting/reports/cash-flow',
                    status: 'Ready'
                },
                {
                    title: 'Aged Receivables',
                    description: 'Outstanding invoices by age (30/60/90 days)',
                    icon: Calendar,
                    color: 'text-cyan-600 bg-cyan-100',
                    href: '/erp/accounting/reports/receivables',
                    status: 'Ready'
                },
                {
                    title: 'Revenue Analytics',
                    description: 'Sales trends, top customers, and product revenue',
                    icon: TrendingUp,
                    color: 'text-indigo-600 bg-indigo-100',
                    href: '/erp/accounting/reports/revenue',
                    status: 'New'
                },
                {
                    title: 'Expense Analysis',
                    description: 'Cost breakdown by category and vendor',
                    icon: TrendingUp, // Using existing icon for now
                    color: 'text-red-600 bg-red-100',
                    href: '/erp/accounting/reports/expenses',
                    status: 'New'
                }
            ]
        }
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reports Center</h1>
                    <p className="text-muted-foreground mt-1">
                        Comprehensive financial insights and audit statements
                    </p>
                </div>
            </div>

            <div className="space-y-8">
                {reports.map((section, idx) => (
                    <div key={idx} className="space-y-4">
                        <h2 className="text-lg font-semibold border-b pb-2">{section.category}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {section.items.map((report, rIdx) => {
                                const Icon = report.icon;
                                return (
                                    <Card
                                        key={rIdx}
                                        className="p-6 hover:bg-muted/50 transition-colors cursor-pointer group"
                                        onClick={() => report.href && router.push(report.href)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className={`p-3 rounded-lg ${report.color}`}>
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            {report.status === 'Coming Soon' ? (
                                                <Badge variant="outline" className="text-muted-foreground">Coming Soon</Badge>
                                            ) : (
                                                <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-50">
                                                    {report.status}
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="mt-4 space-y-2">
                                            <h3 className="font-semibold group-hover:text-primary transition-colors flex items-center gap-2">
                                                {report.title}
                                                {report.status !== 'Coming Soon' && <ArrowRight className="h-4 w-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {report.description}
                                            </p>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
