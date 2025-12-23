"use client";
import { createContext, useContext, useEffect, useState } from "react";

const CustomerContext = createContext();

export function CustomerProvider({ children }) {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem("customers");
    if (data) setCustomers(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem("customers", JSON.stringify(customers));
  }, [customers]);

  const addCustomer = (customer) =>
    setCustomers((p) => [{ id: Date.now(), ...customer }, ...p]);

  return (
    <CustomerContext.Provider value={{ customers, addCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
}

export const useCustomers = () => useContext(CustomerContext);
