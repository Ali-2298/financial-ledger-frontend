    import React, { useState, useEffect } from 'react';


    const [budgetReport, setBudgetReport] = useState(null);  // New state for budget report
      const [budgetId] = useState('YOUR_BUDGET_ID');  // Placeholder; make dynamic later (e.g., from user selection)

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
    
      
      <div className="budgetReport">
        <h3>Budget Report</h3>
        {budgetReport ? (
          <>
            <p><strong>Budget:</strong> {budgetReport.budget.name}</p>
            <p><strong>Period:</strong> {new Date(budgetReport.budget.startDate).toLocaleDateString()} - {new Date(budgetReport.budget.endDate).toLocaleDateString()}</p>
            <p><strong>Total Spent:</strong> {budgetReport.totalSpent.toFixed(2)} {budgetReport.budget.currency}</p>

            <h4>Spending by Account</h4>
            {Object.entries(budgetReport.spentByAccount).map(([accountName, accountData]) => (
              <div key={accountName} style={{ marginBottom: '20px' }}>
                <h5>{accountName}: {accountData.total.toFixed(2)} {budgetReport.budget.currency}</h5>
                <ul>
                  {Object.entries(accountData.categories).map(([categoryName, categoryData]) => (
                    <li key={categoryName}>
                      {categoryName}: {categoryData.total.toFixed(2)} {budgetReport.budget.currency}
                      {categoryData.alertTriggered && <span style={{ color: 'red', marginLeft: '10px' }}>Alert!</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        ) : (
          <p>Loading budget report...</p>
        )}
      </div>
    