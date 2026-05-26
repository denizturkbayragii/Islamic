import type { AppLanguage } from '../types';

interface KnowledgeEntry {
  keywords: string[];
  en: string;
  tr: string;
}

const KNOWLEDGE: KnowledgeEntry[] = [
  {
    keywords: ['fajr', 'imsak', 'morning prayer'],
    en: 'Fajr is the dawn prayer, performed before sunrise. It has two rakahs in Sunnah and is one of the five pillars of daily worship.',
    tr: 'İmsak (fecr) namazı, güneş doğmadan önce kılınan sabah namazıdır. Sünnette iki rekattır ve günlük ibadetin temel vakitlerindendir.',
  },
  {
    keywords: ['zakat', 'zekat', 'nisab'],
    en: 'Zakat is 2.5% of qualifying wealth held for one lunar year above nisab. Use the Zakat calculator in the app and consult a scholar for your case.',
    tr: 'Zekât, nisab üzerinde bir yıl bekleyen malın %2,5\'idir. Uygulamadaki hesaplayıcıyı kullanın; kişisel durumunuz için ehil alime danışın.',
  },
  {
    keywords: ['qibla', 'kıble', 'direction'],
    en: 'Qibla is the direction toward the Kaaba in Makkah. Use the Qibla screen with location enabled and rotate your phone until the needle aligns.',
    tr: 'Kıble, Kâbe yönüdür. Konumu açıp Kıble ekranında telefonu düz tutarak altın ibreyi üst yöne getirin.',
  },
  {
    keywords: ['dua', 'dualar', 'supplication'],
    en: 'Duas are personal supplications. Browse Duas & Adhkar in the app for Arabic text, translation, and optional audio recitation.',
    tr: 'Dualar kişisel niyazlardır. Arapça metin, meal ve sesli okuma için uygulamadaki Dualar bölümüne bakın.',
  },
  {
    keywords: ['ramadan', 'ramazan', 'fast', 'oruç'],
    en: 'Fasting in Ramadan is obligatory for able Muslims. Suhoor before Fajr and Iftar at Maghrib; consult local moon sighting for dates.',
    tr: 'Ramazan orucu gücü yeten Müslümanlara farzdır. İmsaktan önce sahur, akşam ezanıyla iftar; tarihler için yerel hilal görüşüne bakın.',
  },
  {
    keywords: ['hadith', 'hadis', 'sunnah'],
    en: 'Hadith are narrations about the Prophet ﷺ. The app offers sample collections; verify authenticity with qualified scholars for rulings.',
    tr: 'Hadisler Peygamber Efendimiz ﷺ hakkındaki rivayetlerdir. Uygulamada örnek koleksiyonlar var; hüküm için ehil alimlere danışın.',
  },
  {
    keywords: ['family', 'aile', 'child'],
    en: 'Family Mode lets each member track habits separately. Enable it in Settings and add profiles for parents and children.',
    tr: 'Aile Modu her üyenin alışkanlıklarını ayrı takip etmesini sağlar. Ayarlardan açın ve profil ekleyin.',
  },
  {
    keywords: ['reminder', 'bildirim', 'notification', 'hatırlat'],
    en: 'Advanced Reminders support custom dhikr, dua, and Quran times per weekday. Open Advanced Reminders from Home or Notifications.',
    tr: 'Gelişmiş hatırlatıcılar haftanın günlerine göre zikir, dua ve Kur\'an saati eklemenizi sağlar. Ana sayfa veya Bildirimlerden açın.',
  },
  {
    keywords: ['home', 'launcher', 'ana ekran', 'customize', 'özelleştir', 'app icon'],
    en: 'Tap Edit on the home screen to add, remove, and reorder apps like an iPhone home screen. Widget and prayer times are modules you can place or remove.',
    tr: 'Ana ekranda Düzenle ile iPhone gibi uygulama ekleyip kaldırabilir ve sıralayabilirsiniz. Widget ve namaz vakitleri de modül olarak eklenir.',
  },
  {
    keywords: ['bookmark', 'yer imi', 'continue', 'kaldığım', 'progress', 'ilerleme'],
    en: 'Quran and Hadith reading progress is saved per profile. Use the bookmark icon while reading; Continue reading appears on Home.',
    tr: 'Kur\'an ve hadis ilerlemesi profile göre kaydedilir. Okurken yer imi kullanın; Ana sayfada okumaya devam görünür.',
  },
  {
    keywords: ['sign in', 'register', 'guest', 'giriş', 'üye', 'misafir'],
    en: 'Create an account or continue as guest. Guest mode locks premium features — see src/config/featureAccess.ts to change which features require login.',
    tr: 'Hesap oluşturun veya misafir devam edin. Misafir modunda premium özellikler kilitlidir — hangi özelliklerin kilitli olduğu src/config/featureAccess.ts dosyasından değiştirilir.',
  },
];

const GREETING = {
  en: 'Assalamu alaikum! I am your Islamic companion assistant. Ask about prayer, zakat, duas, Qibla, Ramadan, or app features. I provide general guidance — not personal fatwa.',
  tr: 'Selamün aleyküm! İslami yol arkadaşınız asistanıyım. Namaz, zekât, dualar, kıble, Ramazan veya uygulama özellikleri hakkında sorun. Genel bilgi veririm — kişisel fetva değildir.',
};

export function getAIWelcome(lang: AppLanguage): string {
  return GREETING[lang];
}

export function askAI(question: string, lang: AppLanguage): string {
  const q = question.toLowerCase().trim();
  if (!q) return lang === 'tr' ? 'Lütfen bir soru yazın.' : 'Please type a question.';

  for (const entry of KNOWLEDGE) {
    if (entry.keywords.some((k) => q.includes(k.toLowerCase()))) {
      return lang === 'tr' ? entry.tr : entry.en;
    }
  }

  const fallback = {
    en: 'I could not find a specific answer. Try asking about prayer times, zakat, Qibla, duas, or how to use Family Mode and Advanced Reminders. For personal rulings, please consult a qualified scholar.',
    tr: 'Belirli bir cevap bulamadım. Namaz vakitleri, zekât, kıble, dualar veya Aile Modu ve Gelişmiş Hatırlatıcılar hakkında sorun. Kişisel hüküm için lütfen ehil bir alime danışın.',
  };
  return fallback[lang];
}
