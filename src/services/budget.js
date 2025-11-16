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
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to fetch budgets');
      } else {
        const text = await res.text();
        console.error('Received non-JSON response:', text);
        throw new Error(`Server error: ${res.status} ${res.statusText}`);
      }
    }

    return await res.json();
  } catch (err) {
    console.error('Error fetching budgets:', err);
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

    console.log(budgetData)

    if (!res.ok) {
      // Check if response is JSON before parsing
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to create budget');
      } else {
        // If not JSON, it might be HTML error page
        const text = await res.text();
        console.error('Received non-JSON response:', text);
        throw new Error(`Server error: ${res.status} ${res.statusText}`);
      }
    }

    return await res.json();
  } catch (err) {
    console.error('Error creating budget:', err);
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
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to update budget');
      } else {
        const text = await res.text();
        console.error('Received non-JSON response:', text);
        throw new Error(`Server error: ${res.status} ${res.statusText}`);
      }
    }

    return await res.json();
  } catch (err) {
    console.error('Error updating budget:', err);
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
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to delete budget');
      } else {
        const text = await res.text();
        console.error('Received non-JSON response:', text);
        throw new Error(`Server error: ${res.status} ${res.statusText}`);
      }
    }

    return await res.json();
  } catch (err) {
    console.error('Error deleting budget:', err);
    throw err;
  }
};

export {
  getAllBudgets,
  createBudget,
  updateBudget,
  deleteBudget
};