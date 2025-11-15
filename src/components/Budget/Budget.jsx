import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { getAllBudgets, createBudget, updateBudget, deleteBudget } from '../../services/budgetService'; // Your API service module

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
    items: []  // Add UI controls later to edit items array
  });

  const [editId, setEditId] = useState(null);
  const [selectedBudgetId, setSelectedBudgetId] = useState(null); // For report fetch dynamically

  // Fetch all budgets when user changes
  useEffect(() => {
    if (!user?._id) return;
    setLoading(true);
    getAllBudgets(user._id)
      .then(data => setBudgets(data))
      .catch(() => setError('Failed to fetch budgets'))
      .finally(() => setLoading(false));
  }, [user]);

  // Fetch budget report when selectedBudgetId changes
  useEffect(() => {
    if (!selectedBudgetId) return;
    setLoading(true);
    fetch(`/api/budgets/${selectedBudgetId}/report`)
      .then(res => {
        if (!res.ok) throw new Error('Error loading budget report');
        return res.json();
      })
      .then(data => setBudgetReport(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedBudgetId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBudget(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) return;
    setLoading(true);
    setError(null);
    const payload = { ...newBudget, userId: user._id };
    try {
      let saved;
      if (editId) {
        saved = await updateBudget(editId, payload);
        setBudgets(budgets.map(b => (b._id === editId ? saved : b)));
        setEditId(null);
      } else {
        saved = await createBudget(payload);
        setBudgets([...budgets, saved]);
      }
      setSelectedBudgetId(saved._id); // Optionally load new/updated budget report
      setNewBudget({
        name: '',
        periodType: 'monthly',
        startDate: '',
        endDate: '',
        currency: 'BHD',
        alertThresholdPercent: 80,
        items: []
      });
    } catch {
      setError('Failed to save budget');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (budget) => {
    setNewBudget({
      name: budget.name,
      periodType: budget.periodType,
      startDate: budget.startDate?.split('T')[0] || '',
      endDate: budget.endDate?.split('T')[0] || '',
      currency: budget.currency,
      alertThresholdPercent: budget.alertThresholdPercent,
      items: budget.items || []
    });
    setEditId(budget._id);
  };

  const handleDelete = async (budgetId) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) return;
    setLoading(true);
    setError(null);
    try {
      await deleteBudget(budgetId);
      setBudgets(budgets.filter(b => b._id !== budgetId));
      if (selectedBudgetId === budgetId) {
        setBudgetReport(null);
        setSelectedBudgetId(null);
      }
    } catch {
      setError('Failed to delete budget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>{editId ? 'Edit Budget' : 'Create Budget'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          name='name' placeholder='Budget Name' 
          value={newBudget.name} onChange={handleInputChange} required />

        <select name='periodType' value={newBudget.periodType} onChange={handleInputChange}>
          <option value='monthly'>Monthly</option>
          <option value='weekly'>Weekly</option>
          <option value='custom'>Custom</option>
        </select>

        <input type='date' name='startDate' value={newBudget.startDate} onChange={handleInputChange} required />
        <input type='date' name='endDate' value={newBudget.endDate} onChange={handleInputChange} required />

        <input name='currency' maxLength={3} value={newBudget.currency} onChange={handleInputChange} required />
        
        <input 
          type='number' min={1} max={100} name='alertThresholdPercent' 
          value={newBudget.alertThresholdPercent} onChange={handleInputChange} />

        <button type='submit' disabled={loading}>
          {loading ? 'Saving...' : (editId ? 'Update' : 'Create')} Budget
        </button>
      </form>

      <h2>All Budgets</h2>
      {loading && !editId && <p>Loading budgets...</p>}
      <ul>
        {budgets.map(budget => (
          <li key={budget._id}>
            <span 
              onClick={() => setSelectedBudgetId(budget._id)} 
              style={{ cursor: 'pointer', fontWeight: selectedBudgetId === budget._id ? 'bold' : 'normal' }}
            >
              {budget.name} ({new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()})
            </span>
            <button onClick={() => handleEdit(budget)} disabled={loading}>Edit</button>
            <button onClick={() => handleDelete(budget._id)} disabled={loading}>Delete</button>
          </li>
        ))}
      </ul>

      {loading && selectedBudgetId && <p>Loading budget report...</p>}

      {budgetReport && !loading && (
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
