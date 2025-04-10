import React, { useState } from "react";


import ImageCarousel from "@/components/chat/image_layout";


const FirstStage = ({ onProceed }: { onProceed: () => void }) => {
  return (
    <>
    <img src="img/logo.png" alt="" />
      <button
        onClick={onProceed}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
      >
        点击进入第二阶段
      </button>
    </>
  );
};

const SecondStage = () => {
  return (
    <>
      <ImageCarousel/>
    </>
  );
};


export default function ImageOri() {
  
  const [stage, setStage] = useState<"first" | "second">("first");

  // function onSubmit(value:any) {

  //   }

  const [images, setImages] = useState<string[]>([
    "img/psychological_test/image1.png",
    "img/psychological_test/image2.png",
    "img/psychological_test/image3.png",
    "img/psychological_test/image4.png",
  ]);;


  const handleProceed = () => {
    setStage("second"); // 切换到第二阶段

  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
              {/* <div> */}
              {stage === "first" && <FirstStage onProceed={handleProceed}/>}
              {stage === "second" && <SecondStage/>}

              {/* <button onClick={onSubmit}>点击进入第二阶段</button> */}
              {/* </div> */}
    </div>
  );
}