function IncomeList({ incomes, onEdit, onDelete }) {
  // Group incomes by date
  const groupedByDate = incomes.reduce((acc, inc) => {
    const dateKey = new Date(inc.date).toLocaleDateString('en-CA'); // YYYY-MM-DD format for consistent sorting
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(inc);
    return acc;
  }, {});

  // Sort dates in descending order (newest first)
  const sortedDates = Object.keys(groupedByDate).sort().reverse();

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h3 className="text-lg font-semibold mb-3">Incomes</h3>
      {sortedDates.map((dateKey) => (
        <div key={dateKey} className="mb-4">
          <div className="bg-gray-100 px-3 py-2 rounded-lg mb-2 sticky top-0 z-10">
            <p className="text-sm font-semibold text-gray-700">{new Date(dateKey).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
          </div>
          <ul className="divide-y divide-gray-200 ml-2">
            {groupedByDate[dateKey].map((inc) => (
              <li key={inc._id} className="py-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{inc.category}</p>
                    <p className="text-gray-500 text-sm">{inc.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-500 font-semibold">+${inc.amount}</p>
                    <div className="flex justify-end gap-2 mt-1">
                      <button onClick={() => onEdit({ ...inc, type: "income" })}
                        className="text-blue-500 hover:text-blue-700 text-sm">Edit</button>
                      <button onClick={() => onDelete({ ...inc, type: "income" })}
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

export default IncomeList;
