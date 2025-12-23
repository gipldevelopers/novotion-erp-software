"use client";

import { createContext, useContext, useEffect, useState } from "react";

const TaxContext = createContext();

export function TaxProvider({ children }) {
  const [taxes, setTaxes] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("taxes");
    if (stored) setTaxes(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("taxes", JSON.stringify(taxes));
  }, [taxes]);

  const addTax = (tax) => {
    setTaxes((prev) => [...prev, tax]);
  };

  const updateTax = (id, updated) => {
    setTaxes((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
    );
  };

  const deleteTax = (id) => {
    setTaxes((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <TaxContext.Provider
      value={{ taxes, addTax, updateTax, deleteTax }}
    >
      {children}
    </TaxContext.Provider>
  );
}

export const useTaxes = () => useContext(TaxContext);
