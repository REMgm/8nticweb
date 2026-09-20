import { ImageResponse } from "next/og";
export const alt="8NTIC. Always exploring. QIP, human curiosity and shared intelligence.";
export const size={width:1200,height:630};
export const contentType="image/png";
export default function OpenGraph(){return new ImageResponse(<div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",justifyContent:"space-between",padding:"76px",background:"#11130f",color:"#ede9dd",fontFamily:"serif"}}><div style={{display:"flex",fontSize:32,letterSpacing:8}}>8NTIC</div><div style={{display:"flex",flexDirection:"column",fontSize:84,lineHeight:1.05}}><span>Intelligence,</span><span style={{color:"#d8b985"}}>with a memory.</span></div><div style={{display:"flex",justifyContent:"space-between",fontSize:25}}><span>QIP, the flagship exploration</span><span>Always exploring.</span></div></div>,size)}
