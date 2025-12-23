"use client";

import Link from "next/link";
import {
  BarChart3,
  Users,
  TrendingUp,
  BookOpen,
  CreditCard,
} from "lucide-react";

const reports = [
  {
    title: "Invoice Aging Report",
    description: "Outstanding invoices grouped by aging buckets",
    href: "/accounting/reports/aging",
    icon: BarChart3,
  },
  {
    title: "Customer Outstanding",
    description: "Customer-wise pending receivables",
    href: "/accounting/reports/customer-outstanding",
    icon: Users,
  },
  {
    title: "Profit & Loss",
    description: "Income, expenses and net profit/loss",
    href: "/accounting/reports/profit-loss",
    icon: TrendingUp,
  },
  {
    title: "Ledger Summary",
    description: "Debit, credit and advance ledger totals",
    href: "/accounting/reports/ledger-summary",
    icon: BookOpen,
  },
  {
    title: "Payment History",
    description: "All recorded payments with invoice reference",
    href: "/accounting/reports/payment-history",
    icon: CreditCard,
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">Reports</h2>
        <p className="text-sm acc-muted">
          Accounting analytics & financial reports
        </p>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report) => {
          const Icon = report.icon;

          return (
            <Link
              key={report.href}
              href={report.href}
              className="acc-card hover:border-[var(--primary)] transition"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-md bg-[var(--primary)]/10 text-[var(--primary)]">
                  <Icon size={20} />
                </div>

                <div>
                  <h3 className="font-medium">{report.title}</h3>
                  <p className="text-sm acc-muted">
                    {report.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
