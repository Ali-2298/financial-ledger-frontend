import { useState, useEffect } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACK_END_SERVER_URL;

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    type: "",
    category: "",
    amount: "",
    description: "",
    transactionDate: ""
  });

  const incomeCategories = ["Salary", "Commission", "Interest Income", "Investment Earnings", "Other"];
  const expenditureCategories = ["Rent Expense", "Electricity Bill", "Utilities Bill", "Internet Bill", "Petrol", "Groceries", "Investments Purchase", "Other"];

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/transactions`);
        if (!response.ok) throw new Error('Failed to fetch transactions');
        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    fetchTransactions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction({ ...newTransaction, [name]: value });
  };

  const handleSubmit = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/transactions`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify(newTransaction)
    });

    const savedTransaction = await response.json();

    if (!response.ok) {
      console.error('Failed to save transaction:', savedTransaction || response.statusText);
      return;
    }

    setTransactions([...transactions, savedTransaction]);

    setNewTransaction({
      type: "",
      category: "",
      amount: "",
      description: "",
      transactionDate: ""
    });
  } catch (err) {
    console.error('Submit error:', err);
  }
};

  return (
    <div className="dashboard">
      <div className="formDiv">
        <h3>Add New Transaction</h3>
        <div>
          <label htmlFor="type">Type:</label>
          <select
            id="type"
            name="type"
            value={newTransaction.type}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Type</option>
            <option value="income">Income</option>
            <option value="expenditure">Expenditure</option>
          </select>

          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={newTransaction.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Category</option>
            {newTransaction.type === "income" &&
              incomeCategories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
            {newTransaction.type === "expenditure" &&
              expenditureCategories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
          </select>

          <label htmlFor="amount">Amount:</label>
          <input
            id="amount"
            name="amount"
            type="number"
            value={newTransaction.amount}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="description">Description:</label>
          <input
            id="description"
            name="description"
            value={newTransaction.description}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="transactionDate">Date:</label>
          <input
            id="transactionDate"
            name="transactionDate"
            type="date"
            value={newTransaction.transactionDate}
            onChange={handleInputChange}
            required
          />

          <button type="button" onClick={handleSubmit}>Add Transaction</button>
        </div>
      </div>

      <div className="accountsList">
        <h3>Recent Transactions</h3>
        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <div className="accounts-grid">
            {transactions.map((t) => (
              <div key={t._id} className="account-card">
                <h4>{t.description}</h4>
                <p>
                  {t.type === 'income' ? '+' : '-'}${t.amount} — {t.category} — {new Date(t.transactionDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transaction;
