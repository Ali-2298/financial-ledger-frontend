// src/components/Landing.jsx

import { useNavigate } from 'react-router';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          <div className="inline-block bg-blue-600 p-3 rounded-lg mb-6">
            <span className="text-4xl">💰</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
            Welcome to Cashly
          </h1>
          
          <h2 className="text-xl md:text-2xl text-slate-700 mb-4">
            Take Control of Your Finances Quickly and Securely
          </h2>
          
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            With Cashly, you can create accounts, track transactions, and manage your budget all in one application
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/sign-up')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/sign-in')}
              className="bg-white hover:bg-slate-100 text-slate-700 font-medium py-3 px-6 rounded-lg border border-slate-300 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
            Key Features
          </h2>

          <div className="space-y-6">
            
            <div className="border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                💳 Easy Account Management
              </h3>
              <p className="text-slate-600">
                Create multiple accounts for check, savings, and salaries and keep your financial data organized.
              </p>
            </div>

            <div className="border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                💸 Track Transactions Effortlessly
              </h3>
              <p className="text-slate-600">
                Add income, expenses, and transfers, categorize them, and get smarter insights into your spending.
              </p>
            </div>

            <div className="border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                📊 Budgeting Made Simple
              </h3>
              <p className="text-slate-600">
                Set budgets for categories like groceries, entertainment, or savings and compare actual spending with planned budgets using visual charts.
              </p>
            </div>

            <div className="border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                📈 Insights at a Glance
              </h3>
              <p className="text-slate-600">
                View total income vs expenses and quickly understand where your money is going.
              </p>
            </div>

            <div className="border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                🔒 Safe & Private
              </h3>
              <p className="text-slate-600">
                Your financial data stays secure and accessible only when you sign in.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;