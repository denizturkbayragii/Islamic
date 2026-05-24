import type { EducationTopic } from '../types';

export const EDUCATION_TOPICS: EducationTopic[] = [
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
];
