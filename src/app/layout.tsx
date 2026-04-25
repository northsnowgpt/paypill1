import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PayPill - Intelligent Healthcare Management",
  description: "Multi-tenant healthcare platform for individuals, employers, and insurance providers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
