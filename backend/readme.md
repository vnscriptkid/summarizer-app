# Backend API Documentation

## Authentication

### POST /api/auth/login
Login with username and password.
- **Request Body**: `{ "username": string, "password": string }`
- **Response**: `{ "access_token": string, "token_type": string }`

### POST /api/auth/register
Register a new user.
- **Request Body**: `{ "username": string, "email": string, "password": string }`
- **Response**: `{ "id": string, "username": string, "email": string }`

## Users

### GET /api/users/me
Get current user profile.
- **Authentication**: Bearer token required
- **Response**: `{ "id": string, "username": string, "email": string }`

## Videos

### POST /api/videos/analyze
Analyze a YouTube video.
- **Authentication**: Bearer token required
- **Request Body**: `{ "video_url": string }`
- **Response**: 
```json
{
  "id": string,
  "title": string,
  "thumbnail": string,
  "duration": int,
  "status": string
}
```

### GET /api/videos/{video_id}
Get video analysis results.
- **Authentication**: Bearer token required
- **Path Parameters**: `video_id` - ID of the analyzed video
- **Response**:
```json
{
  "id": string,
  "title": string,
  "thumbnail": string,
  "duration": int,
  "status": string,
  "summary": {
    "main_points": [
      { "point": string, "explanation": string }
    ],
    "summary": string,
    "key_concepts": [
      { "concept": string, "explanation": string }
    ]
  },
  "mindmap_url": string,
  "audio_url": string
}
```

### GET /api/videos
Get all analyzed videos for the current user.
- **Authentication**: Bearer token required
- **Response**: Array of video objects

## Channels

### POST /api/channels/add
Add a YouTube channel to monitor.
- **Authentication**: Bearer token required
- **Request Body**: `{ "channel_url": string }`
- **Response**: `{ "id": string, "name": string, "thumbnail": string }`

### GET /api/channels
Get all monitored channels for the current user.
- **Authentication**: Bearer token required
- **Response**: Array of channel objects

### GET /api/channels/{channel_id}/videos
Get all analyzed videos from a specific channel.
- **Authentication**: Bearer token required
- **Path Parameters**: `channel_id` - ID of the channel
- **Response**: Array of video objects
