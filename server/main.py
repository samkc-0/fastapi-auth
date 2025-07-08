from fastapi import FastAPI, Request, Form, status, Depends
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware
from dotenv import load_dotenv
from routers import auth, lemmas

load_dotenv()
app = FastAPI()
app.include_router(auth.router, prefix="/auth")
app.include_router(lemmas.router, prefix="/lemmas")
templates = Jinja2Templates(directory="app/templates")


@app.get("/")
def home():
    return {"msg": "hello world"}
