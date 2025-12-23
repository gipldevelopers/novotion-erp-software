"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useInvoices } from "../../context/InvoiceContext";
import { useTaxes } from "../../context/TaxContext";

export default function NewInvoicePage() {
  const router = useRouter();
  const { addInvoice } = useInvoices();
  const { taxes } = useTaxes();

  const [client, setClient] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [services, setServices] = useState([
    { name: "", description: "", qty: 1, rate: 0 },
  ]);

  const [discountType, setDiscountType] = useState("PERCENT");
  const [discountValue, setDiscountValue] = useState(0);
  const [taxId, setTaxId] = useState("");

  const selectedTax = taxes.find((t) => t.id === taxId);

  // 🔢 Calculations
  const subtotal = services.reduce(
    (sum, s) => sum + s.qty * s.rate,
    0
  );

  const discountAmount =
    discountType === "PERCENT"
      ? (subtotal * discountValue) / 100
      : discountValue;

  const taxableAmount = Math.max(subtotal - discountAmount, 0);

  const taxAmount = selectedTax
    ? (taxableAmount * selectedTax.rate) / 100
    : 0;

  const total = taxableAmount + taxAmount;

  // 🧩 Handlers
  const updateService = (index, field, value) => {
    const updated = [...services];
    updated[index][field] = value;
    setServices(updated);
  };

  const addService = () => {
    setServices([
      ...services,
      { name: "", description: "", qty: 1, rate: 0 },
    ]);
  };

  const removeService = (index) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const saveInvoice = () => {
    addInvoice({
      id: "INV-" + Date.now(),
      client,
      services,
      subtotal,
      discountType,
      discountValue,
      discountAmount,
      taxableAmount,
      taxName: selectedTax?.name || null,
      taxRate: selectedTax?.rate || 0,
      taxAmount,
      total,
      paidAmount: 0,
      outstandingAmount: total,
      status: "Pending",
      dueDate,
    });

    router.push("/accounting/invoices");
  };

  return (
    <div className="max-w-3xl mx-auto acc-card p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold">Create Invoice</h2>
        <p className="text-sm opacity-70">
          Add services and generate invoice
        </p>
      </div>

      {/* Client */}
      <div>
        <label className="text-sm font-medium">Client Name</label>
        <input
          className="input w-full mt-1"
          placeholder="Client name"
          onChange={(e) => setClient(e.target.value)}
        />
      </div>

      {/* Services */}
      <div className="space-y-4">
        <h3 className="font-semibold">Services</h3>

        {services.map((s, index) => (
          <div
            key={index}
            className="border acc-border rounded-lg p-4 space-y-3"
          >
            <div className="grid md:grid-cols-2 gap-3">
              <input
                className="input"
                placeholder="Service name"
                value={s.name}
                onChange={(e) =>
                  updateService(index, "name", e.target.value)
                }
              />

              <input
                className="input"
                placeholder="Rate"
                type="number"
                value={s.rate}
                onChange={(e) =>
                  updateService(index, "rate", Number(e.target.value))
                }
              />
            </div>

            <textarea
              className="input w-full"
              placeholder="Service description"
              value={s.description}
              onChange={(e) =>
                updateService(index, "description", e.target.value)
              }
            />

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  className="input w-24"
                  value={s.qty}
                  onChange={(e) =>
                    updateService(index, "qty", Number(e.target.value))
                  }
                />
                <span className="text-sm opacity-70 self-center">
                  Qty
                </span>
              </div>

              <div className="text-sm font-medium">
                ₹{(s.qty * s.rate).toFixed(2)}
              </div>

              {services.length > 1 && (
                <button
                  onClick={() => removeService(index)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          onClick={addService}
          className="text-sm font-medium underline opacity-80 hover:opacity-100"
        >
          + Add Service
        </button>
      </div>

      {/* Discount & Tax */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Discount</label>
          <div className="flex gap-2 mt-1">
            <select
              className="input w-24"
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
            >
              <option value="PERCENT">%</option>
              <option value="FLAT">₹</option>
            </select>
            <input
              type="number"
              className="input flex-1"
              onChange={(e) =>
                setDiscountValue(Number(e.target.value))
              }
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Tax</label>
          <select
            className="input w-full mt-1"
            onChange={(e) => setTaxId(e.target.value)}
          >
            <option value="">No Tax</option>
            {taxes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.rate}%)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Due Date */}
      <div>
        <label className="text-sm font-medium">Due Date</label>
        <input
          type="date"
          className="input w-full mt-1"
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      {/* Summary */}
      <div className="border acc-border rounded-lg p-4 space-y-2">
        <SummaryRow label="Subtotal" value={subtotal} />
        <SummaryRow label="Discount" value={discountAmount} />
        <SummaryRow label="Tax" value={taxAmount} />
        <div className="border-t acc-border pt-2 flex justify-between font-semibold">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={saveInvoice}
        className="w-full py-2.5 bg-[var(--primary)] text-white rounded-md font-medium transition hover:opacity-90"
      >
        Save Invoice
      </button>
    </div>
  );
}

const SummaryRow = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <span className="opacity-80">{label}</span>
    <span>₹{value.toFixed(2)}</span>
  </div>
);
