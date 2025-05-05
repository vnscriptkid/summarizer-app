import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Your Google Client ID from Google Cloud
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '118974039134-4m539qqed8lqohlbg51rlar2h8qkv769.apps.googleusercontent.com';
  console.log({clientId});


  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    try {
      // Get ID token from response
      const idToken = credentialResponse.credential;
      
      // Send token to your backend for verification
      const response = await fetch('http://localhost:8000/api/v1/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: idToken }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to authenticate with server');
      }
      
      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
    setIsLoading(false);
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Sign in to YouTube Summarizer</h2>
          <p className="text-gray-600 text-center mb-8">
            Connect with your Google account to access your dashboard and start receiving video summaries.
          </p>
          
          <div className="flex justify-center mb-4">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme="outline"
              size="large"
              text="signin_with"
              shape="rectangular"
              logo_alignment="center"
            />
          </div>
          
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
    </GoogleOAuthProvider>
  );
};

export default Login;