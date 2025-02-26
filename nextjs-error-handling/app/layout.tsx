import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Error Handling",
  description: "Study how to handle errors in Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
