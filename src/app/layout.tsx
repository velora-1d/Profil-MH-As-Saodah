import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://mh-assaodah.sch.id"),
  title: {
    default: "MI MH As-Saodah — Madrasah Ibtidaiyah Terbaik di Tasikmalaya",
    template: "%s | MI MH As-Saodah",
  },
  description:
    "Madrasah Ibtidaiyah Miftahul Huda As-Saodah di Mangkubumi, Kab. Tasikmalaya — membangun generasi Qur'ani berwawasan global dengan pendidikan berkualitas, tahfidz Quran, dan akhlakul karimah.",
  keywords: [
    "madrasah ibtidaiyah",
    "MI MH As-Saodah",
    "sekolah islam tasikmalaya",
    "pesantren modern tasikmalaya",
    "PPDB tasikmalaya",
    "sekolah quran",
    "pendidikan islam",
    "mangkubumi",
    "linggajaya",
    "madrasah tasikmalaya",
  ],
  authors: [{ name: "MI MH As-Saodah" }],
  creator: "MI MH As-Saodah",
  publisher: "MI MH As-Saodah",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: "MI MH As-Saodah — Madrasah Ibtidaiyah Terbaik di Tasikmalaya",
    description:
      "Pendidikan berkualitas dengan landasan akhlakul karimah di Mangkubumi, Kab. Tasikmalaya. Daftar PPDB sekarang!",
    type: "website",
    locale: "id_ID",
    siteName: "MI MH As-Saodah",
  },
  twitter: {
    card: "summary_large_image",
    title: "MI MH As-Saodah — Madrasah Ibtidaiyah Terbaik di Tasikmalaya",
    description:
      "Pendidikan berkualitas dengan landasan akhlakul karimah. Daftar PPDB sekarang!",
  },
  alternates: {
    canonical: "/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "MI Miftahul Huda As-Saodah",
  alternateName: "MI MH As-Saodah",
  description:
    "Madrasah Ibtidaiyah yang berfokus pada pendidikan Islam berkualitas dengan program tahfidz, kurikulum nasional, dan pembinaan akhlakul karimah.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://mh-assaodah.sch.id",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Bojong Limus, Linggajaya",
    addressLocality: "Mangkubumi",
    addressRegion: "Kab. Tasikmalaya, Jawa Barat",
    postalCode: "46181",
    addressCountry: "ID",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -7.3366371,
    longitude: 108.1983238,
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "admissions",
    email: "mi.mhassaodah@gmail.com",
  },
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <Script
          id="json-ld-school"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-white text-slate-900 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
