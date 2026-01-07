'use client';

import { Card } from '@/components/ui/card';
import { Calendar as CalendarIcon } from 'lucide-react';

export function FinancialCalendar() {
    const today = new Date();
    const events = [
        { day: today.getDate() + 2, month: 'Current', title: 'GST Payment Due', type: 'tax' },
        { day: 15, month: 'Next', title: 'Advance Tax', type: 'tax' },
        { day: 1, month: 'Next', title: 'Office Rent', type: 'recurring' },
        { day: 5, month: 'Next', title: 'Payroll Run', type: 'payroll' }
    ];

    const getTypeColor = (type) => {
        switch (type) {
            case 'tax': return 'bg-red-100 text-red-700 border-red-200';
            case 'recurring': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'payroll': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <Card className="h-full">
            <div className="p-4 border-b flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm">Upcoming</h3>
            </div>
            <div className="p-3 space-y-3">
                {events.map((evt, i) => (
                    <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center justify-center w-10 h-10 bg-slate-100 rounded-lg border border-slate-200">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">{evt.month === 'Current' ? 'THIS' : 'NEXT'}</span>
                            <span className="text-lg font-bold leading-none">{evt.day}</span>
                        </div>
                        <div className="flex-1 py-0.5">
                            <p className="text-sm font-medium leading-none mb-1.5">{evt.title}</p>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getTypeColor(evt.type)} capitalize`}>
                                {evt.type}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
