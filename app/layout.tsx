import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "ModelOnCloud",
    description: "AI inference in the cloud."
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}