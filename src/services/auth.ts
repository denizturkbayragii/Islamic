import * as Crypto from 'expo-crypto';
import type { AuthSession, StoredAuthUser } from '../types';
import { getJson, setJson, storageKeys } from './storage';

const USERS_KEY = '@islamic/auth/users';
const SESSION_KEY = storageKeys.authSession;

async function hashPassword(password: string, salt: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${password}`);
}

function pseudonymFromEmail(email: string): string {
  const [local, domain] = email.trim().toLowerCase().split('@');
  if (!domain) return 'user';
  const masked = local.length <= 2 ? '••' : `${local[0]}•••${local.slice(-1)}`;
  return `${masked}@${domain}`;
}

async function hashEmail(email: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, email.trim().toLowerCase());
}

async function loadUsers(): Promise<StoredAuthUser[]> {
  return getJson<StoredAuthUser[]>(USERS_KEY, []);
}

async function saveUsers(users: StoredAuthUser[]): Promise<void> {
  await setJson(USERS_KEY, users);
}

export async function getAuthSession(): Promise<AuthSession | null> {
  return getJson<AuthSession | null>(SESSION_KEY, null);
}

export async function setAuthSession(session: AuthSession | null): Promise<void> {
  await setJson(SESSION_KEY, session);
}

export async function registerUser(email: string, password: string): Promise<{ ok: true; session: AuthSession } | { ok: false; error: string }> {
  const normalized = email.trim().toLowerCase();
  if (!normalized.includes('@') || password.length < 6) {
    return { ok: false, error: 'invalid' };
  }
  const emailHash = await hashEmail(normalized);
  const users = await loadUsers();
  if (users.some((u) => u.emailHash === emailHash)) {
    return { ok: false, error: 'exists' };
  }
  const salt = Crypto.randomUUID();
  const passwordHash = await hashPassword(password, salt);
  const user: StoredAuthUser = {
    id: Crypto.randomUUID(),
    emailHash,
    passwordHash,
    salt,
    pseudonym: pseudonymFromEmail(normalized),
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  await saveUsers(users);
  const session: AuthSession = { userId: user.id, isGuest: false, pseudonym: user.pseudonym };
  await setAuthSession(session);
  return { ok: true, session };
}

export async function loginUser(email: string, password: string): Promise<{ ok: true; session: AuthSession } | { ok: false; error: string }> {
  const emailHash = await hashEmail(email);
  const users = await loadUsers();
  const user = users.find((u) => u.emailHash === emailHash);
  if (!user) return { ok: false, error: 'not_found' };
  const passwordHash = await hashPassword(password, user.salt);
  if (passwordHash !== user.passwordHash) return { ok: false, error: 'wrong_password' };
  const session: AuthSession = { userId: user.id, isGuest: false, pseudonym: user.pseudonym };
  await setAuthSession(session);
  return { ok: true, session };
}

export async function continueAsGuest(): Promise<AuthSession> {
  const session: AuthSession = {
    userId: `guest-${Crypto.randomUUID()}`,
    isGuest: true,
    pseudonym: 'Guest',
  };
  await setAuthSession(session);
  return session;
}

export async function logoutUser(): Promise<void> {
  await setAuthSession(null);
}
