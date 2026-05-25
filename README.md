# Islamic

A comprehensive mobile companion app that consolidates prayer times, Quran & Hadith, Qibla, nearby mosques, halal dining, spiritual habits, Islamic calendar, education, and Zakat/Sadaqa tools into one experience.

Built with **React Native** and **Expo SDK 54** (iOS & Android).

## Features

| Module | Description |
|--------|-------------|
| **Prayer Times** | Location-based times via the `adhan` library; 12 calculation methods; Hanafi/Shafi Asr |
| **Notifications** | Per-prayer enable/disable, custom sounds, disable specific weekdays |
| **Quran** | Full surah list via [Al Quran Cloud API](https://alquran.cloud) with multiple translations |
| **Hadith** | Collections filtered by sect preference (Sunni/Shia/neutral); ready for API integration |
| **Qibla** | Compass + bearing to Kaaba using device magnetometer |
| **Nearby Places** | Mosques, prayer rooms, halal restaurants via OpenStreetMap Overpass |
| **Tasbih** | Digital dhikr counter with haptic feedback and lifetime total |
| **Islamic Calendar** | Hijri date conversion and upcoming events |
| **Education** | Multi-perspective topics for all sects |
| **Spiritual Habits** | Track daily worship goals locally |
| **Zakat & Sadaqa** | Wealth-based Zakat estimator and charity planner |
| **Settings** | Language, madhab, calculation method, dark mode, sect content filter |

## Prerequisites

1. Install [Node.js LTS](https://nodejs.org/) (includes npm)
2. Install [Expo Go](https://expo.dev/go) on your phone, or Android Studio / Xcode for emulators

## Setup

```bash
cd Islamic
npm install
npx expo start
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS).

## Project Structure

```
Islamic/
├── App.tsx                 # Root component
├── src/
│   ├── components/         # Reusable UI
│   ├── constants/          # Theme, defaults
│   ├── context/            # Global app state
│   ├── data/               # Education content
│   ├── navigation/         # Tab + stack navigators
│   ├── screens/            # Feature screens
│   ├── services/           # Prayer, Qibla, APIs, storage
│   └── types/              # TypeScript definitions
└── assets/                 # Icons, sounds (see assets/README.md)
```

## Configuration

- **Prayer calculation**: Settings → Calculation method (MWL, ISNA, Umm al-Qura, etc.)
- **Madhab**: Affects Asr shadow length (Hanafi vs standard)
- **Notifications**: Home → Prayer Notifications; tap day chips to mute specific weekdays
- **Hadith API**: Replace sample data in `HadithScreen.tsx` with [sunnah.com API](https://sunnah.com) or similar

## Production Checklist

- [ ] Add app icons and adhan sound files under `assets/`
- [ ] Configure EAS Build (`eas build:configure`)
- [ ] Replace Overpass demo fallback with Google Places API key for dense halal data
- [ ] Integrate full Hadith database
- [ ] Add privacy policy for location & notification permissions
- [ ] Test notifications on physical devices (simulators are limited)

## Tech Stack

- React Native 0.76 + Expo 52
- TypeScript
- `adhan` — prayer time calculations
- `hijri-converter` — Islamic calendar
- `@react-navigation` — navigation
- `@react-native-async-storage/async-storage` — local persistence
- `expo-location`, `expo-notifications`, `expo-sensors`

## License

Private project — all rights reserved unless otherwise specified.
