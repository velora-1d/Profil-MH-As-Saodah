import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "MI MH As-Saodah — Pesantren & Sekolah Modern",
    template: "%s | MI MH As-Saodah",
  },
  description: "Madrasah Ibtidaiyah MH As-Saodah — Membangun generasi Qur'ani yang berwawasan global dengan pendidikan berkualitas dan akhlakul karimah.",
  keywords: ["madrasah ibtidaiyah", "MH As-Saodah", "pesantren modern", "sekolah islam", "PPDB"],
  openGraph: {
    title: "MI MH As-Saodah — Pesantren & Sekolah Modern",
    description: "Pendidikan berkualitas dengan landasan akhlakul karimah untuk masa depan umat yang gemilang.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="antialiased bg-white text-slate-900 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
