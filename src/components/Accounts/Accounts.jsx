import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';

const Account = () => {
    const { user } = useContext(UserContext);

    const [accounts, setAccounts] = useState([]);
    const [newAccount, setNewAccounts] = useState({
        name: "",
        type: "",
        number: "",
        type: "expense"
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
                number: "",
                type: "",
                name: "",
                type: "expense"
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

                    <label htmlFor="name">Name:</label>

                    <input
                        id="name"
                        name="name"
                        type="number"
                        value={newAccount.type}
                        onChange={handleInputChange}
                        required
                    />
                    <label htmlFor="type">Type:</label>
                    <select
                        id="type"
                        name="type"
                        value={newAccount.name}
                        onChange={handleInputChange}
                    >
                        <option value="check">Check</option>
                        <option value="savings">Savings</option>
                        <option value="salary">Salary</option>
                    </select>


                    <label htmlFor="number">Number:</label>
                    <input
                        id="number"
                        name="number"
                        value={newAccount.number}
                        onChange={handleInputChange}
                        required
                    />

                    <label htmlFor="balance">Balance:</label>
                    <select
                        id="balance"
                        name="balance"
                        value={newAccount.type}
                        onChange={handleInputChange}
                    >
                        <option value="income">Income</option>
                        <option value="outcome">Outcome</option>
                    </select>

                    <button type="submit">Add Account</button>
                </form>
            </div>
        </div>
    );
};

export default Account;