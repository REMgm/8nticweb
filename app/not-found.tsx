import Link from "next/link";
import { MascotMark } from "@/components/Brand";
export default function NotFound(){return <section className="page-shell shell not-found"><MascotMark/><p className="eyebrow">Page not found</p><h1>A little<br/><em>off the path.</em></h1><p>There is still plenty to explore.</p><Link className="button button-primary" href="/">Back to 8NTIC</Link></section>}
