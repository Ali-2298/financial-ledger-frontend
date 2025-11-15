const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/accounts`;

const getAllAccounts = async () => {
  try {
    const res = await fetch(BASE_URL, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error('Failed to fetch account');
    }

    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const createAccount = async (accountData) => {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(accountData)
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || 'Failed to create account');
    }

    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export {
  getAllAccounts,
  createAccount
};