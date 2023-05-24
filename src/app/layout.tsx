import Topbar from "@/components/topbar";
import { Inter } from "next/font/google";
import Script from "next/script";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// import "reactflow/dist/style.css";

export const metadata = {
  title: "OpenChatflow",
  description: "An application to design and monitor Telegram chatbots",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className + " bg-gray-100 dark:bg-slate-900"}>
        <Topbar />

        <div className="w-full pt-10 px-4 sm:px-6 md:px-8">{children}</div>

        {process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN && (
          <Script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({
              token: process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN,
            })}
          />
        )}
      </body>
    </html>
  );
}
