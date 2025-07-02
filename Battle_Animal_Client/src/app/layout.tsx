import type { Metadata } from "next";
import "./globals.css";
import "@radix-ui/themes/styles.css";
  
import { Theme } from "@radix-ui/themes";
import Providers from "./provider";

export const metadata: Metadata = {
  title: {
    template: "%s - Gang Roog Jiab",
    default: "Gang Roog Jiab",
  },
  description: "Gang Roog Jiab",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Theme>
          <Providers>{children}</Providers>
        </Theme>
      </body>
    </html>
  );
}
