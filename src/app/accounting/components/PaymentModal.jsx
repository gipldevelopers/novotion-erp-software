"use client";

import { useState } from 'react';
import { X } from 'lucide-react';

export default function PaymentModal({ invoice, onClose, onPayment }) {
  const [paymentData, setPaymentData] = useState({
    amount: invoice.balance,
    date: new Date().toISOString().split('T')[0],
    method: 'Cash',
    note: '',
  });

  const paymentMethods = ['Cash', 'Bank Transfer', 'Credit Card', 'Cheque', 'Online'];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (paymentData.amount <= 0 || paymentData.amount > invoice.balance) {
      alert('Please enter a valid payment amount');
      return;
    }

    onPayment({
      ...paymentData,
      id: Date.now(),
      amount: parseFloat(paymentData.amount),
    });
  };

  const handleFullPayment = () => {
    setPaymentData({
      ...paymentData,
      amount: invoice.balance,
    });
  };

  const handlePartialPayment = () => {
    const half = invoice.balance / 2;
    setPaymentData({
      ...paymentData,
      amount: half.toFixed(2),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Add Payment</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Payment Amount *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  {invoice.currencySymbol}
                </span>
                <input
                  type="number"
                  min="0.01"
                  max={invoice.balance}
                  step="0.01"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({
                    ...paymentData,
                    amount: e.target.value
                  })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Balance due: {invoice.currencySymbol}{invoice.balance.toFixed(2)}
              </p>
              
              {/* Quick Amount Buttons */}
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={handleFullPayment}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Full Amount
                </button>
                <button
                  type="button"
                  onClick={handlePartialPayment}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Half Amount
                </button>
              </div>
            </div>

            {/* Payment Date */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Payment Date *
              </label>
              <input
                type="date"
                value={paymentData.date}
                onChange={(e) => setPaymentData({
                  ...paymentData,
                  date: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Payment Method *
              </label>
              <select
                value={paymentData.method}
                onChange={(e) => setPaymentData({
                  ...paymentData,
                  method: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {paymentMethods.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={paymentData.note}
                onChange={(e) => setPaymentData({
                  ...paymentData,
                  note: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows="3"
                placeholder="Add any notes about this payment..."
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
              >
                Record Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}