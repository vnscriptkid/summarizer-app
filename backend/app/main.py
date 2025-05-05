from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .config import get_settings
from .api import auth, users, channels, videos
from .database import Base, engine

# Create instance of settings
settings = get_settings()

# Create the FastAPI app
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup code (runs before serving requests)
    # Create database tables
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown code (runs when shutting down)
    pass

app = FastAPI(
    title=settings.APP_NAME,
    description="API for YouTube Summarizer application",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(
    auth.router,
    prefix=f"{settings.API_V1_PREFIX}/auth",
    tags=["Authentication"]
)
app.include_router(
    users.router,
    prefix=f"{settings.API_V1_PREFIX}/users",
    tags=["Users"]
)
app.include_router(
    channels.router,
    prefix=f"{settings.API_V1_PREFIX}/channels",
    tags=["Channels"]
)
app.include_router(
    videos.router,
    prefix=f"{settings.API_V1_PREFIX}/videos",
    tags=["Videos"]
)

@app.get("/", tags=["Root"])
async def root():
    return {"message": "Welcome to YouTube Summarizer API"}

@app.get("/healthcheck", tags=["Health"])
async def healthcheck():
    return {"status": "ok"}