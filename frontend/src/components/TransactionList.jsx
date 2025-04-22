import { useState, useEffect } from "react";
import axios from "axios";

function TransactionOverview({ token, transactions, setTransactions }) {
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ date: "", category: "", amount: "" });

  // Static categories for mapping (as fallback)
  const staticCategories = [
    { id: 1, name: "Food" },
    { id: 2, name: "Travel" },
    { id: 3, name: "Entertainment" },
    { id: 4, name: "Utilities" },
  ];

  // Get category name from id
  const getCategoryName = (categoryId) => {
    if (!categoryId) return "Uncategorized"; // Handle null or undefined
    const category = staticCategories.find((cat) => cat.id === parseInt(categoryId));
    return category ? category.name : "Uncategorized";
  };

  // Handle delete transaction
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/transactions/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      // Update transactions by filtering out the deleted one
      setTransactions(transactions.filter((txn) => txn.id !== id));
      setError("");
    } catch (err) {
      setError("Failed to delete transaction. Please try again.");
      console.error("Delete transaction error:", err);
    }
  };

  // Handle filter application
  const applyFilters = async () => {
    try {
      const params = { ...filters };
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/transactions/`, {
        headers: { Authorization: `Token ${token}` },
        params,
      });
      setTransactions(response.data.results || []);
      setError("");
    } catch (err) {
      setError("Failed to load filtered transactions. Please try again.");
      console.error("Filter transactions error:", err);
    }
  };

  // Apply filters when they change
  useEffect(() => {
    if (token) applyFilters();
  }, [filters, token]);

  return (
    <div className="bg-white p-6 rounded-lg shadow mt-6">
      <h2 className="text-xl font-semibold mb-4">Transaction Overview</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex justify-between mb-4 gap-4">
        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Category ID"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Min Amount"
          value={filters.amount}
          onChange={(e) => setFilters({ ...filters, amount: e.target.value })}
          className="p-2 border rounded"
        />
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-t">
              <td className="p-2">{getCategoryName(transaction.category)}</td>
              <td className="p-2">{parseFloat(transaction.amount).toFixed(2)}</td>
              <td className="p-2">
                {new Date(transaction.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>
              <td className="p-2">{transaction.description || "N/A"}</td>
              <td className="p-2">{transaction.type}</td>
              <td className="p-2">
                <button
                  onClick={() => handleDelete(transaction.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-2">
        <button className="p-2 bg-gray-300 rounded">Previous</button>
        <span>Page 1 of 1</span>
        <button className="p-2 bg-gray-300 rounded">Next</button>
      </div>
    </div>
  );
}

export default TransactionOverview;