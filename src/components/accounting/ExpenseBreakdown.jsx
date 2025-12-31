'use client';

import { Card } from '@/components/ui/card';

export function ExpenseBreakdown({ data }) {
    if (!data || !data.breakdown) return null;

    // Sort by percentage desc
    const sortedData = [...data.breakdown].sort((a, b) => b.percentage - a.percentage);

    return (
        <Card className="p-6 h-full">
            <div className="mb-6">
                <h3 className="font-semibold">Top Expenses</h3>
                <p className="text-sm text-muted-foreground">Spend by category</p>
            </div>

            <div className="space-y-5">
                {sortedData.map((item, index) => (
                    <div key={index} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{item.category}</span>
                            <span className="text-muted-foreground">₹{item.amount.toLocaleString()}</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-red-500 rounded-full transition-all duration-500"
                                style={{ width: `${item.percentage}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Spend</span>
                <span className="font-bold text-red-600">₹{data.totalExpense.toLocaleString()}</span>
            </div>
        </Card>
    );
}
