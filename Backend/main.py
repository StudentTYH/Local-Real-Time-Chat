import os
import asyncio

from livekit.agents import JobContext, WorkerOptions, cli, JobProcess,metrics
from livekit.agents.llm import (
    ChatContext,
    ChatMessage,
    ChatImage,
)
from livekit.agents.voice_assistant import VoiceAssistant
from livekit.plugins import deepgram, silero, cartesia

from plugins import openai

from plugins import xtts
from plugins.xtts import VoiceSettings

from dotenv import load_dotenv
import logging
import ollama
import base64
from livekit import rtc
import json

import requests
import aiohttp
from utils import *

from data import image

logger = logging.getLogger("voice-assistant")

load_dotenv()


def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()


async def entrypoint(ctx: JobContext):

    #运行前的配置 需要开启tts
    tts_audio_setting={
          "stream_chunk_size": 100,
          "temperature": 0.85,
          "speed": 1.2,
          "length_penalty": 1.0,
          "repetition_penalty": 5.0,
          "top_p": 0.85,
          "top_k": 50,
          "enable_text_splitting": True
        }
    await set_audio_output(tts_audio_setting)


    initial_ctx = ChatContext(
        messages=[
            ChatMessage(
                role="system",
                content="你是一名语音助手。",
            ),

        ]
    )

    VS=VoiceSettings(style=1,stability=0.1,use_speaker_boost=True,similarity_boost=0.5)


    llm=openai.LLM.with_ollama(
        model="qwen_xinli",
        max_tokens = 150,
    )

    tts = xtts.TTS(
        api_key="dummy",
        language="zh",
        streaming_latency=1,
        tts_speaker="woman.wav",
        voice=xtts.Voice(
            id="v2",
            name="default",
            # category="neural",
            category="expressive",
            # settings={"style": "happy"},
            settings=VS,
        ))


    assistant = VoiceAssistant(
        vad=ctx.proc.userdata["vad"],
        stt=openai.STT(base_url="http://localhost:8111/v1",model="xxx",api_key="123",language="zh-CN"),
        llm=llm,
        tts = tts,
        chat_ctx=initial_ctx,
    )

    await ctx.connect()
    assistant.start(ctx.room)
    await asyncio.sleep(1)


    await assistant.say("您好，我是一名语音助手，有什么可以帮助您的吗？", allow_interruptions=True)


    #更新配置
    @ctx.room.local_participant.register_rpc_method("pg.updateConfig")
    async def update_config(
            data: rtc.rpc.RpcInvocationData,
    ):
        needed_voice=json.loads(data.payload)["voice"]
        tts.update_speaker(speaker="%s.wav"%needed_voice)
        await assistant.say("您好，我是%s，接下来将由我的声音来与你对话。"%needed_voice, allow_interruptions=True,add_to_chat_ctx=False)
        return "success"


    #更新配置
    @ctx.room.local_participant.register_rpc_method("pg.submit")
    async def submit(
            data: rtc.rpc.RpcInvocationData,
    ):
        print(data)
        user_id=json.loads(data.payload)["user_id"]

        data = assistant.chat_ctx

        openai_messages=openai.llm._build_oai_context(data,cache_key="111")

        message_file = open("./Chat_history/message_%s.json" % user_id, mode="w",
                            encoding="utf-8")
        json.dump(openai_messages, message_file, ensure_ascii=False)
        return "success"


    chat = rtc.ChatManager(ctx.room)
    #这个函数就是可以通过直接调用来进行对话
    async def answer_from_text(txt: str,role="user",image=None):

        # 用copy是复制一份，源数据不会改变，如果不用copy则会改变
        # chat_ctx = assistant.chat_ctx.copy()
        chat_ctx = assistant.chat_ctx

        chat_ctx.append(role=role, text=txt,images=[image])
        stream = assistant.llm.chat(chat_ctx=chat_ctx)
        await assistant.say(stream, allow_interruptions=True,add_to_chat_ctx=True)



    #手动输入数据，而非语音输入
    @chat.on("message_received")
    def on_chat_received(msg: rtc.ChatMessage):
        if msg.message:
            asyncio.create_task(answer_from_text(msg.message))


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))