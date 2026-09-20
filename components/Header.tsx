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
  const header=useRef<HTMLElement>(null), mobileNav=useRef<HTMLElement>(null);
  useEffect(()=>{setOpen(false);},[path]);
  useEffect(()=>{
    if(!open)return;
    const escape=(e:KeyboardEvent)=>{if(e.key==="Escape"){e.preventDefault();setOpen(false);toggle.current?.focus();}};
    const outside=(e:PointerEvent)=>{if(e.target instanceof Node&&!header.current?.contains(e.target))setOpen(false);};
    const desktop=matchMedia("(min-width:768px)");
    const resize=()=>{
      if(!desktop.matches)return;
      const focused=document.activeElement;
      if(focused===toggle.current||mobileNav.current?.contains(focused)){
        const href=focused instanceof HTMLAnchorElement?focused.getAttribute("href"):null;
        const matching=Array.from(header.current?.querySelectorAll<HTMLAnchorElement>(".desktop-nav a")||[]).find(link=>link.getAttribute("href")===href);
        (matching||header.current?.querySelector<HTMLAnchorElement>(".brand"))?.focus();
      }
      setOpen(false);
    };
    window.addEventListener("keydown",escape);document.addEventListener("pointerdown",outside);desktop.addEventListener("change",resize);
    return()=>{window.removeEventListener("keydown",escape);document.removeEventListener("pointerdown",outside);desktop.removeEventListener("change",resize);};
  },[open]);
  const active=(href:string)=>path===href||path.startsWith(`${href}/`);
  const select=(href:string)=>{setOpen(false);if(path===href)toggle.current?.focus();};
  return <header ref={header} className="site-header" onBlur={event=>{if(open&&!event.currentTarget.contains(event.relatedTarget))setOpen(false);}}><div className="header-inner"><Brand/><nav className="desktop-nav" aria-label="Main navigation">{links.map(([href,label])=><Link key={href} href={href} aria-current={active(href)?"page":undefined}>{label}</Link>)}</nav><div className="header-actions"><ExperienceControls/><Link className="header-beta" href="/beta">Get updates <ArrowUpRightIcon size={15}/></Link><button ref={toggle} type="button" className="icon-button menu-toggle" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open?"Close menu":"Open menu"} onClick={()=>setOpen(!open)}>{open?<XIcon size={23}/>:<ListIcon size={23}/>}</button></div></div><nav ref={mobileNav} id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" hidden={!open}>{links.map(([href,label])=><Link key={href} href={href} aria-current={active(href)?"page":undefined} onClick={()=>select(href)}>{label}<ArrowUpRightIcon size={22}/></Link>)}<Link href="/beta" onClick={()=>select("/beta")}>Get beta updates<ArrowUpRightIcon size={22}/></Link></nav></header>;
}
