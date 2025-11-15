import { useState, useEffect } from 'react';
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch accounts
                const accountResponse = await fetch('http://localhost:3000/api/accounts', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!accountResponse.ok) throw new Error('Failed to fetch accounts');
                const accountData = await accountResponse.json();
                setAccounts(accountData);

                // Fetch transactions
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
        window.location.href = `/account/${accountId}`;
    };

    // Get transactions for a specific account
    const getAccountTransactions = (accountId) => {
        return transactions.filter(t => t.account?._id === accountId);
    };

    // Calculate total income for an account
    const getAccountIncome = (accountId) => {
        return getAccountTransactions(accountId)
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    };

    // Calculate total expenditure for an account
    const getAccountExpenditure = (accountId) => {
        return getAccountTransactions(accountId)
            .filter(t => t.type === 'expenditure')
            .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    };

    return (
        <div className="dashboard">
            <div className="formDiv">
                <h3>Add New Account</h3>
                <div>
                    <label htmlFor="accountName">Name:</label>
                    <input
                        id="accountName"
                        name="accountName"
                        value={newAccount.accountName}
                        onChange={handleInputChange}
                        required
                    />
                    
                    <label htmlFor="accountType">Type:</label>
                    <select
                        id="accountType"
                        name="accountType"
                        value={newAccount.accountType}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select Type</option>
                        <option value="check">Check</option>
                        <option value="savings">Savings</option>
                        <option value="salary">Salary</option>
                    </select>

                    <label htmlFor="accountNumber">Number:</label>
                    <input
                        id="accountNumber"
                        name="accountNumber"
                        value={newAccount.accountNumber}
                        onChange={handleInputChange}
                        required
                    />

                    <label htmlFor="balance">Balance:</label>
                    <input
                        id="balance"
                        name="balance"
                        value={newAccount.balance}
                        type="number"
                        onChange={handleInputChange}
                        required
                    />

                    <button type="button" onClick={handleSubmit}>Add Account</button>
                </div>
            </div>

            <div className="accountsList">
                <h3>My Accounts</h3>
                {accounts.length === 0 ? (
                    <p>No accounts yet. Add your first account above!</p>
                ) : (
                    <div className="accounts-grid">
                        {accounts.map((account) => {
                            const accountTxs = getAccountTransactions(account._id);
                            const income = getAccountIncome(account._id);
                            const expenditure = getAccountExpenditure(account._id);
                            
                            return (
                                <div 
                                    key={account._id || account.accountNumber} 
                                    className="account-card"
                                    onClick={() => handleAccountClick(account._id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <h4>{account.accountName}</h4>
                                    <p className="balance">
                                        ${parseFloat(account.balance).toFixed(2)}
                                    </p>
                                    <div style={{ fontSize: '0.9em', marginTop: '10px', color: '#666' }}>
                                        <p>Transactions: {accountTxs.length}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
export default Account;