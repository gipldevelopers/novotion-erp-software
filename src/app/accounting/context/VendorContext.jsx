"use client";
import { createContext, useContext, useEffect, useState } from "react";

const VendorContext = createContext();

export function VendorProvider({ children }) {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const d = localStorage.getItem("vendors");
    if (d) setVendors(JSON.parse(d));
  }, []);

  useEffect(() => {
    localStorage.setItem("vendors", JSON.stringify(vendors));
  }, [vendors]);

  const addVendor = (vendor) =>
    setVendors((p) => [{ id: Date.now(), ...vendor }, ...p]);

  return (
    <VendorContext.Provider value={{ vendors, addVendor }}>
      {children}
    </VendorContext.Provider>
  );
}

export const useVendors = () => useContext(VendorContext);
