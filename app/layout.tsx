import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PHProvider, PostHogPageview } from "./providers";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Avail Light Client",
  description:
    "This is an experimental light client for Avail. It runs entirely in your browser to verify that block data is available, by verifying Avail's KZG commitment proofs locally.",
  openGraph: {
    title: "Avail Light Client",
    description:
      "This is an experimental light client for Avail. It runs entirely in your browser to verify that block data is available, by verifying Avail's KZG commitment proofs locally.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Avail Light Client",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Avail Light Client",
    description:
      "This is an experimental light client for Avail. It runs entirely in your browser to verify that block data is available, by verifying Avail's KZG commitment proofs locally.",
    images: ["/images/og-image.png"],
    creator: "@Availproject",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Suspense>
        <PostHogPageview />
      </Suspense>
      <PHProvider>
        <body className={inter.className}>{children}</body>
      </PHProvider>
    </html>
  );
}
