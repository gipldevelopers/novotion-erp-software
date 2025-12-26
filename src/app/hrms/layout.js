import { Geist, Geist_Mono } from "next/font/google";
import "./hr.css";
import { SidebarProvider } from "./context/SidebarContext";
import { ThemeProvider } from "./context/ThemeContext";
import AuthLoader from "./components/AuthLoader";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "HRMS Portal",
  description: "Human Resource Management System",
};

export default function HRMSLayout({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthLoader>
          <SidebarProvider>
            <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
              {children}
            </div>
            <Toaster position="top-right" richColors />
          </SidebarProvider>
        </AuthLoader>
      </AuthProvider>
    </ThemeProvider>
  );
}
