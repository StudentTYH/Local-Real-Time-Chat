import os
import argparse
import subprocess
from datetime import timedelta
from os import access
from pathlib import Path

from fastapi import FastAPI, Request, HTTPException,Response,Depends,status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse


from pydantic import BaseModel,Field
from dotenv import load_dotenv
import time
import ollama
import json
from starlette.middleware.sessions import SessionMiddleware
import secrets
import asyncio
import requests
# from torch.utils.tensorboard.summary import video
from faster_whisper import WhisperModel
import numpy as np
import base64
load_dotenv(override=True)
from util import analysis

#设置对话时间

# ------------ Fast API Config ------------ #

MAX_SESSION_TIME = 15 * 60  # 15 minutes

LLM_name= "llama3.2-vision"



app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



secret_key = secrets.token_hex(32)
app.add_middleware(SessionMiddleware, secret_key=secret_key,max_age=600)


class LoginRequest(BaseModel):
    userId: str


# whisper_name = "large"
# whisper_m = WhisperModel(whisper_name, device="auto", compute_type="default", local_files_only=True)
# ------------ Helper methods ------------ #

#设置id
@app.post("/set_id")
async def login(request: Request):
    # 模拟用户 ID 的验证逻辑
    data = await request.json()
    # # 设置 session cookie
    request.session["USER_ID"] = int(data["USER_ID"])
    return JSONResponse({
        "name": "tyh",
        "USER_ID": request.session["USER_ID"]
    })

@app.post("/save_chat")
async def save_chat(request: Request):
    # 模拟用户 ID 的验证逻辑
    data = await request.json()
    # # 设置 session cookie
    # print(data["chat_history"]["messages"])
    messages = [{"role":"system",
                "content":"假设，你是一位心理医生，请你不断提出专业的心理测评问题来测试对方的心理情况，特别要观察对方是否有抑郁等冲动的倾向。",}]

    for m in data["chat_history"]["messages"]:
        if m["role"]=="human":
            messages.append({"role":"user","content":m["content"]})
        else:
            messages.append({"role":"assistant","content":m["content"]})
    # print(messages)

    print(request.session.get("USER_ID"))

    message_file = open("./Chat_history/message_%d.json" % request.session.get("USER_ID"), mode="w", encoding="utf-8")
    json.dump(messages, message_file, ensure_ascii=False)

    # request.session["USER_ID"] = int(data["USER_ID"])
    return JSONResponse({
        "name": "tyh",
    })


#得到大模型分析结果
@app.post("/get_psychology_report")
async def get_psychology_report(request: Request):
    # user_id=request.session.get("user_id")

    data = await request.json()
    # if data["user_id"]!= "":
    user_id = data["user_id"]
    # if user_id!=None:
    json_path = "./Chat_history/message_%s.json" % user_id
    if not os.path.exists(json_path):
        return "no files in the path"

    response,json_data=analysis.analysis(user_id)

    return JSONResponse({
        "id": response,
        "messages" :json_data
    })



#和机器人对话
@app.post("/talking_for_result")
async def talking_for_result(request: Request):
    data = await request.json()
    talking_message = data["question"]
    #获取对话历史数据
    History = data["History"]

    messages=History
    messages.append(
        {
            'role': 'user',
            'content': talking_message,
        }
    )
    response=analysis.talking(messages)

    return {"response": response}


def escape_bash_arg(s):
    return "'" + s.replace("'", "'\\''") + "'"

def check_host_whitelist(request: Request):
    host_whitelist = os.getenv("HOST_WHITELIST", "")
    request_host_url = request.headers.get("host")

    if not host_whitelist:
        return True

    # Split host whitelist by comma
    allowed_hosts = host_whitelist.split(",")

    # Return True if no whitelist exists are specified
    if len(allowed_hosts) < 1:
        return True

    # Check for apex and www variants
    if any(domain in allowed_hosts for domain in [request_host_url, f"www.{request_host_url}"]):
        return True

    return False





# ------------ Fast API Routes ------------ #

@app.middleware("http")
async def allowed_hosts_middleware(request: Request, call_next ):
    # Middle that optionally checks for hosts in a whitelist
    if not check_host_whitelist(request):
        raise HTTPException(status_code=403, detail="Host access denied")
    response = await call_next(request)
    return response

@app.post("/")
async def index(request: Request) -> JSONResponse:
    return JSONResponse({})


# ------------ Main ------------ #

if __name__ == "__main__":
    # Check environment variables
    import uvicorn

    default_host = os.getenv("HOST", "0.0.0.0")

    # default_host = os.getenv("HOST", "localhost")
    default_port = int(os.getenv("FAST_API_PORT", "8765"))

    parser = argparse.ArgumentParser(
        description="RTVI Bot Runner")
    parser.add_argument("--host", type=str,
                        default=default_host, help="Host address")
    parser.add_argument("--port", type=int,
                        default=default_port, help="Port number")
    parser.add_argument("--reload",default=True, action="store_true",
                        help="Reload code on change")

    config = parser.parse_args()

    uvicorn.run(
        "server:app",
        host=config.host,
        port=config.port,
        reload=config.reload,
    )
