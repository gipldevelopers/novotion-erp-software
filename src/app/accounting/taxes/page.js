"use client";

import { useTaxes } from "../context/TaxContext";

export default function TaxesPage() {
  const { taxes, addTax, updateTax, deleteTax } = useTaxes();

  const addNewTax = () => {
    addTax({
      id: Date.now(),
      name: "New Tax",
      rate: 0,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Taxes</h2>
          <p className="text-sm acc-muted">
            Manage tax rates used in invoices
          </p>
        </div>

        <button
          onClick={addNewTax}
          className="px-4 py-2 rounded-md bg-[var(--primary)] text-white text-sm"
        >
          + New Tax
        </button>
      </div>

      {/* Table */}
      <div className="acc-card">
        {taxes.length === 0 ? (
          <p className="acc-muted">No taxes created yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b acc-border">
                <th className="py-2 text-left">Tax Name</th>
                <th className="py-2 text-right">Rate (%)</th>
                <th className="py-2 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {taxes.map((tax) => (
                <tr
                  key={tax.id}
                  className="border-b acc-border last:border-0"
                >
                  {/* Name */}
                  <td className="py-2">
                    <input
                      value={tax.name}
                      onChange={(e) =>
                        updateTax(tax.id, { name: e.target.value })
                      }
                      className="w-full bg-transparent border acc-border rounded-md
                      px-2 py-1 outline-none"
                    />
                  </td>

                  {/* Rate */}
                  <td className="py-2 text-right">
                    <input
                      type="number"
                      value={tax.rate}
                      onChange={(e) =>
                        updateTax(tax.id, {
                          rate: Number(e.target.value),
                        })
                      }
                      className="w-24 text-right bg-transparent border acc-border
                      rounded-md px-2 py-1 outline-none"
                    />
                  </td>

                  {/* Actions */}
                  <td className="py-2 text-right">
                    <button
                      onClick={() => deleteTax(tax.id)}
                      className="px-3 py-1 rounded-md
                      bg-red-500/10 text-red-600 text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
