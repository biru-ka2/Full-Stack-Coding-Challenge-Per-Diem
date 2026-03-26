import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Per Diem",
  description: "Browse menu by location",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
