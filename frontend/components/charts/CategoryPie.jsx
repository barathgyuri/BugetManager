import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE","#00C49F","#FFBB28","#FF8042","#A78BFA","#F472B6","#60A5FA","#34D399"];

export default function CategoryPie({ data = [], dataKey = "total", nameKey = "_id" }) {
  // transform data: expect [{ _id: "Food", total: 123 }, ...]
  const transformed = data.map(d => ({ name: d[nameKey] || "Unknown", value: d[dataKey] || 0 }));

  return (
    <div style={{ width: "100%", minHeight: 200 }}>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={transformed} dataKey="value" nameKey="name" outerRadius={80} label>
            {transformed.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
