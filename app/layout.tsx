import type { Viewport } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Experience } from "@/components/Experience";
import { siteMetadata,siteJsonLd,jsonLdStringify } from "@/lib/seo";
import "./globals.css";
import "@/styles/publications.css";
import "@/styles/companion.css";

const manrope = localFont({src:"../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2",variable:"--font-sans",display:"swap",weight:"200 800"});
const newsreader = localFont({src:[{path:"../node_modules/@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2",weight:"200 800",style:"normal"},{path:"../node_modules/@fontsource-variable/newsreader/files/newsreader-latin-wght-italic.woff2",weight:"200 800",style:"italic"}],variable:"--font-display",display:"swap"});
export const metadata=siteMetadata;
export const viewport:Viewport={width:"device-width",initialScale:1,viewportFit:"cover",themeColor:"#10110f",colorScheme:"dark"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" className={`${manrope.variable} ${newsreader.variable}`}><body><a className="skip-link" href="#main-content">Skip to content</a><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLdStringify(siteJsonLd)}}/><Experience><Header/><noscript><nav className="nojs-nav shell" aria-label="Navigation without JavaScript"><a href="/qip">QIP</a><a href="/research">Research</a><a href="/experiments">Experiments</a><a href="/publications">Publications</a><a href="/about">About</a></nav></noscript><main id="main-content">{children}</main><Footer/></Experience></body></html>}
