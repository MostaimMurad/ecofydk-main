import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, isLoading, isRoleLoading, isAdmin } = useAuth();
  const navigate = useNavigate();

  // ── DEV BYPASS: skip auth in local development ──────────────────
  // import.meta.env.DEV is true only in Vite dev mode (npm run dev)
  // In production builds (npm run build), this is always false
  // ⚠️  Remove or set VITE_DISABLE_AUTH=false before going live
  const devBypass = import.meta.env.DEV;

  useEffect(() => {
    if (devBypass) return; // skip redirects in dev
    if (!isLoading && !isRoleLoading) {
      if (!user) {
        navigate('/auth');
      } else if (requireAdmin && !isAdmin) {
        navigate('/');
      }
    }
  }, [user, isLoading, isRoleLoading, isAdmin, requireAdmin, navigate, devBypass]);

  if (devBypass) {
    return <>{children}</>;
  }

  if (isLoading || isRoleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || (requireAdmin && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
