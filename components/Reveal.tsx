"use client";
import { useEffect, useRef, type ReactNode } from "react";
export function Reveal({children,className=""}:{children:ReactNode;className?:string}){
  const element=useRef<HTMLDivElement>(null);
  useEffect(()=>{const node=element.current;if(!node || matchMedia('(prefers-reduced-motion: reduce)').matches)return;const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){node.classList.add("arrived");observer.disconnect();}},{threshold:.08});observer.observe(node);return()=>observer.disconnect();},[]);
  return <div ref={element} className={`reveal ${className}`}>{children}</div>;
}
