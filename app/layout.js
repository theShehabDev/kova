// Root layout: fonts, providers, chrome.
import { Open_Sans, Archivo, Playfair_Display, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import Chrome from "@/components/Chrome";
import AgeGate from "@/components/AgeGate";
import { getProductsSafe } from "@/lib/woo";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

const TITLE = "KOVA Compounds — Research Compounds Made and Verified in the USA";
const DESCRIPTION =
  "≥99% purity by HPLC. Synthesized and tested in the United States, with a batch-specific COA on every order. For laboratory research use only.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
  twitter: { title: TITLE, description: DESCRIPTION },
};

export default async function RootLayout({ children }) {
  const products = await getProductsSafe();

  return (
    <html lang="en" className={`${openSans.variable} ${archivo.variable} ${playfair.variable} ${barlow.variable}`}>
      <body className="font-sans antialiased">
        <AgeGate />
        <Chrome products={products}>{children}</Chrome>
      </body>
    </html>
  );
}
