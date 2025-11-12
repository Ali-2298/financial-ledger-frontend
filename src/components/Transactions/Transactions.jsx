import { useState, useEffect } from "react";
import {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction
} from "../../services/transaction";

const Transactions = () => {
  const userId = "1234567890"; // replace with actual logged-in user ID

  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    type: "",
    category: "",
    amount: "",
    description: "",
    transactionDate: ""
  });
  const [editId, setEditId] = useState(null);

  const incomeCategories = ["Salary", "Commission", "Interest Income", "Investment Earnings", "Other"];
  const expenditureCategories = ["Rent Expense", "Electricity Bill", "Utilities Bill", "Internet Bill", "Petrol", "Groceries", "Investments Purchase", "Other"];

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getAllTransactions(userId);
        setTransactions(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTransactions();
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction({ ...newTransaction, [name]: value });
  };

  // Add or update transaction
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...newTransaction, userId };
      if (editId) {
        const updated = await updateTransaction(editId, payload);
        setTransactions(transactions.map(t => t._id === editId ? updated : t));
        setEditId(null);
      } else {
        const saved = await createTransaction(payload);
        setTransactions([...transactions, saved]);
      }
      setNewTransaction({ type: "", category: "", amount: "", description: "", transactionDate: "" });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // Edit transaction
  const handleEdit = (t) => {
    setNewTransaction({
      type: t.type,
      category: t.category,
      amount: t.amount,
      description: t.description,
      transactionDate: t.transactionDate.split("T")[0]
    });
    setEditId(t._id);
  };

  // Delete transaction
 const handleDelete = async (transactionId) => {
  if (!window.confirm("Are you sure you want to delete this transaction?")) return;

  try {
    await deleteTransaction(transactionId, userId);
    setTransactions(transactions.filter(t => t._id !== transactionId));
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

  return (
    <div className="dashboard">

      {/* Transaction Form */}
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
        </form>
      </div>

      {/* Recent Transactions */}
      <div className="transactionsList">
        <h3>Recent Transactions</h3>
        {transactions.length === 0 ? (
          <p>No transactions yet!</p>
        ) : (
          <div className="transactions-grid">
            {transactions.map(t => (
              <div key={t._id} className="transaction-card">
                <h4>{t.description}</h4>
                {t.type === "income" && <p>Income: ${parseFloat(t.amount).toFixed(2)}</p>}
                {t.type === "expenditure" && <p>Outcome: ${parseFloat(t.amount).toFixed(2)}</p>}
                <p>Amount: ${parseFloat(t.amount).toFixed(2)}</p>
                <p>Category: {t.category}</p>
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
