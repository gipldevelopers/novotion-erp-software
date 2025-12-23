"use client";

const ledgers = [
  {
    id: 1,
    name: "Cash",
    type: "Asset",
    balance: "₹1,25,000",
    status: "Active",
  },
  {
    id: 2,
    name: "Bank Account",
    type: "Asset",
    balance: "₹4,80,000",
    status: "Active",
  },
  {
    id: 3,
    name: "Office Rent",
    type: "Expense",
    balance: "₹12,000",
    status: "Active",
  },
  {
    id: 4,
    name: "Client Advance",
    type: "Liability",
    balance: "₹8,000",
    status: "Pending",
  },
];

export default function LedgerTable() {
  return (
    <div className="acc-card">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b acc-border">
              <th className="py-3 text-left acc-muted font-medium">
                Ledger Name
              </th>
              <th className="py-3 text-left acc-muted font-medium">
                Type
              </th>
              <th className="py-3 text-right acc-muted font-medium">
                Balance
              </th>
              <th className="py-3 text-left acc-muted font-medium">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {ledgers.map((ledger) => (
              <tr
                key={ledger.id}
                className="border-b acc-border last:border-0"
              >
                <td className="py-3 font-medium">
                  {ledger.name}
                </td>

                <td className="py-3">
                  {ledger.type}
                </td>

                <td className="py-3 text-right font-semibold">
                  {ledger.balance}
                </td>

                <td className="py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs
                    ${
                      ledger.status === "Active"
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {ledger.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {ledgers.map((ledger) => (
          <div
            key={ledger.id}
            className="border acc-border rounded-xl p-4"
          >
            <div className="flex justify-between items-center">
              <p className="font-medium">{ledger.name}</p>
              <span className="font-semibold">
                {ledger.balance}
              </span>
            </div>

            <div className="flex justify-between text-sm acc-muted mt-2">
              <span>{ledger.type}</span>
              <span>{ledger.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
