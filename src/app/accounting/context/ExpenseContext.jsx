"use client";

import { createContext, useContext, useState } from "react";

const ExpenseContext = createContext();

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState([]);

  const addExpense = (expense) => {
    setExpenses((prev) => [
      {
        id: "EXP-" + Date.now(),
        ...expense,
      },
      ...prev,
    ]);
  };

  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const totalExpense = expenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        addExpense,
        deleteExpense,
        totalExpense,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpenses = () => useContext(ExpenseContext);
