#main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.route import router as event_router  # For event-related routes
from routers.auth import router as auth_router    # For authentication-related routes
from routers.password_reset import router as password_reset_router  # For password reset routes
from fastapi.staticfiles import StaticFiles
from pathlib import Path

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the "images" directory to make sure image is publicly accessible 
app.mount("/images", StaticFiles(directory="images"), name="images")

# Include the routers
app.include_router(event_router, prefix = "/events")  # Event routes under "/events" path
app.include_router(auth_router, prefix = "/auth")     # Auth routes under "/auth" path
app.include_router(password_reset_router, prefix = "/password-reset")  # Password reset routes under "/password-reset" path

# The event route is now available under /events/ and auth under /auth/

