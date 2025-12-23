"use client";

import { createContext, useContext, useEffect, useState } from "react";

const InvoiceContext = createContext();

export function InvoiceProvider({ children }) {
  const [invoices, setInvoices] = useState([]);

  /* ---------------------------------
     LOAD FROM LOCAL STORAGE
  ---------------------------------- */
  useEffect(() => {
    const stored = localStorage.getItem("invoices");
    if (stored) {
      setInvoices(JSON.parse(stored));
    }
  }, []);

  /* ---------------------------------
     SAVE TO LOCAL STORAGE
  ---------------------------------- */
  useEffect(() => {
    localStorage.setItem("invoices", JSON.stringify(invoices));
  }, [invoices]);

  /* ---------------------------------
     ADD NEW INVOICE
  ---------------------------------- */
  const addInvoice = (invoice) => {
    setInvoices((prev) => [
      {
        ...invoice,
        paidAmount: 0,
        outstandingAmount: invoice.total,
        status: invoice.status || "Pending",
      },
      ...prev,
    ]);
  };

  /* ---------------------------------
     GET INVOICE BY ID
  ---------------------------------- */
  const getInvoiceById = (id) => {
    return invoices.find((inv) => inv.id === id);
  };

  /* ---------------------------------
     UPDATE INVOICE (EDIT)
  ---------------------------------- */
  const updateInvoice = (id, updates) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id
          ? {
              ...inv,
              ...updates,
              outstandingAmount:
                inv.total - (inv.paidAmount || 0),
            }
          : inv
      )
    );
  };

  /* ---------------------------------
     APPLY PAYMENT (PARTIAL / FULL)
  ---------------------------------- */
  const applyPayment = (id, amount) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== id) return inv;

        const newPaidAmount = (inv.paidAmount || 0) + amount;
        const outstanding = inv.total - newPaidAmount;

        return {
          ...inv,
          paidAmount: newPaidAmount,
          outstandingAmount:
            outstanding > 0 ? outstanding : 0,
          status: outstanding <= 0 ? "Paid" : "Pending",
        };
      })
    );
  };

  /* ---------------------------------
     DELETE INVOICE (OPTIONAL)
  ---------------------------------- */
  const deleteInvoice = (id) => {
    setInvoices((prev) =>
      prev.filter((inv) => inv.id !== id)
    );
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        addInvoice,
        getInvoiceById,
        updateInvoice,
        applyPayment,
        deleteInvoice,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

/* ---------------------------------
   HOOK
---------------------------------- */
export const useInvoices = () => useContext(InvoiceContext);
