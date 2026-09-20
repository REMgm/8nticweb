"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ListIcon, XIcon, ArrowUpRightIcon } from "@phosphor-icons/react";
import { Brand } from "./Brand";
import { ExperienceControls } from "./Experience";

const links = [["/qip","QIP"],["/research","Research"],["/experiments","Experiments"],["/publications","Publications"],["/about","About"]];
export function Header() {
  const path=usePathname(), [open,setOpen]=useState(false), toggle=useRef<HTMLButtonElement>(null);
  useEffect(()=>{setOpen(false);},[path]);
  useEffect(()=>{if(!open)return; const escape=(e:KeyboardEvent)=>{if(e.key==="Escape"){setOpen(false);toggle.current?.focus();}};window.addEventListener("keydown",escape);return()=>window.removeEventListener("keydown",escape);},[open]);
  return <header className="site-header"><div className="header-inner"><Brand/><nav className="desktop-nav" aria-label="Main navigation">{links.map(([href,label])=><Link key={href} href={href} aria-current={path.startsWith(href)?"page":undefined}>{label}</Link>)}</nav><div className="header-actions"><ExperienceControls/><Link className="header-beta" href="/beta">Get updates <ArrowUpRightIcon size={15}/></Link><button ref={toggle} className="icon-button menu-toggle" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open?"Close menu":"Open menu"} onClick={()=>setOpen(!open)}>{open?<XIcon size={23}/>:<ListIcon size={23}/>}</button></div></div><nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" hidden={!open}>{links.map(([href,label])=><Link key={href} href={href} aria-current={path.startsWith(href)?"page":undefined} onClick={()=>setOpen(false)}>{label}<ArrowUpRightIcon size={22}/></Link>)}<Link href="/beta" onClick={()=>setOpen(false)}>Get beta updates<ArrowUpRightIcon size={22}/></Link></nav></header>;
}
