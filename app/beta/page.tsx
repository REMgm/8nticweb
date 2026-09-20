import { BetaForm } from "@/components/BetaForm";
import { MascotMark } from "@/components/Brand";
import { pageMetadata } from "@/lib/seo";
export const metadata=pageMetadata({title:"Beta and research updates",description:"Sign up for notification when 8NTIC is ready to share beta news and research updates. Name and email only, with your explicit permission.",path:"/beta"});
export default function Beta(){return <div className="page-shell shell"><section className="signup-section beta-page"><div className="signup-copy"><MascotMark/><h1>Be here for<br/><em>what comes next.</em></h1><p>Leave your name and email. We’ll let you know when we’re ready to share beta news and research updates.</p><p className="caption">A notification list, not a beta-access guarantee.</p></div><BetaForm/></section></div>}
