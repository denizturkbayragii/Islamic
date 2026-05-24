const BASE = 'https://api.alquran.cloud/v1';

export interface SurahListItem {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
}

export async function fetchSurahList(edition = 'en'): Promise<SurahListItem[]> {
  const res = await fetch(`${BASE}/surah`);
  const json = await res.json();
  return json.data ?? [];
}

export async function fetchSurah(
  surahNumber: number,
  edition = 'en.sahih'
): Promise<{ ayahs: Ayah[]; surah: SurahListItem }> {
  const res = await fetch(`${BASE}/surah/${surahNumber}/${edition}`);
  const json = await res.json();
  return {
    surah: json.data,
    ayahs: (json.data?.ayahs ?? []).map((a: { number: number; text: string; numberInSurah: number }) => ({
      number: a.number,
      text: a.text,
      numberInSurah: a.numberInSurah,
    })),
  };
}

export async function searchQuran(query: string, edition = 'en'): Promise<string[]> {
  const res = await fetch(`${BASE}/search/${encodeURIComponent(query)}/all/${edition}`);
  const json = await res.json();
  return (json.data?.matches ?? []).slice(0, 20).map(
    (m: { surah: { englishName: string }; numberInSurah: number }) =>
      `${m.surah.englishName} ${m.numberInSurah}`
  );
}
