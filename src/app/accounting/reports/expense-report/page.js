"use client";

import { useExpenses } from "../../context/ExpenseContext";

export default function ExpenseReport() {
  const { expenses } = useExpenses();

  const grouped = {};

  expenses.forEach((e) => {
    const key = e.date.slice(0, 7); // YYYY-MM
    grouped[key] = (grouped[key] || 0) + e.amount;
  });

  return (
    <div className="max-w-md space-y-4">
      <h2 className="text-xl font-semibold">
        Monthly Expense Report
      </h2>

      <div className="acc-card space-y-2">
        {Object.entries(grouped).map(([month, total]) => (
          <div
            key={month}
            className="flex justify-between"
          >
            <span>{month}</span>
            <span className="font-semibold">
              ₹{total}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
