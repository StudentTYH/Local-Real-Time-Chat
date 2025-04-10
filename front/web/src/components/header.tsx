"use client";

import { CodeViewer } from "@/components/code-viewer";
import { PresetSave } from "@/components/preset-save";
import { PresetSelector } from "@/components/preset-selector";
import { PresetShare } from "@/components/preset-share";
import { Button } from "@/components/ui/button";

import Link from 'next/link';



export function Header() {
  return (
    <div className="flex flex-shrink-0 flex-col lg:flex-row p-4 border-l border-r border-t border-b rounded-t-md bg-white">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:flex-grow">
        <div className="flex flex-col mb-2 lg:mb-0">
          <div className="flex flex-row items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">欢迎来到实时对话系统</h2>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center justify-between sm:justify-end space-x-2 mt-2 lg:mt-0">

          <div className="flex flex-row items-center space-x-2">
                <Link href="/Reports" target="_blank">
                  <Button>聊天历史分析</Button>
               </Link>
            {/* <PresetSelector /> */}
            {/* <PresetSave />
            <PresetShare />
            <CodeViewer /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
