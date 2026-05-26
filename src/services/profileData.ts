import { getJson, setJson } from './storage';

/** Scope habits, stats, tasbih, reading progress per family profile */
export function profileScopeKey(baseKey: string, activeFamilyMemberId: string | null): string {
  const suffix = activeFamilyMemberId ?? 'account';
  return `${baseKey}::${suffix}`;
}

export async function getProfileJson<T>(
  baseKey: string,
  activeFamilyMemberId: string | null,
  fallback: T
): Promise<T> {
  return getJson(profileScopeKey(baseKey, activeFamilyMemberId), fallback);
}

export async function setProfileJson<T>(
  baseKey: string,
  activeFamilyMemberId: string | null,
  value: T
): Promise<void> {
  await setJson(profileScopeKey(baseKey, activeFamilyMemberId), value);
}
