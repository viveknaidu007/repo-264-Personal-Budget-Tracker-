import { useState } from "react";
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";
import BudgetManager from "./BudgetManager";
import Chart from "./Chart";
import axios from "axios";

function Dashboard({ token, onLogout }) {
  const [summary, setSummary] = useState({ total_income: 0, total_expenses: 0, balance: 0 });
  const [budgetData, setBudgetData] = useState({ budget: 0, actual_expenses: 0 });

  const fetchSummary = async () => {
    const response = await axios.get("http://localhost:8000/api/summary/", {
      headers: { Authorization: `Token ${token}` },
    });
    setSummary(response.data);
  };

  const fetchBudgetComparison = async () => {
    const response = await axios.get("http://localhost:8000/api/budget-comparison/", {
      headers: { Authorization: `Token ${token}` },
    });
    setBudgetData(response.data);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Budget Tracker</h1>
        <button onClick={onLogout} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Financial Summary</h2>
          <Chart data={summary} type="bar" />
          <button onClick={fetchSummary} className="mt-4 bg-blue-500 text-white p-2 rounded">
            Refresh Summary
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Budget Comparison</h2>
          <Chart data={budgetData} type="bar" />
          <button onClick={fetchBudgetComparison} className="mt-4 bg-blue-500 text-white p-2 rounded">
            Refresh Budget
          </button>
        </div>

        <TransactionForm token={token} />
        <TransactionList token={token} />
        <BudgetManager token={token} />
      </div>
    </div>
  );
}

export default Dashboard;