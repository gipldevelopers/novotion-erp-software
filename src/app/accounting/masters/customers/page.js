"use client";

import { useState } from "react";
import { Pencil, Trash2, Save, X } from "lucide-react";
import { useCustomers } from "../../context/CustomerContext";

export default function CustomersPage() {
  const {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  } = useCustomers();

  const [form, setForm] = useState({ name: "", email: "" });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-xl font-semibold">Customers</h2>

      {/* ADD CUSTOMER */}
      <div className="acc-card space-y-3">
        <input
          className="input"
          placeholder="Customer Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />
        <input
          className="input"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />
        <button
          onClick={() => {
            addCustomer(form);
            setForm({ name: "", email: "" });
          }}
          className="bg-[var(--primary)] text-white px-4 py-2 rounded"
        >
          Add Customer
        </button>
      </div>

      {/* LIST */}
      <div className="acc-card">
        {customers.map((c) => (
          <div
            key={c.id}
            className="flex justify-between items-center border-b acc-border py-2"
          >
            {editId !== c.id ? (
              <>
                <div>
                  <strong>{c.name}</strong>
                  <p className="text-xs acc-muted">{c.email}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditId(c.id);
                      setEditData(c);
                    }}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => deleteCustomer(c.id)}
                    className="text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex gap-2 w-full">
                <input
                  className="input flex-1"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      name: e.target.value,
                    })
                  }
                />
                <input
                  className="input flex-1"
                  value={editData.email}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      email: e.target.value,
                    })
                  }
                />
                <button
                  onClick={() => {
                    updateCustomer(c.id, editData);
                    setEditId(null);
                  }}
                >
                  <Save size={16} />
                </button>
                <button onClick={() => setEditId(null)}>
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
