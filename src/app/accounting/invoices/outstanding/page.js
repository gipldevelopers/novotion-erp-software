"use client";

import Link from "next/link";
import { useInvoices } from "../../context/InvoiceContext";

/**
 * Outstanding Invoices
 * - Only Pending / Overdue
 * - Shows Subtotal, Tax, Total
 * - Shows Due Date & Days Overdue
 */
export default function OutstandingInvoicesPage() {
  const { invoices } = useInvoices();

  const outstandingInvoices = invoices.filter(
    (inv) => inv.status !== "Paid"
  );

  const getDaysOverdue = (dueDate) => {
    if (!dueDate) return 0;
    const today = new Date();
    const due = new Date(dueDate);
    const diff =
      Math.ceil((today - due) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">
          Outstanding Invoices
        </h2>
        <p className="text-sm acc-muted">
          Pending and overdue invoices with tax details
        </p>
      </div>

      {/* Table */}
      <div className="acc-card">
        {outstandingInvoices.length === 0 ? (
          <p className="acc-muted">
            No outstanding invoices 🎉
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b acc-border">
                <th className="py-2 text-left">Invoice</th>
                <th className="py-2 text-left">Client</th>
                <th className="py-2 text-right">Subtotal</th>
                <th className="py-2 text-right">Tax</th>
                <th className="py-2 text-right">Total</th>
                <th className="py-2 text-left">Due Date</th>
                <th className="py-2 text-right">Overdue</th>
                <th className="py-2 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {outstandingInvoices.map((inv) => {
                const overdueDays = getDaysOverdue(inv.dueDate);

                return (
                  <tr
                    key={inv.id}
                    className="border-b acc-border last:border-0"
                  >
                    {/* Invoice */}
                    <td className="py-2">
                      <Link
                        href={`/accounting/invoices/${inv.id}`}
                        className="text-[var(--primary)] font-medium"
                      >
                        {inv.id}
                      </Link>
                    </td>

                    {/* Client */}
                    <td className="py-2">{inv.client}</td>

                    {/* Subtotal */}
                    <td className="py-2 text-right">
                      ₹{inv.subtotal.toLocaleString("en-IN")}
                    </td>

                    {/* Tax */}
                    <td className="py-2 text-right acc-muted">
                      {inv.taxRate > 0 ? (
                        <>
                          ₹{inv.taxAmount.toLocaleString("en-IN")}
                          <span className="text-xs block">
                            ({inv.taxName} {inv.taxRate}%)
                          </span>
                        </>
                      ) : (
                        "—"
                      )}
                    </td>

                    {/* Total */}
                    <td className="py-2 text-right font-semibold">
                      ₹{inv.total.toLocaleString("en-IN")}
                    </td>

                    {/* Due Date */}
                    <td className="py-2">{inv.dueDate}</td>

                    {/* Overdue */}
                    <td className="py-2 text-right">
                      {overdueDays > 0 ? (
                        <span className="text-red-500 font-medium">
                          {overdueDays}d
                        </span>
                      ) : (
                        <span className="acc-muted">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-2">
                      <StatusBadge status={inv.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ---------------- STATUS BADGE ---------------- */

function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-amber-500/10 text-amber-600",
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
