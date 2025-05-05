import apiClient from './api';
import { Summary } from '../types';

export const summaryService = {
  // Get all summaries for the current user
  getSummaries: async (page = 1, limit = 10) => {
    const response = await apiClient.get('/api/summaries', {
      params: { page, limit }
    });
    return {
      summaries: response.data.items as Summary[],
      total: response.data.total,
      page: response.data.page,
      pages: response.data.pages
    };
  },
  
  // Get summaries for a specific channel
  getSummariesByChannel: async (channelId: string, page = 1, limit = 10) => {
    const response = await apiClient.get(`/api/channels/${channelId}/summaries`, {
      params: { page, limit }
    });
    return {
      summaries: response.data.items as Summary[],
      total: response.data.total,
      page: response.data.page,
      pages: response.data.pages
    };
  },
  
  // Get a specific summary by ID
  getSummary: async (summaryId: string) => {
    const response = await apiClient.get(`/api/summaries/${summaryId}`);
    return response.data as Summary;
  },
  
  // Request a summary for a specific YouTube video URL
  requestSummary: async (videoUrl: string) => {
    const response = await apiClient.post('/api/summaries/request', { url: videoUrl });
    return response.data as { jobId: string };
  },
  
  // Check the status of a summary job
  checkSummaryStatus: async (jobId: string) => {
    const response = await apiClient.get(`/api/summaries/status/${jobId}`);
    return response.data as { 
      status: 'pending' | 'processing' | 'completed' | 'failed',
      summary?: Summary,
      error?: string
    };
  }
};