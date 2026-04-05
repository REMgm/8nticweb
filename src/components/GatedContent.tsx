// Passthrough - no auth gating
export default function GatedContent({ children }: { children: React.ReactNode; fallbackMessage?: string; blurIntensity?: number }) {
  return <>{children}</>;
}
