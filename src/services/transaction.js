const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/transactions`;

const getTokenHeader = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});

const getAllTransactions = async () => {
  const res = await fetch(BASE_URL, { headers: getTokenHeader() });
  if (!res.ok) throw new Error('Failed to fetch transactions');
  return await res.json();
};

const createTransaction = async (transactionData) => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: getTokenHeader(),
    body: JSON.stringify(transactionData)
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.message || 'Failed to create transaction');
  }
  return await res.json();
};

const updateTransaction = async (transactionId, updatedData) => {
  const res = await fetch(`${BASE_URL}/${transactionId}`, {
    method: 'PUT',
    headers: getTokenHeader(),
    body: JSON.stringify(updatedData)
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || 'Failed to update transaction');
  }
  return await res.json();
};

const deleteTransaction = async (transactionId) => {
  const res = await fetch(`${BASE_URL}/${transactionId}`, {
    method: 'DELETE',
    headers: getTokenHeader()
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || 'Failed to delete transaction');
  }
  return await res.json();
};

export { 
  getAllTransactions, 
  createTransaction, 
  updateTransaction, 
  deleteTransaction 
};