import type { Metadata } from "next";
import { Geist, Geist_Mono, Quicksand, Inter, Roboto } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'], // Specify the weights you need
  variable: '--font-quicksand', // Optional: define a CSS variable
});
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // Adjust weights as needed
  display: 'swap',
});
const roboto = Roboto({
  subsets: ['latin'], // Ensure Latin subset is included
  weight: ['400', '500', '700'], // Add desired font weights
  style: ['normal', 'italic'], // Add styles if needed
  display: 'swap', // Use 'swap' for better performance
});

export const metadata: Metadata = {
  title: "AquaShop",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
