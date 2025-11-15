import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { getAllBudgets, createBudget, updateBudget, deleteBudget } from '../../services/budgetService'; // assume these APIs exist

const Budget = () => {
  const { user } = useContext(UserContext);
  
  const [budgets, setBudgets] = useState([]);
  const [budgetReport, setBudgetReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [newBudget, setNewBudget] = useState({
    name: '',
    periodType: 'monthly',
    startDate: '',
    endDate: '',
    currency: 'BHD',
    alertThresholdPercent: 80,
    items: [] // e.g., [{ categoryId: '', limitAmount: '' }]
  });

  const [editId, setEditId] = useState(null);

  // Fetch all budgets on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await getAllBudgets(user._id);
        setBudgets(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch budgets');
      }
    })();
  }, [user]);

  // Fetch report for selected budget
  const fetchBudgetReport = async (budgetId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/budgets/${budgetId}/report`);
      if (!response.ok) throw new Error('Failed to fetch budget report');
      const reportData = await response.json();
      setBudgetReport(reportData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBudget(prev => ({ ...prev, [name]: value }));
  };

  // Add or update budget
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...newBudget, userId: user._id };
      let saved;
      if(editId) {
        saved = await updateBudget(editId, payload);
        setBudgets(budgets.map(b => (b._id === editId ? saved : b)));
        setEditId(null);
      } else {
        saved = await createBudget(payload);
        setBudgets([...budgets, saved]);
      }
      setNewBudget({ name: '', periodType: 'monthly', startDate: '', endDate: '', currency: 'BHD', alertThresholdPercent: 80, items: [] });
      setBudgetReport(null);
    } catch (err) {
      console.error(err);
      setError('Failed to save budget');
    }
  };

  // Edit budget: populate form with budget data
  const handleEdit = (budget) => {
    setNewBudget({
      name: budget.name,
      periodType: budget.periodType,
      startDate: budget.startDate ? budget.startDate.split('T')[0] : '',
      endDate: budget.endDate ? budget.endDate.split('T')[0] : '',
      currency: budget.currency,
      alertThresholdPercent: budget.alertThresholdPercent,
      items: budget.items || []
    });
    setEditId(budget._id);
  };

  // Delete budget
  const handleDelete = async (budgetId) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) return;
    try {
      await deleteBudget(budgetId);
      setBudgets(budgets.filter(b => b._id !== budgetId));
      if (budgetReport && budgetReport.budget._id === budgetId) setBudgetReport(null);
    } catch (err) {
      console.error(err);
      setError('Failed to delete budget');
    }
  };

  return (
    <div>
      <h2>{editId ? 'Edit Budget' : 'Create Budget'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name='name' placeholder='Budget Name' value={newBudget.name} onChange={handleInputChange} required />
        <select name='periodType' value={newBudget.periodType} onChange={handleInputChange}>
          <option value='monthly'>Monthly</option>
          <option value='weekly'>Weekly</option>
          <option value='custom'>Custom</option>
        </select>
        <input type='date' name='startDate' value={newBudget.startDate} onChange={handleInputChange} required />
        <input type='date' name='endDate' value={newBudget.endDate} onChange={handleInputChange} required />
        <input name='currency' value={newBudget.currency} onChange={handleInputChange} maxLength={3} required />
        <input type='number' name='alertThresholdPercent' value={newBudget.alertThresholdPercent} min={1} max={100} onChange={handleInputChange} />

      

        <button type='submit'>{editId ? 'Update' : 'Create'} Budget</button>
      </form>

      <h2>All Budgets</h2>
      <ul>
        {budgets.map(b => (
          <li key={b._id}>
            <span onClick={() => fetchBudgetReport(b._id)} style={{ cursor: 'pointer' }}>
              {b.name} ({new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()})
            </span>
            <button onClick={() => handleEdit(b)}>Edit</button>
            <button onClick={() => handleDelete(b._id)}>Delete</button>
          </li>
        ))}
      </ul>

      {budgetReport && (
        <div className="budgetReport">
          <h3>Budget Report: {budgetReport.budget.name}</h3>
          <p>Period: {new Date(budgetReport.budget.startDate).toLocaleDateString()} - {new Date(budgetReport.budget.endDate).toLocaleDateString()}</p>
          <p>Total Spent: {budgetReport.totalSpent.toFixed(2)} {budgetReport.budget.currency}</p>

          <h4>Spending by Account</h4>
          {budgetReport.spentByAccount && Object.entries(budgetReport.spentByAccount).map(([accountName, accountData]) => (
            <div key={accountName} style={{ marginBottom: '20px' }}>
              <h5>{accountName}: {accountData.total.toFixed(2)} {budgetReport.budget.currency}</h5>
              <ul>
                {accountData.categories && Object.entries(accountData.categories).map(([categoryName, categoryData]) => (
                  <li key={categoryName}>
                    {categoryName}: {categoryData.total.toFixed(2)} {budgetReport.budget.currency}
                    {categoryData.alertTriggered && <span style={{ color: 'red', marginLeft: '10px' }}>Alert!</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Budget;
