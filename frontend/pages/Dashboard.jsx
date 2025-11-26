import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../src/auth/AuthContext";
import AnalyticsPanel from "../components/AnalyticsPanel";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [balance, setBalance] = useState(0);

  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchAll = async () => {
    try {
      const [expRes, incRes, sumRes] = await Promise.all([
        axios.get("/api/expenses"),
        axios.get("/api/incomes"),
        axios.get("/api/analytics/summary"),
      ]);
      setExpenses(expRes.data);
      setIncomes(incRes.data);
      setBalance(sumRes.data.balance);
    } catch (err) {
      console.error('Error fetching dashboard data:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        headers: err.config?.headers
      });
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const payload = Object.fromEntries(form.entries());
    payload.amount = parseFloat(payload.amount);
    payload.date = new Date(payload.date);

    try {
      if (editItem) {
        await axios.put(`/api/expenses/${editItem._id}`, payload);
      } else {
        await axios.post("/api/expenses", payload);
      }
      setShowExpenseForm(false);
      setEditItem(null);
      await fetchAll();
    } catch (err) {
      alert("Error saving expense: " + err.response?.data?.message || err.message);
    }
  };

  const handleIncomeSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const payload = Object.fromEntries(form.entries());
    payload.amount = parseFloat(payload.amount);
    payload.date = new Date(payload.date);

    try {
      if (editItem) {
        await axios.put(`/api/incomes/${editItem._id}`, payload);
      } else {
        await axios.post("/api/incomes", payload);
      }
      setShowIncomeForm(false);
      setEditItem(null);
      await fetchAll();
    } catch (err) {
      alert("Error saving income: " + err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async () => {
    try {
      if (confirmDelete.type === "expense") {
        await axios.delete(`/api/expenses/${confirmDelete.id}`);
      } else {
        await axios.delete(`/api/incomes/${confirmDelete.id}`);
      }
      setConfirmDelete(null);
      await fetchAll();
    } catch (err) {
      alert("Error deleting item: " + err.message);
    }
  };

  return (
    <div className="min-h-screen app-container py-8">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-100">Welcome, {user?.name || user?.email}</h1>
          <p className="text-sm text-gray-400">Personal finance at a glance</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={logout} className="text-sm text-gray-400 hover:text-red-400">Logout</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-100">Current Balance</h2>
              <p className={`text-3xl font-extrabold ${balance >= 0 ? "text-green-400" : "text-red-400"}`}>
                {balance.toFixed(2)}ft
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowExpenseForm(true); setEditItem(null); }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700"
              >
                + Add Expense
              </button>
              <button
                onClick={() => { setShowIncomeForm(true); setEditItem(null); }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700"
              >
                + Add Income
              </button>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Expenses</h3>
            {expenses.length === 0 ? (
              <p className="text-gray-400 text-sm">No expenses yet.</p>
            ) : (
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-sm divide-y divide-gray-700">
                  <thead>
                    <tr className="text-left text-gray-400">
                      <th className="py-2">Date</th>
                      <th className="py-2">Amount</th>
                      <th className="py-2">Category</th>
                      <th className="py-2">Description</th>
                      <th className="py-2">Importance</th>
                      <th className="py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((e) => (
                      <tr key={e._id} className="hover:bg-gray-700">
                        <td className="py-2 text-gray-300">{new Date(e.date).toLocaleDateString()}</td>
                        <td className="py-2 text-red-400">-{e.amount.toFixed(2)}ft</td>
                        <td className="py-2 text-gray-300">{e.category}</td>
                        <td className="py-2 text-gray-300">{e.description}</td>
                        <td className="py-2 text-gray-300">{e.importance}</td>
                        <td className="py-2 text-right space-x-2">
                          <button onClick={() => { setEditItem(e); setShowExpenseForm(true); }} className="text-sm text-blue-400 hover:text-blue-300">Edit</button>
                          <button onClick={() => setConfirmDelete({ type: "expense", id: e._id })} className="text-sm text-red-400 hover:text-red-300">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Incomes</h3>
            {incomes.length === 0 ? (
              <p className="text-gray-400 text-sm">No incomes yet.</p>
            ) : (
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-sm divide-y divide-gray-700">
                  <thead>
                    <tr className="text-left text-gray-400">
                      <th className="py-2">Date</th>
                      <th className="py-2">Amount</th>
                      <th className="py-2">Category</th>
                      <th className="py-2">Description</th>
                      <th className="py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incomes.map((i) => (
                      <tr key={i._id} className="hover:bg-gray-700">
                        <td className="py-2 text-gray-300">{new Date(i.date).toLocaleDateString()}</td>
                        <td className="py-2 text-green-400">+{i.amount.toFixed(2)}ft</td>
                        <td className="py-2 text-gray-300">{i.category}</td>
                        <td className="py-2 text-gray-300">{i.description}</td>
                        <td className="py-2 text-right">
                          <button onClick={() => { setEditItem(i); setShowIncomeForm(true); }} className="text-sm text-blue-400 hover:text-blue-300">Edit</button>
                          <button onClick={() => setConfirmDelete({ type: "income", id: i._id })} className="ml-3 text-sm text-red-400 hover:text-red-300">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <AnalyticsPanel />
        </div>
      </div>

      {/* Expense form modal */}
      {showExpenseForm && (
        <Modal onClose={() => setShowExpenseForm(false)}>
          <h3 className="text-lg font-semibold mb-2 text-gray-100">{editItem ? "Edit Expense" : "Add Expense"}</h3>
          <form onSubmit={handleExpenseSubmit} className="space-y-3">
            <input
              type="date"
              name="date"
              defaultValue={editItem ? editItem.date.split("T")[0] : ""}
              required
              className="border border-gray-600 rounded p-2 w-full bg-gray-700 text-gray-100"
            />
            <input
              type="number"
              name="amount"
              step="0.01"
              defaultValue={editItem?.amount || ""}
              placeholder="Amount"
              required
              className="border border-gray-600 rounded p-2 w-full bg-gray-700 text-gray-100"
            />
            <input
              type="text"
              name="category"
              defaultValue={editItem?.category || ""}
              placeholder="Category"
              required
              className="border border-gray-600 rounded p-2 w-full bg-gray-700 text-gray-100"
            />
            <input
              type="text"
              name="description"
              defaultValue={editItem?.description || ""}
              placeholder="Description"
              className="border border-gray-600 rounded p-2 w-full bg-gray-700 text-gray-100"
            />
            <select
              name="importance"
              defaultValue={editItem?.importance || "Medium"}
              className="border border-gray-600 rounded p-2 w-full bg-gray-700 text-gray-100"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowExpenseForm(false)}
                className="px-3 py-1 rounded bg-gray-600 text-gray-100 hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Income form modal */}
      {showIncomeForm && (
        <Modal onClose={() => setShowIncomeForm(false)}>
          <h3 className="text-lg font-semibold mb-2 text-gray-100">{editItem ? "Edit Income" : "Add Income"}</h3>
          <form onSubmit={handleIncomeSubmit} className="space-y-3">
            <input
              type="date"
              name="date"
              defaultValue={editItem ? editItem.date.split("T")[0] : ""}
              required
              className="border border-gray-600 rounded p-2 w-full bg-gray-700 text-gray-100"
            />
            <input
              type="number"
              name="amount"
              step="0.01"
              defaultValue={editItem?.amount || ""}
              placeholder="Amount"
              required
              className="border border-gray-600 rounded p-2 w-full bg-gray-700 text-gray-100"
            />
            <input
              type="text"
              name="category"
              defaultValue={editItem?.category || ""}
              placeholder="Category"
              required
              className="border border-gray-600 rounded p-2 w-full bg-gray-700 text-gray-100"
            />
            <input
              type="text"
              name="description"
              defaultValue={editItem?.description || ""}
              placeholder="Description"
              className="border border-gray-600 rounded p-2 w-full bg-gray-700 text-gray-100"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowIncomeForm(false)}
                className="px-3 py-1 rounded bg-gray-600 text-gray-100 hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Confirm delete modal */}
      {confirmDelete && (
        <Modal onClose={() => setConfirmDelete(null)}>
          <h3 className="text-lg font-semibold mb-2 text-gray-100">Confirm Delete</h3>
          <p className="text-gray-300">Are you sure you want to delete this {confirmDelete.type}?</p>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setConfirmDelete(null)}
              className="px-3 py-1 rounded bg-gray-600 text-gray-100 hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ---- Reusable Modal ---- */
function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-3 top-2 text-gray-400 hover:text-gray-200"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
