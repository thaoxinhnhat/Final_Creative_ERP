import type React from "react"
import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { NotificationCenter } from "@/components/notification-center"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Workspace Dashboard",
  description: "Internal workspace dashboard for startup employees",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="fixed top-4 right-4 z-[100]">
            <NotificationCenter />
          </div>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
