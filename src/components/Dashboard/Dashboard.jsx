// src/components/Dashboard/Dashboard.jsx

import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import { getAllTransactions } from '../../services/transaction';

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [lastTransaction, setLastTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch accounts
        const accountResponse = await fetch('http://localhost:3000/api/accounts', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (accountResponse.ok) {
          const accountData = await accountResponse.json();
          setAccounts(accountData);
        }

        // Fetch transactions
        const txs = await getAllTransactions();
        if (txs.length > 0) {
          setLastTransaction(txs[0]);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getAccountBalance = (account, transactions) => {
    const income = transactions
      .filter(t => t.account?._id === account._id && t.type === 'Income')
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    const expenses = transactions
      .filter(t => t.account?._id === account._id && t.type === 'Expenditure')
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    return parseFloat(account.balance) + income - expenses;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Dashboard
          </h1>
          <p className="text-slate-600">Welcome back, {user?.username}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Account Balances</h2>
          
          {accounts.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">💳</span>
              <p className="text-slate-500 text-lg mb-4">No accounts yet</p>
              <button 
                onClick={() => navigate('/account')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Create Your First Account
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {accounts.map((account) => {
                const balance = getAccountBalance(account, []);
                
                return (
                  <div 
                    key={account._id}
                    className="border border-slate-200 rounded-lg p-5 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => navigate(`/account/${account._id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">
                          {account.accountName}
                        </h3>
                        <p className="text-sm text-slate-500 capitalize">
                          {account.accountType} • #{account.accountNumber}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-slate-900">
                          {balance.toFixed(3)}
                        </p>
                        <p className="text-sm text-slate-500">BHD</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Last Transaction</h2>
          
          {!lastTransaction ? (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">📝</span>
              <p className="text-slate-500 text-lg mb-4">No transactions yet</p>
              <button 
                onClick={() => navigate('/transactions')}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Add Your First Transaction
              </button>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-lg p-6 bg-slate-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      lastTransaction.type === 'Income' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {lastTransaction.type}
                    </span>
                    <span className="text-sm text-slate-500">
                      {new Date(lastTransaction.transactionDate).toLocaleDateString('en-GB', { 
                        day: '2-digit', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {lastTransaction.description}
                  </h3>
                  
                  <div className="flex flex-col gap-1 text-sm text-slate-600">
                    <p>
                      <span className="font-medium">Category:</span> {lastTransaction.category}
                    </p>
                    <p>
                      <span className="font-medium">Account:</span> {lastTransaction.account?.accountName || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="text-right sm:text-left">
                  <p className={`text-4xl font-bold ${
                    lastTransaction.type === 'Income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {lastTransaction.type === 'Income' ? '+' : '-'}
                    {parseFloat(lastTransaction.amount).toFixed(3)}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">{lastTransaction.currency}</p>
                </div>
              </div>

              <button 
                onClick={() => navigate('/transactions')}
                className="w-full mt-6 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-3 rounded-lg transition-colors"
              >
                View All Transactions →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;