import { useState } from 'react';
import { Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

interface GatedContentProps {
  children: React.ReactNode;
  fallbackMessage?: string;
  blurIntensity?: number;
}

export default function GatedContent({
  children,
  fallbackMessage = 'Sign in to access the full research content',
  blurIntensity = 8,
}: GatedContentProps) {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (loading) return <>{children}</>;

  if (user) return <>{children}</>;

  return (
    <div className="relative">
      {/* Blurred content preview */}
      <div
        className="select-none pointer-events-none"
        style={{ filter: `blur(${blurIntensity}px)` }}
        aria-hidden="true"
      >
        {children}
      </div>

      {/* Overlay CTA */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="glass-panel p-6 text-center max-w-sm mx-4">
          <div className="w-10 h-10 rounded-full bg-8ntic-accent/20 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-5 h-5 text-8ntic-accent" />
          </div>
          <p className="text-sm text-8ntic-text-secondary mb-4">{fallbackMessage}</p>
          <button
            onClick={() => setShowAuth(true)}
            className="btn-primary text-sm"
          >
            Unlock content
          </button>
        </div>
      </div>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} defaultMode="signup" />
    </div>
  );
}
