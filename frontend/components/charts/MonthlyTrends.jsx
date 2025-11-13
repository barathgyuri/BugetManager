import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

/*
 expected data: [{ label: "2024-01", expense: 100, income: 300 }, ...]
*/
export default function MonthlyTrends({ data = [] }) {
  // ensure sorted by label (YYYY-MM)
  const sorted = [...data].sort((a,b) => a.label.localeCompare(b.label));
  return (
    <div style={{ width: "100%", minHeight: 220 }}>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={sorted}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="expense" stroke="#ff4d4f" strokeWidth={2} />
          <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
