"use client";
import { useState, useEffect } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import { holidayService } from '@/services/holidayService';
import { Loader2, Calendar as CalendarIcon, Gift, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export default function HolidayPage() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchHolidays = async () => {
        try {
            setIsLoading(true);
            const response = await holidayService.getAllHolidays();
            setData(response || []);
        } catch (error) {
            toast.error("Failed to load holiday data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHolidays();
    }, []);

    const getMonthName = (dateStr) => {
        return new Date(dateStr).toLocaleString('default', { month: 'long' });
    };

    const getDay = (dateStr) => {
        return new Date(dateStr).getDate();
    };

    return (
        <div className="space-y-6">
            <Breadcrumb
                title="Holidays & Events"
                subtitle="Upcoming company holidays and public events for 2025"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                ) : data.length > 0 ? (
                    data.map((holiday, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-md transition group">
                            <div className="p-6 flex items-start gap-4">
                                <div className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                    <span className="text-xs uppercase font-bold leading-none">{getMonthName(holiday.date).substring(0, 3)}</span>
                                    <span className="text-2xl font-black leading-none">{getDay(holiday.date)}</span>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{holiday.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <CalendarIcon size={14} />
                                        <span>{new Date(holiday.date).toLocaleDateString('default', { weekday: 'long' })}</span>
                                    </div>
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                                        <Gift size={10} />
                                        {holiday.type}
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs text-gray-400">
                                <div className="flex items-center gap-1">
                                    <MapPin size={12} />
                                    <span>All Regions</span>
                                </div>
                                <span>Upcoming</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="col-span-full text-center py-12 text-gray-500">No holidays found.</p>
                )}
            </div>
        </div>
    );
}
