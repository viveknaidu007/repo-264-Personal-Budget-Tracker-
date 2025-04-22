import { useState, useEffect } from "react";
import axios from "axios";

function TransactionOverview({ token, transactions }) {
  const [error, setError] = useState("");

  // Static categories for mapping
  const staticCategories = [
    { id: 1, name: "Food" },
    { id: 2, name: "Travel" },
    { id: 3, name: "Entertainment" },
    { id: 4, name: "Utilities" },
  ];

  // Get category name from id
  const getCategoryName = (categoryId) => {
    if (!categoryId) return "N/A"; // Handle null or undefined
    const category = staticCategories.find((cat) => cat.id === parseInt(categoryId));
    return category ? category.name : "N/A";
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mt-6">
      <h2 className="text-xl font-semibold mb-4">Transaction Overview</h2>
      <div className="flex justify-between mb-2">
        <input type="date" className="p-2 border rounded" />
        <input type="text" placeholder="Category ID" className="p-2 border rounded" />
        <input type="number" placeholder="Min Amount" className="p-2 border rounded" />
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
              <td className="p-2">{transaction.amount}</td>
              <td className="p-2">{new Date(transaction.date).toLocaleDateString()}</td>
              <td className="p-2">{transaction.description || "N/A"}</td>
              <td className="p-2">{transaction.type}</td>
              <td className="p-2">
                <button className="text-red-500">Delete</button>
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