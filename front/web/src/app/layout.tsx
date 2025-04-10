import "./globals.css";
import { PlaygroundStateProvider } from "@/hooks/use-playground-state";
import { ConnectionProvider } from "@/hooks/use-connection";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { PHProvider } from "@/hooks/posthog-provider";
import { Public_Sans } from "next/font/google";
import dynamic from "next/dynamic";
import { UserInfoProvider } from "@/components/chat/user_info"

const PostHogPageView = dynamic(
  () => import("../components/posthog-pageview"),
  {
    ssr: false,
  }
);

// Configure the Public Sans font
const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

import "@livekit/components-styles";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  //<ConnectionProvider>  连接openai的context hook


  return (
    <html lang="en">
      <body className={publicSans.className}>
        <PHProvider>
        <UserInfoProvider>
          <PlaygroundStateProvider>
            <ConnectionProvider>
              <TooltipProvider>
                <PostHogPageView />
                {children}
                <Toaster />
              </TooltipProvider>
            </ConnectionProvider>
          </PlaygroundStateProvider>
          </UserInfoProvider>
        </PHProvider>
      </body>
    </html>
  );
}
