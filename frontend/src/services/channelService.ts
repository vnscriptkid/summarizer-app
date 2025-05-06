import apiClient from './api';
import { Channel } from '../types';

export const channelService = {
  // Get all channels for the current user
  getChannels: async () => {
    const response = await apiClient.get('/channels');
    return response.data as Channel[];
  },
  
  // Add a new channel by URL
  addChannel: async (channelUrl: string) => {
    const response = await apiClient.post('/channels', { channel_url: channelUrl });
    return response.data as Channel;
  },
  
  // Delete a channel by ID
  deleteChannel: async (channelId: string) => {
    await apiClient.delete(`/channels/${channelId}`);
    return true;
  },
  
  // Get details of a specific channel
  getChannel: async (channelId: string) => {
    const response = await apiClient.get(`/channels/${channelId}`);
    return response.data as Channel;
  }
};