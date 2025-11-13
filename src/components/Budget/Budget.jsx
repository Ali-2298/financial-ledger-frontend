    import React, { useState, useEffect } from 'react';

const BudgetReport = () => {
  const [budgetReport, setBudgetReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace with actual budget ID or make dynamic later
  const budgetId = 'YOUR_BUDGET_ID';

  useEffect(() => {
    const fetchBudgetReport = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/budgets/${budgetId}/report`);
        if (!response.ok) throw new Error('Failed to fetch budget report');
        const data = await response.json();
        setBudgetReport(data);
      } catch (err) {
        setError('Failed to load budget report');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetReport();
  }, [budgetId]);

  if (loading) return <p>Loading budget report...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!budgetReport) return <p>No budget report found.</p>;

  // Destructure for convenience
  const { budget, totalSpent, spentByAccount } = budgetReport;

  return (
    <div className="budgetReport">
      <h3>Budget Report</h3>
      <p><strong>Budget:</strong> {budget?.name}</p>
      <p>
        <strong>Period:</strong> {new Date(budget?.startDate).toLocaleDateString()} - {new Date(budget?.endDate).toLocaleDateString()}
      </p>
      <p><strong>Total Spent:</strong> {totalSpent?.toFixed(2)} {budget?.currency}</p>

      <h4>Spending by Account</h4>

      {spentByAccount && Object.entries(spentByAccount).length > 0 ? (
        Object.entries(spentByAccount).map(([accountName, accountData]) => (
          <div key={accountName} style={{ marginBottom: '20px' }}>
            <h5>{accountName}: {accountData.total.toFixed(2)} {budget?.currency}</h5>
            <ul>
              {accountData.categories && Object.entries(accountData.categories).map(([categoryName, categoryData]) => (
                <li key={categoryName}>
                  {categoryName}: {categoryData.total.toFixed(2)} {budget?.currency}
                  {categoryData.alertTriggered && (
                    <span style={{ color: 'red', marginLeft: '10px' }}>Alert!</span>
                  )}
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

export default BudgetReport;
