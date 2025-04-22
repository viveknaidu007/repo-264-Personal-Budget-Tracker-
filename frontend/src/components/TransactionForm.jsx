import { useState } from "react";
import axios from "axios";

function TransactionForm({ token, transactions, setTransactions }) {
  const [formData, setFormData] = useState({
    category_id: "",
    amount: "",
    date: "",
    description: "",
    type: "income",
  });
  const [error, setError] = useState("");

  const staticCategories = [
    { id: 1, name: "Food" },
    { id: 2, name: "Travel" },
    { id: 3, name: "Entertainment" },
    { id: 4, name: "Utilities" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...(formData.category_id && { category: formData.category_id }),
        amount: parseFloat(formData.amount) || 0,
        date: formData.date,
        description: formData.description || "",
        type: formData.type,
      };
      if (!payload.amount || !payload.date || !payload.type) {
        throw new Error("Amount, date, and type are required fields.");
      }
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/transactions/`, payload, {
        headers: { Authorization: `Token ${token}` },
      });
      setTransactions((prevTransactions) => [response.data, ...prevTransactions]); // Update state
      setFormData({ category_id: "", amount: "", date: "", description: "", type: "income" });
      setError("");
    } catch (err) {
      setError(err.response?.data?.error?.[0] || err.message || "Failed to add transaction. Please try again.");
      console.error("Transaction submit error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <select
          value={formData.category_id}
          onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
          className="w-full p-2 border rounded mb-4"
          required
        >
          <option value="">Select Category</option>
          {staticCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Amount"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-2 border rounded mb-4"
        />
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full p-2 border rounded mb-4"
          required
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
          Add Transaction
        </button>
      </form>
    </div>
  );
}

export default TransactionForm;