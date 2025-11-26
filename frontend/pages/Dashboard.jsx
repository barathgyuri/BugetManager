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
          <h1 className="text-2xl font-semibold" style={{color: '#D8E4F3'}}>Welcome, {user?.name || user?.email}</h1>
          <p className="text-sm" style={{color: '#2FA6AC'}}>Personal finance at a glance</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={logout} className="text-sm hover:opacity-80" style={{color: '#2FA6AC'}}>Logout</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold" style={{color: '#D8E4F3'}}>Current Balance</h2>
              <p className={`text-3xl font-extrabold`} style={{color: balance >= 0 ? '#2FA6AC' : '#81367D'}}>
                {balance.toFixed(2)}ft
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowExpenseForm(true); setEditItem(null); }}
                className="text-white px-4 py-2 rounded-lg shadow-md hover:opacity-90"
                style={{backgroundColor: '#81367D'}}
              >
                + Add Expense
              </button>
              <button
                onClick={() => { setShowIncomeForm(true); setEditItem(null); }}
                className="text-white px-4 py-2 rounded-lg shadow-md hover:opacity-90"
                style={{backgroundColor: '#2FA6AC'}}
              >
                + Add Income
              </button>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2" style={{color: '#D8E4F3'}}>Expenses</h3>
            {expenses.length === 0 ? (
              <p className="text-sm" style={{color: '#2FA6AC'}}>No expenses yet.</p>
            ) : (
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-sm divide-y" style={{borderColor: 'rgba(129, 54, 125, 0.3)'}}>
                  <thead>
                    <tr style={{color: '#2FA6AC'}}>
                      <th className="py-2 text-left">Date</th>
                      <th className="py-2 text-left">Amount</th>
                      <th className="py-2 text-left">Category</th>
                      <th className="py-2 text-left">Description</th>
                      <th className="py-2 text-left">Importance</th>
                      <th className="py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((e) => (
                      <tr key={e._id} style={{borderColor: 'rgba(129, 54, 125, 0.2)'}}>
                        <td className="py-2" style={{color: '#D8E4F3'}}>{new Date(e.date).toLocaleDateString()}</td>
                        <td className="py-2" style={{color: '#81367D'}}>-{e.amount.toFixed(2)}ft</td>
                        <td className="py-2" style={{color: '#D8E4F3'}}>{e.category}</td>
                        <td className="py-2" style={{color: '#D8E4F3'}}>{e.description}</td>
                        <td className="py-2" style={{color: '#D8E4F3'}}>{e.importance}</td>
                        <td className="py-2 text-right space-x-2">
                          <button onClick={() => { setEditItem(e); setShowExpenseForm(true); }} className="text-sm hover:opacity-80" style={{color: '#3469A9'}}>Edit</button>
                          <button onClick={() => setConfirmDelete({ type: "expense", id: e._id })} className="text-sm hover:opacity-80" style={{color: '#81367D'}}>Delete</button>
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
            <h3 className="text-lg font-semibold mb-2" style={{color: '#D8E4F3'}}>Incomes</h3>
            {incomes.length === 0 ? (
              <p className="text-sm" style={{color: '#2FA6AC'}}>No incomes yet.</p>
            ) : (
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-sm divide-y" style={{borderColor: 'rgba(47, 166, 172, 0.3)'}}>
                  <thead>
                    <tr style={{color: '#2FA6AC'}}>
                      <th className="py-2 text-left">Date</th>
                      <th className="py-2 text-left">Amount</th>
                      <th className="py-2 text-left">Category</th>
                      <th className="py-2 text-left">Description</th>
                      <th className="py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incomes.map((i) => (
                      <tr key={i._id} style={{borderColor: 'rgba(47, 166, 172, 0.2)'}}>
                        <td className="py-2" style={{color: '#D8E4F3'}}>{new Date(i.date).toLocaleDateString()}</td>
                        <td className="py-2" style={{color: '#2FA6AC'}}>+{i.amount.toFixed(2)}ft</td>
                        <td className="py-2" style={{color: '#D8E4F3'}}>{i.category}</td>
                        <td className="py-2" style={{color: '#D8E4F3'}}>{i.description}</td>
                        <td className="py-2 text-right">
                          <button onClick={() => { setEditItem(i); setShowIncomeForm(true); }} className="text-sm hover:opacity-80" style={{color: '#3469A9'}}>Edit</button>
                          <button onClick={() => setConfirmDelete({ type: "income", id: i._id })} className="ml-3 text-sm hover:opacity-80" style={{color: '#81367D'}}>Delete</button>
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
          <h3 className="text-lg font-semibold mb-2" style={{color: '#D8E4F3'}}>{editItem ? "Edit Expense" : "Add Expense"}</h3>
          <form onSubmit={handleExpenseSubmit} className="space-y-3">
            <input
              type="date"
              name="date"
              defaultValue={editItem ? editItem.date.split("T")[0] : ""}
              required
              className="border rounded p-2 w-full"
              style={{borderColor: '#81367D', backgroundColor: 'rgba(129, 54, 125, 0.1)', color: '#D8E4F3'}}
            />
            <input
              type="number"
              name="amount"
              step="0.01"
              defaultValue={editItem?.amount || ""}
              placeholder="Amount"
              required
              className="border rounded p-2 w-full"
              style={{borderColor: '#81367D', backgroundColor: 'rgba(129, 54, 125, 0.1)', color: '#D8E4F3'}}
            />
            <input
              type="text"
              name="category"
              defaultValue={editItem?.category || ""}
              placeholder="Category"
              required
              className="border rounded p-2 w-full"
              style={{borderColor: '#81367D', backgroundColor: 'rgba(129, 54, 125, 0.1)', color: '#D8E4F3'}}
            />
            <input
              type="text"
              name="description"
              defaultValue={editItem?.description || ""}
              placeholder="Description"
              className="border rounded p-2 w-full"
              style={{borderColor: '#81367D', backgroundColor: 'rgba(129, 54, 125, 0.1)', color: '#D8E4F3'}}
            />
            <select
              name="importance"
              defaultValue={editItem?.importance || "Medium"}
              className="border rounded p-2 w-full"
              style={{borderColor: '#81367D', backgroundColor: 'rgba(129, 54, 125, 0.1)', color: '#D8E4F3'}}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowExpenseForm(false)}
                className="px-3 py-1 rounded"
                style={{backgroundColor: 'rgba(129, 54, 125, 0.2)', color: '#D8E4F3'}}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded text-white"
                style={{backgroundColor: '#3469A9'}}
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
          <h3 className="text-lg font-semibold mb-2" style={{color: '#D8E4F3'}}>{editItem ? "Edit Income" : "Add Income"}</h3>
          <form onSubmit={handleIncomeSubmit} className="space-y-3">
            <input
              type="date"
              name="date"
              defaultValue={editItem ? editItem.date.split("T")[0] : ""}
              required
              className="border rounded p-2 w-full"
              style={{borderColor: '#2FA6AC', backgroundColor: 'rgba(47, 166, 172, 0.1)', color: '#D8E4F3'}}
            />
            <input
              type="number"
              name="amount"
              step="0.01"
              defaultValue={editItem?.amount || ""}
              placeholder="Amount"
              required
              className="border rounded p-2 w-full"
              style={{borderColor: '#2FA6AC', backgroundColor: 'rgba(47, 166, 172, 0.1)', color: '#D8E4F3'}}
            />
            <input
              type="text"
              name="category"
              defaultValue={editItem?.category || ""}
              placeholder="Category"
              required
              className="border rounded p-2 w-full"
              style={{borderColor: '#2FA6AC', backgroundColor: 'rgba(47, 166, 172, 0.1)', color: '#D8E4F3'}}
            />
            <input
              type="text"
              name="description"
              defaultValue={editItem?.description || ""}
              placeholder="Description"
              className="border rounded p-2 w-full"
              style={{borderColor: '#2FA6AC', backgroundColor: 'rgba(47, 166, 172, 0.1)', color: '#D8E4F3'}}
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowIncomeForm(false)}
                className="px-3 py-1 rounded"
                style={{backgroundColor: 'rgba(47, 166, 172, 0.2)', color: '#D8E4F3'}}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded text-white"
                style={{backgroundColor: '#3469A9'}}
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
          <h3 className="text-lg font-semibold mb-2" style={{color: '#D8E4F3'}}>Confirm Delete</h3>
          <p style={{color: '#D8E4F3'}}>Are you sure you want to delete this {confirmDelete.type}?</p>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setConfirmDelete(null)}
              className="px-3 py-1 rounded"
              style={{backgroundColor: 'rgba(129, 54, 125, 0.2)', color: '#D8E4F3'}}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1 rounded text-white"
              style={{backgroundColor: '#81367D'}}
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
      <div className="rounded-2xl p-6 w-full max-w-md relative" style={{backgroundColor: 'rgba(8, 17, 27, 0.95)', border: '1px solid rgba(129, 54, 125, 0.3)'}}>
        <button
          onClick={onClose}
          className="absolute right-3 top-2 hover:opacity-80"
          style={{color: '#2FA6AC'}}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
