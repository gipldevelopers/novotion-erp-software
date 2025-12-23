"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
} from "lucide-react";

const transactions = [
  {
    id: 1,
    date: "12 Sep 2025",
    title: "Client Invoice Payment",
    type: "credit",
    amount: "₹25,000",
    status: "Completed",
  },
  {
    id: 2,
    date: "11 Sep 2025",
    title: "Office Rent",
    type: "debit",
    amount: "₹12,000",
    status: "Completed",
  },
  {
    id: 3,
    date: "10 Sep 2025",
    title: "Advance to Vendor",
    type: "advance",
    amount: "₹8,000",
    status: "Pending",
  },
];

export default function RecentTransactions() {
  return (
    <div className="acc-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold">Recent Transactions</h3>
        <span className="text-sm acc-muted">Last 7 days</span>
      </div>

      {/* Table (Desktop) */}
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b acc-border">
              <th className="py-2 text-left acc-muted font-medium">Date</th>
              <th className="py-2 text-left acc-muted font-medium">Details</th>
              <th className="py-2 text-left acc-muted font-medium">Type</th>
              <th className="py-2 text-right acc-muted font-medium">Amount</th>
              <th className="py-2 text-left acc-muted font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="border-b acc-border last:border-0"
              >
                <td className="py-3">{tx.date}</td>

                <td className="py-3">{tx.title}</td>

                <td className="py-3 flex items-center gap-2 capitalize">
                  {tx.type === "credit" && (
                    <ArrowDownLeft size={16} className="text-[var(--primary)]" />
                  )}
                  {tx.type === "debit" && (
                    <ArrowUpRight size={16} className="text-[var(--danger)]" />
                  )}
                  {tx.type === "advance" && (
                    <Clock size={16} className="text-[var(--warning)]" />
                  )}
                  {tx.type}
                </td>

                <td className="py-3 text-right font-medium">
                  {tx.amount}
                </td>

                <td className="py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs
                    ${
                      tx.status === "Completed"
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="border acc-border rounded-xl p-3"
          >
            <div className="flex items-center justify-between">
              <p className="font-medium">{tx.title}</p>
              <span className="text-sm font-semibold">{tx.amount}</span>
            </div>

            <div className="flex items-center justify-between mt-2 text-sm acc-muted">
              <span>{tx.date}</span>
              <span className="capitalize">{tx.type}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
