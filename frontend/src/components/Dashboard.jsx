import { useState, useEffect } from "react";
import TransactionForm from "./TransactionForm";
import TransactionOverview from "./TransactionOverview"; // Use the new component
import BudgetManager from "./BudgetManager";
import Chart from "./Chart";
import axios from "axios";

function Dashboard({ token, onLogout }) {
  const [summary, setSummary] = useState({ total_income: 0, total_expenses: 0, balance: 0 });
  const [budgetData, setBudgetData] = useState({ budget: 0, actual_expenses: 0 });
  const [transactions, setTransactions] = useState([]); // Shared state for transactions
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, budgetRes, transactionsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/summary/`, {
            headers: { Authorization: `Token ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/budget-comparison/`, {
            headers: { Authorization: `Token ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/transactions/?page=1`, {
            headers: { Authorization: `Token ${token}` },
          }),
        ]);
        setSummary(summaryRes.data);
        setBudgetData(budgetRes.data);
        setTransactions(transactionsRes.data.results || []);
        setError(""); // Clear error on successful fetch
      } catch (err) {
        setError("Failed to load dashboard data. Please try again.");
        console.error("Dashboard fetch error:", err); // Log for debugging
      }
    };
    if (token) fetchData();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Budget Tracker</h1>
        <button onClick={onLogout} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Financial Summary</h2>
          <Chart data={summary} type="bar" />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Budget Comparison</h2>
          <Chart data={budgetData} type="bar" />
        </div>
        <TransactionForm token={token} transactions={transactions} setTransactions={setTransactions} />
        <TransactionOverview token={token} transactions={transactions} />
        <BudgetManager token={token} />
      </div>
    </div>
  );
}

export default Dashboard;