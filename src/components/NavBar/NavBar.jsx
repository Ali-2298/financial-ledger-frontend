// src/components/NavBar/NavBar.jsx

import { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { UserContext } from '../../contexts/UserContext';

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-all ${
        isActive(to)
          ? 'bg-blue-600 text-white shadow-sm'
          : 'text-slate-700 hover:bg-slate-100'
      }`}
    >
      {children}
    </Link>
  );

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg group-hover:scale-110 transition-transform">
              <span className="text-2xl"></span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-slate-900">Cashly</h1>
            </div>
          </Link>

          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <NavLink to="/">Dashboard</NavLink>
              <NavLink to="/account">Accounts</NavLink>
              <NavLink to="/budget">Budget</NavLink>
              
              <div className="ml-4 pl-4 border-l border-slate-200 flex items-center gap-3">
                <button
                  onClick={handleSignOut}
                  className="bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/sign-up">Sign Up</NavLink>
              <Link
                to="/sign-in"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;