import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import { KirishDarvozasi } from "@/app/_components/KirishDarvozasi";
import { MAVZU_SKRIPTI } from "@/lib/mavzu";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Nutrilife",
  description: "Ovqatingiz qancha kaloriya — rasmga oling, bilib oling",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="uz"
      className={`${inter.variable} ${interTight.variable} h-full antialiased`}
      // Skript gidratsiyadan oldin data-mavzu ni qo'yadi — React DOM'dagi qiymatni qabul qilsin.
      suppressHydrationWarning
    >
      <head>
        {/* Saqlangan mavzu sahifa chizilishidan oldin qo'llanadi (lib/mavzu.ts). */}
        <script dangerouslySetInnerHTML={{ __html: MAVZU_SKRIPTI }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <KirishDarvozasi>{children}</KirishDarvozasi>
      </body>
    </html>
  );
}
