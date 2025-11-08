import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "思い出売場 - レトログッズのオンラインショップ",
  description: "懐かしいレトログッズを売り買いできるレトロポップなECサイト",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
