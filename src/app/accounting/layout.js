import "./accounting.css";

import { InvoiceProvider } from "./context/InvoiceContext";
import { PaymentProvider } from "./context/PaymentContext";
import { LedgerProvider } from "./context/LedgerContext";
import { ExpenseProvider } from "./context/ExpenseContext";
import { TaxProvider } from "./context/TaxContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { CustomerProvider } from "./context/CustomerContext"; // ✅ ADD THIS

import AccountingSidebar from "./components/AccountingSidebar";
import AccountingHeader from "./components/AccountingHeader";

export default function AccountingLayout({ children }) {
  return (
    <InvoiceProvider>
      <PaymentProvider>
        <LedgerProvider>
          <ExpenseProvider>
            <CustomerProvider> {/* ✅ IMPORTANT */}
              <TaxProvider>
                <CurrencyProvider>
                  {/* Layout wrapper used for print isolation */}
                  <div className="accounting-layout flex min-h-screen acc-bg acc-text">
                    <AccountingSidebar />

                    <div className="flex flex-1 flex-col">
                      <AccountingHeader />

                      <main className="p-4 sm:p-6 space-y-6">
                        {children}
                      </main>
                    </div>
                  </div>
                </CurrencyProvider>
              </TaxProvider>
            </CustomerProvider>
          </ExpenseProvider>
        </LedgerProvider>
      </PaymentProvider>
    </InvoiceProvider>
  );
}
