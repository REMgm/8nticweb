import Image from "next/image";
import Link from "next/link";

export function Brand({ large = false }: { large?: boolean }) {
  return <Link href="/" className={`brand ${large ? "brand-large" : ""}`} aria-label="8NTIC, home"><Image src="/assets/wordmark.webp" alt="8NTIC" width={705} height={195} priority /></Link>;
}

export function MascotMark({ className = "" }: { className?: string }) {
  return <Image className={`mascot-mark ${className}`} src="/assets/mark.webp" width={180} height={253} alt="" aria-hidden="true" />;
}
