// Updated: 2025-12-27
'use client';

import React from 'react';
import { companyDetails } from '@/services/posMockData';
import { Separator } from '@/components/ui/separator';

const InvoiceTemplate = ({ invoice }) => {
    const company = companyDetails;

    // Calculate tax breakdown (assuming same state = CGST+SGST, different state = IGST)
    const isSameState = invoice.client?.gstin?.substring(0, 2) === company.gstin.substring(0, 2);
    const cgst = isSameState ? invoice.taxTotal / 2 : 0;
    const sgst = isSameState ? invoice.taxTotal / 2 : 0;
    const igst = !isSameState ? invoice.taxTotal : 0;

    return (
        <div className="bg-white text-black p-8 max-w-4xl mx-auto" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            {/* Header */}
            <div className="border-2 border-black">
                {/* Company Details */}
                <div className="p-4 border-b-2 border-black">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold mb-1">{company.name}</h1>
                            <div className="text-sm space-y-0.5">
                                <p>{company.address}</p>
                                <p>{company.city}, {company.state} - {company.pincode}</p>
                                <p>Phone: {company.phone} | Email: {company.email}</p>
                            </div>
                        </div>
                        <div className="text-right text-sm">
                            <p><strong>GSTIN:</strong> {company.gstin}</p>
                            <p><strong>PAN:</strong> {company.pan}</p>
                        </div>
                    </div>
                </div>

                {/* Invoice Title */}
                <div className="bg-black text-white text-center py-2">
                    <h2 className="text-xl font-bold">TAX INVOICE</h2>
                </div>

                {/* Invoice & Client Details */}
                <div className="grid grid-cols-2 border-b-2 border-black">
                    <div className="p-4 border-r-2 border-black">
                        <h3 className="font-bold mb-2 text-sm">Bill To:</h3>
                        <div className="text-sm space-y-0.5">
                            <p className="font-semibold">{invoice.client?.name || 'Walk-in Customer'}</p>
                            {invoice.client?.address && <p>{invoice.client.address}</p>}
                            {invoice.client?.city && (
                                <p>{invoice.client.city}, {invoice.client.state} - {invoice.client.pincode}</p>
                            )}
                            {invoice.client?.phone && <p>Phone: {invoice.client.phone}</p>}
                            {invoice.client?.gstin && <p><strong>GSTIN:</strong> {invoice.client.gstin}</p>}
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                                <span className="font-semibold">Invoice No:</span>
                                <span>{invoice.invoiceNumber}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold">Invoice Date:</span>
                                <span>{new Date(invoice.date).toLocaleDateString('en-IN')}</span>
                            </div>
                            {invoice.dueDate && (
                                <div className="flex justify-between">
                                    <span className="font-semibold">Due Date:</span>
                                    <span>{new Date(invoice.dueDate).toLocaleDateString('en-IN')}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="font-semibold">Payment Method:</span>
                                <span>{invoice.paymentMethod}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Line Items Table */}
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-100 border-b-2 border-black">
                            <th className="p-2 text-left border-r border-black" style={{ width: '5%' }}>#</th>
                            <th className="p-2 text-left border-r border-black" style={{ width: '35%' }}>Description</th>
                            <th className="p-2 text-center border-r border-black" style={{ width: '12%' }}>SAC</th>
                            <th className="p-2 text-center border-r border-black" style={{ width: '8%' }}>Qty</th>
                            <th className="p-2 text-right border-r border-black" style={{ width: '12%' }}>Rate</th>
                            <th className="p-2 text-center border-r border-black" style={{ width: '8%' }}>Tax%</th>
                            <th className="p-2 text-right" style={{ width: '15%' }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(Array.isArray(invoice.items) ? invoice.items : []).map((item, index) => (
                            <tr key={index} className="border-b border-gray-300">
                                <td className="p-2 border-r border-gray-300">{index + 1}</td>
                                <td className="p-2 border-r border-gray-300">
                                    <div className="font-semibold">{item.name}</div>
                                    {item.description && (
                                        <div className="text-xs text-gray-600">{item.description}</div>
                                    )}
                                </td>
                                <td className="p-2 text-center border-r border-gray-300 font-mono text-xs">
                                    {item.sacCode}
                                </td>
                                <td className="p-2 text-center border-r border-gray-300">{item.quantity}</td>
                                <td className="p-2 text-right border-r border-gray-300">
                                    ₹{item.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="p-2 text-center border-r border-gray-300">{item.taxRate}%</td>
                                <td className="p-2 text-right font-semibold">
                                    ₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals Section */}
                <div className="grid grid-cols-2">
                    <div className="p-4 border-r-2 border-black border-t-2">
                        <div className="text-sm">
                            <p className="font-semibold mb-2">Bank Details:</p>
                            <p><strong>Bank:</strong> {company.bankName}</p>
                            <p><strong>A/C No:</strong> {company.accountNumber}</p>
                            <p><strong>IFSC:</strong> {company.ifscCode}</p>
                            <p><strong>Branch:</strong> {company.branch}</p>
                        </div>
                    </div>
                    <div className="border-t-2 border-black">
                        <div className="text-sm">
                            <div className="flex justify-between p-2 border-b border-gray-300">
                                <span>Subtotal:</span>
                                <span className="font-semibold">
                                    ₹{invoice.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                            {invoice.discount > 0 && (
                                <div className="flex justify-between p-2 border-b border-gray-300 text-green-700">
                                    <span>Discount:</span>
                                    <span className="font-semibold">
                                        -₹{invoice.discount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            )}
                            {isSameState ? (
                                <>
                                    <div className="flex justify-between p-2 border-b border-gray-300">
                                        <span>CGST (9%):</span>
                                        <span>₹{cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between p-2 border-b border-gray-300">
                                        <span>SGST (9%):</span>
                                        <span>₹{sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </>
                            ) : (
                                <div className="flex justify-between p-2 border-b border-gray-300">
                                    <span>IGST (18%):</span>
                                    <span>₹{igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                </div>
                            )}
                            <div className="flex justify-between p-2 bg-gray-100 font-bold text-base border-t-2 border-black">
                                <span>Total Amount:</span>
                                <span>₹{invoice.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between p-2 border-t border-gray-300">
                                <span>Amount Paid:</span>
                                <span className="font-semibold text-green-700">
                                    ₹{invoice.amountPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                            {invoice.balance > 0 && (
                                <div className="flex justify-between p-2 border-t border-gray-300 text-red-700">
                                    <span className="font-semibold">Balance Due:</span>
                                    <span className="font-bold">
                                        ₹{invoice.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t-2 border-black">
                    <div className="flex justify-between items-end">
                        <div className="text-xs text-gray-600">
                            <p className="font-semibold mb-1">Terms & Conditions:</p>
                            <p>1. Payment is due within 14 days of invoice date.</p>
                            <p>2. Please quote invoice number when making payment.</p>
                            <p>3. All disputes subject to {company.city} jurisdiction.</p>
                        </div>
                        <div className="text-right">
                            <div className="mb-8"></div>
                            <div className="border-t border-black pt-1 text-sm">
                                <p className="font-semibold">Authorized Signatory</p>
                                <p className="text-xs">{company.name}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx>{`
                @media print {
                    @page {
                        size: A4;
                        margin: 10mm;
                    }
                    body {
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                }
            `}</style>
        </div>
    );
};

InvoiceTemplate.displayName = 'InvoiceTemplate';

export { InvoiceTemplate };
