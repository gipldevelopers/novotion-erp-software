"use client";

import { use } from "react";
import { useState } from "react";
import { Download } from "lucide-react";
import { useInvoices } from "../../context/InvoiceContext";

export default function InvoiceViewPage({ params }) {
  const { id } = use(params);
  const { getInvoiceById, applyPayment } = useInvoices();

  const invoice = getInvoiceById(id);
  const [payAmount, setPayAmount] = useState("");

  if (!invoice) {
    return <p className="acc-muted">Invoice not found</p>;
  }

  const handlePayment = () => {
    const amt = Number(payAmount);
    if (!amt || amt <= 0) return;
    applyPayment(invoice.id, amt);
    setPayAmount("");
  };

  const exportInvoice = () => {
    window.print();
  };

  return (
    <div className="invoice-print max-w-4xl mx-auto acc-card p-6 space-y-6 print:bg-white">
      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-start border-b acc-border pb-4">
        <div>
          <h2 className="text-2xl font-semibold">Invoice</h2>
          <p className="acc-muted text-sm">{invoice.id}</p>
        </div>

        <div className="text-right text-sm space-y-1">
          <p>
            <span className="acc-muted">Status:</span> <b>{invoice.status}</b>
          </p>
          <p>
            <span className="acc-muted">Due Date:</span>{" "}
            {invoice.dueDate || "—"}
          </p>
        </div>
      </div>

      {/* ===== COMPANY + CLIENT ===== */}
      <div className="grid md:grid-cols-2 gap-6 text-sm">
        <div>
          <h4 className="font-semibold mb-1">From</h4>
          <p className="font-medium">Your Company Name</p>
          <p className="acc-muted">your@email.com</p>
          <p className="acc-muted">+91 XXXXX XXXXX</p>
        </div>

        <div>
          <h4 className="font-semibold mb-1">Bill To</h4>
          <p className="font-medium">{invoice.client}</p>
          <p className="acc-muted">Client Address</p>
        </div>
      </div>

      {/* ===== SERVICES TABLE ===== */}
      {invoice.services?.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border acc-border">
            <thead className="bg-black/5">
              <tr>
                <th className="text-left p-2 border acc-border">Service</th>
                <th className="text-left p-2 border acc-border">Description</th>
                <th className="text-right p-2 border acc-border">Qty</th>
                <th className="text-right p-2 border acc-border">Rate</th>
                <th className="text-right p-2 border acc-border">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.services.map((s, i) => (
                <tr key={i}>
                  <td className="p-2 border acc-border">{s.name}</td>
                  <td className="p-2 border acc-border acc-muted">
                    {s.description || "—"}
                  </td>
                  <td className="p-2 border acc-border text-right">{s.qty}</td>
                  <td className="p-2 border acc-border text-right">
                    ₹{s.rate}
                  </td>
                  <td className="p-2 border acc-border text-right">
                    ₹{(s.qty * s.rate).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ===== TOTALS ===== */}
      <div className="grid md:grid-cols-2 gap-6">
        <div />

        <div className="border acc-border rounded-md p-4 text-sm space-y-2">
          <Row label="Subtotal" value={invoice.subtotal} />
          <Row label="Discount" value={invoice.discountAmount} />
          <Row label="Tax" value={invoice.taxAmount} />
          <Row label="Paid" value={invoice.paidAmount} />

          <div className="border-t acc-border pt-2 flex justify-between font-semibold">
            <span>Outstanding</span>
            <span className="text-red-500">₹{invoice.outstandingAmount}</span>
          </div>
        </div>
      </div>

      {/* ===== PAYMENT ===== */}
      {invoice.status !== "Paid" && (
        <div className="border acc-border rounded-md p-4 space-y-4 print:hidden">
          <h3 className="font-medium">Receive Payment</h3>

          <input
            type="number"
            placeholder="Enter paid amount"
            value={payAmount}
            onChange={(e) => setPayAmount(e.target.value)}
            className="w-full input"
          />

          <div className="flex gap-3">
            {/* Partial Payment */}
            <button
              onClick={handlePayment}
              className="flex-1 py-2 rounded-md bg-[var(--success)] text-white"
            >
              Apply Payment
            </button>

            {/* Full Payment */}
            <button
              onClick={() =>
                applyPayment(invoice.id, invoice.outstandingAmount)
              }
              className="flex-1 py-2 rounded-md border acc-border text-sm font-medium"
            >
              Pay Full Amount (₹{invoice.outstandingAmount})
            </button>
          </div>
        </div>
      )}

      {/* ===== ACTIONS ===== */}
      <div className="flex gap-3 print:hidden">
        <button
          onClick={exportInvoice}
          className="flex items-center gap-2 px-4 py-2 rounded-md border acc-border text-sm"
        >
          <Download size={16} />
          Download / Print
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="acc-muted">{label}</span>
      <span>₹{Number(value).toFixed(2)}</span>
    </div>
  );
}
