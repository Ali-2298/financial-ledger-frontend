import { useState, useEffect } from 'react';
import { getAllTransactions, createTransaction, updateTransaction } from '../../services/transaction';

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
    "Petrol",
    "Groceries",
    "Investments Purchase",
    "Other"
  ];

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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewTransaction({ ...newTransaction, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editId) {
        const updated = await updateTransaction(editId, newTransaction);
        setTransactions(transactions.map(t => t._id === editId ? updated : t));
        setEditId(null);
      } else {
        const savedTransaction = await createTransaction(newTransaction);
        setTransactions([...transactions, savedTransaction]);
      }
      setNewTransaction({
        type: "",
        category: "",
        amount: "",
        description: "",
        transactionDate: ""
      });
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
    setNewTransaction({
      type: "",
      category: "",
      amount: "",
      description: "",
      transactionDate: ""
    });
  };

  return (
    <div className="dashboard">
      <div className="formDiv">
        <h3>{!editId ? "Add New Transaction" : "Edit Transaction"}</h3>
        {!editId && (
          <form onSubmit={handleSubmit}>
            <label htmlFor="type">Transaction Type:</label>
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
                incomeCategories.map((item, i) => (
                  <option key={i} value={item}>{item}</option>
                ))
              }
              {newTransaction.type === "expenditure" &&
                expenditureCategories.map((item, i) => (
                  <option key={i} value={item}>{item}</option>
                ))
              }
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

            <label htmlFor="transactionDate">Transaction Date:</label>
            <input
              id="transactionDate"
              name="transactionDate"
              type="date"
              value={newTransaction.transactionDate}
              onChange={handleInputChange}
              required
            />

            <button type="submit">
              Add Transaction
            </button>
          </form>
        )}
      </div>

      <div className="transactionsList">
        <h3>Recent Transactions</h3>
        {transactions.length === 0 ? (
          <p>No transactions yet. Add your first transaction above!</p>
        ) : (
          <div className="transactions-grid">
            {transactions.map((t, index) => (
              <div key={index} className="transaction-card">
                {editId === t._id ? (
                  <form onSubmit={handleSubmit}>
                    <label htmlFor="typeEdit">Transaction Type:</label>
                    <select
                      id="typeEdit"
                      name="type"
                      value={newTransaction.type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="income">Income</option>
                      <option value="expenditure">Expenditure</option>
                    </select>

                    <label htmlFor="categoryEdit">Category:</label>
                    <select
                      id="categoryEdit"
                      name="category"
                      value={newTransaction.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {newTransaction.type === "income" &&
                        incomeCategories.map((item, i) => (
                          <option key={i} value={item}>{item}</option>
                        ))
                      }
                      {newTransaction.type === "expenditure" &&
                        expenditureCategories.map((item, i) => (
                          <option key={i} value={item}>{item}</option>
                        ))
                      }
                    </select>

                    <label htmlFor="amountEdit">Amount:</label>
                    <input
                      id="amountEdit"
                      name="amount"
                      type="number"
                      value={newTransaction.amount}
                      onChange={handleInputChange}
                      required
                    />

                    <label htmlFor="descriptionEdit">Description:</label>
                    <input
                      id="descriptionEdit"
                      name="description"
                      value={newTransaction.description}
                      onChange={handleInputChange}
                      required
                    />

                    <label htmlFor="transactionDateEdit">Transaction Date:</label>
                    <input
                      id="transactionDateEdit"
                      name="transactionDate"
                      type="date"
                      value={newTransaction.transactionDate}
                      onChange={handleInputChange}
                      required
                    />

                    <button type="submit">Update Transaction</button>
                    <button type="button" onClick={handleCancelEdit}>Cancel</button>
                  </form>
                ) : (
                  <>
                    <h4>{t.description}</h4>
                    <p>
                      {t.type === 'income' ? '+' : '-'}${parseFloat(t.amount).toFixed(2)} — {t.category}
                    </p>
                    <p>Date: {new Date(t.transactionDate).toLocaleDateString()}</p>
                    <button onClick={() => handleEdit(t)}>Edit</button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
