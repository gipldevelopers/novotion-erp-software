"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useInvoices } from "../../../context/InvoiceContext";
import { useTaxes } from "../../../context/TaxContext";
import { useState } from "react";

export default function EditInvoicePage({ params }) {
  const { id } = use(params);
  const router = useRouter();

  const { getInvoiceById, updateInvoice } = useInvoices();
  const { taxes } = useTaxes();

  const invoice = getInvoiceById(id);

  if (!invoice) {
    return <p className="acc-muted">Invoice not found</p>;
  }

  const [client, setClient] = useState(invoice.client);
  const [subtotal, setSubtotal] = useState(invoice.subtotal);
  const [taxId, setTaxId] = useState(invoice.taxId || "");
  const [dueDate, setDueDate] = useState(invoice.dueDate);

  const selectedTax = taxes.find(t => t.id == taxId);

  const taxAmount = selectedTax
    ? (subtotal * selectedTax.rate) / 100
    : 0;

  const total = subtotal + taxAmount;

  const saveChanges = () => {
    updateInvoice(id, {
      client,
      subtotal,
      taxId: selectedTax?.id || null,
      taxName: selectedTax?.name || null,
      taxRate: selectedTax?.rate || 0,
      taxAmount,
      total,
      dueDate,
    });

    router.push(`/accounting/invoices/${id}`);
  };

  return (
    <div className="max-w-xl acc-card space-y-4">
      <h2 className="text-xl font-semibold">
        Edit Invoice {invoice.id}
      </h2>

      {/* Client */}
      <div>
        <label className="text-sm acc-muted">Client</label>
        <input
          value={client}
          onChange={(e) => setClient(e.target.value)}
          className="w-full mt-1 px-3 py-2 border acc-border rounded-md bg-transparent"
        />
      </div>

      {/* Subtotal */}
      <div>
        <label className="text-sm acc-muted">Subtotal (₹)</label>
        <input
          type="number"
          value={subtotal}
          onChange={(e) => setSubtotal(Number(e.target.value))}
          className="w-full mt-1 px-3 py-2 border acc-border rounded-md bg-transparent"
        />
      </div>

      {/* Tax */}
      <div>
        <label className="text-sm acc-muted">Tax</label>
        <select
          value={taxId}
          onChange={(e) => setTaxId(e.target.value)}
          className="w-full mt-1 px-3 py-2 border acc-border rounded-md bg-transparent"
        >
          <option value="">No Tax</option>
          {taxes.map((tax) => (
            <option key={tax.id} value={tax.id}>
              {tax.name} ({tax.rate}%)
            </option>
          ))}
        </select>
      </div>

      {/* Due Date */}
      <div>
        <label className="text-sm acc-muted">Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full mt-1 px-3 py-2 border acc-border rounded-md bg-transparent"
        />
      </div>

      {/* Summary */}
      <div className="border acc-border rounded-md p-3 text-sm space-y-1">
        <Row label="Subtotal" value={subtotal} />
        <Row label="Tax" value={taxAmount} />
        <div className="flex justify-between font-semibold border-t acc-border pt-1">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      <button
        onClick={saveChanges}
        className="w-full py-2 rounded-md bg-[var(--primary)] text-white"
      >
        Save Changes
      </button>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="acc-muted">{label}</span>
      <span>₹{value}</span>
    </div>
  );
}
