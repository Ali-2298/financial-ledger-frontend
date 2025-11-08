import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';

const Account = () => {
    const { user } = useContext(UserContext);

    const [accounts, setAccounts] = useState([]);
    const [newAccount, setNewAccounts] = useState({
        accountName: "",
        accountType: "",
        accountNumber: "",
        balance: ""
    });

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await fetch('/api/accounts');
                if (!response.ok) throw new Error('Failed to fetch accounts');
                const data = await response.json();
                setAccounts(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchAccounts();
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewAccounts({ ...newAccount, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('/api/accounts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAccount)
            });

            let data = null;
            try {
                data = await response.json();
            } catch {
                console.warn('Server returned no JSON.');
            }

            if (!response.ok) {
                console.error('Failed to save name:', data || response.statusText);
                return;
            }

            setAccounts([...Accounts, newAccount]);

            setNewAccounts({
                accountName: "",
                accountType: "",
                accountNumber: "",
                balance: ""
            });
        } catch (err) {
            console.error('Submit error:', err);
        }
    };

    return (
        <div className="dashboard">
            <div className="formDiv">
                <h3>Add New Account</h3>
                <form onSubmit={handleSubmit}>

                    <label htmlFor="accountName">Name:</label>

                    <input
                        id="accountNname"
                        name="accountName"
                        value={newAccount.type}
                        onChange={handleInputChange}
                        required
                    />
                    <label htmlFor="accountType">Type:</label>
                    <select
                        id="accountType"
                        name="accountType"
                        value={newAccount.name}
                        onChange={handleInputChange}
                    >
                        <option value="check">Check</option>
                        <option value="savings">Savings</option>
                        <option value="salary">Salary</option>
                    </select>


                    <label htmlFor="accountNumber">Number:</label>
                    <input
                        id="accountNumber"
                        name="accountNumber"
                        value={newAccount.number}
                        onChange={handleInputChange}
                        required
                    />

                    <label htmlFor="balance">Balance:</label>
                    <input
                        id="balance"
                        name="balance"
                        value={newAccount.type}
                        type="number"
                        onChange={handleInputChange}
                    />

                    <button type="submit">Add Account</button>
                </form>
            </div>
        </div>
    );
};

export default Account;