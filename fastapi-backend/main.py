from fastapi import FastAPI, HTTPException
from routers.route import router

app = FastAPI()
app.include_router(router)


