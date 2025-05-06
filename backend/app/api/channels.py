import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import re
from datetime import datetime
import httpx
import uuid

from ..database import get_db
from ..config import get_settings
from ..models import Channel, User
from .auth import get_current_user

router = APIRouter()
settings = get_settings()
logger = logging.getLogger(__name__)

# Pydantic schemas for request/response
from pydantic import BaseModel, HttpUrl, validator

class ChannelCreate(BaseModel):
    channel_url: str
    
    @validator('channel_url')
    def validate_channel_url(cls, v):
        # Check if it's a valid YouTube URL or channel ID
        channel_id_pattern = r'^UC[\w-]{22}$'
        youtube_url_pattern = r'youtube\.com\/(?:c\/|channel\/|user\/|@)([\w-]+)'
        
        if re.match(channel_id_pattern, v):
            return v
        
        match = re.search(youtube_url_pattern, v)
        if match:
            return match.group(1)
        
        raise ValueError('Invalid YouTube channel URL or ID')

class ChannelResponse(BaseModel):
    id: str
    yt_channel_id: str
    channel_title: str
    last_published_at: datetime | None = None
    created_at: datetime
    
    model_config = {
        "from_attributes": True,
        "json_encoders": {
            uuid.UUID: lambda v: str(v)
        }
    }

@router.post("/", response_model=ChannelResponse, status_code=status.HTTP_201_CREATED)
async def subscribe_to_channel(
    channel: ChannelCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Subscribe to a YouTube channel
    """
    # Check if the channel exists on YouTube and get details
    channel_info = await get_youtube_channel_info(channel.channel_url)
    
    if not channel_info:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Channel not found on YouTube"
        )
    
    # Check if user is already subscribed to this channel
    existing_subscription = db.query(Channel).filter(
        Channel.user_id == current_user.id,
        Channel.yt_channel_id == channel_info["id"]
    ).first()
    
    if existing_subscription:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already subscribed to this channel"
        )
    
    # Create new channel subscription
    new_channel = Channel(
        yt_channel_id=channel_info["id"],
        user_id=current_user.id,
        channel_title=channel_info["title"],
        last_published_at=None  # Will be updated when the first video is processed
    )
    
    db.add(new_channel)
    db.commit()
    db.refresh(new_channel)
    
    # Manual conversion for UUID
    new_channel.id = str(new_channel.id)
    
    return new_channel

@router.get("/", response_model=List[ChannelResponse])
async def get_subscribed_channels(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all channels that the user is subscribed to
    """
    channels = db.query(Channel).filter(Channel.user_id == current_user.id).all()
    
    # Manually convert UUID to string for list responses
    for channel in channels:
        channel.id = str(channel.id)
    
    return channels

@router.delete("/{channel_id}", status_code=status.HTTP_204_NO_CONTENT)
async def unsubscribe_from_channel(
    channel_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Unsubscribe from a channel
    """
    try:
        # Convert string ID to UUID for database query
        channel_uuid = uuid.UUID(channel_id)
        channel = db.query(Channel).filter(
            Channel.id == channel_uuid,
            Channel.user_id == current_user.id
        ).first()
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid channel ID format"
        )
    
    if not channel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Channel subscription not found"
        )
    
    db.delete(channel)
    db.commit()
    
    return None

@router.get("/{channel_id}", response_model=ChannelResponse)
async def get_channel(
    channel_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific channel by ID
    """
    try:
        # Convert string ID to UUID for database query
        channel_uuid = uuid.UUID(channel_id)
        channel = db.query(Channel).filter(
            Channel.id == channel_uuid,
            Channel.user_id == current_user.id
        ).first()
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid channel ID format"
        )
    
    if not channel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Channel not found"
        )
    
    # Manual conversion for UUID
    channel.id = str(channel.id)
    
    return channel

async def get_youtube_channel_info(channel_identifier):
    """
    Get channel information from YouTube API
    
    Args:
        channel_identifier: YouTube channel URL, username, or ID
    
    Returns:
        dict: Channel information (id, title)
    """
    # Extract channel ID or handle from the URL if needed
    channel_id = channel_identifier
    
    # If it's a channel URL, extract the ID or handle
    if 'youtube.com' in channel_identifier:
        # Different URL formats:
        # - youtube.com/channel/UC...
        # - youtube.com/c/ChannelName
        # - youtube.com/user/Username
        # - youtube.com/@handle
        
        if '/channel/' in channel_identifier:
            channel_id = channel_identifier.split('/channel/')[1].split('/')[0]
        elif '/c/' in channel_identifier:
            channel_id = channel_identifier.split('/c/')[1].split('/')[0]
        elif '/user/' in channel_identifier:
            channel_id = channel_identifier.split('/user/')[1].split('/')[0]
        elif '/@' in channel_identifier:
            channel_id = channel_identifier.split('/@')[1].split('/')[0]
    
    # Determine the parameter to use (id, forUsername, or handle)
    if channel_id.startswith('UC') and len(channel_id) == 24:
        param_name = 'id'
    elif '@' in channel_id:
        param_name = 'forHandle'
        channel_id = channel_id.replace('@', '')
    else:
        param_name = 'forUsername'
    
    # Make request to YouTube API
    async with httpx.AsyncClient() as client:
        response = await client.get(
            'https://www.googleapis.com/youtube/v3/channels',
            params={
                'part': 'snippet',
                param_name: channel_id,
                'key': settings.YOUTUBE_API_KEY
            }
        )
    
    if response.status_code != 200:
        logger.error(f"err calling youtube api {response}")
        return None
    
    data = response.json()
    
    # Check if any items were returned
    if not data.get('items'):
        logger.error(f"no items returned")
        return None
    
    channel = data['items'][0]
    return {
        'id': channel['id'],
        'title': channel['snippet']['title']
    }