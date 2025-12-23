"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useVendors } from "../../context/VendorContext";

export default function VendorsPage() {
  const vendorContext = useVendors?.() || { vendors: [], addVendor: () => {} };
  const { vendors, addVendor } = vendorContext;

  const [name, setName] = useState("");

  return (
    <div className="max-w-md space-y-4">
      <h2 className="text-xl font-semibold">Vendors</h2>

      <div className="acc-card space-y-2">
        <input
          className="input"
          placeholder="Vendor Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={() => {
            addVendor({ name });
            setName("");
          }}
          className="bg-[var(--primary)] text-white px-4 py-2 rounded"
        >
          Add Vendor
        </button>
      </div>

      <div className="acc-card space-y-2">
        {vendors.map((v) => (
          <div key={v.id}>{v.name}</div>
        ))}
      </div>
    </div>
  );
}
