"use client";

import { useState } from "react";

export default function ExpenseCategories() {
  const [categories, setCategories] = useState([
    "Office",
    "Travel",
    "Utilities",
    "Salary",
    "Miscellaneous",
  ]);

  const [newCat, setNewCat] = useState("");

  return (
    <div className="max-w-md space-y-6">
      <h2 className="text-xl font-semibold">Expense Categories</h2>

      <div className="acc-card space-y-2">
        <input
          className="input"
          placeholder="New Category"
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
        />
        <button
          onClick={() => {
            setCategories([...categories, newCat]);
            setNewCat("");
          }}
          className="bg-[var(--primary)] text-white px-4 py-2 rounded"
        >
          Add Category
        </button>
      </div>

      <div className="acc-card space-y-2">
        {categories.map((c) => (
          <div key={c}>{c}</div>
        ))}
      </div>
    </div>
  );
}
