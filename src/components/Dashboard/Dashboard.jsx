// src/components/Dashboard/Dashboard.jsx

import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';

const Dashboard = () => {
  const { user } = useContext(UserContext);


  const [transactions, setTransactions] = useState([]);

  
  const [budgetReport, setBudgetReport] = useState(null);

  
  const [budgetId] = useState('YOUR_BUDGET_ID');

  
  const [newTransaction, setNewTransaction] = useState({
    category: "",
    amount: "",
    description: "",
    type: "expense",
    transactionDate: ""
  });

  
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/transactions');
        if (!response.ok) throw new Error('Failed to fetch transactions');
        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        console.error(err);
      }
    };

   
    const fetchBudgetReport = async () => {
      try {
        const response = await fetch(`/api/budgets/${budgetId}/report`);
        if (!response.ok) throw new Error('Failed to fetch budget report');
        const data = await response.json();
        setBudgetReport(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTransactions();
    fetchBudgetReport();
  }, [budgetId]);

 
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewTransaction(prev => ({ ...prev, [name]: value }));
  };

  
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction)
      });

      let data = null;
      try {
        data = await response.json();
      } catch {
        console.warn('Server returned no JSON.');
      }

      if (!response.ok) {
        console.error('Failed to save transaction:', data || response.statusText);
        return;
      }

      
      setTransactions(prev => [...prev, data || newTransaction]);

      
      setNewTransaction({
        category: "",
        amount: "",
        description: "",
        type: "expense",
        transactionDate: ""
      });
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  return (
    <div className="dashboard">
      {/* Transaction Form */}
      <div className="formDiv">
        <h3>Add New Transaction</h3>
        <form onSubmit={handleSubmit}>
          <label htmlFor="category">Category:</label>
          <input id="category" name="category" value={newTransaction.category} onChange={handleInputChange} />

          <label htmlFor="amount">Amount:</label>
          <input id="amount" name="amount" type="number" value={newTransaction.amount} onChange={handleInputChange} required min="0" step="0.01" />

          <label htmlFor="description">Description:</label>
          <input id="description" name="description" value={newTransaction.description} onChange={handleInputChange} required />

          <label htmlFor="type">Type:</label>
          <select id="type" name="type" value={newTransaction.type} onChange={handleInputChange}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <label htmlFor="transactionDate">Transaction Date:</label>
          <input id="transactionDate" name="transactionDate" type="date" value={newTransaction.transactionDate} onChange={handleInputChange} required />

          <button type="submit">Add Transaction</button>
        </form>
      </div>

      {/* Existing Transactions List */}
      <div className="transactionList">
        <h3>Recent Transactions</h3>
        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          transactions.map((t, index) => (
            <div key={index} className="transactionCard">
              <h4>{t.description}</h4>
              <p>
                {t.type === 'income' ? '+' : '-'}${t.amount} — {t.category}
              </p>
            </div>
          ))
        )}
      </div>

      {/* New Budget Report Section */}
      <div className="budgetReport">
        <h3>Budget Report</h3>
        {budgetReport ? (
          <>
            <p><strong>Budget:</strong> {budgetReport.budget.name}</p>
            <p><strong>Period:</strong> {new Date(budgetReport.budget.startDate).toLocaleDateString()} - {new Date(budgetReport.budget.endDate).toLocaleDateString()}</p>
            <p><strong>Total Spent:</strong> {budgetReport.totalSpent.toFixed(2)} {budgetReport.budget.currency}</p>

            <h4>Spending by Account</h4>
            {budgetReport.spentByAccount && Object.entries(budgetReport.spentByAccount).map(([accountName, accountData]) => (
              <div key={accountName} style={{ marginBottom: '20px' }}>
                <h5>{accountName}: {accountData.total.toFixed(2)} {budgetReport.budget.currency}</h5>
                <ul>
                  {accountData.categories && Object.entries(accountData.categories).map(([categoryName, categoryData]) => (
                    <li key={categoryName}>
                      {categoryName}: {categoryData.total.toFixed(2)} {budgetReport.budget.currency}
                      {categoryData.alertTriggered && <span style={{ color: 'red', marginLeft: '10px' }}>Alert!</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        ) : (
          <p>Loading budget report...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
