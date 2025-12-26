import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Novotion | ERP, CRM, Accounting & POS Software Solutions",
  description:
    "Novotion builds powerful ERP, CRM, Accounting, and POS software for growing businesses. Custom enterprise software, automation, and scalable digital solutions for modern organizations.",

  keywords: [
    "ERP software",
    "CRM software",
    "Accounting software",
    "POS software",
    "Business management software",
    "Enterprise software development",
    "Custom ERP solutions",
    "CRM system development",
    "Accounting automation",
    "Retail POS system",
    "Inventory management software",
    "HRM software",
    "Business automation",
    "Novotion software"
  ],

  authors: [{ name: "Novotion" }],
  creator: "Novotion",
  publisher: "Novotion",

  openGraph: {
    title: "Novotion | ERP, CRM, Accounting & POS Software",
    description:
      "All-in-one ERP, CRM, Accounting, and POS solutions built to scale businesses with automation and intelligence.",
    url: "https://yourdomain.com",
    siteName: "Novotion",
    images: [
      {
        url: "https://yourdomain.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Novotion Software Solutions",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Novotion | ERP, CRM, Accounting & POS Software",
    description:
      "Smart ERP, CRM, Accounting & POS solutions for modern businesses.",
    images: ["https://yourdomain.com/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
