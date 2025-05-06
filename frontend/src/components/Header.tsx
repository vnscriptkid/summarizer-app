import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in using the correct localStorage key
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    
    setIsLoggedIn(!!token);
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Failed to parse user data', e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/');
  };

  return (
    <header className="bg-indigo-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold">
            YouTube Summarizer
          </Link>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:text-indigo-200">
                Home
              </Link>
            </li>
            {isLoggedIn ? (
              <>
                <li>
                  <Link to="/dashboard" className="hover:text-indigo-200">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/add-channel" className="hover:text-indigo-200">
                    Add Channel
                  </Link>
                </li>
                <li>
                  <span className="mr-4 text-indigo-200">
                    {user?.first_name ? `Hello, ${user.first_name}` : 'Welcome'}
                  </span>
                </li>
                <li>
                  <button 
                    onClick={handleLogout} 
                    className="hover:text-indigo-200"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login" className="hover:text-indigo-200">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;