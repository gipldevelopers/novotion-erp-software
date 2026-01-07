'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Download,
    ArrowLeft,
    Info,
    AlertTriangle,
    CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { taxationService } from '@/services/taxationService';
import { toast } from 'sonner';

export default function GSTR3BPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        loadData();
    }, [month, year]);

    const loadData = async () => {
        try {
            setLoading(true);
            const result = await taxationService.getGSTR3BData(month, year);
            setData(result);
        } catch (error) {
            toast.error('Failed to load GSTR-3B data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const formatCurrency = (val) => `₹${val.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">GSTR-3B: Monthly Return</h1>
                    <p className="text-muted-foreground">{data.period}</p>
                </div>
                <div className="ml-auto flex gap-2">
                    <select
                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                        value={month}
                        onChange={(e) => setMonth(parseInt(e.target.value))}
                    >
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {new Date(0, i).toLocaleString('default', { month: 'short' })}
                            </option>
                        ))}
                    </select>
                    <select
                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                        value={year}
                        onChange={(e) => setYear(parseInt(e.target.value))}
                    >
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                    </select>
                    <Button variant="outline">Download JSON</Button>
                </div>
            </div>

            {/* 3.1 Outward Supplies */}
            <Card className="overflow-hidden">
                <div className="p-4 bg-muted/50 border-b flex items-center justify-between">
                    <h3 className="font-semibold">3.1 Details of Outward Supplies</h3>
                    <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                <table className="w-full text-sm">
                    <thead className="bg-muted/20 text-xs uppercase text-muted-foreground">
                        <tr>
                            <th className="p-4 text-left font-medium">Nature of Supplies</th>
                            <th className="p-4 text-right font-medium">Taxable Value</th>
                            <th className="p-4 text-right font-medium">IGST</th>
                            <th className="p-4 text-right font-medium">CGST</th>
                            <th className="p-4 text-right font-medium">SGST</th>
                            <th className="p-4 text-right font-medium">Cess</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        <tr>
                            <td className="p-4 font-medium">(a) Outward Taxable Supplies</td>
                            <td className="p-4 text-right">{formatCurrency(data.outwardSupplies.taxableValue)}</td>
                            <td className="p-4 text-right">{formatCurrency(data.outwardSupplies.igst)}</td>
                            <td className="p-4 text-right">{formatCurrency(data.outwardSupplies.cgst)}</td>
                            <td className="p-4 text-right">{formatCurrency(data.outwardSupplies.sgst)}</td>
                            <td className="p-4 text-right">{formatCurrency(data.outwardSupplies.cess)}</td>
                        </tr>
                    </tbody>
                </table>
            </Card>

            {/* 4. Eligible ITC */}
            <Card className="overflow-hidden">
                <div className="p-4 bg-muted/50 border-b flex items-center justify-between">
                    <h3 className="font-semibold">4. Eligible ITC</h3>
                    <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                <table className="w-full text-sm">
                    <thead className="bg-muted/20 text-xs uppercase text-muted-foreground">
                        <tr>
                            <th className="p-4 text-left font-medium">Details</th>
                            <th className="p-4 text-right font-medium">IGST</th>
                            <th className="p-4 text-right font-medium">CGST</th>
                            <th className="p-4 text-right font-medium">SGST</th>
                            <th className="p-4 text-right font-medium">Cess</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        <tr>
                            <td className="p-4 font-medium">(A) ITC Available (Import, Inward Supplies)</td>
                            <td className="p-4 text-right">{formatCurrency(data.itc.igst)}</td>
                            <td className="p-4 text-right">{formatCurrency(data.itc.cgst)}</td>
                            <td className="p-4 text-right">{formatCurrency(data.itc.sgst)}</td>
                            <td className="p-4 text-right">{formatCurrency(data.itc.cess)}</td>
                        </tr>
                    </tbody>
                </table>
            </Card>

            {/* 6.1 Payment of Tax */}
            <Card className="p-6 bg-slate-900 text-white border-slate-800">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                        6.1 Payment of Tax
                    </h3>
                    <div className="text-right">
                        <span className="text-sm text-slate-400">Total Payable</span>
                        <div className="text-2xl font-bold">{formatCurrency(data.payment.taxPayable)}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded bg-slate-800/50 border border-slate-700">
                        <span className="text-sm text-slate-400">Output Tax Liability</span>
                        <div className="text-lg font-semibold mt-1">
                            {formatCurrency(data.outwardSupplies.igst + data.outwardSupplies.cgst + data.outwardSupplies.sgst)}
                        </div>
                    </div>
                    <div className="p-4 rounded bg-slate-800/50 border border-slate-700">
                        <span className="text-sm text-slate-400">Input Tax Credit Available</span>
                        <div className="text-lg font-semibold mt-1 text-green-400">
                            {formatCurrency(data.itc.igst + data.itc.cgst + data.itc.sgst)}
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <Button variant="outline" className="bg-transparent text-white border-slate-600 hover:bg-slate-800 hover:text-white">
                        Create Challan
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                        File GSTR-3B
                    </Button>
                </div>
            </Card>
        </div>
    );
}
