"use client";

import { useInvoices } from "../../context/InvoiceContext";

export default function CustomerOutstanding() {
  const { invoices } = useInvoices();

  const customerMap = {};

  invoices.forEach(inv => {
    if (inv.outstandingAmount <= 0) return;

    customerMap[inv.client] =
      (customerMap[inv.client] || 0) + inv.outstandingAmount;
  });

  return (
    <div className="max-w-lg space-y-4">
      <h2 className="text-xl font-semibold">Customer Outstanding</h2>

      <div className="acc-card space-y-2">
        {Object.entries(customerMap).map(([client, amount]) => (
          <div key={client} className="flex justify-between">
            <span>{client}</span>
            <span className="font-semibold text-red-500">
              ₹{amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
