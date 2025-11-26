import { useState } from "react";

function AddExpenseForm({ onAdd }) {
  const [form, setForm] = useState({
    date: "",
    amount: "",
    category: "",
    description: "",
    importance: "Medium",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.date || !form.amount || !form.category || !form.importance) {
      setError("Please fill all required fields.");
      return;
    }
    if (Number(form.amount) <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    onAdd({ ...form, amount: Number(form.amount) });
    setForm({ date: "", amount: "", category: "", description: "", importance: "Medium" });
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="card rounded-2xl shadow p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2" style={{color: '#D8E4F3'}}>Add Expense</h3>

      {error && <p className="text-sm mb-2" style={{color: '#81367D'}}>{error}</p>}

      <div className="grid grid-cols-2 gap-2">
        <input type="date" name="date" value={form.date} onChange={handleChange}
          className="border rounded p-2 w-full" style={{borderColor: '#81367D', backgroundColor: 'rgba(129, 54, 125, 0.1)', color: '#D8E4F3'}} required />
        <input type="number" name="amount" placeholder="Amount" value={form.amount}
          onChange={handleChange} className="border rounded p-2 w-full" style={{borderColor: '#81367D', backgroundColor: 'rgba(129, 54, 125, 0.1)', color: '#D8E4F3'}} required />
      </div>

      <input type="text" name="category" placeholder="Category"
        value={form.category} onChange={handleChange}
        className="border rounded p-2 w-full mt-2" style={{borderColor: '#81367D', backgroundColor: 'rgba(129, 54, 125, 0.1)', color: '#D8E4F3'}} required />

      <textarea name="description" placeholder="Description (optional)"
        value={form.description} onChange={handleChange}
        className="border rounded p-2 w-full mt-2" style={{borderColor: '#81367D', backgroundColor: 'rgba(129, 54, 125, 0.1)', color: '#D8E4F3'}} />

      <select name="importance" value={form.importance} onChange={handleChange}
        className="border rounded p-2 w-full mt-2" style={{borderColor: '#81367D', backgroundColor: 'rgba(129, 54, 125, 0.1)', color: '#D8E4F3'}}>
        <option value="Low">Low Importance</option>
        <option value="Medium">Medium Importance</option>
        <option value="High">High Importance</option>
      </select>

      <button type="submit"
        className="mt-3 text-white font-semibold px-4 py-2 rounded w-full hover:opacity-90"
        style={{backgroundColor: '#81367D'}}>
        ➕ Add Expense
      </button>
    </form>
  );
}

export default AddExpenseForm;
