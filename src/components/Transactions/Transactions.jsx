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
      setNewTransaction({ type: "", category: "", amount: "", currency: "BHD", description: "", transactionDate: "", accountId: "" });
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
    setNewTransaction({ type: "", category: "", amount: "", currency: "BHD", description: "", transactionDate: "", accountId: "" });
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Transactions</h1>
          <p className="text-slate-600">Manage your income and expenditure records</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-6">
              <h3 className="text-xl font-bold text-slate-900 mb-6">
                {editId ? "Edit Transaction" : "Add New Transaction"}
              </h3>
              
              <div className="space-y-4" onSubmit={handleSubmit}>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <select 
                    name="type" 
                    value={newTransaction.type} 
                    onChange={handleInputChange} 
                    required
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Select Type</option>
                    <option value="Income">Income</option>
                    <option value="Expenditure">Expenditure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={newTransaction.category}
                    onChange={handleInputChange}
                    required
                    disabled={!newTransaction.type}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
                  >
                    <option value="">{newTransaction.type ? "Select Category" : "Select Type first"}</option>
                    {displayedCategories.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Account <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="accountId"
                    value={newTransaction.accountId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Select Account</option>
                    {accounts.map(acc => (
                      <option key={acc._id} value={acc._id}>
                        {acc.accountName || "Unnamed Account"}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Amount (BHD) <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="number" 
                    name="amount" 
                    value={newTransaction.amount} 
                    onChange={handleInputChange} 
                    required
                    step="0.001"
                    placeholder="0.000"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="description" 
                    value={newTransaction.description} 
                    onChange={handleInputChange} 
                    required
                    placeholder="Enter transaction details"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="date" 
                    name="transactionDate" 
                    value={newTransaction.transactionDate} 
                    onChange={handleInputChange} 
                    required
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={handleSubmit}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-sm"
                  >
                    {editId ? "Update" : "Add Transaction"}
                  </button>
                  {editId && (
                    <button 
                      onClick={handleCancel}
                      className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-2.5 px-4 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Transactions</h3>
              
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-slate-500 text-lg">No transactions yet!</p>
                  <p className="text-slate-400 text-sm mt-1">Add your first transaction to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map(t => (
                    <div 
                      key={t._id} 
                      className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all bg-slate-50"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              t.type === 'Income' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {t.type}
                            </span>
                            <span className="text-sm text-slate-500">
                              {new Date(t.transactionDate).toLocaleDateString('en-GB', { 
                                day: '2-digit', 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </span>
                          </div>
                          
                          <h4 className="text-lg font-semibold text-slate-900">{t.description}</h4>
                          
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                            <p className="text-slate-600">
                              <span className="font-medium">Category:</span> {t.category}
                            </p>
                            <p className="text-slate-600">
                              <span className="font-medium">Account:</span> {t.account?.accountName || "Unnamed Account"}
                            </p>
                          </div>
                          
                          <p className={`text-2xl font-bold ${
                            t.type === 'Income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {t.type === 'Income' ? '+' : '-'} {t.amount} {t.currency}
                          </p>
                        </div>

                        <div className="flex sm:flex-col gap-2">
                          <button 
                            onClick={() => handleEdit(t)}
                            className="flex-1 sm:flex-none bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(t._id)}
                            className="flex-1 sm:flex-none bg-red-50 hover:bg-red-100 text-red-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;