"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLedger } from "../../context/LedgerContext";

export default function NewExpensePage() {
  const router = useRouter();
  const { addDebit } = useLedger();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  const saveExpense = () => {
    if (!title || !amount) return;

    addDebit({
      id: Date.now(),
      description: title,
      amount: Number(amount),
      date: new Date().toLocaleDateString(),
    });

    router.push("/accounting/expenses");
  };

  return (
    <div className="max-w-xl acc-card space-y-4">
      <h2 className="text-xl font-semibold">New Expense</h2>

      <div>
        <label className="text-sm acc-muted">Expense Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mt-1 px-3 py-2 border acc-border rounded-md bg-transparent"
          placeholder="Office Rent, Electricity, Internet..."
        />
      </div>

      <div>
        <label className="text-sm acc-muted">Amount (₹)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full mt-1 px-3 py-2 border acc-border rounded-md bg-transparent"
        />
      </div>

      <button
        onClick={saveExpense}
        className="w-full py-2 rounded-md bg-[var(--danger)] text-white"
      >
        Save Expense
      </button>
    </div>
  );
}
