import type { Metadata } from "next";
import { Righteous, Pacifico } from "next/font/google";
import "./globals.css";

const righteous = Righteous({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-righteous",
});

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pacifico",
});

export const metadata: Metadata = {
  title: "Blobscape - Virtual Lava Lamp",
  description: "A groovy 70s virtual lava lamp experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${righteous.variable} ${pacifico.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
