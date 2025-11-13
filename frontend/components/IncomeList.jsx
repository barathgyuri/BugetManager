function IncomeList({ incomes, onEdit, onDelete }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h3 className="text-lg font-semibold mb-3">Incomes</h3>
      <ul className="divide-y divide-gray-200">
        {incomes.map((inc) => (
          <li key={inc._id} className="py-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{inc.category}</p>
                <p className="text-gray-500 text-sm">{inc.description}</p>
                <p className="text-xs text-gray-400">{new Date(inc.date).toLocaleDateString()}</p>
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
  );
}

export default IncomeList;
