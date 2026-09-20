import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import { isBetaSignupAvailable } from "@/lib/beta/availability";
import { BetaForm } from "./BetaForm";

export function BetaSignup({ available = isBetaSignupAvailable(), headingLevel = 3 }: { available?: boolean; headingLevel?: 2 | 3 }) {
  if (available) return <BetaForm />;
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <div className="beta-form beta-prelaunch">
      <p className="eyebrow">Beta updates</p>
      <Heading>Still taking shape.</Heading>
      <p className="beta-prelaunch-message">Signups aren’t open yet. Explore QIP and our publications while the next chapter takes shape.</p>
      <div className="beta-prelaunch-actions">
        <Link href="/qip" className="button button-primary">Explore QIP <ArrowUpRightIcon size={18} aria-hidden="true" /></Link>
        <Link href="/publications" className="text-link">Read publications <ArrowUpRightIcon size={18} aria-hidden="true" /></Link>
      </div>
    </div>
  );
}
