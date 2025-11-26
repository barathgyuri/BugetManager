function BalanceCard({ balance, income, expense }) {
  return (
    <div className="card shadow rounded-2xl p-6 text-center">
      <h2 className="text-xl font-semibold mb-4" style={{color: '#D8E4F3'}}>Current Balance</h2>
      <p className="text-3xl font-bold" style={{color: balance >= 0 ? '#2FA6AC' : '#81367D'}}>${balance.toFixed(2)}</p>
      <div className="flex justify-between mt-4">
        <div>
          <p style={{color: '#2FA6AC'}}>Income</p>
          <p className="font-semibold" style={{color: '#2FA6AC'}}>${income.toFixed(2)}</p>
        </div>
        <div>
          <p style={{color: '#81367D'}}>Expenses</p>
          <p className="font-semibold" style={{color: '#81367D'}}>${expense.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

export default BalanceCard;
