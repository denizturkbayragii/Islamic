import { toHijri, toGregorian } from 'hijri-converter';

export interface HijriDate {
  day: number;
  month: number;
  monthName: string;
  year: number;
  formatted: string;
}

const HIJRI_MONTHS = [
  'Muharram',
  'Safar',
  "Rabi' al-awwal",
  "Rabi' al-thani",
  'Jumada al-awwal',
  'Jumada al-thani',
  'Rajab',
  "Sha'ban",
  'Ramadan',
  'Shawwal',
  "Dhu al-Qi'dah",
  'Dhu al-Hijjah',
];

const ISLAMIC_EVENTS: { hijriMonth: number; hijriDay: number; name: string }[] = [
  { hijriMonth: 1, hijriDay: 1, name: 'Islamic New Year' },
  { hijriMonth: 1, hijriDay: 10, name: 'Day of Ashura' },
  { hijriMonth: 3, hijriDay: 12, name: "Mawlid an-Nabi" },
  { hijriMonth: 7, hijriDay: 27, name: "Laylat al-Mi'raj" },
  { hijriMonth: 8, hijriDay: 15, name: "Laylat al-Bara'ah" },
  { hijriMonth: 9, hijriDay: 1, name: 'Start of Ramadan' },
  { hijriMonth: 9, hijriDay: 27, name: 'Laylat al-Qadr (commonly observed)' },
  { hijriMonth: 10, hijriDay: 1, name: 'Eid al-Fitr' },
  { hijriMonth: 12, hijriDay: 10, name: 'Eid al-Adha' },
];

export function gregorianToHijri(date: Date): HijriDate {
  const h = toHijri(date.getFullYear(), date.getMonth() + 1, date.getDate());
  return {
    day: h.hd,
    month: h.hm,
    monthName: HIJRI_MONTHS[h.hm - 1] ?? '',
    year: h.hy,
    formatted: `${h.hd} ${HIJRI_MONTHS[h.hm - 1]} ${h.hy} AH`,
  };
}

export function hijriToGregorian(hy: number, hm: number, hd: number): Date {
  const g = toGregorian(hy, hm, hd);
  return new Date(g.gy, g.gm - 1, g.gd);
}

export function getUpcomingIslamicEvents(fromDate = new Date(), count = 6) {
  const hijri = gregorianToHijri(fromDate);
  return ISLAMIC_EVENTS.map((e) => ({
    ...e,
    hijriLabel: `${e.hijriDay} ${HIJRI_MONTHS[e.hijriMonth - 1]}`,
    passedThisYear: e.hijriMonth < hijri.month || (e.hijriMonth === hijri.month && e.hijriDay < hijri.day),
  }))
    .sort((a, b) => a.hijriMonth - b.hijriMonth || a.hijriDay - b.hijriDay)
    .slice(0, count);
}

export { HIJRI_MONTHS };
