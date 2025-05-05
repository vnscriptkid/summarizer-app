import httpx
from typing import Dict, Optional, Any
from datetime import datetime
import re
import json
import logging

from ..config import get_settings

settings = get_settings()
logger = logging.getLogger(__name__)

async def get_video_info(video_id: str) -> Optional[Dict[str, Any]]:
    """
    Get information about a YouTube video
    
    Args:
        video_id: YouTube video ID
        
    Returns:
        dict: Video information or None if not found
    """
    try:
        # Extract video ID from URL if needed
        if 'youtube.com' in video_id or 'youtu.be' in video_id:
            video_id = extract_video_id_from_url(video_id)
            
        if not video_id:
            return None
            
        async with httpx.AsyncClient() as client:
            response = await client.get(
                'https://www.googleapis.com/youtube/v3/videos',
                params={
                    'part': 'snippet,contentDetails',
                    'id': video_id,
                    'key': settings.YOUTUBE_API_KEY
                }
            )
        
        if response.status_code != 200:
            logger.error(f"YouTube API error: {response.status_code}, {response.text}")
            return None
            
        data = response.json()
        
        # Check if any items were returned
        if not data.get('items'):
            return None
            
        video = data['items'][0]
        snippet = video['snippet']
        
        return {
            'video_id': video_id,
            'title': snippet['title'],
            'description': snippet.get('description', ''),
            'channel_id': snippet['channelId'],
            'channel_title': snippet['channelTitle'],
            'published_at': datetime.fromisoformat(snippet['publishedAt'].replace('Z', '+00:00'))
        }
    except Exception as e:
        logger.error(f"Error getting video info: {str(e)}")
        return None

async def get_video_transcript(video_id: str) -> Optional[str]:
    """
    Get transcript for a YouTube video
    
    For the MVP, this is a simplified implementation that will be improved later
    with actual YouTube caption/transcript API integration.
    
    Args:
        video_id: YouTube video ID
        
    Returns:
        str: Video transcript or None if not available
    """
    try:
        # Extract video ID from URL if needed
        if 'youtube.com' in video_id or 'youtu.be' in video_id:
            video_id = extract_video_id_from_url(video_id)
            
        if not video_id:
            return None
            
        # For MVP, we'll use a third-party service to get transcripts
        # This is a simplified implementation - in production, integrate with
        # YouTube's caption API or use youtube-transcript-api library
        
        # Mock implementation for MVP
        # In production, replace with actual API call to get transcripts
        return f"This is a placeholder transcript for video {video_id}. " + \
               f"In a real implementation, this would be the actual transcript " + \
               f"fetched from YouTube's API or using a specialized library."
        
    except Exception as e:
        logger.error(f"Error getting video transcript: {str(e)}")
        return None

def extract_video_id_from_url(url: str) -> Optional[str]:
    """
    Extract YouTube video ID from various YouTube URL formats
    
    Args:
        url: YouTube URL
        
    Returns:
        str: Video ID or None if not found
    """
    patterns = [
        r"youtube\.com/watch\?v=([a-zA-Z0-9_-]+)",  # Standard watch URL
        r"youtu\.be/([a-zA-Z0-9_-]+)",              # Short youtu.be URL
        r"youtube\.com/embed/([a-zA-Z0-9_-]+)",     # Embed URL
        r"youtube\.com/v/([a-zA-Z0-9_-]+)",         # Old embed URL
        r"youtube\.com/shorts/([a-zA-Z0-9_-]+)"     # YouTube Shorts URL
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
            
    return None