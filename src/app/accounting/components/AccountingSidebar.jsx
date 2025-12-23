"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Receipt,
  Wallet,
  BookOpen,
  ArrowDownLeft,
  ArrowUpRight,
  Landmark,
  Percent,
  Menu,
  X,
  Calculator,
} from "lucide-react";

const NAV = [
  { label: "Overview", href: "/accounting", icon: LayoutDashboard },

  { section: "Transactions" },
  { label: "Invoices", href: "/accounting/invoices", icon: FileText },
  { label: "Expenses", href: "/accounting/expenses", icon: Receipt },
  { label: "Payments", href: "/accounting/payments", icon: Wallet },

  { section: "Ledgers" },
  { label: "All Ledgers", href: "/accounting/ledgers", icon: BookOpen },
  {
    label: "Credit Ledger",
    href: "/accounting/ledgers/credit",
    icon: ArrowDownLeft,
  },
  {
    label: "Debit Ledger",
    href: "/accounting/ledgers/debit",
    icon: ArrowUpRight,
  },
  {
    label: "Advance Ledger",
    href: "/accounting/ledgers/advance",
    icon: Landmark,
  },

  { section: "Compliance" },
  { label: "Taxes", href: "/accounting/taxes", icon: Percent },
];

export default function AccountingSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md
        bg-[var(--primary)] text-white"
      >
        <Menu size={18} />
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static z-50 w-64 h-auto
        acc-surface acc-border border-r
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between p-6  border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Novotion
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Accounts</p>
            </div>
          </div>
          
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4 text-sm">
          {NAV.map((item, i) =>
            item.section ? (
              <div
                key={i}
                className="mt-6 mb-2 px-2 text-xs font-medium uppercase acc-muted tracking-wider"
              >
                {item.section}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg
                transition
                ${
                  pathname === item.href
                    ? "bg-[var(--primary)]/10 text-[var(--primary)] font-medium"
                    : "hover:bg-slate-100 dark:hover:bg-white/5"
                }`}
              >
                <item.icon size={16} />
                <span className="leading-none">{item.label}</span>
              </Link>
            )
          )}
        </nav>
      </aside>
    </>
  );
}
