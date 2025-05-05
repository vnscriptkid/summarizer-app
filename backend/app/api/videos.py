from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import httpx
from pydantic import BaseModel, UUID4

from ..database import get_db
from ..config import get_settings
from ..models import Video, Channel, User
from .auth import get_current_user
from ..services import youtube_service, ai_service

router = APIRouter()
settings = get_settings()

class VideoBase(BaseModel):
    video_id: str
    title: str
    description: Optional[str] = None
    published_at: datetime
    
class VideoResponse(VideoBase):
    id: UUID4
    channel_id: UUID4
    processed_at: Optional[datetime] = None
    mp3_url: Optional[str] = None
    mindmap_url: Optional[str] = None
    summary_json: Optional[dict] = None
    
    class Config:
        orm_mode = True

@router.get("/", response_model=List[VideoResponse])
async def get_videos(
    channel_id: Optional[str] = None,
    skip: int = 0, 
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all videos from user's subscribed channels or from a specific channel
    """
    # Base query to get videos from channels the user has subscribed to
    query = db.query(Video).join(Channel).filter(Channel.user_id == current_user.id)
    
    # Filter by channel if specified
    if channel_id:
        query = query.filter(Channel.id == channel_id)
    
    # Order by published date (newest first) and paginate
    videos = query.order_by(Video.published_at.desc()).offset(skip).limit(limit).all()
    
    return videos

@router.get("/{video_id}", response_model=VideoResponse)
async def get_video(
    video_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific video by ID
    """
    video = db.query(Video).join(Channel).filter(
        Video.id == video_id,
        Channel.user_id == current_user.id
    ).first()
    
    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video not found"
        )
    
    return video

@router.post("/process/{youtube_video_id}", response_model=VideoResponse)
async def process_video(
    youtube_video_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Process a YouTube video to generate summary, audio, and mindmap
    """
    # Get video information from YouTube
    video_info = await youtube_service.get_video_info(youtube_video_id)
    
    if not video_info:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video not found on YouTube"
        )
    
    # Check if the user is subscribed to the video's channel
    channel = db.query(Channel).filter(
        Channel.user_id == current_user.id,
        Channel.yt_channel_id == video_info['channel_id']
    ).first()
    
    if not channel:
        # User is not subscribed to this channel, so create a subscription
        channel = Channel(
            yt_channel_id=video_info['channel_id'],
            user_id=current_user.id,
            channel_title=video_info['channel_title'],
            last_published_at=video_info['published_at']
        )
        db.add(channel)
        db.commit()
        db.refresh(channel)
    
    # Check if the video is already processed
    existing_video = db.query(Video).filter(
        Video.video_id == youtube_video_id,
        Video.channel_id == channel.id
    ).first()
    
    if existing_video and existing_video.processed_at:
        return existing_video
    
    # If video exists but not processed, update it
    if existing_video:
        video = existing_video
    else:
        # Create a new video record
        video = Video(
            video_id=youtube_video_id,
            channel_id=channel.id,
            title=video_info['title'],
            description=video_info.get('description'),
            published_at=video_info['published_at']
        )
        db.add(video)
        db.commit()
        db.refresh(video)
    
    # Start async processing of the video (this would typically use Celery in production)
    # For the MVP, we'll process synchronously
    try:
        # Download and process the video
        transcript = await youtube_service.get_video_transcript(youtube_video_id)
        
        if not transcript:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not get video transcript"
            )
        
        # Generate summary using AI
        summary = await ai_service.generate_summary(transcript, video.title)
        
        # Generate mindmap
        mindmap_url = await ai_service.generate_mindmap(summary)
        
        # Generate audio from summary
        mp3_url = await ai_service.generate_audio(summary)
        
        # Update video with results
        video.summary_json = summary
        video.transcript = transcript
        video.mp3_url = mp3_url
        video.mindmap_url = mindmap_url
        video.processed_at = datetime.utcnow()
        
        db.commit()
        db.refresh(video)
        
        return video
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing video: {str(e)}"
        )