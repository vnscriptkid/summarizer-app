import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, JSON, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from ..database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    oauth_refresh_token = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    channels = relationship("Channel", back_populates="user")
    
class Channel(Base):
    __tablename__ = "channels"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    yt_channel_id = Column(String, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    channel_title = Column(String)
    last_published_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="channels")
    videos = relationship("Video", back_populates="channel")
    
class Video(Base):
    __tablename__ = "videos"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    video_id = Column(String, index=True)
    channel_id = Column(UUID(as_uuid=True), ForeignKey("channels.id"))
    title = Column(String)
    description = Column(Text, nullable=True)
    published_at = Column(DateTime)
    processed_at = Column(DateTime, nullable=True)
    summary_json = Column(JSON, nullable=True)
    mp3_url = Column(String, nullable=True)
    mindmap_url = Column(String, nullable=True)
    transcript = Column(Text, nullable=True)
    sent_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    channel = relationship("Channel", back_populates="videos")