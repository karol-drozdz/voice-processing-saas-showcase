import "../app/globals.css";
import { Open_Sans } from "next/font/google";
import { FacebookProvider } from "./context/FacebookContext";
import CookieBanner from "./components/CookieBanner";

const opensans = Open_Sans({
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://voiceclip.eu"),
  title: "Voice Clip",
  description: "Summarize your audio message",
  icons: "/favicon.ico",
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="!scroll-smooth">
      <body className={opensans.className}>
        {" "}
        <FacebookProvider>{children} </FacebookProvider>
        <CookieBanner />
      </body>
    </html>
  );
}
