"use client";
import { useState, useEffect } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import { performanceService } from '@/services/performanceService';
import { Loader2, TrendingUp, Star, Award, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function PerformanceAppraisalPage() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAppraisals = async () => {
        try {
            setIsLoading(true);
            const response = await performanceService.getMyAppraisals();
            setData(response || []);
        } catch (error) {
            toast.error("Failed to load appraisal data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAppraisals();
    }, []);

    return (
        <div className="space-y-6">
            <Breadcrumb
                title="Performance Appraisal"
                subtitle="Track your professional growth and reviews"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: "Current Rating", value: "4.5 / 5.0", icon: <Star />, color: "text-amber-500", bg: "bg-amber-50" },
                    { title: "Review Status", value: "Completed", icon: <TrendingUp />, color: "text-green-600", bg: "bg-green-50" },
                    { title: "Next Review", value: "15 Jan 2025", icon: <Award />, color: "text-blue-600", bg: "bg-blue-50" },
                ].map((item, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 ${item.bg} dark:bg-opacity-10 rounded-lg ${item.color}`}>
                                {item.icon}
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{item.title}</p>
                                <h3 className="text-xl font-bold">{item.value}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
                    <MessageSquare size={20} className="text-blue-500" />
                    <h2 className="font-bold">Appraisal History</h2>
                </div>

                <div className="p-6">
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        </div>
                    ) : data.length > 0 ? (
                        <div className="space-y-6">
                            {data.map((item, i) => (
                                <div key={i} className="p-6 border border-gray-100 dark:border-gray-700 rounded-2xl hover:border-blue-200 dark:hover:border-blue-800 transition shadow-sm hover:shadow-md">
                                    <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-800 dark:text-white">{item.period} Review</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Date: {item.date}</p>
                                        </div>
                                        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl border border-blue-100 dark:border-blue-800 self-start text-blue-700 dark:text-blue-300">
                                            <Star size={18} className="fill-blue-500 text-blue-500" />
                                            <span className="font-bold text-lg">{item.score}</span>
                                            <span className="text-sm opacity-60">/ 5.0</span>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl italic text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                        "{item.feedback}"
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center py-12 text-gray-500">No appraisal history found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
