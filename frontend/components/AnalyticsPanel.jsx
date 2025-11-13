import { useEffect, useState } from "react";
import axios from "axios";
import CategoryPie from "./charts/CategoryPie";
import MonthlyTrends from "./charts/MonthlyTrends";

export default function AnalyticsPanel() {
  const [expByCat, setExpByCat] = useState([]);
  const [incByCat, setIncByCat] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [summary, setSummary] = useState({ totalExpense: 0, totalIncome: 0, balance: 0 });

  const fetch = async () => {
    try {
      const [eRes, iRes, mRes, sRes] = await Promise.all([
        axios.get("/api/analytics/expenses/category"),
        axios.get("/api/analytics/incomes/category"),
        axios.get("/api/analytics/trends/monthly"),
        axios.get("/api/analytics/summary")
      ]);
      setExpByCat(eRes.data);
      setIncByCat(iRes.data);
      setMonthly(mRes.data);
      setSummary(sRes.data);
    } catch (err) {
      console.error('Error fetching analytics:', err.response?.data || err.message);
    }
  };

  useEffect(() => { fetch(); }, []);

  return (
    <div className="card mt-3">
      <h3 className="text-lg font-semibold mb-3">Analytics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col items-center">
          <p className="text-sm text-gray-500 mb-2">Expenses by Category</p>
          <div className="w-full max-w-xs">
            <CategoryPie data={expByCat} dataKey="total" nameKey="_id" />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-sm text-gray-500 mb-2">Incomes by Category</p>
          <div className="w-full max-w-xs">
            <CategoryPie data={incByCat} dataKey="total" nameKey="_id" />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm text-gray-500 mb-2">Monthly Trends</p>
        <div className="w-full">
          <MonthlyTrends data={monthly} />
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <div className="p-3 bg-gray-50 rounded flex-1 text-center">
          <p className="text-xs text-gray-500">Total Income</p>
          <p className="font-semibold">${Number(summary.totalIncome || 0).toFixed(2)}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded flex-1 text-center">
          <p className="text-xs text-gray-500">Total Expense</p>
          <p className="font-semibold">${Number(summary.totalExpense || 0).toFixed(2)}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded flex-1 text-center">
          <p className="text-xs text-gray-500">Balance</p>
          <p className="font-semibold">${Number(summary.balance || 0).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
