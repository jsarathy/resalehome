import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

/**
 * Works in two modes:
 *  1. Wrapper:      <RequireAuth><SomePage /></RequireAuth>
 *  2. Layout route: <Route element={<RequireAuth roles={[...]} />}>
 *                     <Route ... />
 *                   </Route>
 *     — renders <Outlet /> on pass (no children prop).
 */
export default function RequireAuth({ children, roles }) {
  const { user, userProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner fullPage />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && userProfile && !roles.includes(userProfile.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ?? <Outlet />;
}
