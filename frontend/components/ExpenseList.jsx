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
    <div className="bg-white p-4 rounded-2xl shadow">
      <h3 className="text-lg font-semibold mb-3">Expenses</h3>
      {sortedDates.map((dateKey) => (
        <div key={dateKey} className="mb-4">
          <div className="bg-gray-100 px-3 py-2 rounded-lg mb-2 sticky top-0 z-10">
            <p className="text-sm font-semibold text-gray-700">{new Date(dateKey).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
          </div>
          <ul className="divide-y divide-gray-200 ml-2">
            {groupedByDate[dateKey].map((exp) => (
              <li key={exp._id} className="py-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{exp.category} ({exp.importance})</p>
                    <p className="text-gray-500 text-sm">{exp.description}</p>
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
      ))}
    </div>
  );
}

export default ExpenseList;
