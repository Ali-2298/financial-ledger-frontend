import { useState, useEffect } from 'react';
import { getAllTransactions, createTransaction, updateTransaction, deleteTransaction } from '../../services/transaction';
import { getAllAccounts } from '../../services/accounts';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    type: "",
    category: "",
    amount: "",
    currency: "BHD",
    description: "",
    transactionDate: "",
    accountId: ""
  });
  const [editId, setEditId] = useState(null);

  const incomeCategories = ["Salary","Commission","Interest Income","Investment Earnings","Other"];
  const expenditureCategories = ["Rent Expense","Electricity Bill","Utilities Bill","Internet Bill","Petrol","Groceries","Investments Purchase","Other"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tx = await getAllTransactions();
        const acc = await getAllAccounts();
        console.log("Fetched accounts:", acc); 
        setTransactions(tx);
        setAccounts(acc);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "type") {
      setNewTransaction({ ...newTransaction, type: value, category: "" });
    } else {
      setNewTransaction({ ...newTransaction, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        const updated = await updateTransaction(editId, newTransaction);
        setTransactions(transactions.map(t => t._id === editId ? updated : t));
        setEditId(null);
      } else {
        const saved = await createTransaction(newTransaction);
        setTransactions([...transactions, saved]);
      }
      setNewTransaction({ type: "", category: "", amount: "", currency: "", description: "", transactionDate: "", accountId: "" });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleEdit = (t) => {
    setNewTransaction({
      type: t.type,
      category: t.category,
      amount: t.amount,
      currency: t.currency,
      description: t.description,
      transactionDate: t.transactionDate.split('T')[0],
      accountId: t.account?._id || ""
    });
    setEditId(t._id);
  };

  const handleCancel = () => {
    setEditId(null);
    setNewTransaction({ type: "", category: "", amount: "", currency: "", description: "", transactionDate: "", accountId: "" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    try {
      await deleteTransaction(id);
      setTransactions(transactions.filter(t => t._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const displayedCategories = newTransaction.type === "Income"
    ? incomeCategories
    : newTransaction.type === "Expenditure"
      ? expenditureCategories
      : [];

  return (
    <div className="dashboard">
      <div className="formDiv">
        <h3>{editId ? "Edit Transaction" : "Add New Transaction"}</h3>
        <form onSubmit={handleSubmit}>
          <label>Type:</label>
          <select name="type" value={newTransaction.type} onChange={handleInputChange} required>
            <option value="">Select Type</option>
            <option value="Income">Income</option>
            <option value="Expenditure">Expenditure</option>
          </select>

          <label>Category:</label>
          <select
            name="category"
            value={newTransaction.category}
            onChange={handleInputChange}
            required
            disabled={!newTransaction.type}
          >
            <option value="">{newTransaction.type ? "Select Category" : "Select Type first"}</option>
            {displayedCategories.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>

          <label>Account:</label>
          <select
            name="accountId"
            value={newTransaction.accountId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Account</option>
            {accounts.map(acc => (
              <option key={acc._id} value={acc._id}>
                {acc.accountName || "Unnamed Account"}
              </option>
            ))}
          </select>

          <label>Amount:</label>
          <input type="number" name="amount" value={newTransaction.amount} onChange={handleInputChange} required />

          <label>Currency:</label>
          <input type="text" name="currency" value={newTransaction.currency} onChange={handleInputChange} readOnly />

          <label>Description:</label>
          <input type="text" name="description" value={newTransaction.description} onChange={handleInputChange} required />

          <label>Date:</label>
          <input type="date" name="transactionDate" value={newTransaction.transactionDate} onChange={handleInputChange} required />

          <button type="submit">{editId ? "Update" : "Add"}</button>
          {editId && <button type="button" onClick={handleCancel}>Cancel</button>}
        </form>
      </div>

      <div className="transactionsList">
        <h3>Recent Transactions</h3>
        {transactions.length === 0 ? (
          <p>No transactions yet!</p>
        ) : (
          transactions.map(t => (
            <div key={t._id} className="transaction-card">
              <p><strong>Type:</strong> {t.type}</p>
              <p><strong>Category:</strong> {t.category}</p>
              <p><strong>Account:</strong> {t.account?.accountName || "Unnamed Account"}</p>
              <p><strong>Amount:</strong> {t.amount} <strong>{t.currency}</strong></p>
              <p><strong>Date:</strong> {new Date(t.transactionDate).toLocaleDateString()}</p>
              <p><strong>Description:</strong> {t.description}</p>
              <button onClick={() => handleEdit(t)}>Edit</button>
              <button onClick={() => handleDelete(t._id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Transactions;