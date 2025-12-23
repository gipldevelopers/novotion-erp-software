"use client";

import { useState } from "react";
import { useExpenses } from "../context/ExpenseContext";

export default function ExpensePage() {
  const { expenses, addExpense, deleteExpense, totalExpense } =
    useExpenses();

  const [categories, setCategories] = useState([
    "Office",
    "Travel",
    "Utilities",
    "Salary",
    "Miscellaneous",
  ]);

  const [newCategory, setNewCategory] = useState("");

  const [form, setForm] = useState({
    title: "",
    category: "",
    amount: "",
    paymentMode: "Cash",
    date: "",
    paidTo: "",
    notes: "",
    attachment: null,
  });

  /* ===== CATEGORY ===== */
  const addCategory = () => {
    if (!newCategory.trim()) return;
    setCategories([...categories, newCategory]);
    setNewCategory("");
  };

  /* ===== FILE ===== */
  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setForm({ ...form, attachment: reader.result });
    reader.readAsDataURL(file);
  };

  /* ===== SAVE ===== */
  const saveExpense = () => {
    if (!form.title || !form.amount || !form.category) return;

    addExpense(form);
    setForm({
      title: "",
      category: "",
      amount: "",
      paymentMode: "Cash",
      date: "",
      paidTo: "",
      notes: "",
      attachment: null,
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* ===== HEADER ===== */}
      <div>
        <h2 className="text-2xl font-semibold">Expenses</h2>
        <p className="acc-muted text-sm">
          Track and manage company expenses
        </p>
      </div>

      {/* ===== CATEGORY MASTER ===== */}
      <div className="acc-card p-4 space-y-3">
        <h3 className="font-medium">Expense Categories</h3>
        <div className="flex gap-2">
          <input
            className="input flex-1"
            placeholder="New category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button
            onClick={addCategory}
            className="bg-[var(--primary)] text-white px-4 rounded-md"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          {categories.map((c) => (
            <span
              key={c}
              className="px-3 py-1 border acc-border rounded-full"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* ===== EXPENSE ENTRY ===== */}
      <div className="acc-card p-6 space-y-4">
        <h3 className="font-medium">Add Expense</h3>

        <input
          className="input w-full"
          placeholder="Expense title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <div className="grid md:grid-cols-3 gap-4">
          <select
            className="input"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          >
            <option value="">Category</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <input
            type="number"
            className="input"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value })
            }
          />

          <select
            className="input"
            value={form.paymentMode}
            onChange={(e) =>
              setForm({ ...form, paymentMode: e.target.value })
            }
          >
            <option>Cash</option>
            <option>Bank</option>
            <option>UPI</option>
            <option>Card</option>
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="date"
            className="input"
            value={form.date}
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
          />
          <input
            className="input"
            placeholder="Paid to"
            value={form.paidTo}
            onChange={(e) =>
              setForm({ ...form, paidTo: e.target.value })
            }
          />
        </div>

        <textarea
          className="input"
          rows={3}
          placeholder="Notes"
          value={form.notes}
          onChange={(e) =>
            setForm({ ...form, notes: e.target.value })
          }
        />

        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        <button
          onClick={saveExpense}
          className="w-full py-2 bg-[var(--primary)] text-white rounded-md"
        >
          Save Expense
        </button>
      </div>

      {/* ===== EXPENSE LIST ===== */}
      <div className="acc-card p-4 space-y-3">
        <h3 className="font-medium">
          Expense Records (Total ₹{totalExpense})
        </h3>

        <table className="w-full text-sm border acc-border">
          <thead className="bg-black/5">
            <tr>
              <th className="p-2 text-left">Title</th>
              <th className="p-2">Category</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Mode</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e.id}>
                <td className="p-2">{e.title}</td>
                <td className="p-2 text-center">{e.category}</td>
                <td className="p-2 text-center">₹{e.amount}</td>
                <td className="p-2 text-center">{e.paymentMode}</td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => deleteExpense(e.id)}
                    className="text-red-500 text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="p-4 text-center acc-muted"
                >
                  No expenses recorded
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
