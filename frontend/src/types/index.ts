export interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  createdAt: string;
}

export interface Channel {
  id: string;
  yt_channel_id: string;
  channel_title: string;
  last_published_at: string | null;
  created_at: string;
}

export interface Summary {
  id: string;
  videoId: string;
  channelId: string;
  channelName: string;
  videoTitle: string;
  publishedAt: string;
  summaryJson: {
    tldr: string;
    keyTakeaways: string[];
    actionItems: string[];
  };
  audioUrl?: string;
  mindmapUrl?: string;
  sentAt: string;
}