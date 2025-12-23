"use client";

import { usePayments } from "../../context/PaymentContext";

export default function PaymentHistory() {
  const { payments } = usePayments();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Payment History</h2>

      <div className="acc-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b acc-border">
              <th>Date</th>
              <th>Invoice</th>
              <th>Mode</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id} className="border-b acc-border">
                <td>{p.date}</td>
                <td>{p.invoiceId}</td>
                <td>{p.mode}</td>
                <td className="text-right">₹{p.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
