import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router";

const AccountDetail = () => {
    const { accountId } = useParams();
    const navigate = useNavigate();
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedAccount, setEditedAccount] = useState({
        accountName: "",
        accountType: "",
        accountNumber: "",
        balance: ""
    });

    useEffect(() => {
        const fetchAccount = async () => {
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
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        fetchAccount();
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

    if (loading) return <div>Loading...</div>;
    if (!account) return <div>Account not found</div>;

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
                            <span>${parseFloat(account.balance).toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <div>
                        <button onClick={() => setIsEditing(true)}>Edit</button>
                        <button onClick={handleDelete}>Delete</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default AccountDetail;