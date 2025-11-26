function ExpenseList({ expenses, onEdit, onDelete }) {
  // Group expenses by date
  const groupedByDate = expenses.reduce((acc, exp) => {
    const dateKey = new Date(exp.date).toLocaleDateString('en-CA'); // YYYY-MM-DD format for consistent sorting
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(exp);
    return acc;
  }, {});

  // Sort dates in descending order (newest first)
  const sortedDates = Object.keys(groupedByDate).sort().reverse();

  return (
    <div className="bg-gray-800 p-4 rounded-2xl shadow">
      <h3 className="text-lg font-semibold mb-3 text-gray-100">Expenses</h3>
      {sortedDates.map((dateKey) => (
        <div key={dateKey} className="mb-4">
          <div className="bg-gray-700 px-3 py-2 rounded-lg mb-2 sticky top-0 z-10">
            <p className="text-sm font-semibold text-gray-300">{new Date(dateKey).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
          </div>
          <ul className="divide-y divide-gray-700 ml-2">
            {groupedByDate[dateKey].map((exp) => (
              <li key={exp._id} className="py-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-100">{exp.category} ({exp.importance})</p>
                    <p className="text-gray-400 text-sm">{exp.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-400 font-semibold">-${exp.amount}</p>
                    <div className="flex justify-end gap-2 mt-1">
                      <button onClick={() => onEdit({ ...exp, type: "expense" })}
                        className="text-blue-400 hover:text-blue-300 text-sm">Edit</button>
                      <button onClick={() => onDelete({ ...exp, type: "expense" })}
                        className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default ExpenseList;
