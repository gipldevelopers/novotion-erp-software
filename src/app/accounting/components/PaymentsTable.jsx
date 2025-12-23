"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";

const payments = [
  {
    id: 1,
    date: "15 Sep 2025",
    party: "Client A",
    type: "receive",
    amount: "₹25,000",
    mode: "UPI",
  },
  {
    id: 2,
    date: "14 Sep 2025",
    party: "Office Rent",
    type: "pay",
    amount: "₹12,000",
    mode: "Bank",
  },
  {
    id: 3,
    date: "13 Sep 2025",
    party: "Vendor X",
    type: "pay",
    amount: "₹8,000",
    mode: "Cash",
  },
];

export default function PaymentsTable() {
  return (
    <div className="acc-card">
      <h3 className="font-semibold mb-4">
        Recent Payments
      </h3>

      {/* Desktop */}
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b acc-border">
              <th className="py-3 text-left acc-muted">Date</th>
              <th className="py-3 text-left acc-muted">Party</th>
              <th className="py-3 text-left acc-muted">Type</th>
              <th className="py-3 text-right acc-muted">Amount</th>
              <th className="py-3 text-left acc-muted">Mode</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((p) => (
              <tr
                key={p.id}
                className="border-b acc-border last:border-0"
              >
                <td className="py-3">{p.date}</td>
                <td className="py-3 font-medium">{p.party}</td>

                <td className="py-3 flex items-center gap-2 capitalize">
                  {p.type === "receive" ? (
                    <ArrowDownLeft
                      size={16}
                      className="text-[var(--success)]"
                    />
                  ) : (
                    <ArrowUpRight
                      size={16}
                      className="text-[var(--danger)]"
                    />
                  )}
                  {p.type}
                </td>

                <td className="py-3 text-right font-semibold">
                  {p.amount}
                </td>

                <td className="py-3">{p.mode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="md:hidden space-y-3">
        {payments.map((p) => (
          <div
            key={p.id}
            className="border acc-border rounded-xl p-4"
          >
            <div className="flex justify-between">
              <p className="font-medium">{p.party}</p>
              <span className="font-semibold">{p.amount}</span>
            </div>

            <div className="flex justify-between text-sm acc-muted mt-2">
              <span>{p.date}</span>
              <span>{p.mode}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
