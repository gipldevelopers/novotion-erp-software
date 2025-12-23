import PaymentForm from "../components/PaymentForm";
import PaymentsTable from "../components/PaymentsTable";

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Payments
        </h2>
        <p className="text-sm acc-muted mt-1">
          Receive and pay money with proper records
        </p>
      </div>

      {/* Form + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PaymentForm />
        <div className="lg:col-span-2">
          <PaymentsTable />
        </div>
      </div>
    </div>
  );
}
