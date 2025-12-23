"use client";

import { useState } from "react";
import { useCurrency } from "../context/CurrencyContext";

export default function CurrencyPage() {
  const { currencies, addCurrency, updateRate } = useCurrency();

  const [code, setCode] = useState("");
  const [symbol, setSymbol] = useState("");
  const [name, setName] = useState("");
  const [rate, setRate] = useState("");

  const saveCurrency = () => {
    addCurrency({
      code,
      symbol,
      name,
      rate: Number(rate),
      isBase: false
    });

    setCode(""); setSymbol(""); setName(""); setRate("");
  };

  return (
    <div className="space-y-6 max-w-xl">
      <h2 className="text-xl font-semibold">Currencies</h2>

      <div className="acc-card space-y-3">
        <input className="input" placeholder="Code (USD)" onChange={e => setCode(e.target.value)} />
        <input className="input" placeholder="Symbol ($)" onChange={e => setSymbol(e.target.value)} />
        <input className="input" placeholder="Name" onChange={e => setName(e.target.value)} />
        <input className="input" placeholder="Rate vs Base" type="number" onChange={e => setRate(e.target.value)} />

        <button
          onClick={saveCurrency}
          className="bg-[var(--primary)] text-white py-2 rounded-md"
        >
          Add Currency
        </button>
      </div>

      <div className="acc-card">
        {currencies.map(c => (
          <div key={c.code} className="flex justify-between py-2 border-b acc-border">
            <span>{c.code} ({c.symbol})</span>
            {!c.isBase && (
              <input
                type="number"
                value={c.rate}
                onChange={e => updateRate(c.code, Number(e.target.value))}
                className="w-24 input"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
