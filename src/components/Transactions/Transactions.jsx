import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';

const Transaction = () => {
    const { user } = useContext(UserContext);

    const [transactions, setTransactions] = useState([]);
    const [newTransaction, setNewTransaction] = useState({
        category: "",
        amount: "",
        description: "",
        type: "expense"
    });

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch('/api/transactions');
                if (!response.ok) throw new Error('Failed to fetch transactions');
                const data = await response.json();
                setTransactions(data);
            } catch (err) {
                console.error(err);
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
            const response = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTransaction)
            });

            let data = null;
            try {
                data = await response.json();
            } catch {
                console.warn('Server returned no JSON.');
            }

            if (!response.ok) {
                console.error('Failed to save transaction:', data || response.statusText);
                return;
            }

            setTransactions([...transactions, newTransaction]);

            setNewTransaction({
                description: "",
                amount: "",
                category: "",
                type: "expense"
            });
        } catch (err) {
            console.error('Submit error:', err);
        }
    };

    return (
        <div className="dashboard">
            <div className="formDiv">
                <h3>Add New Transaction</h3>
                <form onSubmit={handleSubmit}>

                    <label htmlFor="category">Category:</label>
                    <input
                        id="category"
                        name="category"
                        value={newTransaction.category}
                        onChange={handleInputChange}
                    />

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

                    <label htmlFor="account Type">Account Type:</label>
                    <select
                        id="account-type"
                        name="account-type"
                        value={newTransaction.type}
                        onChange={handleInputChange}
                    >
                        <option value="income">Income</option>
                        <option value="outcome">Outcome</option>
                    </select>


                    <label htmlFor="transaction-date" >Transaction Date:</label>
                    <input
                        id="transaction-date"
                        name="transaction-date"
                        type="date"
                        value={newTransaction.transactionDate}
                        onChange={handleInputChange}
                        required
                    />

                    <button type="submit">Add Transaction</button>
                </form>
            </div>

            <div className="transactionList">
                <h3>Recent Transactions</h3>
                {transactions.length === 0 ? (
                    <p>No transactions yet.</p>
                ) : (
                    transactions.map((t, index) => (
                        <div key={index} className="transactionCard">
                            <h4>{t.description}</h4>
                            <p>
                                {t.type === 'income' ? '+' : '-'}${t.amount} — {t.category}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Transaction;