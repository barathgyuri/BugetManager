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
    <div className="card p-4 rounded-2xl">
      <h3 className="text-lg font-semibold mb-3" style={{color: '#D8E4F3'}}>Expenses</h3>
      {sortedDates.map((dateKey) => (
        <div key={dateKey} className="mb-4">
          <div className="px-3 py-2 rounded-lg mb-2 sticky top-0 z-10" style={{backgroundColor: 'rgba(129, 54, 125, 0.15)'}}>
            <p className="text-sm font-semibold" style={{color: '#2FA6AC'}}>{new Date(dateKey).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
          </div>
          <ul className="divide-y ml-2" style={{borderColor: 'rgba(129, 54, 125, 0.2)'}}>
            {groupedByDate[dateKey].map((exp) => (
              <li key={exp._id} className="py-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium" style={{color: '#D8E4F3'}}>{exp.category} ({exp.importance})</p>
                    <p className="text-sm" style={{color: '#2FA6AC'}}>{exp.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold" style={{color: '#81367D'}}>-${exp.amount}</p>
                    <div className="flex justify-end gap-2 mt-1">
                      <button onClick={() => onEdit({ ...exp, type: "expense" })}
                        className="text-sm hover:opacity-80" style={{color: '#3469A9'}}>Edit</button>
                      <button onClick={() => onDelete({ ...exp, type: "expense" })}
                        className="text-sm hover:opacity-80" style={{color: '#81367D'}}>Delete</button>
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
