import { useState } from "react";

function AddIncomeForm({ onAdd }) {
  const [form, setForm] = useState({
    date: "",
    amount: "",
    category: "",
    description: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.date || !form.amount || !form.category) {
      setError("Please fill all required fields.");
      return;
    }
    if (Number(form.amount) <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    onAdd({ ...form, amount: Number(form.amount) });
    setForm({ date: "", amount: "", category: "", description: "" });
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-2xl shadow p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2 text-gray-100">Add Income</h3>

      {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

      <div className="grid grid-cols-2 gap-2">
        <input type="date" name="date" value={form.date}
          onChange={handleChange} className="border border-gray-600 rounded p-2 w-full bg-gray-700 text-gray-100" required />
        <input type="number" name="amount" placeholder="Amount" value={form.amount}
          onChange={handleChange} className="border border-gray-600 rounded p-2 w-full bg-gray-700 text-gray-100" required />
      </div>

      <input type="text" name="category" placeholder="Category"
        value={form.category} onChange={handleChange}
        className="border border-gray-600 rounded p-2 w-full mt-2 bg-gray-700 text-gray-100" required />

      <textarea name="description" placeholder="Description (optional)"
        value={form.description} onChange={handleChange}
        className="border border-gray-600 rounded p-2 w-full mt-2 bg-gray-700 text-gray-100" />

      <button type="submit"
        className="mt-3 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded w-full">
        ➕ Add Income
      </button>
    </form>
  );
}

export default AddIncomeForm;
