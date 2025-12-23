"use client";

import { createContext, useContext, useEffect, useState } from "react";

const PaymentContext = createContext();

export function PaymentProvider({ children }) {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem("payments");
    if (data) setPayments(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem("payments", JSON.stringify(payments));
  }, [payments]);

  const addPayment = (payment) => {
    setPayments((prev) => [payment, ...prev]);
  };

  return (
    <PaymentContext.Provider value={{ payments, addPayment }}>
      {children}
    </PaymentContext.Provider>
  );
}

export const usePayments = () => useContext(PaymentContext);
