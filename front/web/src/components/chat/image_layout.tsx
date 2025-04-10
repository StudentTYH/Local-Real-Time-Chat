import React, { useState,useEffect } from "react";
import {
  useConnectionState,
  useVoiceAssistant,
  useLocalParticipant,
  BarVisualizer,
} from "@livekit/components-react";

export default function ImageCarousel() {
  // 图片集合
  const images = [
    "img/psychological_test/image1.png",
    "img/psychological_test/image2.png",
    "img/psychological_test/image3.png",
    "img/psychological_test/image4.png",
    "img/psychological_test/image5.png",
  ];


  // 当前图片索引   设成0的时候在第一张图片出现的时候不会触发，只能设成-1然后通过useEffect来改值
  const [currentIndex, setCurrentIndex] = useState(-1);
  const { localParticipant } = useLocalParticipant();
  const { agent } = useVoiceAssistant();


  useEffect(() => {
    if (currentIndex === -1) {
      setCurrentIndex(0); // 初次渲染后设置为0
    }
  }, [currentIndex]); // 只在 currentIndex 为 -1 时触发

  useEffect(() => {
    try {
    
      let response = localParticipant.performRpc({
        destinationIdentity: agent.identity,
        method: "pg.second_step",
        payload: JSON.stringify({ "images":images[currentIndex] }),
      });
    } catch (e) {
    }
  }, [currentIndex]); 



  // 切换到上一张图片
  const showPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // 切换到下一张图片
  const showNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      {/* 图片显示区域 */}
      <div className="w-full flex items-center justify-center mb-4">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="max-h-96 max-w-full rounded shadow-md"
        />
      </div>

      {/* 按钮区域 */}
      <div className="flex gap-4">
        <button
          onClick={showPrevious}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          上一张
        </button>
        <button
          onClick={showNext}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          下一张
        </button>
      </div>
    </div>
  );
}