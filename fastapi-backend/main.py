from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from routers.route import router
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from models.user import User
from routers.auth import router as auth_router
from routers.route import router as event_router


app = FastAPI()


origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(event_router)
app.include_router(auth_router)





