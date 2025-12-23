"use client";

import { useInvoices } from "../../context/InvoiceContext";

export default function AgingReport() {
  const { invoices } = useInvoices();
  const today = new Date();

  const buckets = {
    "0-30": 0,
    "31-60": 0,
    "61-90": 0,
    "90+": 0,
  };

  invoices.forEach(inv => {
    if (inv.outstandingAmount <= 0 || !inv.dueDate) return;

    const diff =
      Math.floor((today - new Date(inv.dueDate)) / (1000 * 60 * 60 * 24));

    if (diff <= 30) buckets["0-30"] += inv.outstandingAmount;
    else if (diff <= 60) buckets["31-60"] += inv.outstandingAmount;
    else if (diff <= 90) buckets["61-90"] += inv.outstandingAmount;
    else buckets["90+"] += inv.outstandingAmount;
  });

  return (
    <div className="max-w-lg space-y-4">
      <h2 className="text-xl font-semibold">Invoice Aging Report</h2>

      <div className="acc-card space-y-2">
        {Object.entries(buckets).map(([range, amount]) => (
          <div key={range} className="flex justify-between">
            <span>{range} days</span>
            <span className="font-semibold">₹{amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
