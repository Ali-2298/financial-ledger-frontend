// src/components/SignUpForm/SignUpForm.jsx

import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { signUp } from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';

const SignUpForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordConf: '',
  });

  const { username, password, passwordConf } = formData;

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const newUser = await signUp(formData);
      setUser(newUser);
      navigate('/');
    } catch (err) {
      setMessage(err.message);
    }
  };

  const isFormInvalid = () => {
    return !(username && password && password === passwordConf);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
          <p className="text-slate-600">Join Financial Ledger and take control of your finances</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          
          {message && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <span className="text-xl"></span>
              <p className="text-sm">{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div>
              <label htmlFor='username' className="block text-sm font-medium text-slate-700 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl"></span>
                <input
                  type='text'
                  id='username'
                  value={username}
                  name='username'
                  onChange={handleChange}
                  required
                  placeholder="Choose a username"
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor='password' className="block text-sm font-medium text-slate-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl"></span>
                <input
                  type='password'
                  id='password'
                  value={password}
                  name='password'
                  onChange={handleChange}
                  required
                  placeholder="Create a strong password"
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor='confirm' className="block text-sm font-medium text-slate-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl"></span>
                <input
                  type='password'
                  id='confirm'
                  value={passwordConf}
                  name='passwordConf'
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
                  className={`w-full pl-12 pr-4 py-3 bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:border-transparent outline-none transition-all ${
                    passwordConf && password !== passwordConf
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-slate-300 focus:ring-purple-500'
                  }`}
                />
              </div>
              {passwordConf && password !== passwordConf && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  Passwords do not match
                </p>
              )}
            </div>

           <div className="flex flex-col gap-3 pt-2">
              <button 
                type="submit"
                disabled={isFormInvalid()}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all shadow-sm"
              >
                Sign Up
              </button>
              <button 
                type="button"
                onClick={() => navigate('/')}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;