function ExpenseList({ expenses, onEdit, onDelete }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h3 className="text-lg font-semibold mb-3">Expenses</h3>
      <ul className="divide-y divide-gray-200">
        {expenses.map((exp) => (
          <li key={exp._id} className="py-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{exp.category} ({exp.importance})</p>
                <p className="text-gray-500 text-sm">{exp.description}</p>
                <p className="text-xs text-gray-400">{new Date(exp.date).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-red-500 font-semibold">-${exp.amount}</p>
                <div className="flex justify-end gap-2 mt-1">
                  <button onClick={() => onEdit({ ...exp, type: "expense" })}
                    className="text-blue-500 hover:text-blue-700 text-sm">Edit</button>
                  <button onClick={() => onDelete({ ...exp, type: "expense" })}
                    className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpenseList;
