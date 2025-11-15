import React, { useState, useEffect } from 'react';

const Budget = () => {
  const [budgetReport, setBudgetReport] = useState(null);
  const [loading, setLoading] = useState(true);      // Loading state to track fetch status
  const [error, setError] = useState(null);          // Error state to handle fetch errors
  
  // Replace with actual budget ID or make it dynamic later
  const budgetId = 'YOUR_BUDGET_ID';
  
  useEffect(() => {
    const fetchBudgetReport = async () => {
      setLoading(true);        // Set loading to true before the fetch
      setError(null);          // Clear previous errors before new fetch
      try {
        const response = await fetch(`/api/budgets/${budgetId}/report`);
        if (!response.ok) throw new Error('Failed to fetch budget report');
        const data = await response.json();
        setBudgetReport(data);
      } catch (err) {
        setError(err.message);  // Capture error message
      } finally {
        setLoading(false);      // Set loading to false after fetch completes
      }
    };

    if (budgetId) {
      fetchBudgetReport();
    }
  }, [budgetId]);
  
  if (loading) return <p>Loading budget report...</p>;   // Loading feedback to user
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!budgetReport) return <p>No budget data available.</p>;

  const { budget: budgetInfo, totalSpent, spentByAccount } = budgetReport;

  return (
    <div className="budgetReport">
      <h3>Budget Report</h3>
      <p><strong>Budget:</strong> {budgetInfo.name}</p>
      <p><strong>Period:</strong> {new Date(budgetInfo.startDate).toLocaleDateString()} - {new Date(budgetInfo.endDate).toLocaleDateString()}</p>
      <p><strong>Total Spent:</strong> {totalSpent.toFixed(2)} {budgetInfo.currency}</p>

      <h4>Spending by Account</h4>
      {spentByAccount && Object.entries(spentByAccount).length > 0 ? (
        Object.entries(spentByAccount).map(([accountName, accountData]) => (
          <div key={accountName} style={{ marginBottom: '20px' }}>
            <h5>{accountName}: {accountData.total.toFixed(2)} {budgetInfo.currency}</h5>
            <ul>
              {accountData.categories && Object.entries(accountData.categories).map(([categoryName, categoryData]) => (
                <li key={categoryName}>
                  {categoryName}: {categoryData.total.toFixed(2)} {budgetInfo.currency}
                  {categoryData.alertTriggered && <span style={{ color: 'red', marginLeft: '10px' }}>Alert!</span>}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No spending data available for this budget.</p>
      )}
    </div>
  );
};

export default Budget;
