import StatCard from "./components/StatCard";
import RecentTransactions from "./components/RecentTransactions";

export default function AccountingPage() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Revenue" value="₹12,40,000" variant="revenue" />
        <StatCard title="Expenses" value="₹4,10,000" variant="expense" />
        <StatCard title="Net Profit" value="₹8,30,000" variant="profit" />
        <StatCard
          title="Pending Payments"
          value="₹1,20,000"
          variant="pending"
        />
      </div>

      {/* Transactions */}
      <RecentTransactions />
    </div>
  );
}
