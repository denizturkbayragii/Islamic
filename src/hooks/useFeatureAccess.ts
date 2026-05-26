import { isGuestFeatureAllowed } from '../config/featureAccess';
import { useAuth } from '../context/AuthContext';
import type { HomeFeatureId } from '../types';

export function useFeatureAccess() {
  const { isGuest } = useAuth();

  const canAccess = (featureId: HomeFeatureId | string) => isGuestFeatureAllowed(featureId, isGuest);

  return { isGuest, canAccess };
}
