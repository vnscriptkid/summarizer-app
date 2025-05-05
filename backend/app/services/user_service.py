from sqlalchemy.orm import Session
from typing import Optional

from ..models import User

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """
    Get a user by email
    """
    return db.query(User).filter(User.email == email).first()

def get_or_create_user(db: Session, email: str, first_name: str = None, last_name: str = None, oauth_refresh_token: str = None) -> User:
    """
    Get a user by email or create a new one if it doesn't exist
    """
    user = get_user_by_email(db, email)
    
    if not user:
        # Create new user
        user = User(
            email=email,
            first_name=first_name,
            last_name=last_name,
            oauth_refresh_token=oauth_refresh_token
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        # Update existing user if needed
        update_needed = False
        
        if first_name and user.first_name != first_name:
            user.first_name = first_name
            update_needed = True
            
        if last_name and user.last_name != last_name:
            user.last_name = last_name
            update_needed = True
            
        if oauth_refresh_token and user.oauth_refresh_token != oauth_refresh_token:
            user.oauth_refresh_token = oauth_refresh_token
            update_needed = True
            
        if update_needed:
            db.commit()
            db.refresh(user)
            
    return user