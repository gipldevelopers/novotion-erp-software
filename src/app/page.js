"use client";

import { useRouter } from "next/navigation";
import { BarChart3, Wallet, Users } from "lucide-react";
import { ThemeToggle } from "./components/ThemeToggle";

export default function ModuleSelectPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center px-6 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="max-w-5xl w-full">
        {/* Branding */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Novotion</h1>
          <p className="text-gray-500 mt-2">
            Enterprise ERP • CRM • Accounting • POS
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* CRM Card */}
          <div
            onClick={() => router.push("/crm")}
            className="cursor-pointer group bg-slate-100 dark:bg-slate-900 rounded-2xl border border-black dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 p-10 hover:-translate-y-1"
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-[#e6f7fa] mb-6 group-hover:scale-110 transition">
              <BarChart3 className="w-8 h-8 text-[#27B0C4]" />
            </div>

            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
              CRM Module
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Manage leads, customers, sales pipelines, follow-ups, and team
              performance in one powerful CRM system.
            </p>

            <div className="mt-6 text-sm font-medium text-[#27B0C4]">
              Open CRM →
            </div>
          </div>

          {/* HRMS Card */}
          <div
            onClick={() => router.push("/hrms")}
            className="cursor-pointer group bg-slate-100 dark:bg-slate-900 rounded-2xl border border-black dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 p-10 hover:-translate-y-1"
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-[#f0fdf4] mb-6 group-hover:scale-110 transition">
              <Users className="w-8 h-8 text-[#10b981]" />
            </div>

            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
              HRMS Module
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Manage employees, attendance, leave, departments, designations, and HR operations efficiently.
            </p>

            <div className="mt-6 text-sm font-medium text-[#10b981]">
              Open HRMS →
            </div>
          </div>

          {/* Accounting Card */}
          <div
            onClick={() => router.push("/accounting")}
            className="cursor-pointer group bg-slate-100 dark:bg-slate-900 rounded-2xl border border-black dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 p-10 hover:-translate-y-1"
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-[#f0f9ff] mb-6 group-hover:scale-110 transition">
              <Wallet className="w-8 h-8 text-[#0ea5e9]" />
            </div>

            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
              Accounting Module
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Track income, expenses, invoices, ledgers, taxes, and financial
              reports with real-time accuracy.
            </p>

            <div className="mt-6 text-sm font-medium text-[#0ea5e9]">
              Open Accounting →
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-14 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Novotion. All rights reserved.
        </div>
      </div>
    </div>
  );
}
