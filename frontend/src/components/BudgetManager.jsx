import { useState, useEffect } from "react";
import axios from "axios";

function BudgetManager({ token }) {
  const [budget, setBudget] = useState("");
  const [currentBudget, setCurrentBudget] = useState(null);
  const [error, setError] = useState("");

  const fetchCurrentBudget = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/budgets/`, {
        headers: { Authorization: `Token ${token}` },
      });
      const today = new Date();
      const currentMonthBudget = response.data.results.find(
        (b) => new Date(b.month).getMonth() === today.getMonth()
      );
      setCurrentBudget(currentMonthBudget || null);
      setError("");
    } catch (err) {
      setError("Failed to load budget. Please try again.");
      console.error("Budget fetch error:", err);
    }
  };

  useEffect(() => {
    if (token) fetchCurrentBudget();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const today = new Date();
      const monthStart = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`;
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/budgets/`,
        { month: monthStart, amount: budget },
        { headers: { Authorization: `Token ${token}` } }
      );
      setBudget("");
      fetchCurrentBudget();
    } catch (err) {
      setError("Failed to set budget. Please try again.");
      console.error("Budget submit error:", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mt-6">
      <h2 className="text-xl font-semibold mb-4">Budget Management</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {currentBudget ? (
        <p>Current Budget: ${currentBudget.amount}</p>
      ) : (
        <p>No budget set for this month.</p>
      )}
      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="number"
          placeholder="Set Monthly Budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
          Set Budget
        </button>
      </form>
    </div>
  );
}

export default BudgetManager;