import type { AppLanguage } from '../types';

export interface LocalizedEducationTopic {
  id: string;
  title: string;
  summary: string;
  perspectives: { sect: string; approach: string }[];
}

const topics: Record<AppLanguage, LocalizedEducationTopic[]> = {
  en: [
    {
      id: 'prayer-validity',
      title: 'Conditions of Valid Prayer',
      summary: 'Core requirements for salah across schools of thought, with emphasis on intention, purity, and proper performance.',
      perspectives: [
        { sect: 'Hanafi', approach: 'Emphasizes fard elements; certain actions are wajib vs sunnah with distinct rulings on mistakes.' },
        { sect: "Shafi'i", approach: 'Structured pillars (arkan) and obligatory acts (wajibat); detailed rules on forgetfulness (sahw).' },
        { sect: "Ja'fari", approach: 'Similar pillars with specific rulings on turbah, times, and combined prayers under conditions.' },
      ],
    },
    {
      id: 'zakat-differences',
      title: 'Zakat: Nisab and Eligible Wealth',
      summary: 'How different scholars calculate nisab thresholds and which assets are zakatable.',
      perspectives: [
        { sect: 'Majority (Sunni)', approach: '2.5% on qualifying surplus wealth held for one lunar year; gold/silver nisab benchmarks.' },
        { sect: 'Contemporary fiqh councils', approach: 'Extended zakatable items may include certain stocks and business inventory with conditions.' },
        { sect: "Ja'fari", approach: 'Khums (one-fifth) applies to certain surplus categories in addition to specific zakat rules.' },
      ],
    },
    {
      id: 'fasting-ramadan',
      title: 'Fasting in Ramadan',
      summary: 'Shared foundations of fasting with differences in moon sighting and exemption rulings.',
      perspectives: [
        { sect: 'Local sighting', approach: 'Moon must be sighted locally or regionally per many classical opinions.' },
        { sect: 'Calculation / global', approach: 'Some communities follow fixed calendars or broader regional announcements.' },
        { sect: 'Medical exemptions', approach: 'All agree on illness and travel concessions; make-up (qada) vs fidya details vary by madhab.' },
      ],
    },
    {
      id: 'halal-food',
      title: 'Halal Food Standards',
      summary: 'Principles of permissible food and contemporary certification challenges.',
      perspectives: [
        { sect: 'Quranic principles', approach: 'Prohibition of pork, carrion, blood, and improperly slaughtered animals; alcohol in ingredients.' },
        { sect: 'Certification bodies', approach: 'Different standards for mechanical slaughter, stunning, and cross-contamination.' },
        { sect: 'Minority communities', approach: 'Practical guidance: vegetarian options, seafood, and verified halal labels when traveling.' },
      ],
    },
    {
      id: 'interest-finance',
      title: 'Islamic Finance & Interest',
      summary: 'Riba (usury) prohibitions and modern financial instruments.',
      perspectives: [
        { sect: 'Classical', approach: 'Broad prohibition of riba in loan contracts; trade and profit-sharing preferred.' },
        { sect: 'Modern banks', approach: 'Islamic windows, sukuk, murabaha — scholarly debate on equivalence to conventional products.' },
        { sect: 'Personal practice', approach: 'Scholars differ on mortgages, student loans, and pension funds in non-Muslim countries.' },
      ],
    },
  ],
  tr: [
    {
      id: 'prayer-validity',
      title: 'Geçerli Namazın Şartları',
      summary: 'Farklı mezheplerde namazın temel şartları; niyet, temizlik ve doğru kılınış üzerine.',
      perspectives: [
        { sect: 'Hanefi', approach: 'Farz unsurlara vurgu; bazı fiiller vacip veya sünnet olarak ayrılır, hata hükümleri farklıdır.' },
        { sect: 'Şafii', approach: 'Arkan ve vacipler sistematik; unutma (sehiv) kuralları ayrıntılıdır.' },
        { sect: 'Caferi', approach: 'Benzer rükünler; turbeye, vakitlere ve birleştirilmiş namaza özgü hükümler vardır.' },
      ],
    },
    {
      id: 'zakat-differences',
      title: 'Zekât: Nisab ve Zekât Malı',
      summary: 'Nisab eşiği ve zekâta tabi malın farklı alimlere göre hesaplanması.',
      perspectives: [
        { sect: 'Sünni çoğunluk', approach: 'Bir yıl üzerinde kalan fazla malın %2,5\'i; altın/gümüş nisab ölçütleri.' },
        { sect: 'Güncel fetva kurulları', approach: 'Belirli hisse senetleri ve ticari emtia şartlarla zekâta dahil edilebilir.' },
        { sect: 'Caferi', approach: 'Hums (beşte bir) bazı fazlalık türlerinde zekâttan ayrı hükümlere tabidir.' },
      ],
    },
    {
      id: 'fasting-ramadan',
      title: 'Ramazan Orucu',
      summary: 'Orucun ortak esasları; hilal görme ve mazeret hükümlerindeki farklar.',
      perspectives: [
        { sect: 'Yerel görme', approach: 'Birçok klasik görüşe göre hilalin yerel veya bölgesel görülmesi gerekir.' },
        { sect: 'Hesap / küresel', approach: 'Bazı topluluklar sabit takvim veya geniş bölgesel ilanları takip eder.' },
        { sect: 'Sağlık mazereti', approach: 'Hastalık ve yolculukta ruhsat ortaktır; kaza ve fidye ayrıntıları mezhebe göre değişir.' },
      ],
    },
    {
      id: 'halal-food',
      title: 'Helal Gıda Standartları',
      summary: 'Helal gıdanın ilkeleri ve günümüz sertifikasyon zorlukları.',
      perspectives: [
        { sect: 'Kur\'anî ilkeler', approach: 'Domuz, leş, kan ve usulsüz kesim yasağı; içerikte alkol.' },
        { sect: 'Sertifikasyon kuruluşları', approach: 'Mekanik kesim, sersemletme ve çapraz bulaşma standartları farklıdır.' },
        { sect: 'Azınlık toplulukları', approach: 'Pratik rehber: vejetaryen, deniz ürünleri ve doğrulanmış helal etiketler.' },
      ],
    },
    {
      id: 'interest-finance',
      title: 'İslami Finans ve Faiz',
      summary: 'Riba yasağı ve modern finans araçları.',
      perspectives: [
        { sect: 'Klasik', approach: 'Kredi sözleşmelerinde ribanın geniş yasağı; alışveriş ve ortaklık tercih edilir.' },
        { sect: 'Modern bankacılık', approach: 'İslami pencere, sukuk, murabaha — konvansiyonel ürünlere denklik tartışmalıdır.' },
        { sect: 'Kişisel uygulama', approach: 'İpotek, öğrenim kredisi ve emeklilik fonlarında alimler farklı görüştedir.' },
      ],
    },
  ],
};

export function getEducationTopics(lang: AppLanguage): LocalizedEducationTopic[] {
  return topics[lang] ?? topics.en;
}
