"use client";

import { FileText } from "lucide-react";

const invoices = [
  {
    id: "INV-1001",
    client: "Client A",
    date: "10 Sep 2025",
    dueDate: "20 Sep 2025",
    amount: "₹25,000",
    status: "Paid",
  },
  {
    id: "INV-1002",
    client: "Client B",
    date: "12 Sep 2025",
    dueDate: "22 Sep 2025",
    amount: "₹18,500",
    status: "Pending",
  },
  {
    id: "INV-1003",
    client: "Client C",
    date: "01 Sep 2025",
    dueDate: "10 Sep 2025",
    amount: "₹32,000",
    status: "Overdue",
  },
];

export default function InvoiceTable() {
  return (
    <div className="acc-card">
      {/* Desktop */}
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b acc-border">
              <th className="py-3 text-left acc-muted font-medium">
                Invoice
              </th>
              <th className="py-3 text-left acc-muted font-medium">
                Client
              </th>
              <th className="py-3 text-left acc-muted font-medium">
                Date
              </th>
              <th className="py-3 text-left acc-muted font-medium">
                Due Date
              </th>
              <th className="py-3 text-right acc-muted font-medium">
                Amount
              </th>
              <th className="py-3 text-left acc-muted font-medium">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((inv) => (
              <tr
                key={inv.id}
                className="border-b acc-border last:border-0"
              >
                <td className="py-3 flex items-center gap-2 font-medium">
                  <FileText size={16} />
                  {inv.id}
                </td>

                <td className="py-3">{inv.client}</td>
                <td className="py-3">{inv.date}</td>
                <td className="py-3">{inv.dueDate}</td>

                <td className="py-3 text-right font-semibold">
                  {inv.amount}
                </td>

                <td className="py-3">
                  <InvoiceStatus status={inv.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="md:hidden space-y-3">
        {invoices.map((inv) => (
          <div
            key={inv.id}
            className="border acc-border rounded-xl p-4"
          >
            <div className="flex justify-between items-center">
              <p className="font-medium">{inv.id}</p>
              <span className="font-semibold">{inv.amount}</span>
            </div>

            <p className="text-sm acc-muted mt-1">
              {inv.client}
            </p>

            <div className="flex justify-between items-center mt-2 text-sm">
              <span>{inv.dueDate}</span>
              <InvoiceStatus status={inv.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- STATUS BADGE ---------------- */

function InvoiceStatus({ status }) {
  const styles = {
    Paid: "bg-green-500/10 text-green-600 dark:text-green-400",
    Pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    Overdue: "bg-red-500/10 text-red-600 dark:text-red-400",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}
