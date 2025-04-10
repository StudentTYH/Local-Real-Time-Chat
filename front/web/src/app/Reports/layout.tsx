import "./globals.css";
import "@livekit/components-styles";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  // 可以在这里进行一些初始化操作，如设置 OpenAI 连接信息等

  return (
    <html lang="en">
      <head>
        {/* 你可以在这里添加页面的元数据、标题、样式等 */}
      </head>
      <body>
        {/* 包裹子组件的 ConnectionProvider 使后代组件能够访问上下文 */}
          {children}
      </body>
    </html>
  );
}