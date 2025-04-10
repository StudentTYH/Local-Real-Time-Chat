import React, { useState,useContext,createContext } from "react";
import { Button } from "../ui/button";
import {
  useConnectionState,
  useVoiceAssistant,
  useLocalParticipant,
  BarVisualizer,
} from "@livekit/components-react";
import { useUserIn } from "./user_info";


export default function Transcript_Head() {
  
  const { data } = useUserIn();  


  console.log(data);

  const [stage, setStage] = useState<"first" | "second">("first");

  const [currentIndex, setCurrentIndex] = useState(0);
  const { localParticipant } = useLocalParticipant();
  const { agent } = useVoiceAssistant();

  function onSubmit() {
      try {
        
        let response = localParticipant.performRpc({
          destinationIdentity: agent.identity,
          method: "pg.submit",
          payload: JSON.stringify({"user_id":data}),
        });
        alert("提交成功");


      } catch (e) {
        alert("提交失败");

      }
  }

  return (
    <>
      <div className="flex items-center text-xs font-semibold uppercase tracking-widest sticky top-0 left-0 w-full p-4 bg-green-100">
          转录结果
          {/* 使按钮向右对齐 */}
            <div className="ml-auto"> 
              <Button type="submit" onClick={() => onSubmit()}>
                提交对话内容
              </Button>
            </div>
          </div>
    </>
  );
}