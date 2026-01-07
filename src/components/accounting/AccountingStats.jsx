import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function AccountingStats({ stats }) {
    const statCards = [
        {
            title: 'Total Assets',
            value: stats.totalAssets || 0,
            gradient: 'bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm',
            border: 'border-green-100 dark:border-green-900/30',
            textColor: 'text-foreground',
            labelColor: 'text-muted-foreground',
            icon: TrendingUp,
            iconColor: 'text-green-600'
        },
        {
            title: 'Total Liabilities',
            value: stats.totalLiabilities || 0,
            gradient: 'bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm',
            border: 'border-red-100 dark:border-red-900/30',
            textColor: 'text-foreground',
            labelColor: 'text-muted-foreground',
            icon: TrendingDown,
            iconColor: 'text-red-600'
        },
        {
            title: 'Net Worth',
            value: (stats.totalAssets || 0) - (stats.totalLiabilities || 0),
            gradient: 'bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/30 dark:to-slate-900',
            border: 'border-indigo-100 dark:border-indigo-900/30',
            textColor: 'text-indigo-700 dark:text-indigo-300',
            labelColor: 'text-indigo-600/80 dark:text-indigo-400/80',
            icon: Minus,
            iconColor: 'text-indigo-600'
        },
        {
            title: 'Total Income',
            value: stats.totalIncome || 0,
            gradient: 'bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm',
            border: 'border-blue-100 dark:border-blue-900/30',
            textColor: 'text-foreground',
            labelColor: 'text-muted-foreground',
            icon: TrendingUp,
            iconColor: 'text-blue-600'
        },
        {
            title: 'Total Expenses',
            value: stats.totalExpenses || 0,
            gradient: 'bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm',
            border: 'border-orange-100 dark:border-orange-900/30',
            textColor: 'text-foreground',
            labelColor: 'text-muted-foreground',
            icon: TrendingDown,
            iconColor: 'text-orange-600'
        },
        {
            title: 'Net Profit',
            value: (stats.totalIncome || 0) - (stats.totalExpenses || 0),
            gradient: 'bg-gradient-to-br from-teal-50 to-white dark:from-teal-950/30 dark:to-slate-900',
            border: 'border-teal-100 dark:border-teal-900/30',
            textColor: 'text-teal-700 dark:text-teal-300',
            labelColor: 'text-teal-600/80 dark:text-teal-400/80',
            icon: TrendingUp,
            iconColor: 'text-teal-600'
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {statCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <Card
                        key={index}
                        className={`p-4 border ${stat.border} ${stat.gradient} transition-all duration-300 hover:shadow-premium hover:-translate-y-1 shadow-sm`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className={`text-xs font-semibold uppercase tracking-wider ${stat.labelColor}`}>
                                {stat.title}
                            </div>
                            <div className={`p-1.5 rounded-full bg-white/50 dark:bg-black/10 ${stat.iconColor}`}>
                                <Icon className="h-4 w-4" />
                            </div>
                        </div>
                        <div className={`text-2xl font-bold tracking-tight ${stat.textColor}`}>
                            ₹{stat.value.toLocaleString('en-IN')}
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
