import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import {
    Plus,
    ShoppingCart,
    UserPlus,
    Receipt,
    BarChart2,
    Package,
    Settings,
    ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const actions = [
    {
        title: 'Financials',
        desc: 'Generate invoices & billing',
        icon: Receipt,
        href: '/erp/accounting/invoices/create',
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        border: 'hover:border-blue-500/20'
    },
    {
        title: 'Retail POS',
        desc: 'Process sales transactions',
        icon: ShoppingCart,
        href: '/erp/pos/billing',
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
        border: 'hover:border-emerald-500/20'
    },
    {
        title: 'Inventory',
        desc: 'Manage stock & products',
        icon: Package,
        href: '/erp/pos/products/create',
        color: 'text-amber-500',
        bg: 'bg-amber-500/10',
        border: 'hover:border-amber-500/20'
    },
    {
        title: 'CRM Hub',
        desc: 'Manage customer relations',
        icon: UserPlus,
        href: '/erp/crm/customers/create',
        color: 'text-indigo-500',
        bg: 'bg-indigo-500/10',
        border: 'hover:border-indigo-500/20'
    },
    {
        title: 'Analytics',
        desc: 'Deep performace insights',
        icon: BarChart2,
        href: '/erp/pos/reports',
        color: 'text-rose-500',
        bg: 'bg-rose-500/10',
        border: 'hover:border-rose-500/20'
    },
    {
        title: 'Settings',
        desc: 'System configurations',
        icon: Settings,
        href: '/erp/admin/settings',
        color: 'text-slate-500',
        bg: 'bg-slate-500/10',
        border: 'hover:border-slate-500/20'
    },
];

export const QuickActionGrid = () => {
    const router = useRouter();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {actions.map((action, i) => (
                <div
                    key={i}
                    className={cn(
                        "group relative p-6 rounded-[1.5rem] bg-card border border-border shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1.5 cursor-pointer overflow-hidden",
                        action.border
                    )}
                    onClick={() => router.push(action.href)}
                >
                    {/* Subtle Background Glow */}
                    <div className={cn("absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity", action.bg)} />

                    <div className="relative z-10 flex flex-col gap-4">
                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110",
                            action.bg,
                            action.color
                        )}>
                            <action.icon size={24} />
                        </div>

                        <div className="space-y-1">
                            <h3 className="font-black text-lg tracking-tight group-hover:text-primary transition-colors">
                                {action.title}
                            </h3>
                            <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
                                {action.desc}
                            </p>
                        </div>

                        <div className="pt-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                            Launch Module <ArrowRight size={12} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
