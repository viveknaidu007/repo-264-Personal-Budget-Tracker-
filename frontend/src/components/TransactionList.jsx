import { useState, useEffect } from "react";
import axios from "axios";

function TransactionList({ token }) {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ date: "", category: "", amount: "" });
  const [totalPages, setTotalPages] = useState(1);

  const fetchTransactions = async () => {
    const params = { page, ...filters };
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/transactions/`, {
      headers: { Authorization: `Token ${token}` },
      params,
    });
    setTransactions(response.data.results);
    setTotalPages(Math.ceil(response.data.count / 10));
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, filters]);

  const handleDelete = async (id) => {
    await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/transactions/${id}/`, {
      headers: { Authorization: `Token ${token}` },
    });
    fetchTransactions();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mt-6">
      <h2 className="text-xl font-semibold mb-4">Transaction Overview</h2>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
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
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Category</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Date</th>
            <th className="p-2">Description</th>
            <th className="p-2">Type</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr key={txn.id} className="border-b">
              <td className="p-2">{txn.category.name}</td>
              <td className="p-2">{txn.amount}</td>
              <td className="p-2">{txn.date}</td>
              <td className="p-2">{txn.description}</td>
              <td className="p-2">{txn.type}</td>
              <td className="p-2">
                <button
                  onClick={() => handleDelete(txn.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-400"
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default TransactionList;