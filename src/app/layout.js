
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://balika-storelo.vercel.app"),

  title: {
    default: "BALIKA | Elegance in Every Detail",
    template: "%s | BALIKA",
  },

  description:
    "Shop elegant jewellery and fashion accessories at BALIKA. Discover beautiful collections and find your perfect style.",

  applicationName: "BALIKA",

  keywords: [
    "BALIKA",
    "Online Jewellery Store",
    "Jewellery Bangladesh",
    "Fashion Accessories",
    "Elegant Jewellery",
  ],

  openGraph: {
    title: "BALIKA | Elegance in Every Detail",
    description:
      "Discover beautiful jewellery and accessories at BALIKA.",
    siteName: "BALIKA",
    type: "website",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "BALIKA | Elegance in Every Detail",
    description:
      "Discover beautiful jewellery and accessories at BALIKA.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
