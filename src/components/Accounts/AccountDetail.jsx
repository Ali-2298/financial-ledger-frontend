import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router'
import { getAllTransactions } from '../../services/transaction';

const Account = () => {
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const accountResponse = await fetch('http://localhost:3000/api/accounts', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!accountResponse.ok) throw new Error('Failed to fetch accounts');
                const accountData = await accountResponse.json();
                setAccounts(accountData);

                const txs = await getAllTransactions();
                setTransactions(txs);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, []);

    const handleAccountClick = (accountId) => {
        navigate(`/account/${accountId}`);
    };

    const getAccountTransactions = (accountId) => {
        return transactions.filter(t => t.account?._id === accountId);
    };

    const getAccountIncome = (accountId) => {
        return getAccountTransactions(accountId)
            .filter(t => t.type === 'Income')
            .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    };

    const getAccountExpenditure = (accountId) => {
        return getAccountTransactions(accountId)
            .filter(t => t.type === 'Expenditure')
            .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    };

    const getCalculatedBalance = (accountId, initialBalance) => {
        const income = getAccountIncome(accountId);
        const expenditure = getAccountExpenditure(accountId);
        return parseFloat(initialBalance) + income - expenditure;
    };

    const totalBalance = accounts.reduce((sum, acc) => 
        sum + getCalculatedBalance(acc._id, acc.balance), 0
    );

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">My Accounts</h1>
                    <p className="text-slate-600">Manage your financial accounts</p>
                </div>

                <div className="bg-blue-600 rounded-lg p-6 mb-6 text-white">
                    <p className="text-sm opacity-90 mb-1">Total Balance</p>
                    <p className="text-4xl font-bold">{totalBalance.toFixed(3)} BHD</p>
                    <p className="text-sm opacity-75 mt-1">Across {accounts.length} account{accounts.length !== 1 ? 's' : ''}</p>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Your Accounts</h3>
                    
                    {accounts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-slate-500">No accounts yet!</p>
                            <p className="text-slate-400 text-sm mt-1">Add your first account to get started</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {accounts.map((account) => {
                                const accountTxs = getAccountTransactions(account._id);
                                const income = getAccountIncome(account._id);
                                const expenditure = getAccountExpenditure(account._id);
                                const balance = getCalculatedBalance(account._id, account.balance);

                                return (
                                    <div
                                        key={account._id || account.accountNumber}
                                        onClick={() => handleAccountClick(account._id)}
                                        className="border border-slate-200 rounded-lg p-4 cursor-pointer hover:border-blue-500 hover:bg-slate-50 transition-all"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <h4 className="font-bold text-slate-900">{account.accountName}</h4>
                                                <p className="text-sm text-slate-500 capitalize">{account.accountType} • #{account.accountNumber}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-slate-900">{balance.toFixed(3)}</p>
                                                <p className="text-xs text-slate-500">BHD</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 pt-3 border-t border-slate-200 text-sm">
                                            <div>
                                                <span className="text-slate-500">Income: </span>
                                                <span className="font-semibold text-green-600">{income.toFixed(3)}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-500">Expenses: </span>
                                                <span className="font-semibold text-red-600">{expenditure.toFixed(3)}</span>
                                            </div>
                                            <div className="ml-auto">
                                                <span className="text-slate-500">{accountTxs.length} transactions</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="mt-6">
                    <button 
                        onClick={() => navigate("/transactions")}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors"
                    >
                        New Transaction
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Account;