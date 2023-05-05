import Topbar from "@/components/sidebar";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

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
      </body>
    </html>
  );
}
