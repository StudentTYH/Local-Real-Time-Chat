"use client"; 

import React, { useState, useEffect } from "react";
import { Input_ID } from "@/components/reports/get_id";
// import Link from 'next/link';
import WordDownloadLink from "@/components/reports/download";


interface Message {
  role: "system" | "assistant" | "user";
  content: string;
}

export default function PsychologyReportChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "system", content: "这是一个心理评估报告对话系统。您可以询问关于报告的问题。" },
    { role: "assistant", content: "您好！我是您的AI助手。我可以回答您关于心理评估报告的问题。您想了解什么？" },
  ]);
  const [input, setInput] = useState<string>("");
  const [USERid, setUSERid] = useState<string>("");
  const [History, setHistory] = useState<string>("");
  const [psychologyReport, setPsychologyReport] = useState<string>("请输入您需要查询的ID . . .");

  const request_address = "http://localhost:8765";

  const handleChildData = (data: string) => setUSERid(data);

  useEffect(() => {
    if (!USERid) return;

    const fetchPsychologyReport = async () => {
      try {
        const response = await fetch(`${request_address}/get_psychology_report`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: USERid }),
        });
        const data = await response.json();
        


        setHistory(data.messages);
        setPsychologyReport(data.id);
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessages((prev) => [...prev, { role: "assistant", content: "获取数据失败，请稍后再试。" }]);
      }
    };

    fetchPsychologyReport();
  }, [USERid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);

    try {
      const response = await fetch(`${request_address}/talking_for_result`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input, user_id: USERid, History }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "获取数据失败，请稍后再试。" }]);
    }

    setInput("");
  };

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-8 font-sans h-[100vh] w-[100vh]">
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 border-b pb-2">心理评估报告与AI助手对话</h1>
      </header>

      <div className="flex justify-between items-center gap-3 mb-4">
        <Input_ID onData={handleChildData} />
        <WordDownloadLink></WordDownloadLink>

      </div>

      <div className="flex gap-6 mb-4 h-[60%]">
        {/* 左侧：心理报告数据 */}
        <section className="flex-1 bg-gray-100 border rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">心理报告</h2>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{psychologyReport}</p>
        </section>

        {/* 右侧：聊天记录 */}
        <section className="flex-1 border rounded-lg p-4 overflow-y-auto bg-white shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">聊天记录</h2>
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              marginBottom: "10px",
              textAlign: message.role === "user" ? "right" : "left",
            }}
          >
            <span
              style={{
                background: message.role === "user" ? "#dcf8c6" : "#e9e9eb",
                padding: "8px 12px",
                borderRadius: "18px",
                display: "inline-block",
                maxWidth: "70%",
              }}
            >
              {message.content}
            </span>
          </div>
        ))}
        </section>
      </div>

      {/* 用户输入表单 */}
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入您的问题..."
          className="flex-grow py-2 px-4 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-6 text-base rounded hover:bg-blue-600 transition"
        >
          发送
        </button>
      </form>
    </div>
  );
}
