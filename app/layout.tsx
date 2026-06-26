import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Social Comment Generator",
  description: "Generate 3 comments for your topic",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <script src="https://js.puter.com/v2/" async></script>
        {children}
      </body>
    </html>
  )
}
