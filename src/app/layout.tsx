import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Josefin_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
});

const dmSans = DM_Sans({
    subsets: ["latin"],
    variable: "--font-dm-sans",
});

const josefin = Josefin_Sans({
    subsets: ["latin"],
    variable: "--font-josefin",
});

export const metadata: Metadata = {
    title: "CHRONOS | Premium Luxury Timepieces",
    description: "Experience the pinnacle of horology with our hand-crafted luxury timepieces. Engineering meets art in every tick.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body
                className={`${playfair.variable} ${dmSans.variable} ${josefin.variable} font-body antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
