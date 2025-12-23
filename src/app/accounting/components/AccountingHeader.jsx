"use client";

import { Bell, Plus, Sun, Moon, User } from "lucide-react";
import { useEffect, useState } from "react";

export default function AccountingHeader() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  return (
    <header
      className="h-16 px-4 sm:px-6 flex items-center justify-between
      acc-surface acc-border border-b"
    >
      {/* Left */}
      <h1 className="text-lg font-semibold">
        Accounting Dashboard
      </h1>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-white/5"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* New Entry */}
        {/* <button
          className="hidden sm:flex items-center gap-2 px-3 py-1.5
          rounded-md bg-[var(--primary)] text-white text-sm"
        >
          <Plus size={16} />
          New Entry
        </button> */}

        {/* Notifications */}
        <button className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-white/5">
          <Bell size={18} />
        </button>

        {/* User */}
        <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5">
          <User size={18} />
        </button>
      </div>
    </header>
  );
}
