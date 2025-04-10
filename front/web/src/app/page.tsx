import { Header } from "@/components/header";
import { RoomComponent } from "@/components/room-component";
import { Auth } from "@/components/auth";
import LK from "@/components/lk";
import Heart from "@/assets/heart.svg";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { defaultPresets } from "@/data/presets";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
  let title = "实时对话";
  let description =
    "AAAAA";

  const presetId = searchParams?.preset;
  if (presetId) {
    const selectedPreset = defaultPresets.find(
      (preset) => preset.id === presetId,
    );
    if (selectedPreset) {
      title = `实时对话`;
      description = `AAAAA`;
    }
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: "https://playground.livekit.io/",
      images: [
        {
          url: "https://playground.livekit.io/og-image.png",
          width: 1200,
          height: 675,
          type: "image/png",
          alt: title,
        },
      ],
    },
  };
}

export default function Dashboard() {
  return (
    <div className="flex flex-col h-full bg-neutral-100">
      <header className="flex flex-shrink-0 h-12 items-center justify-between px-4 w-full md:mx-auto">
        <LK />

        {/* 弹出框 */}
        <Auth />

      </header>
      <main className="flex flex-col flex-grow overflow-hidden p-0 md:p-2 md:pt-0 w-full md:mx-auto">

        <Header />



        {/* 各个组件 */}
        <RoomComponent />
      </main>
    </div>
  );
}
