import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // This would be replaced with actual OAuth authentication
      // For now, we'll just simulate a successful login
      setTimeout(() => {
        localStorage.setItem('token', 'dummy-token');
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Sign in to YouTube Summarizer</h2>
        <p className="text-gray-600 text-center mb-8">
          Connect with your Google account to access your dashboard and start receiving video summaries.
        </p>
        
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-lg py-3 px-4 hover:bg-gray-50 transition-colors mb-4 disabled:opacity-70"
        >
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" 
            alt="Google logo" 
            className="w-5 h-5 mr-2"
          />
          {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </button>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            By signing in, you agree to our
            <a href="#" className="text-indigo-600 hover:text-indigo-800 ml-1">Terms of Service</a>
            <span className="mx-1">and</span>
            <a href="#" className="text-indigo-600 hover:text-indigo-800">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;