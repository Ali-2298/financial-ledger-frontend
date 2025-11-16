import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { getAllBudgets, createBudget, updateBudget, deleteBudget } from '../../services/budget';

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
    items: []
  });

  const [editId, setEditId] = useState(null);
  const [selectedBudgetId, setSelectedBudgetId] = useState(null);

  useEffect(() => {
    if (!user?._id) return;
    setLoading(true);
    getAllBudgets(user._id)
      .then(data => setBudgets(data))
      .catch(() => setError('Failed to fetch budgets'))
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (!selectedBudgetId) return;
    setLoading(true);
    fetch(`${import.meta.env.VITE_BACK_END_SERVER_URL}/api/budgets/${selectedBudgetId}/report`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
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
    const payload = { ...newBudget, owner: user._id };
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
      setSelectedBudgetId(saved._id);
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

  const handleCancel = () => {
    setEditId(null);
    setNewBudget({
      name: '',
      periodType: 'monthly',
      startDate: '',
      endDate: '',
      currency: 'BHD',
      alertThresholdPercent: 80,
      items: []
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Budget Manager</h1>
          <p className="text-slate-600">Create and track your financial budgets</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            <p>{error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">✕</button>
          </div>
        )}

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Budget Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl">📊</span>
                <h3 className="text-xl font-bold text-slate-900">
                  {editId ? 'Edit Budget' : 'Create Budget'}
                </h3>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Budget Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Budget Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name='name' 
                    placeholder='e.g., Monthly Expenses' 
                    value={newBudget.name} 
                    onChange={handleInputChange} 
                    required
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                {/* Period Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Period Type <span className="text-red-500">*</span>
                  </label>
                  <select 
                    name='periodType' 
                    value={newBudget.periodType} 
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value='monthly'>📅 Monthly</option>
                    <option value='weekly'>📆 Weekly</option>
                    <option value='custom'>🔧 Custom</option>
                  </select>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type='date' 
                      name='startDate' 
                      value={newBudget.startDate} 
                      onChange={handleInputChange} 
                      required
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type='date' 
                      name='endDate' 
                      value={newBudget.endDate} 
                      onChange={handleInputChange} 
                      required
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Currency */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Currency <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name='currency' 
                    maxLength={3} 
                    value={newBudget.currency} 
                    onChange={handleInputChange} 
                    placeholder="BHD"
                    required
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all uppercase"
                  />
                </div>

                {/* Alert Threshold */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Alert Threshold (%) <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type='number' 
                    min={1} 
                    max={100} 
                    name='alertThresholdPercent' 
                    value={newBudget.alertThresholdPercent} 
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                  <p className="text-xs text-slate-500 mt-1">Get notified when spending reaches this percentage</p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button 
                    type='submit' 
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-sm"
                  >
                    {loading ? '⏳ Saving...' : (editId ? '💾 Update' : '➕ Create')}
                  </button>
                  {editId && (
                    <button 
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-2.5 px-4 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Budgets List & Report */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Budgets List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Your Budgets</h3>
              
              {loading && !editId && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
                  <p className="text-slate-500">Loading budgets...</p>
                </div>
              )}

              {!loading && budgets.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-slate-500 text-lg">No budgets yet!</p>
                  <p className="text-slate-400 text-sm mt-1">Create your first budget to start tracking expenses</p>
                </div>
              )}

              {!loading && budgets.length > 0 && (
                <div className="space-y-3">
                  {budgets.map(budget => (
                    <div 
                      key={budget._id}
                      className={`border rounded-lg p-4 transition-all cursor-pointer ${
                        selectedBudgetId === budget._id 
                          ? 'border-blue-500 bg-blue-50 shadow-md' 
                          : 'border-slate-200 bg-slate-50 hover:border-blue-300 hover:shadow-sm'
                      }`}
                      onClick={() => setSelectedBudgetId(budget._id)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">
                              {budget.periodType === 'monthly' ? '📅' : budget.periodType === 'weekly' ? '📆' : '🔧'}
                            </span>
                            <h4 className="text-lg font-bold text-slate-900">{budget.name}</h4>
                            {selectedBudgetId === budget._id && (
                              <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">Active</span>
                            )}
                          </div>
                          <div className="text-sm text-slate-600">
                            <span>📍 {new Date(budget.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                            <span className="mx-2">→</span>
                            <span>{new Date(budget.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                          </div>
                          <div className="text-sm text-slate-500 mt-1">
                            💰 Alert at {budget.alertThresholdPercent}% • {budget.currency}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleEdit(budget); }} 
                            disabled={loading}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                          >
                            ✏️ Edit
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(budget._id); }} 
                            disabled={loading}
                            className="bg-red-50 hover:bg-red-100 text-red-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Budget Report */}
            {loading && selectedBudgetId && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
                  <p className="text-slate-500">Loading budget report...</p>
                </div>
              </div>
            )}

            {budgetReport && !loading && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-2xl">📈</span>
                  <h3 className="text-xl font-bold text-slate-900">Budget Report: {budgetReport.budget.name}</h3>
                </div>

                {/* Report Summary */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-5 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-purple-700">Period</span>
                    <span className="text-sm text-purple-600">
                      {new Date(budgetReport.budget.startDate).toLocaleDateString('en-GB')} - {new Date(budgetReport.budget.endDate).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-purple-700">Total Spent</span>
                    <span className="text-3xl font-bold text-purple-900">
                      {budgetReport.totalSpent.toFixed(3)} {budgetReport.budget.currency}
                    </span>
                  </div>
                </div>

                {/* Spending by Account */}
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <span>💳</span> Spending by Account
                  </h4>
                  
                  {budgetReport.spentByAccount && Object.keys(budgetReport.spentByAccount).length === 0 ? (
                    <p className="text-slate-500 text-center py-8">No spending recorded for this period</p>
                  ) : (
                    <div className="space-y-4">
                      {budgetReport.spentByAccount && Object.entries(budgetReport.spentByAccount).map(([accountName, accountData]) => (
                        <div key={accountName} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                          <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-200">
                            <h5 className="text-lg font-bold text-slate-900">{accountName}</h5>
                            <span className="text-xl font-bold text-slate-900">
                              {accountData.total.toFixed(3)} {budgetReport.budget.currency}
                            </span>
                          </div>
                          
                          {accountData.categories && Object.keys(accountData.categories).length > 0 ? (
                            <div className="space-y-2">
                              {Object.entries(accountData.categories).map(([categoryName, categoryData]) => (
                                <div 
                                  key={categoryName} 
                                  className="flex items-center justify-between py-2 px-3 bg-white rounded border border-slate-100"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-slate-700">{categoryName}</span>
                                    {categoryData.alertTriggered && (
                                      <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                        ⚠️ Alert
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-sm font-semibold text-slate-900">
                                    {categoryData.total.toFixed(3)} {budgetReport.budget.currency}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-slate-500 italic">No categories for this account</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Budget;