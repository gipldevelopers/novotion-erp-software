"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [currencies, setCurrencies] = useState([]);
  const [baseCurrency, setBaseCurrency] = useState(null);

  /* Load */
  useEffect(() => {
    const stored = localStorage.getItem("currencies");
    if (stored) {
      const data = JSON.parse(stored);
      setCurrencies(data);
      setBaseCurrency(data.find(c => c.isBase));
    } else {
      // Default INR
      const defaultCurrency = {
        code: "INR",
        symbol: "₹",
        name: "Indian Rupee",
        rate: 1,
        isBase: true
      };
      setCurrencies([defaultCurrency]);
      setBaseCurrency(defaultCurrency);
    }
  }, []);

  /* Save */
  useEffect(() => {
    localStorage.setItem("currencies", JSON.stringify(currencies));
  }, [currencies]);

  const addCurrency = (currency) => {
    setCurrencies(prev => [...prev, currency]);
  };

  const updateRate = (code, rate) => {
    setCurrencies(prev =>
      prev.map(c =>
        c.code === code ? { ...c, rate } : c
      )
    );
  };

  return (
    <CurrencyContext.Provider
      value={{
        currencies,
        baseCurrency,
        addCurrency,
        updateRate
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
