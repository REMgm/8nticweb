"use client";
export default function ErrorPage({reset}:{reset:()=>void}){return <section className="page-shell shell"><h1>A pause in the exploration.</h1><p>We couldn’t load this page. Please try again.</p><button className="button button-primary" onClick={reset}>Try again</button><a className="text-link" href="/">Return home</a></section>}
