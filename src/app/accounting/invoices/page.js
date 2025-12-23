"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { useInvoices } from "../context/InvoiceContext";

export default function InvoicesPage() {
  const { invoices } = useInvoices();

  const getOutstanding = (inv) =>
    inv.status === "Paid" ? 0 : inv.total;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Invoices</h2>
          <p className="text-sm acc-muted">
            All customer invoices
          </p>
        </div>

        <Link
          href="/accounting/invoices/new"
          className="px-4 py-2 rounded-md bg-[var(--primary)] text-white text-sm"
        >
          + New Invoice
        </Link>
      </div>

      {/* Table */}
      <div className="acc-card overflow-x-auto">
        {invoices.length === 0 ? (
          <p className="acc-muted">No invoices created yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b acc-border">
                <th className="py-2 text-left">Invoice</th>
                <th className="py-2 text-left">Client</th>
                <th className="py-2 text-left">Due Date</th>
                <th className="py-2 text-right">Total</th>
                <th className="py-2 text-right">Outstanding</th>
                <th className="py-2 text-left">Status</th>
                <th className="py-2 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="border-b acc-border last:border-0"
                >
                  {/* Invoice */}
                  <td className="py-2">
                    <Link
                      href={`/accounting/invoices/${inv.id}`}
                      className="text-[var(--primary)] font-medium hover:underline"
                    >
                      {inv.id}
                    </Link>
                  </td>

                  {/* Client */}
                  <td className="py-2">{inv.client}</td>

                  {/* Due Date */}
                  <td className="py-2">
                    {inv.dueDate || "—"}
                  </td>

                  {/* Total */}
                  <td className="py-2 text-right font-semibold">
                    ₹{inv.total.toLocaleString("en-IN")}
                  </td>

                  {/* Outstanding */}
                  <td className="py-2 text-right">
                    {getOutstanding(inv) > 0 ? (
                      <span className="text-red-500 font-medium">
                        ₹{getOutstanding(inv).toLocaleString("en-IN")}
                      </span>
                    ) : (
                      <span className="text-green-600 font-medium">
                        ₹0
                      </span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-2">
                    <StatusBadge status={inv.status} />
                  </td>

                  {/* Action */}
                  <td className="py-2 text-center">
                    {inv.status !== "Paid" ? (
                      <Link
                        href={`/accounting/invoices/${inv.id}/edit`}
                        className="inline-flex items-center gap-1
                        text-sm text-[var(--primary)]
                        hover:underline"
                        title="Edit Invoice"
                      >
                        <Pencil size={14} />
                        Edit
                      </Link>
                    ) : (
                      <span
                        className="text-xs acc-muted cursor-not-allowed"
                        title="Paid invoices cannot be edited"
                      >
                        Locked
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ---------- STATUS BADGE ---------- */

function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-amber-500/10 text-amber-600",
    Paid: "bg-green-500/10 text-green-600",
    Overdue: "bg-red-500/10 text-red-600",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}
