import type { Metadata } from "next";
import { Geist, Geist_Mono, Playwrite_AU_QLD, Arimo } from "next/font/google";
import "./globals.css";
import ClientSessionWrapper from "@/components/sessionProvider";
import { TanstackProvider } from "@/components/tanstackProvider";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playwrite = Playwrite_AU_QLD({
  variable: "--font-playwrite",
});

const arimo = Arimo({
  variable: "--font-arimo",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GlobeTrotter - Endless Horizons",
  description: "Explore the world with GlobeTrotter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playwrite.variable}  ${arimo.variable} antialiased`}
      >
        <ClientSessionWrapper>
          <TanstackProvider>
            {children}
            <ToastContainer
              position="bottom-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </TanstackProvider>
        </ClientSessionWrapper>
      </body>
    </html>
  );
}
