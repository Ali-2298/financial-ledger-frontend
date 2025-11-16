import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router'
import { getAllTransactions } from '../../services/transaction';

const Account = () => {
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [newAccount, setNewAccount] = useState({
        accountName: "",
        accountType: "",
        accountNumber: "",
        balance: ""
    });

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

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewAccount({ ...newAccount, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/accounts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(newAccount)
            });

            let data = null;
            try {
                data = await response.json();
            } catch {
                console.warn('Server returned no JSON.');
            }

            if (!response.ok) {
                console.error('Failed to save account:', data || response.statusText);
                return;
            }

            setAccounts([...accounts, data]);
            setNewAccount({
                accountName: "",
                accountType: "",
                accountNumber: "",
                balance: ""
            });
        } catch (err) {
            console.error('Submit error:', err);
        }
    };

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

    const getAccountTypeIcon = (type) => {
        switch(type?.toLowerCase()) {
            case 'savings': return '💰';
            case 'salary': return '💵';
            case 'check': return '🏦';
            default: return '💳';
        }
    };

    const totalBalance = accounts.reduce((sum, acc) => 
        sum + getCalculatedBalance(acc._id, acc.balance), 0
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">My Accounts</h1>
                    <p className="text-slate-600">Manage your financial accounts</p>
                </div>

                {/* Total Balance Card */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-8 mb-8 text-white">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">💼</span>
                        <span className="text-lg font-medium opacity-90">Total Balance</span>
                    </div>
                    <div className="text-5xl font-bold mb-2">{totalBalance.toFixed(3)} BHD</div>
                    <p className="text-blue-100">Across {accounts.length} account{accounts.length !== 1 ? 's' : ''}</p>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Add Account Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-6">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="text-2xl">➕</span>
                                <h3 className="text-xl font-bold text-slate-900">Add New Account</h3>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Account Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="accountName"
                                        value={newAccount.accountName}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Main Checking"
                                        required
                                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Account Type <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="accountType"
                                        value={newAccount.accountType}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    >
                                        <option value="">Select Type</option>
                                        <option value="check">Check</option>
                                        <option value="savings">Savings</option>
                                        <option value="salary">Salary</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Account Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="accountNumber"
                                        value={newAccount.accountNumber}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 1234567890"
                                        required
                                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Initial Balance (BHD) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="balance"
                                        value={newAccount.balance}
                                        type="number"
                                        step="0.001"
                                        onChange={handleInputChange}
                                        placeholder="0.000"
                                        required
                                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>

                                <button 
                                    onClick={handleSubmit}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-sm"
                                >
                                    ➕ Add Account
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Accounts List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h3 className="text-xl font-bold text-slate-900 mb-6">Your Accounts</h3>
                            
                            {accounts.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">💳</div>
                                    <p className="text-slate-500 text-lg">No accounts yet!</p>
                                    <p className="text-slate-400 text-sm mt-1">Add your first account to get started</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {accounts.map((account) => {
                                        const accountTxs = getAccountTransactions(account._id);
                                        const income = getAccountIncome(account._id);
                                        const expenditure = getAccountExpenditure(account._id);
                                        const balance = getCalculatedBalance(account._id, account.balance);

                                        return (
                                            <div
                                                key={account._id || account.accountNumber}
                                                onClick={() => handleAccountClick(account._id)}
                                                className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-5 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200"
                                            >
                                                <div className="flex items-start justify-between mb-4">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-2xl">{getAccountTypeIcon(account.accountType)}</span>
                                                            <h4 className="text-lg font-bold text-slate-900">{account.accountName}</h4>
                                                        </div>
                                                        <p className="text-sm text-slate-500 capitalize">{account.accountType} Account</p>
                                                    </div>
                                                    <span className="text-2xl">→</span>
                                                </div>

                                                <div className="mb-4">
                                                    <p className="text-3xl font-bold text-slate-900">
                                                        {balance.toFixed(3)} <span className="text-lg text-slate-600">BHD</span>
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-1">Account #{account.accountNumber}</p>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200">
                                                    <div>
                                                        <p className="text-xs text-slate-500">Income</p>
                                                        <p className="text-sm font-semibold text-green-600">📈 {income.toFixed(3)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-500">Expenses</p>
                                                        <p className="text-sm font-semibold text-red-600">📉 {expenditure.toFixed(3)}</p>
                                                    </div>
                                                </div>

                                                <div className="mt-3 pt-3 border-t border-slate-200">
                                                    <p className="text-xs text-slate-500">
                                                        {accountTxs.length} transaction{accountTxs.length !== 1 ? 's' : ''}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Quick Action Button */}
                        <div className="mt-6">
                            <button 
                                onClick={() => navigate("/transactions")}
                                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-4 px-6 rounded-xl transition-all shadow-sm"
                            >
                                ➕ New Transaction
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;