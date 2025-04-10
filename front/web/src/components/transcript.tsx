import { cn } from "@/lib/utils";
import { useAgent } from "@/hooks/use-agent";
import { useEffect, useRef, RefObject, useState,useContext,createContext } from "react";

// interface Transcription {
//   segment: TranscriptionSegment;
//   participant?: Participant;
//   publication?: TrackPublication;
// }


// interface Transcription {
//   segment: TranscriptionSegment;
//   participant?: Participant;
//   publication?: TrackPublication;
// }



type Message = {
  // sender: "user" | "model";  // 消息的发送者
  role: string;           // 消息内容
  content: string;         // 时间戳 (ISO 8601 格式)
};

type ChatConversation = {
  // conversationId: string;    // 唯一的对话 ID
  messages: Message[];       // 消息列表
};




export function Transcript({
  scrollContainerRef,
  scrollButtonRef,
}: {
  scrollContainerRef: RefObject<HTMLElement>;
  scrollButtonRef: RefObject<HTMLButtonElement>;
}) {


  


  const { displayTranscriptions } = useAgent();



  // const context = useContext(USER_ID1);
  


  // 提交
  // function onSubmit(value:any) {
  //   const chat_history: ChatConversation = {
  //     messages: [],
  //   };    
  //   console.log(context);

  //   // 处理函数
  //   // console.log(value);
  //   for (const item of value) {
  //     const m:Message={
  //       role:item.participant.identity,
  //       content:item.segment.text
  //     };
  //     chat_history.messages.push(m);
  //   }

  //   // 发送到后端 API 路由
  //   fetch('http://localhost:8765/save_chat', {
  //     method: 'POST',
  //     credentials: "include",
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       chat_history,
  //     }),
  //   })
  //     .then(response => response.json())
  //     .then(data => {
  //       console.log('Server response:', data);
  //       // 如果请求成功，执行一些后续操作
  //     })
  //     .catch(error => {
  //       console.error('Error:', error);
  //     });
  // }







  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const calculateDistanceFromBottom = (container: HTMLElement) => {
    const { scrollHeight, scrollTop, clientHeight } = container;
    return scrollHeight - scrollTop - clientHeight;
  };

  const handleScrollVisibility = (
    container: HTMLElement,
    scrollButton: HTMLButtonElement,
  ) => {
    const distanceFromBottom = calculateDistanceFromBottom(container);
    const shouldShowButton = distanceFromBottom > 100;
    setShowScrollButton(shouldShowButton);
    scrollButton.style.display = shouldShowButton ? "flex" : "none";
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    const scrollButton = scrollButtonRef.current;
    if (container && scrollButton) {
      const handleScroll = () =>
        handleScrollVisibility(container, scrollButton);

      handleScroll(); // Check initial state
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [
    scrollContainerRef,
    scrollButtonRef,
    displayTranscriptions,
    handleScrollVisibility,
  ]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const distanceFromBottom = calculateDistanceFromBottom(container);
      const isNearBottom = distanceFromBottom < 100;
      if (isNearBottom) {
        transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [displayTranscriptions, scrollContainerRef, transcriptEndRef]);

  const scrollToBottom = () => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const scrollButton = scrollButtonRef.current;
    if (scrollButton) {
      scrollButton.addEventListener("click", scrollToBottom);
      return () => scrollButton.removeEventListener("click", scrollToBottom);
    }
  }, [scrollButtonRef]);

    // <div className="flex items-center text-xs font-semibold uppercase tracking-widest sticky top-0 left-0 w-full p-4 bg-green-100">
    //     转录结果
    //     <div className="ml-auto"> {/* 使按钮向右对齐 */}
    //       <Button type="submit" onClick={() => onSubmit(displayTranscriptions)}>
    //         提交转录结果
    //       </Button>
    //     </div>
    //   </div>

  return (
    <>
      
      <div className="p-4 min-h-[300px] relative">
        {displayTranscriptions.length === 0 ? (
          <div className="flex items-center justify-center h-full text-black-300 text-sm">
            {/* Get talking to start the conversation! */}
            
          </div>
        ) : (
          <div className="space-y-4">
            {displayTranscriptions.map(
              ({ segment, participant, publication }) =>
                segment.text.trim() !== "" && (
                  <div
                    key={segment.id}
                    className={cn(
                      "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                      participant?.isAgent
                        ? "bg-neutral-100 text-[#09090B]"
                        : "ml-auto border border-neutral-300",
                    )}
                  >
                    {segment.text.trim()}
                  </div>
                ),
            )}
            <div ref={transcriptEndRef} />
          </div>
        )}
      </div>
      </>
  );
}
