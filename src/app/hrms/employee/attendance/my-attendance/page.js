"use client";
import { useState, useEffect, useMemo } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import {
    useReactTable,
    getCoreRowModel,
    flexRender
} from '@tanstack/react-table';
import { attendanceService } from '@/services/attendanceService';
import Pagination from '@/components/common/Pagination';
import { Loader2, Clock, LogIn, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export default function MyAttendancePage() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [totalItems, setTotalItems] = useState(0);

    const fetchAttendance = async () => {
        try {
            setIsLoading(true);
            const response = await attendanceService.getMyAttendance({
                page: pagination.pageIndex + 1,
                limit: pagination.pageSize
            });
            setData(response.data || []);
            setTotalItems(response.pagination?.totalItems || 0);
        } catch (error) {
            toast.error("Failed to load attendance data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, [pagination.pageIndex, pagination.pageSize]);

    const columns = useMemo(() => [
        {
            accessorKey: 'date',
            header: 'Date',
            cell: info => <span className="text-sm font-medium">{info.getValue()}</span>,
        },
        {
            accessorKey: 'clockIn',
            header: 'Clock In',
            cell: info => <span className="text-sm text-gray-600 dark:text-gray-400">{info.getValue() || '--:--'}</span>,
        },
        {
            accessorKey: 'clockOut',
            header: 'Clock Out',
            cell: info => <span className="text-sm text-gray-600 dark:text-gray-400">{info.getValue() || '--:--'}</span>,
        },
        {
            accessorKey: 'workHours',
            header: 'Work Hours',
            cell: info => <span className="text-sm font-medium text-blue-600">{info.getValue()} hrs</span>,
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: info => {
                const status = info.getValue();
                const colors = {
                    'Present': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
                    'Absent': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
                    'Late': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
                };
                return (
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100'}`}>
                        {status}
                    </span>
                );
            },
        },
    ], []);

    const table = useReactTable({
        data,
        columns,
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: Math.ceil(totalItems / pagination.pageSize),
    });

    const handleClockIn = async () => {
        try {
            await attendanceService.clockIn('EMP001');
            toast.success("Clocked in successfully");
            fetchAttendance();
        } catch (error) {
            toast.error("Clock-in failed");
        }
    };

    const handleClockOut = async () => {
        try {
            // In a real app, we'd find the current active record
            const todayRecord = data.find(r => r.date === new Date().toISOString().split('T')[0] && !r.clockOut);
            if (todayRecord) {
                await attendanceService.clockOut(todayRecord.id);
                toast.success("Clocked out successfully");
                fetchAttendance();
            } else {
                toast.error("No active clock-in found for today");
            }
        } catch (error) {
            toast.error("Clock-out failed");
        }
    };

    return (
        <div className="space-y-6">
            <Breadcrumb
                title="My Attendance"
                subtitle="Manage and track your daily attendance"
                rightContent={
                    <div className="flex gap-3">
                        <button
                            onClick={handleClockIn}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm"
                        >
                            <LogIn size={18} /> Clock In
                        </button>
                        <button
                            onClick={handleClockOut}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-sm"
                        >
                            <LogOut size={18} /> Clock Out
                        </button>
                    </div>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Working Hours</p>
                            <h3 className="text-2xl font-bold">8.5 hrs</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400">
                            <LogIn size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Days Present</p>
                            <h3 className="text-2xl font-bold">22 Days</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
                            <LogOut size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Late Comings</p>
                            <h3 className="text-2xl font-bold">2 Days</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                            <span className="text-gray-500">Loading your attendance...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : data.length > 0 ? (
                                table.getRowModel().rows.map(row => (
                                    <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                                        No attendance records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    currentPage={table.getState().pagination.pageIndex + 1}
                    totalItems={totalItems}
                    itemsPerPage={table.getState().pagination.pageSize}
                    onPageChange={(page) => table.setPageIndex(page - 1)}
                    onItemsPerPageChange={(size) => {
                        table.setPageSize(size);
                        table.setPageIndex(0);
                    }}
                    className="p-4 border-t border-gray-100 dark:border-gray-700"
                />
            </div>
        </div>
    );
}
