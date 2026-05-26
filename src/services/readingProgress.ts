import type { HadithProgress, QuranBookmark, QuranProgress } from '../types';
import { getProfileJson, setProfileJson } from './profileData';
import { storageKeys } from './storage';

const emptyQuran: QuranProgress = { lastRead: null, bookmarks: [] };
const emptyHadith: HadithProgress = { lastRead: null, bookmarks: [] };

export async function loadQuranProgress(memberId: string | null): Promise<QuranProgress> {
  return getProfileJson(storageKeys.quranProgress, memberId, emptyQuran);
}

export async function saveQuranProgress(memberId: string | null, data: QuranProgress): Promise<void> {
  await setProfileJson(storageKeys.quranProgress, memberId, data);
}

export async function updateQuranLastRead(
  memberId: string | null,
  surahNumber: number,
  edition: string,
  surahName: string,
  ayahNumber: number
): Promise<QuranProgress> {
  const current = await loadQuranProgress(memberId);
  const next: QuranProgress = {
    ...current,
    lastRead: {
      surahNumber,
      edition,
      surahName,
      ayahNumber,
      updatedAt: new Date().toISOString(),
    },
  };
  await saveQuranProgress(memberId, next);
  return next;
}

export async function addQuranBookmark(
  memberId: string | null,
  bookmark: Omit<QuranBookmark, 'id' | 'createdAt'>
): Promise<QuranProgress> {
  const current = await loadQuranProgress(memberId);
  const entry: QuranBookmark = {
    ...bookmark,
    id: `bm-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const next: QuranProgress = {
    ...current,
    bookmarks: [entry, ...current.bookmarks.filter((b) => b.ayahNumber !== bookmark.ayahNumber || b.surahNumber !== bookmark.surahNumber)].slice(0, 50),
  };
  await saveQuranProgress(memberId, next);
  return next;
}

export async function loadHadithProgress(memberId: string | null): Promise<HadithProgress> {
  return getProfileJson(storageKeys.hadithProgress, memberId, emptyHadith);
}

export async function saveHadithProgress(memberId: string | null, data: HadithProgress): Promise<void> {
  await setProfileJson(storageKeys.hadithProgress, memberId, data);
}

export async function updateHadithLastRead(
  memberId: string | null,
  collectionId: string,
  collectionName: string,
  itemIndex: number
): Promise<HadithProgress> {
  const current = await loadHadithProgress(memberId);
  const next: HadithProgress = {
    ...current,
    lastRead: {
      collectionId,
      collectionName,
      itemIndex,
      updatedAt: new Date().toISOString(),
    },
  };
  await saveHadithProgress(memberId, next);
  return next;
}

export async function addHadithBookmark(
  memberId: string | null,
  collectionId: string,
  collectionName: string,
  itemIndex: number,
  label: string
): Promise<HadithProgress> {
  const current = await loadHadithProgress(memberId);
  const entry = {
    id: `hbm-${Date.now()}`,
    collectionId,
    collectionName,
    itemIndex,
    label,
    createdAt: new Date().toISOString(),
  };
  const next: HadithProgress = {
    ...current,
    bookmarks: [entry, ...current.bookmarks.filter((b) => !(b.collectionId === collectionId && b.itemIndex === itemIndex))].slice(0, 50),
  };
  await saveHadithProgress(memberId, next);
  return next;
}
