"use client";

import { useState } from "react";
import { Pencil, Trash2, Save, X, Plus } from "lucide-react";
import { useLedger } from "../../context/LedgerContext";

export default function DebitLedgersPage() {
  const { ledgers, addLedger, updateLedger, deleteLedger } = useLedger();

  const debitLedgers = (ledgers || []).filter(
    (l) => l.type === "Debit"
  );

  const [form, setForm] = useState({
    name: "",
    openingBalance: "",
  });

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const addDebitLedger = () => {
    if (!form.name) return;

    addLedger({
      name: form.name,
      type: "Debit",
      openingBalance: Number(form.openingBalance || 0),
    });

    setForm({ name: "", openingBalance: "" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Debit Ledgers</h2>
        <p className="text-sm acc-muted">
          All debit-type ledger accounts
        </p>
      </div>

      {/* ADD FORM */}
      <div className="acc-card grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          className="input"
          placeholder="Ledger Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          type="number"
          className="input"
          placeholder="Opening Balance"
          value={form.openingBalance}
          onChange={(e) =>
            setForm({
              ...form,
              openingBalance: e.target.value,
            })
          }
        />

        <button
          onClick={addDebitLedger}
          className="flex items-center justify-center gap-2
          bg-[var(--primary)] text-white rounded-md"
        >
          <Plus size={16} />
          Add Debit Ledger
        </button>
      </div>

      {/* LIST */}
      <div className="acc-card overflow-x-auto">
        {debitLedgers.length === 0 ? (
          <p className="acc-muted">No debit ledgers created yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b acc-border">
                <th>Name</th>
                <th className="text-right">Opening Balance</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {debitLedgers.map((l) => (
                <tr key={l.id} className="border-b acc-border">
                  {editId !== l.id ? (
                    <>
                      <td>{l.name}</td>
                      <td className="text-right">
                        ₹{l.openingBalance}
                      </td>
                      <td className="flex gap-2 justify-end">
                        <button
                          onClick={() => {
                            setEditId(l.id);
                            setEditData(l);
                          }}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => deleteLedger(l.id)}
                          className="text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>
                        <input
                          className="input"
                          value={editData.name}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              name: e.target.value,
                            })
                          }
                        />
                      </td>

                      <td>
                        <input
                          type="number"
                          className="input text-right"
                          value={editData.openingBalance}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              openingBalance: e.target.value,
                            })
                          }
                        />
                      </td>

                      <td className="flex gap-2 justify-end">
                        <button
                          onClick={() => {
                            updateLedger(l.id, {
                              name: editData.name,
                              openingBalance: Number(
                                editData.openingBalance
                              ),
                            });
                            setEditId(null);
                          }}
                        >
                          <Save size={16} />
                        </button>
                        <button onClick={() => setEditId(null)}>
                          <X size={16} />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
