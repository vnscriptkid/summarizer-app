import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { channelService } from '../services/channelService';

const AddChannel: React.FC = () => {
  const navigate = useNavigate();
  const [channelUrl, setChannelUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Simple validation
    if (!channelUrl) {
      setError('Please enter a YouTube channel URL');
      return;
    }

    // Check if it's a valid YouTube URL (basic check)
    if (!channelUrl.includes('youtube.com/') && !channelUrl.includes('youtu.be/')) {
      setError('Please enter a valid YouTube channel URL');
      return;
    }

    setIsLoading(true);
    try {
      // In a production app, we would make an actual API call:
      // await channelService.addChannel(channelUrl);
      
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to dashboard with success message
      navigate('/dashboard', { 
        state: { 
          notification: {
            type: 'success',
            message: 'Channel added successfully! You will receive summaries for new videos.'
          }
        }
      });
    } catch (error: any) {
      console.error('Error adding channel:', error);
      setError(error?.response?.data?.message || 'Failed to add channel. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Add YouTube Channel</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="channelUrl" className="block text-sm font-medium text-gray-700 mb-1">
              YouTube Channel URL
            </label>
            <input
              type="text"
              id="channelUrl"
              value={channelUrl}
              onChange={(e) => setChannelUrl(e.target.value)}
              placeholder="https://www.youtube.com/c/ChannelName"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading}
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter the URL of any YouTube channel you want to follow
            </p>
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>
          
          <div className="flex items-center">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-75 flex items-center"
            >
              {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isLoading ? 'Adding Channel...' : 'Add Channel'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="ml-4 text-gray-600 hover:text-gray-800 text-sm"
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-3">How it works</h3>
          <ol className="list-decimal pl-5 space-y-2 text-gray-600">
            <li>Enter the complete URL of the YouTube channel you want to monitor</li>
            <li>We'll check if the channel exists and verify it's a valid YouTube channel</li>
            <li>Once added, we'll scan for new videos every few minutes</li>
            <li>When a new video is published, we'll generate summaries and send them to your email</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default AddChannel;