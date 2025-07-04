from fastapi import FastAPI, Request, Form, status, Depends
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware
from dotenv import load_dotenv
import os
from routers import auth

load_dotenv()
app = FastAPI()
app.include_router(auth.router)

templates = Jinja2Templates(directory="app/templates")


@app.get("/")
def home():
    return {"msg": "hello world"}
