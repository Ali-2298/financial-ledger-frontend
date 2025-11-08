import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';

const Transaction = () => {
    const { user } = useContext(UserContext);

    const [transactions, setTransactions] = useState([]);
    const [newTransaction, setNewTransaction] = useState({
        category: "",
        amount: "",
        description: "",
        type: ""
    });

    const incomeCategories = [
        "Salary",
        "Commission",
        "Interest Income",
        "Investment Earnings"
    ];

    const expenseCategories = [
        "Rent Expense",
        "Electricity Bill",
        "Utilities Bill",
        "Internet Bill",
        "Petrol",
        "Groceries",
        "Investments Purchase"
    ];

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
                type: ""
            });
        } catch (err) {
            console.error('Submit error:', err);
        }
    };

    return (
        <div className="account">
            <div className="formDiv">
                <h3>Add New Transaction</h3>
                <form onSubmit={handleSubmit}>

                    <label htmlFor="account-type">Account Type:</label>
                    <select
                        id="account-type"
                        name="type"
                        value={newTransaction.type}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select Type</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
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

                        {newTransaction.type === "expense" &&
                            expenseCategories.map((item, i) => (
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

                    <label htmlFor="transaction-date">Transaction Date:</label>
                    <input
                        id="transaction-date"
                        name="transactionDate"
                        type="date"
                        value={newTransaction.transactionDate || ""}
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
