import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Channel, Summary } from '../types';
import { channelService } from '../services/channelService';
import { summaryService } from '../services/summaryService';

interface LocationState {
  notification?: {
    type: 'success' | 'error';
    message: string;
  };
}

const Dashboard: React.FC = () => {
  const location = useLocation();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<LocationState['notification']>();

  useEffect(() => {
    // Check for notification from location state (e.g., after adding a channel)
    const state = location.state as LocationState;
    if (state && state.notification) {
      setNotification(state.notification);
      // Clear the location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    // Fetch channels and summaries
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch real data from the API
        const channelsData = await channelService.getChannels();
        // const summariesData = await summaryService.getSummaries();
        
        // We'll keep using mock summaries data for now
        const mockSummaries: Summary[] = [
          {
            id: '101',
            videoId: 'abc123',
            channelId: '1',
            channelName: 'TechInsights',
            videoTitle: 'The Future of AI in 2025',
            publishedAt: '2025-05-04T12:00:00Z',
            summaryJson: {
              tldr: 'This video covers the latest AI advancements, including GPT-5 capabilities, ethical considerations, and potential applications in healthcare and education.',
              keyTakeaways: [
                'GPT-5 shows remarkable improvements in reasoning and multimodal capabilities',
                'Healthcare applications focus on personalized treatment plans',
                'Educational AI tools are becoming more adaptive to student needs'
              ],
              actionItems: [
                'Research regulatory frameworks for AI in your industry',
                'Consider implementing AI tools for productivity enhancement'
              ]
            },
            audioUrl: 'https://example.com/summary-audio-101.mp3',
            mindmapUrl: 'https://example.com/mindmap-101.png',
            sentAt: '2025-05-04T12:10:00Z'
          },
          {
            id: '102',
            videoId: 'def456',
            channelId: '2',
            channelName: 'Finance Today',
            videoTitle: 'Cryptocurrency Market Analysis - May 2025',
            publishedAt: '2025-05-02T15:30:00Z',
            summaryJson: {
              tldr: 'The video analyzes the current state of cryptocurrency markets, with focus on Bitcoin, Ethereum, and emerging DeFi platforms. Regulatory changes and market trends are discussed.',
              keyTakeaways: [
                'Bitcoin has stabilized around $100,000 after recent volatility',
                'Ethereum 3.0 launch has significantly reduced gas fees',
                'Regulatory clarity is improving in major markets'
              ],
              actionItems: [
                'Consider portfolio rebalancing based on new market conditions',
                'Follow developments in DeFi governance tokens'
              ]
            },
            audioUrl: 'https://example.com/summary-audio-102.mp3',
            sentAt: '2025-05-02T15:40:00Z'
          },
          {
            id: '103',
            videoId: 'ghi789',
            channelId: '3',
            channelName: 'Science Explained',
            videoTitle: 'Recent Breakthroughs in Quantum Computing',
            publishedAt: '2025-05-01T09:45:00Z',
            summaryJson: {
              tldr: 'The video explains recent advancements in quantum computing, including new qubit architectures and potential applications in cryptography and complex simulations.',
              keyTakeaways: [
                'New stable qubit design allows for longer computation times',
                'First demonstration of quantum advantage in chemical simulations',
                'Post-quantum cryptography standards are being finalized'
              ],
              actionItems: [
                'Assess your organization\'s cryptographic vulnerabilities',
                'Explore quantum simulation tools for your field'
              ]
            },
            mindmapUrl: 'https://example.com/mindmap-103.png',
            sentAt: '2025-05-01T09:55:00Z'
          }
        ];

        setChannels(channelsData);
        setSummaries(mockSummaries);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle API errors gracefully
        setNotification({
          type: 'error',
          message: 'Failed to load your channels. Please try again later.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteChannel = async (channelId: string) => {
    if (window.confirm('Are you sure you want to unsubscribe from this channel?')) {
      try {
        // Use the channelService to delete the channel
        await channelService.deleteChannel(channelId);
        
        // Update the state after successful deletion
        setChannels(channels.filter(channel => channel.id !== channelId));
        setNotification({
          type: 'success',
          message: 'Channel removed successfully'
        });
      } catch (error) {
        console.error('Error removing channel:', error);
        setNotification({
          type: 'error',
          message: 'Failed to remove channel. Please try again.'
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <span className="ml-3 text-gray-600">Loading your dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {notification && (
        <div 
          className={`p-4 rounded-md ${notification.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
          role="alert"
        >
          {notification.message}
          <button 
            className="float-right" 
            onClick={() => setNotification(undefined)}
          >
            ×
          </button>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Your Dashboard</h1>
        <Link 
          to="/add-channel" 
          className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Channel
        </Link>
      </div>

      <section>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Channels</h2>
        {channels.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600">You haven't added any channels yet.</p>
            <Link 
              to="/add-channel" 
              className="text-indigo-600 hover:text-indigo-800 font-medium mt-2 inline-block"
            >
              Add your first channel
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {channels.map(channel => (
              <div key={channel.id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <img 
                    src={`https://i.ytimg.com/vi/${channel.yt_channel_id}/default.jpg`} 
                    alt={channel.channel_title} 
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="ml-3">
                    <h3 className="font-medium">{channel.channel_title}</h3>
                    <p className="text-sm text-gray-500">
                      {channel.last_published_at ? 
                        `Last published: ${new Date(channel.last_published_at).toLocaleDateString()}` : 
                        'No videos yet'}
                    </p>
                  </div>
                </div>
                <button 
                  className="text-gray-500 hover:text-red-600"
                  onClick={() => handleDeleteChannel(channel.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Summaries</h2>
        {summaries.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600">No summaries available yet.</p>
            <p className="text-gray-500 text-sm mt-1">
              Summaries will appear here once your channels upload new videos.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {summaries.map(summary => (
              <div key={summary.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-800">{summary.videoTitle}</h3>
                  <span className="text-sm text-gray-500">{new Date(summary.publishedAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-600 mt-2">{summary.channelName}</p>
                
                <div className="my-4 border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">TL;DR</h4>
                  <p className="text-gray-600">{summary.summaryJson.tldr}</p>
                </div>
                
                {summary.summaryJson.keyTakeaways.length > 0 && (
                  <div className="my-4 border-t border-gray-100 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Key Takeaways</h4>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                      {summary.summaryJson.keyTakeaways.map((takeaway, index) => (
                        <li key={index}>{takeaway}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {summary.summaryJson.actionItems.length > 0 && (
                  <div className="my-4 border-t border-gray-100 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Action Items</h4>
                    <ol className="list-decimal pl-5 space-y-1 text-gray-600">
                      {summary.summaryJson.actionItems.map((action, index) => (
                        <li key={index}>{action}</li>
                      ))}
                    </ol>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-3 mt-4">
                  {summary.audioUrl && (
                    <a 
                      href={summary.audioUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      Audio Summary
                    </a>
                  )}
                  {summary.mindmapUrl && (
                    <a 
                      href={summary.mindmapUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                      </svg>
                      Mind Map
                    </a>
                  )}
                  <a 
                    href={`https://youtube.com/watch?v=${summary.videoId}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    Watch Original
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;