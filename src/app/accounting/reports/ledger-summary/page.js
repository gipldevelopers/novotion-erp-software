"use client";

import { useLedger } from "../../context/LedgerContext";

export default function LedgerSummary() {
  const ledger = useLedger();

  // SAFETY CHECK
  const entries = ledger?.entries || [];

  const summary = {};

  entries.forEach((e) => {
    if (!e.type || !e.amount) return;

    summary[e.type] = (summary[e.type] || 0) + e.amount;
  });

  return (
    <div className="max-w-md space-y-6">
      <h2 className="text-xl font-semibold">Ledger Summary</h2>

      <div className="acc-card space-y-2">
        {Object.keys(summary).length === 0 ? (
          <p className="acc-muted">No ledger entries yet.</p>
        ) : (
          Object.entries(summary).map(([type, amount]) => (
            <div
              key={type}
              className="flex justify-between"
            >
              <span>{type}</span>
              <span className="font-semibold">
                ₹{amount}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
