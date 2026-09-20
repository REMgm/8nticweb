"use client";
import { useState } from "react";
import { ArrowRightIcon, ArrowsClockwiseIcon, BrainIcon, HeartbeatIcon, ListChecksIcon, NotebookIcon } from "@phosphor-icons/react";
import { useExperience } from "./Experience";

const stages=[
  {title:"A task begins",label:"Create a task",icon:ListChecksIcon,copy:"An agent turns an intention into a specific task, with a human-defined boundary.",example:"Prepare a launch brief. Ask a person before contacting a customer."},
  {title:"A heartbeat picks it up",label:"Pick it up",icon:HeartbeatIcon,copy:"A recurring check finds ready work and brings the next action into focus.",example:"The brief is ready to draft. A customer email stays outside the allowed scope."},
  {title:"Memory informs the work",label:"Use memory",icon:BrainIcon,copy:"Relevant context and earlier lessons guide the next attempt.",example:"An earlier review asked for source links beside every claim. That lesson informs this draft."},
  {title:"The lesson carries forward",label:"Keep the lesson",icon:NotebookIcon,copy:"A reviewed lesson is stored so another task can benefit from what happened.",example:"Record the source-link preference for the next brief. Human review still determines what is useful."}
];
export function QipLoop({compact=false}:{compact?:boolean}){
  const [active,setActive]=useState(0),[cycle,setCycle]=useState(0);const {cue}=useExperience();const stage=stages[active];
  const choose=(i:number)=>{setActive(i);cue();};
  return <div className={`qip-loop ${compact?"compact":""}`}>
    <div className="loop-visual" aria-label="Compound Autonomy Loop">
      <div className="orbit orbit-one" aria-hidden="true"/><div className="orbit orbit-two" aria-hidden="true"/><div className="orbit orbit-three" aria-hidden="true"/><div className="orbital-traveller" aria-hidden="true"/>
      <div className="loop-core"><span>QIP</span><small>learning carries forward</small></div>
      <div className="loop-steps">{stages.map((s,i)=><button key={s.label} onClick={()=>choose(i)} className={`loop-node node-${i} ${active===i?"selected":""}`} aria-pressed={active===i} aria-controls="loop-detail"><s.icon size={24} weight="light"/><span>{s.label}</span></button>)}</div>
    </div>
    <div className="loop-content" id="loop-detail"><p className="caption">Explore the Compound Autonomy Loop</p><h3>{stage.title}</h3><p>{stage.copy}</p><div className="example-note"><span>Illustrative example</span><p>{stage.example}</p></div><div className="loop-controls"><button className="text-link" onClick={()=>{if(active===3){setActive(0);setCycle(cycle+1)}else setActive(active+1);cue();}}>{active===3?"Begin the next cycle":"Follow the next step"}{active===3?<ArrowsClockwiseIcon size={20}/>:<ArrowRightIcon size={20}/>}</button><span className="loop-count" aria-live="polite">{active+1} / 4{cycle>0?` · ${cycle} cycle${cycle===1?"":"s"} explored`:""}</span></div></div>
    <ol className="sr-only">{stages.map(s=><li key={s.title}>{s.title}. {s.copy}</li>)}</ol>
  </div>;
}
