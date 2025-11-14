import { useState, useEffect } from 'react';
import { getAllTransactions, createTransaction, updateTransaction, deleteTransaction } from '../../services/transaction';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    type: "",
    category: "",
    amount: "",
    description: "",
    transactionDate: ""
  });
  const [editId, setEditId] = useState(null);

  const incomeCategories = [
    "Salary",
    "Commission",
    "Interest Income",
    "Investment Earnings",
    "Other"
  ];
  const expenditureCategories = [
    "Rent Expense",
    "Electricity Bill",
    "Utilities Bill",
    "Internet Bill",
    "Petrol","Groceries",
    "Investments Purchase",
    "Other"];

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getAllTransactions();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        const updated = await updateTransaction(editId, newTransaction);
        setTransactions(transactions.map(t => t._id === editId ? updated : t));
        setEditId(null);
      } else {
        const savedTransaction = await createTransaction(newTransaction);
        setTransactions([...transactions, savedTransaction]);
      }
      setNewTransaction({ type: "", category: "", amount: "", description: "", transactionDate: "" });
    } catch (err) {
      console.error('Error creating/updating transaction:', err);
      alert(err.message);
    }
  };

  const handleEdit = (transaction) => {
    setNewTransaction({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      description: transaction.description,
      transactionDate: transaction.transactionDate.split('T')[0]
    });
    setEditId(transaction._id);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setNewTransaction({ type: "", category: "", amount: "", description: "", transactionDate: "" });
  };

  const handleDelete = async (transactionId) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    try {
      await deleteTransaction(transactionId);
      setTransactions(transactions.filter(t => t._id !== transactionId));
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="dashboard">
      <div className="formDiv">
        <h3>{editId ? "Edit Transaction" : "Add New Transaction"}</h3>
        <form onSubmit={handleSubmit}>
          <label>Type:</label>
          <select name="type" value={newTransaction.type} onChange={handleInputChange} required>
            <option value="">Select Type</option>
            <option value="income">Income</option>
            <option value="expenditure">Expenditure</option>
          </select>

          <label>Category:</label>
          <select name="category" value={newTransaction.category} onChange={handleInputChange} required>
            <option value="">Select Category</option>
            {newTransaction.type === "income" && incomeCategories.map((c, i) => <option key={i} value={c}>{c}</option>)}
            {newTransaction.type === "expenditure" && expenditureCategories.map((c, i) => <option key={i} value={c}>{c}</option>)}
          </select>

          <label>Amount:</label>
          <input type="number" name="amount" value={newTransaction.amount} onChange={handleInputChange} required />

          <label>Description:</label>
          <input type="text" name="description" value={newTransaction.description} onChange={handleInputChange} required />

          <label>Date:</label>
          <input type="date" name="transactionDate" value={newTransaction.transactionDate} onChange={handleInputChange} required />

          <button type="submit">{editId ? "Update Transaction" : "Add Transaction"}</button>
          {editId && <button type="button" onClick={handleCancelEdit}>Cancel</button>}
        </form>
      </div>

      <div className="transactionsList">
        <h3>Recent Transactions</h3>
        {transactions.length === 0 ? <p>No transactions yet!</p> : (
          <div className="transactions-grid">
            {transactions.map(t => (
              <div key={t._id} className="transaction-card">
                <h4>{t.description}</h4>
                <p>{t.type === "income" ? "+" : "-"}${parseFloat(t.amount).toFixed(2)} — {t.category}</p>
                <p>Date: {new Date(t.transactionDate).toLocaleDateString()}</p>
                <button onClick={() => handleEdit(t)}>Edit</button>
                <button onClick={() => handleDelete(t._id)}>Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
