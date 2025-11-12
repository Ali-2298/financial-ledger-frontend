const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/transactions`;

const getAllTransactions = async () => {
  try {
    const res = await fetch(BASE_URL, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error('Failed to fetch transactions');
    }
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const createTransaction = async (transactionData) => {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transactionData)
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || 'Failed to create transaction');
    }
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const updateTransaction = async (transactionId, updatedData) => {
  const res = await fetch(`${BASE_URL}/${transactionId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: updatedData.type,
      category: updatedData.category,
      amount: updatedData.amount,
      description: updatedData.description,
      transactionDate: updatedData.transactionDate,
    })
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to update transaction');
  }
  return await res.json();
};

export {
  getAllTransactions,
  createTransaction,
  updateTransaction
};
