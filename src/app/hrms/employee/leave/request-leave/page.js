"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/common/Breadcrumb';
import Label from '../../../components/form/Label';
import InputField from '../../../components/form/input/InputField';
import DateRangePicker from '../../../components/form/date/DateRangePicker';
import { leaveRequestService } from '@/services/leaveRequestService';
import { toast } from 'sonner';
import { Send, Calendar, FileText, Info } from 'lucide-react';

export default function RequestLeavePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [formData, setFormData] = useState({
        type: '',
        dates: [],
        reason: '',
    });

    useEffect(() => {
        const fetchLeaveTypes = async () => {
            try {
                const types = await leaveRequestService.getLeaveTypesDropdown();
                setLeaveTypes(types);
            } catch (error) {
                toast.error("Failed to load leave types");
            }
        };
        fetchLeaveTypes();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.type || formData.dates.length < 2 || !formData.reason) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            setIsLoading(true);
            const data = {
                type: formData.type,
                startDate: formData.dates[0].toISOString().split('T')[0],
                endDate: formData.dates[1].toISOString().split('T')[0],
                reason: formData.reason,
            };
            await leaveRequestService.createLeaveRequest(data);
            toast.success("Leave request submitted successfully");
            router.push('/hrms/employee/attendance/my-leaves');
        } catch (error) {
            toast.error("Failed to submit leave request");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <Breadcrumb
                title="Request Leave"
                subtitle="Submit a new leave application for approval"
            />

            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                    <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
                        <Calendar size={24} />
                        <h2 className="text-xl font-bold">New Leave Application</h2>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Leave Type */}
                        <div className="space-y-2">
                            <Label htmlFor="type">Leave Type <span className="text-red-500">*</span></Label>
                            <select
                                id="type"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-sm focus:ring-2 focus:ring-blue-500 transition"
                            >
                                <option value="">Select Type</option>
                                {leaveTypes.map(type => (
                                    <option key={type.id} value={type.name}>{type.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Date Range */}
                        <div className="space-y-2">
                            <Label>Date Range <span className="text-red-500">*</span></Label>
                            <DateRangePicker
                                value={formData.dates}
                                onChange={(dates) => setFormData({ ...formData, dates })}
                                placeholder="Select Start and End Date"
                            />
                        </div>
                    </div>

                    {/* Reason */}
                    <div className="space-y-2">
                        <Label htmlFor="reason">Reason for Leave <span className="text-red-500">*</span></Label>
                        <div className="relative">
                            <textarea
                                id="reason"
                                rows={4}
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                placeholder="Please provide a brief reason for your leave request..."
                                className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent text-sm focus:ring-2 focus:ring-blue-500 transition resize-none"
                            ></textarea>
                            <FileText size={18} className="absolute right-4 top-4 text-gray-400" />
                        </div>
                    </div>

                    {/* Important Note */}
                    <div className="flex gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 text-sm text-blue-700 dark:text-blue-300">
                        <Info size={20} className="shrink-0" />
                        <p>
                            Your request will be sent to your manager for approval.
                            Please ensure you have enough leave balance before submitting.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {isLoading ? "Submitting..." : <><Send size={18} /> Submit Application</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
