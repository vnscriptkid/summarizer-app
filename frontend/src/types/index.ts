export interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  createdAt: string;
}

export interface Channel {
  id: string;
  ytChannelId: string;
  name: string;
  thumbnail: string;
  lastPublishedAt: string;
  userId: string;
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