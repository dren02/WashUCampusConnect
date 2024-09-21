#main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.route import router as event_router  # For event-related routes
from routers.auth import router as auth_router    # For authentication-related routes

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the routers
app.include_router(event_router, prefix = "/events")  # Event routes under "/events" path
app.include_router(auth_router, prefix = "/auth")     # Auth routes under "/auth" path

# The event route is now available under /events/ and auth under /auth/

