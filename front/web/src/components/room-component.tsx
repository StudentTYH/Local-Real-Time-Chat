"use client";

import {
  LiveKitRoom,
  RoomAudioRenderer,
  StartAudio,
} from "@livekit/components-react";

import { ConfigurationForm } from "@/components/configuration-form";
import { Chat } from "@/components/chat";
import { Transcript } from "@/components/transcript";
import { useConnection } from "@/hooks/use-connection";
import { AgentProvider } from "@/hooks/use-agent";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";
// import { ChatMessageInput } from "@/components/chat/ChatMessageInput";
import { ChatMessageInput } from "./chat/ChatMessageInput";
import Transcript_Head from "./chat/transcript_head";


export function RoomComponent() {
  const { shouldConnect, wsUrl, token } = useConnection();
  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  const scrollButtonRef = useRef<HTMLButtonElement>(null);
  const inputHeight = 60;

  return (
    <LiveKitRoom
      serverUrl={wsUrl}
      token={token}
      connect={shouldConnect}
      audio={true}
      className="bg-pink-100 flex flex-col md:grid md:grid-cols-[1fr_360px] lg:grid-cols-[300px_1fr_300px] xl:grid-cols-[360px_1fr_360px] flex-grow overflow-hidden border-l border-r border-b rounded-b-md"
      style={{ "--lk-bg": "white" } as React.CSSProperties}
      options={{
        publishDefaults: {
          stopMicTrackOnMute: true,
        },
      }}
    >
      <AgentProvider>


        {/* 配置部分 */}
        <div className="hidden lg:block h-full overflow-y-auto relative border-r bg-yellow-100">
          <ConfigurationForm />
        </div>
        {/* 对话部分 */}
        <div className="flex flex-col justi fy-center w-full max-w-3xl mx-auto">
          <Chat />
        </div>
        {/* 聊天记录部分 */}
        <div className="hidden md:flex flex-col h-full overflow-y-hidden border-l relative bg-blue-100">
          <Transcript_Head />

          <div
            className="flex-grow overflow-y-auto"
            ref={transcriptContainerRef}
          >
            <Transcript
              scrollContainerRef={transcriptContainerRef}
              scrollButtonRef={scrollButtonRef}
            />
          </div>
          

          <div className="left-0 right-0 p-4">
          {/* <div className="absolute left-0 right-0 p-4"> */}

            {/* <button
              ref={scrollButtonRef}
              className="p-2 bg-white text-gray-500 rounded-full hover:bg-gray-100 transition-colors absolute right-4 bottom-4 shadow-md flex items-center"
            > */}
            <button
              ref={scrollButtonRef}
              className="p-2 bg-white text-gray-500 rounded-full hover:bg-gray-100 transition-colors shadow-md flex items-center"
            >
              <ChevronDown className="mr-1 h-4 w-4" />
              <span className="text-xs pr-1">View latest</span>
            </button>
          </div>

            <div>
            <ChatMessageInput
            height={inputHeight}
            placeholder="手动输入回答..."
            accentColor="black"
            // onSend={"123"}
            />
            </div>
        </div>

        <RoomAudioRenderer />
        <StartAudio label="Click to allow audio playback" />
      </AgentProvider>
    </LiveKitRoom>
  );
}
