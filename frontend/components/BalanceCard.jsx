function BalanceCard({ balance, income, expense }) {
  return (
    <div className="bg-gray-800 shadow rounded-2xl p-6 text-center">
      <h2 className="text-xl font-semibold text-gray-100 mb-4">Current Balance</h2>
      <p className="text-3xl font-bold text-green-400">${balance.toFixed(2)}</p>
      <div className="flex justify-between mt-4">
        <div>
          <p className="text-gray-400">Income</p>
          <p className="text-green-400 font-semibold">${income.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-400">Expenses</p>
          <p className="text-red-400 font-semibold">${expense.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

export default BalanceCard;
