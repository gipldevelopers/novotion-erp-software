"use client";
import { createContext, useContext, useEffect, useState } from "react";

const LedgerContext = createContext();

export function LedgerProvider({ children }) {
  const [ledgers, setLedgers] = useState([]);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const l = localStorage.getItem("ledgers");
    const e = localStorage.getItem("ledgerEntries");
    if (l) setLedgers(JSON.parse(l));
    if (e) setEntries(JSON.parse(e));
  }, []);

  useEffect(() => {
    localStorage.setItem("ledgers", JSON.stringify(ledgers));
  }, [ledgers]);

  useEffect(() => {
    localStorage.setItem("ledgerEntries", JSON.stringify(entries));
  }, [entries]);

  const addLedger = (ledger) =>
    setLedgers((p) => [{ id: Date.now(), ...ledger }, ...p]);

  const addEntry = (entry) =>
    setEntries((p) => [...p, { id: Date.now(), ...entry }]);

  return (
    <LedgerContext.Provider
      value={{ ledgers, entries, addLedger, addEntry }}
    >
      {children}
    </LedgerContext.Provider>
  );
}

export const useLedger = () => useContext(LedgerContext);
