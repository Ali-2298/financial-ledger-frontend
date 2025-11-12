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
  const res = await axios.put(`${BASE_URL}/${transactionId}`, updatedData);
  return res.data;
};

export {
  getAllTransactions,
  createTransaction,
  updateTransaction
};