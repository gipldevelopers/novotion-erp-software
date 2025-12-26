"use client";
import { useState, useEffect, useMemo } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import {
    useReactTable,
    getCoreRowModel,
    flexRender
} from '@tanstack/react-table';
import { leaveRequestService } from '@/services/leaveRequestService';
import Pagination from '@/components/common/Pagination';
import { Loader2, Calendar, FileText, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function MyLeavesPage() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const fetchLeaves = async () => {
        try {
            setIsLoading(true);
            const response = await leaveRequestService.getAllLeaveRequests();
            // In a real app, we would filter for the current user
            setData(response || []);
        } catch (error) {
            toast.error("Failed to load leave requests");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, [pagination.pageIndex, pagination.pageSize]);

    const columns = useMemo(() => [
        {
            accessorKey: 'type',
            header: 'Leave Type',
            cell: info => <span className="text-sm font-medium">{info.getValue()}</span>,
        },
        {
            accessorKey: 'startDate',
            header: 'Start Date',
            cell: info => <span className="text-sm text-gray-600 dark:text-gray-400">{info.getValue()}</span>,
        },
        {
            accessorKey: 'endDate',
            header: 'End Date',
            cell: info => <span className="text-sm text-gray-600 dark:text-gray-400">{info.getValue()}</span>,
        },
        {
            accessorKey: 'reason',
            header: 'Reason',
            cell: info => <span className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[200px]">{info.getValue()}</span>,
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: info => {
                const status = info.getValue();
                const colors = {
                    'Approved': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
                    'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
                    'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
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
    });

    return (
        <div className="space-y-6">
            <Breadcrumb
                title="My Leaves"
                subtitle="Manage your leave applications and balance"
                rightContent={
                    <Link
                        href="/hrms/employee/leave/request-leave"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
                    >
                        <PlusCircle size={18} /> Request Leave
                    </Link>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Annual Leave", value: "24", total: "30", color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Sick Leave", value: "8", total: "12", color: "text-green-600", bg: "bg-green-50" },
                    { label: "Casual Leave", value: "6", total: "10", color: "text-purple-600", bg: "bg-purple-50" },
                    { label: "Unpaid Leave", value: "2", total: "∞", color: "text-red-600", bg: "bg-red-50" },
                ].map((item, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{item.label}</p>
                        <div className="flex items-end gap-2">
                            <h3 className={`text-2xl font-bold ${item.color}`}>{item.value}</h3>
                            <span className="text-gray-400 text-sm mb-1">/ {item.total} Days</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="font-bold">Leave History</h2>
                    <div className="flex gap-2">
                        <select className="text-sm border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700">
                            <option>All Status</option>
                            <option>Approved</option>
                            <option>Pending</option>
                            <option>Rejected</option>
                        </select>
                    </div>
                </div>
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
                                        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
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
                                        No leave applications found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    currentPage={table.getState().pagination.pageIndex + 1}
                    totalItems={data.length}
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
