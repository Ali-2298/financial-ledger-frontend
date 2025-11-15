import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router";
import { getAllTransactions } from '../../services/transaction';

const AccountDetail = () => {
    const { accountId } = useParams();
    const navigate = useNavigate();
    const [account, setAccount] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedAccount, setEditedAccount] = useState({
        accountName: "",
        accountType: "",
        accountNumber: "",
        balance: ""
    });

    useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/accounts/${accountId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch account');
            
            const data = await response.json();
            setAccount(data);
            setEditedAccount({
                accountName: data.accountName,
                accountType: data.accountType,
                accountNumber: data.accountNumber,
                balance: data.balance
            });

            const txs = await getAllTransactions();
            setTransactions(txs);
            
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    fetchData();
}, [accountId]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditedAccount({ ...editedAccount, [name]: value });
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/accounts/${accountId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(editedAccount)
            });

            if (!response.ok) throw new Error('Failed to update account');

            const updatedAccount = await response.json();
            setAccount(updatedAccount);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/accounts/${accountId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error('Failed to delete account');

            navigate('/account');
        } catch (err) {
            console.error(err);
        }
    };
const accountTransactions = transactions.filter(t => t.account?._id === accountId);

const totalIncome = accountTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

const totalExpenditure = accountTransactions
    .filter(t => t.type === 'expenditure')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    

    if (loading) return <div>Loading...</div>;
    if (!account) return <div>Account not found</div>;
const calculatedBalance = parseFloat(account.balance) + totalIncome - totalExpenditure;
    return (
        <div className="dashboard">
            <button onClick={() => navigate('/account')}>← Back to Accounts</button>
            
            <h2>Account Details</h2>
            
            {isEditing ? (
                <div className="formDiv">
                    <div>
                        <label htmlFor="accountName">Account Name:</label>
                        <input
                            id="accountName"
                            name="accountName"
                            value={editedAccount.accountName}
                            onChange={handleInputChange}
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="accountType">Account Type:</label>
                        <select
                            id="accountType"
                            name="accountType"
                            value={editedAccount.accountType}
                            onChange={handleInputChange}
                        >
                            <option value="check">Check</option>
                            <option value="savings">Savings</option>
                            <option value="salary">Salary</option>
                        </select>
                    </div>
                    
                    <div>
                        <label htmlFor="accountNumber">Account Number:</label>
                        <input
                            id="accountNumber"
                            name="accountNumber"
                            value={editedAccount.accountNumber}
                            onChange={handleInputChange}
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="balance">Balance:</label>
                        <input
                            id="balance"
                            name="balance"
                            type="number"
                            value={editedAccount.balance}
                            onChange={handleInputChange}
                        />
                    </div>
                    
                    <div>
                        <button onClick={handleUpdate}>Save</button>
                        <button onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="detail-section">
                        <div className="detail-row">
                            <strong>Account Name:</strong>
                            <span>{account.accountName}</span>
                        </div>
                        
                        <div className="detail-row">
                            <strong>Account Type:</strong>
                            <span>{account.accountType}</span>
                        </div>
                        
                        <div className="detail-row">
                            <strong>Account Number:</strong>
                            <span>{account.accountNumber}</span>
                        </div>
                        
                        <div className="detail-row">
                            <strong>Balance:</strong>
                        <span>{calculatedBalance.toFixed(3)} BHD</span>
                        </div>
                        <div className="detail-row">
                        <strong>Total Transactions:</strong>
                        <span>{accountTransactions.length}</span>
                        </div>

                        <div className="detail-row">
                         <strong>Total Income:</strong>
                         <span style={{ color: 'green' }}>{totalIncome.toFixed(3)} BHD</span>
                        </div>

                        <div className="detail-row">
                        <strong>Total Expenses:</strong>
                        <span style={{ color: 'red' }}>{totalExpenditure.toFixed(3)} BHD</span>
                        </div>
                    </div>
                    
                    <div>
                        <button onClick={() => setIsEditing(true)}>Edit</button>
                        <button onClick={handleDelete}>Delete</button>
                    </div>
                    <div style={{ marginTop: '30px' }}>
    <h3>Recent Transactions</h3>
    {accountTransactions.length === 0 ? (
        <p>No transactions for this account yet.</p>
    ) : (
        <div>
            {accountTransactions.slice(0, 5).map((transaction) => (
                <div key={transaction._id} style={{ 
                    padding: '10px', 
                    borderBottom: '1px solid #ccc',
                    marginBottom: '10px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span><strong>{transaction.category}</strong></span>
                        <span style={{ 
                            color: transaction.type === 'income' ? 'green' : 'red',
                            fontWeight: 'bold'
                        }}>
                            {transaction.type === 'income' ? '+' : '-'}{parseFloat(transaction.amount).toFixed(3)} BHD
                        </span>
                    </div>
                    <div style={{ fontSize: '0.9em', color: '#666' }}>
                        {transaction.description} • {new Date(transaction.transactionDate).toLocaleDateString()}
                    </div>
                </div>
            ))}
        </div>
    )}
</div>
                </>
            )}
        </div>
    );
};


export default AccountDetail;