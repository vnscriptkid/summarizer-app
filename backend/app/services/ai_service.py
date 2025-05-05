import logging
import json
import os
import io
import uuid
from typing import Dict, Optional, Any, List
import openai
import boto3
import httpx
import subprocess
import pymermaid
from elevenlabs import ElevenLabs

from ..config import get_settings

settings = get_settings()
logger = logging.getLogger(__name__)

# Configure API keys
openai.api_key = settings.OPENAI_API_KEY

# Initialize ElevenLabs client with API key
eleven_labs = ElevenLabs(api_key=settings.ELEVENLABS_API_KEY)

# Configure S3 client for file storage
s3_client = boto3.client(
    's3',
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    region_name=settings.AWS_REGION
)

async def generate_summary(transcript: str, title: str) -> Dict[str, Any]:
    """
    Generate a structured summary of the video transcript using OpenAI
    
    For MVP, we'll keep this simple with a few key sections
    
    Args:
        transcript: Full transcript of the video
        title: Title of the video
        
    Returns:
        dict: Structured summary with key sections
    """
    try:
        # For MVP, we'll use a simpler version that will be enhanced later
        prompt = f"""
        Video Title: {title}
        
        Transcript: 
        {transcript[:4000]}...
        
        Please provide a comprehensive summary of this video with the following sections:
        1. Main Points (list the 3-5 key takeaways)
        2. Summary (2-3 paragraphs summarizing the content)
        3. Key Concepts (list and briefly explain 3-5 important concepts from the video)
        
        Format the response as a JSON object with the following structure:
        {{
            "main_points": [
                {{ "point": "First main point", "explanation": "Brief explanation" }},
                ...
            ],
            "summary": "Full summary text with multiple paragraphs",
            "key_concepts": [
                {{ "concept": "Concept name", "explanation": "Concept explanation" }},
                ...
            ]
        }}
        """
        
        # For MVP, we'll use a mock response to avoid OpenAI costs
        # In production, use this instead:
        """
        response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that summarizes YouTube videos."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
        )
        summary = json.loads(response.choices[0].message.content)
        """
        
        # Mock response for MVP
        summary = {
            "main_points": [
                {"point": "First main point", "explanation": "Brief explanation of the first point"},
                {"point": "Second main point", "explanation": "Brief explanation of the second point"},
                {"point": "Third main point", "explanation": "Brief explanation of the third point"}
            ],
            "summary": f"This is a summary of the video titled '{title}'. The video discusses important topics and provides valuable insights. This is the first paragraph of the summary.\n\nThis is the second paragraph of the summary, adding more details and context about the video content.",
            "key_concepts": [
                {"concept": "First concept", "explanation": "Explanation of the first concept"},
                {"concept": "Second concept", "explanation": "Explanation of the second concept"},
                {"concept": "Third concept", "explanation": "Explanation of the third concept"}
            ]
        }
        
        return summary
        
    except Exception as e:
        logger.error(f"Error generating summary: {str(e)}")
        # Return a basic structure in case of error
        return {
            "main_points": [{"point": "Error generating summary", "explanation": "Please try again later"}],
            "summary": "There was an error generating the summary for this video.",
            "key_concepts": [{"concept": "Error", "explanation": "Please try again later"}]
        }

async def generate_mindmap(summary: Dict[str, Any]) -> Optional[str]:
    """
    Generate a mind map from the summary and upload it to S3
    
    Args:
        summary: Structured summary from generate_summary()
        
    Returns:
        str: URL to the generated mind map image
    """
    try:
        # Create mermaid markdown for the mindmap
        mindmap_md = "mindmap\n"
        mindmap_md += f"  root({summary.get('main_points', [])[0].get('point', 'Video Summary')})\n"
        
        # Add main points
        for i, point in enumerate(summary.get('main_points', [])):
            indent = "    "
            point_text = point.get('point', f"Point {i+1}")
            mindmap_md += f"{indent}{i+1}[{point_text}]\n"
            
            # Add key concepts under each point (simplified for MVP)
            if i < len(summary.get('key_concepts', [])):
                concept = summary.get('key_concepts', [])[i]
                concept_text = concept.get('concept', f"Concept {i+1}")
                mindmap_md += f"{indent}  {i+1}.1({concept_text})\n"
        
        # For production use:
        if settings.ENVIRONMENT == "production":
            # Generate the mind map using pymermaid
            # Create a temp file for the mermaid diagram
            temp_file = f"/tmp/mindmap_{uuid.uuid4()}.mmd"
            with open(temp_file, "w") as f:
                f.write(mindmap_md)
            
            # Generate image using pymermaid
            output_file = f"/tmp/mindmap_{uuid.uuid4()}.png"
            pymermaid.render(temp_file, output_file)
            
            # Upload to S3
            file_key = f"mindmaps/{uuid.uuid4()}.png"
            with open(output_file, 'rb') as f:
                s3_client.upload_fileobj(
                    f,
                    settings.AWS_BUCKET_NAME,
                    file_key,
                    ExtraArgs={'ContentType': 'image/png'}
                )
            
            # Clean up temp files
            os.remove(temp_file)
            os.remove(output_file)
            
            # Generate URL
            url = f"https://{settings.AWS_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/{file_key}"
            return url
        
        # Mock URL for MVP or development environment
        url = f"https://example.com/mindmap-{hash(json.dumps(summary))}.png"
        return url
        
    except Exception as e:
        logger.error(f"Error generating mindmap: {str(e)}")
        return None

async def generate_audio(summary: Dict[str, Any]) -> Optional[str]:
    """
    Generate audio narration from the summary and upload it to S3
    
    Args:
        summary: Structured summary from generate_summary()
        
    Returns:
        str: URL to the generated audio file
    """
    try:
        # Extract text for audio narration
        narration_text = f"Here's a summary of this video. "
        
        # Add main points
        narration_text += "Main points: "
        for i, point in enumerate(summary.get('main_points', [])):
            narration_text += f"{i+1}. {point.get('point', '')}. "
            narration_text += f"{point.get('explanation', '')}. "
        
        # Add summary text
        narration_text += f"Summary: {summary.get('summary', '')}. "
        
        # For MVP, we'll simulate generating audio and return a mock URL
        # In production, you'd use:
        """
        # Generate audio using ElevenLabs
        audio = eleven_labs.generate(
            text=narration_text,
            voice=settings.ELEVENLABS_VOICE_ID,
            model="eleven_multilingual_v2"
        )
        
        # Upload to S3
        file_key = f"audio/{uuid.uuid4()}.mp3"
        s3_client.upload_fileobj(
            io.BytesIO(b''.join(audio)),
            settings.AWS_BUCKET_NAME,
            file_key,
            ExtraArgs={'ContentType': 'audio/mpeg'}
        )
        
        # Generate URL (adjust based on your S3 configuration)
        url = f"https://{settings.AWS_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/{file_key}"
        """
        
        # Mock URL for MVP
        url = f"https://example.com/audio-{hash(json.dumps(summary))}.mp3"
        
        return url
        
    except Exception as e:
        logger.error(f"Error generating audio: {str(e)}")
        return None