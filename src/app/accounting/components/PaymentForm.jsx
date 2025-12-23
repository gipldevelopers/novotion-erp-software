"use client";

import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

export default function PaymentForm() {
  const [type, setType] = useState("receive");

  return (
    <div className="acc-card space-y-4">
      <h3 className="font-semibold text-base">
        {type === "receive" ? "Receive Payment" : "Pay Money"}
      </h3>

      {/* Type Toggle */}
      <div className="flex rounded-lg border acc-border overflow-hidden">
        <button
          onClick={() => setType("receive")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm
          ${
            type === "receive"
              ? "bg-[var(--primary)] text-white"
              : "hover:bg-slate-100 dark:hover:bg-white/5"
          }`}
        >
          <ArrowDownLeft size={16} />
          Receive
        </button>

        <button
          onClick={() => setType("pay")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm
          ${
            type === "pay"
              ? "bg-[var(--danger)] text-white"
              : "hover:bg-slate-100 dark:hover:bg-white/5"
          }`}
        >
          <ArrowUpRight size={16} />
          Pay
        </button>
      </div>

      {/* Amount */}
      <div>
        <label className="text-sm acc-muted">Amount (₹)</label>
        <input
          type="number"
          placeholder="Enter amount"
          className="mt-1 w-full px-3 py-2 rounded-md border acc-border
          bg-transparent outline-none"
        />
      </div>

      {/* Party */}
      <div>
        <label className="text-sm acc-muted">
          {type === "receive" ? "Received From" : "Paid To"}
        </label>
        <input
          type="text"
          placeholder="Client / Vendor name"
          className="mt-1 w-full px-3 py-2 rounded-md border acc-border
          bg-transparent outline-none"
        />
      </div>

      {/* Payment Mode */}
      <div>
        <label className="text-sm acc-muted">Payment Mode</label>
        <select
          className="mt-1 w-full px-3 py-2 rounded-md border acc-border
          bg-transparent outline-none"
        >
          <option>Cash</option>
          <option>Bank Transfer</option>
          <option>UPI</option>
          <option>Cheque</option>
        </select>
      </div>

      {/* Note */}
      <div>
        <label className="text-sm acc-muted">Note (optional)</label>
        <textarea
          rows="2"
          className="mt-1 w-full px-3 py-2 rounded-md border acc-border
          bg-transparent outline-none"
          placeholder="Payment note"
        />
      </div>

      {/* Submit */}
      <button
        className={`w-full py-2 rounded-md text-sm text-white
        ${
          type === "receive"
            ? "bg-[var(--success)]"
            : "bg-[var(--danger)]"
        }`}
      >
        {type === "receive" ? "Receive Payment" : "Pay Now"}
      </button>
    </div>
  );
}
