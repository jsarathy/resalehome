import { useAuthContext } from '../context/AuthContext';

export function useAuth() {
  const { user, userProfile, loading, refreshProfile } = useAuthContext();
  return {
    user,
    userProfile,
    loading,
    refreshProfile,
    role: userProfile?.role ?? null,
    isAdmin:  userProfile?.role === 'admin',
    isRM:     userProfile?.role === 'rm',
    isSeller: userProfile?.role === 'seller',
    isBuyer:  userProfile?.role === 'buyer',
  };
}
