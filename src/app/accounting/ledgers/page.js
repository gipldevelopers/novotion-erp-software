"use client";

import { useState, useMemo } from "react";
import {
  Pencil,
  Save,
  X,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Scale,
} from "lucide-react";

/* ================= MOCK LEDGER DATA (BACKEND READY) ================= */
const initialLedgers = [
  { id: 1, name: "Cash", type: "Asset", balance: 120000 },
  { id: 2, name: "Bank", type: "Asset", balance: 340000 },
  { id: 3, name: "Sales", type: "Income", balance: 620000 },
  { id: 4, name: "Consulting Income", type: "Income", balance: 350000 },
  { id: 5, name: "Office Rent", type: "Expense", balance: 180000 },
  { id: 6, name: "Salary", type: "Expense", balance: 230000 },
  { id: 7, name: "Loan", type: "Liability", balance: 200000 },
];

export default function LedgerDashboardPage() {
  const [ledgers, setLedgers] = useState(initialLedgers);
  const [editId, setEditId] = useState(null);
  const [editRow, setEditRow] = useState({});

  /* ================= ACCOUNTING TOTALS ================= */
  const totals = useMemo(() => {
    const t = { asset: 0, liability: 0, income: 0, expense: 0 };

    ledgers.forEach((l) => {
      if (l.type === "Asset") t.asset += l.balance;
      if (l.type === "Liability") t.liability += l.balance;
      if (l.type === "Income") t.income += l.balance;
      if (l.type === "Expense") t.expense += l.balance;
    });

    return t;
  }, [ledgers]);

  const profitLoss = totals.income - totals.expense;

  /* ================= EDIT HANDLERS ================= */
  const startEdit = (ledger) => {
    setEditId(ledger.id);
    setEditRow({ ...ledger });
  };

  const saveEdit = () => {
    setLedgers((prev) =>
      prev.map((l) => (l.id === editId ? editRow : l))
    );
    setEditId(null);
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-10">

      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Ledger Dashboard
        </h2>
        <p className="text-sm acc-muted mt-1">
          Complete accounting view from ledgers
        </p>
      </div>

      {/* ================= DASHBOARD CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Assets" value={totals.asset} icon={<Wallet />} />
        <StatCard title="Total Liabilities" value={totals.liability} icon={<Scale />} />
        <StatCard title="Total Income" value={totals.income} icon={<ArrowDownLeft />} />
        <StatCard title="Total Expenses" value={totals.expense} icon={<ArrowUpRight />} />
      </div>

      {/* ================= PROFIT & LOSS ================= */}
      <div className="acc-card p-6 space-y-4">
        <h3 className="font-semibold text-lg">Profit & Loss Statement</h3>

        <table className="w-full text-sm border acc-border">
          <tbody>
            <tr className="border-b acc-border">
              <td className="p-3">Total Income</td>
              <td className="p-3 text-right font-medium">₹{totals.income}</td>
            </tr>
            <tr className="border-b acc-border">
              <td className="p-3">Total Expenses</td>
              <td className="p-3 text-right font-medium">₹{totals.expense}</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold">Net Profit / Loss</td>
              <td
                className={`p-3 text-right font-semibold ${
                  profitLoss >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                ₹{profitLoss}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ================= LEDGER TABLE (EDITABLE) ================= */}
      <div className="acc-card p-6 space-y-4 overflow-x-auto">
        <h3 className="font-semibold text-lg">Ledger Balances</h3>

        <table className="w-full text-sm border acc-border">
          <thead className="bg-black/5">
            <tr>
              <th className="p-3 text-left">Ledger Name</th>
              <th className="p-3 text-center">Type</th>
              <th className="p-3 text-right">Balance (₹)</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {ledgers.map((l) => (
              <tr key={l.id} className="border-t acc-border">
                {editId !== l.id ? (
                  <>
                    <td className="p-3">{l.name}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          l.type === "Income"
                            ? "bg-green-500/10 text-green-600"
                            : l.type === "Expense"
                            ? "bg-red-500/10 text-red-600"
                            : "bg-blue-500/10 text-blue-600"
                        }`}
                      >
                        {l.type}
                      </span>
                    </td>
                    <td className="p-3 text-right font-medium">
                      ₹{l.balance}
                    </td>
                    <td className="p-3 text-center">
                      <button onClick={() => startEdit(l)}>
                        <Pencil size={16} />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3">
                      <input
                        className="input"
                        value={editRow.name}
                        onChange={(e) =>
                          setEditRow({ ...editRow, name: e.target.value })
                        }
                      />
                    </td>

                    <td className="p-3">
                      <select
                        className="input"
                        value={editRow.type}
                        onChange={(e) =>
                          setEditRow({ ...editRow, type: e.target.value })
                        }
                      >
                        <option>Asset</option>
                        <option>Liability</option>
                        <option>Income</option>
                        <option>Expense</option>
                      </select>
                    </td>

                    <td className="p-3">
                      <input
                        type="number"
                        className="input text-right"
                        value={editRow.balance}
                        onChange={(e) =>
                          setEditRow({
                            ...editRow,
                            balance: Number(e.target.value),
                          })
                        }
                      />
                    </td>

                    <td className="p-3 flex justify-center gap-3">
                      <button onClick={saveEdit} className="text-green-600">
                        <Save size={16} />
                      </button>
                      <button onClick={() => setEditId(null)} className="text-red-600">
                        <X size={16} />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================= CARD ================= */
function StatCard({ title, value, icon }) {
  return (
    <div className="acc-card p-5 flex items-center justify-between">
      <div>
        <p className="text-sm acc-muted">{title}</p>
        <p className="text-2xl font-semibold">₹{value}</p>
      </div>
      <div className="p-3 rounded-md bg-black/5">{icon}</div>
    </div>
  );
}
