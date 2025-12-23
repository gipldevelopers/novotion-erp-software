"use client";

import { useRouter } from "next/navigation";
import { BarChart3, Wallet } from "lucide-react";

export default function ModuleSelectPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] flex items-center justify-center px-6">

      <div className="max-w-5xl w-full">
        {/* Branding */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Novotion</h1>
          <p className="text-gray-500 mt-2">
            Enterprise ERP • CRM • Accounting • POS
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* CRM Card */}
          <div
            onClick={() => router.push("/crm")}
            className="cursor-pointer group bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 p-10 hover:-translate-y-1"
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-[#e6f7fa] mb-6 group-hover:scale-110 transition">
              <BarChart3 className="w-8 h-8 text-[#27B0C4]" />
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              CRM Module
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Manage leads, customers, sales pipelines, follow-ups, and team
              performance in one powerful CRM system.
            </p>

            <div className="mt-6 text-sm font-medium text-[#27B0C4]">
              Open CRM →
            </div>
          </div>

          {/* Accounting Card */}
          <div
            onClick={() => router.push("/accounting")}
            className="cursor-pointer group bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 p-10 hover:-translate-y-1"
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-[#f0f9ff] mb-6 group-hover:scale-110 transition">
              <Wallet className="w-8 h-8 text-[#0ea5e9]" />
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Accounting Module
            </h2>
            <p className="text-gray-600 leading-relaxed">
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
