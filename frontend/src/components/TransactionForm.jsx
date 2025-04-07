import { useState, useEffect } from "react";
import axios from "axios";

function TransactionForm({ token }) {
  const [categories, setCategories] = useState([]); // Always an array
  const [formData, setFormData] = useState({
    category_id: "",
    amount: "",
    date: "",
    description: "",
    type: "income",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/categories/", {
          headers: { Authorization: `Token ${token}` },
        });
        console.log("Categories response:", response.data); // Debug raw response
        const data = Array.isArray(response.data) ? response.data : []; // Force array
        console.log("Processed categories:", data); // Debug processed data
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err.response?.data || err.message);
        setError("Failed to load categories. Please try again.");
        setCategories([]); // Fallback to empty array
      }
    };
    if (token) fetchCategories();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/transactions/", formData, {
        headers: { Authorization: `Token ${token}` },
      });
      setFormData({ category_id: "", amount: "", date: "", description: "", type: "income" });
    } catch (err) {
      console.error("Error adding transaction:", err.response?.data || err.message);
      setError("Failed to add transaction. Please try again.");
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
          disabled={categories.length === 0}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
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
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Add Transaction
        </button>
      </form>
    </div>
  );
}

export default TransactionForm;