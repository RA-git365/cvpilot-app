export const metadata = {
  title: "CVPilot Pro",
  description: "World-class AI Resume Builder",
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}