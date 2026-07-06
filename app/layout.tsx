import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import TooltipWrapper from "./_providers/tooltip";
import { Toaster } from "sonner";
import { ThemeProvider } from "./_providers/theme-provider";
// import StoreWrapper from "./_providers/store";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IG Library System",
  description: "Library cataloguing system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
      suppressHydrationWarning={true}
    >
      <body className="min-h-full flex md:flex-col" suppressHydrationWarning={true}>
        {/* <StoreWrapper> */}
          <TooltipWrapper>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </TooltipWrapper>
        {/* </StoreWrapper> */}
      </body>

    </html>
  );
}
