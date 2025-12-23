"use client";

import { useInvoices } from "../../context/InvoiceContext";
import { useExpenses } from "../../context/ExpenseContext";

export default function ProfitLoss() {
  const { invoices } = useInvoices();
  const { expenses } = useExpenses();

  const revenue = invoices
    .filter(i => i.status === "Paid")
    .reduce((sum, i) => sum + i.total, 0);

  const totalExpenses = expenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );

  const profit = revenue - totalExpenses;

  return (
    <div className="max-w-md space-y-4">
      <h2 className="text-xl font-semibold">Profit & Loss</h2>

      <div className="acc-card space-y-2">
        <Row label="Total Revenue" value={revenue} />
        <Row label="Total Expenses" value={totalExpenses} />
        <hr className="acc-border" />
        <Row
          label="Net Result"
          value={profit}
          highlight={profit >= 0}
        />
      </div>
    </div>
  );
}

const Row = ({ label, value, highlight }) => (
  <div className="flex justify-between">
    <span>{label}</span>
    <span className={highlight ? "text-green-600" : "text-red-500"}>
      ₹{value}
    </span>
  </div>
);
