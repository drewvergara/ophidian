import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ophidian",
  description: "Ophidian is an applet that is a Snake game.",
  openGraph: {
    title: 'Ophidian',
    description: 'Ophidian is an applet that is a Snake game.',
    url: 'https://preamble-offekt.vercel.app/',
    siteName: 'Ophidian',
    images: [
      {
        url: 'https://offekt.s3.us-west-2.amazonaws.com/opengraph/preamble_opengraph_800x600.png', // Must be an absolute URL
        width: 800,
        height: 600,
      },
      {
        url: 'https://offekt.s3.us-west-2.amazonaws.com/opengraph/preamble_opengraph_1800x1600.png', // Must be an absolute URL
        width: 1800,
        height: 1600,
        alt: 'Ophidian | A Snake Game',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ophidian',
    description: 'Ophidian is an applet that is a Snake game.',
    creator: '@drewvergara',
    images: ['https://offekt.s3.us-west-2.amazonaws.com/opengraph/preamble_opengraph_1800x1600.png'], // Must be an absolute URL
  }    
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
