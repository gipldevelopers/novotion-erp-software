"use client";
import { useState, useEffect, useMemo } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import {
    useReactTable,
    getCoreRowModel,
    flexRender
} from '@tanstack/react-table';
import { payrollService } from '@/services/payrollService';
import Pagination from '@/components/common/Pagination';
import { Loader2, Download, Eye, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function PaySlipsPage() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [totalItems, setTotalItems] = useState(0);

    const fetchPayslips = async () => {
        try {
            setIsLoading(true);
            const response = await payrollService.getMyPayslips({
                page: pagination.pageIndex + 1,
                limit: pagination.pageSize
            });
            setData(response.data || []);
            setTotalItems(response.pagination?.totalItems || 0);
        } catch (error) {
            toast.error("Failed to load payslips");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPayslips();
    }, [pagination.pageIndex, pagination.pageSize]);

    const columns = useMemo(() => [
        {
            accessorKey: 'month',
            header: 'Month',
            cell: info => <span className="text-sm font-medium">{info.getValue()}</span>,
        },
        {
            accessorKey: 'date',
            header: 'Payment Date',
            cell: info => <span className="text-sm text-gray-600 dark:text-gray-400">{info.getValue()}</span>,
        },
        {
            accessorKey: 'basicSalary',
            header: 'Basic Salary',
            cell: info => <span className="text-sm text-gray-600 dark:text-gray-400">${info.getValue().toLocaleString()}</span>,
        },
        {
            accessorKey: 'netSalary',
            header: 'Net Salary',
            cell: info => <span className="text-sm font-bold text-blue-600">${info.getValue().toLocaleString()}</span>,
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: info => (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    {info.getValue()}
                </span>
            ),
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: () => (
                <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition" title="View">
                        <Eye size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 transition" title="Download">
                        <Download size={18} />
                    </button>
                </div>
            ),
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

    return (
        <div className="space-y-6">
            <Breadcrumb
                title="My Payslips"
                subtitle="View and download your monthly salary statements"
            />

            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600">
                        <FileText size={20} />
                    </div>
                    <h2 className="font-bold">Salary History</h2>
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
                                        No payslips found.
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
