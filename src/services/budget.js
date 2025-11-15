const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/budgets`;

const getAllBudgets = async () => {
  try {
    const res = await fetch(BASE_URL, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error('Failed to fetch budgets');
    }

    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const createBudget = async (budgetData) => {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(budgetData)
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || 'Failed to create budget');
    }

    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};
const updateBudget = async (budgetId, budgetData) => {
  try {
    const res = await fetch(`${BASE_URL}/${budgetId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(budgetData)
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || 'Failed to update budget');
    }

    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};
const deleteBudget = async (budgetId) => {
  try {
    const res = await fetch(`${BASE_URL}/${budgetId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || 'Failed to delete budget');
    }

    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export {
  getAllBudgets,
  createBudget,
  updateBudget,
  deleteBudget
};