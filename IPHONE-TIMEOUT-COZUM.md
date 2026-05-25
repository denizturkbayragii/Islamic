# iPhone "Request timed out" — Kesin Çözüm Rehberi

## Expo email / şifre soruyor — Gerekli mi?

| Mod | Hesap gerekir mi? |
|-----|-------------------|
| **LAN / hotspot** (`baslat-iphone.bat`) | **HAYIR** — ücretsiz, giriş yok |
| **Tunnel** (`baslat-tunnel.bat`) | **EVET** — çoğu zaman Expo hesabı ister |
| **Web** (`w` tuşu) | Bazen hesap veya ek paket ister |

**Timeout + giriş sorunu birlikte:** Tunnel kullanıyorsanız ve giriş yapmadıysanız tunnel düzgün açılmaz → timeout normaldir.

**Çözüm:** Tunnel kullanmayın. `baslat-iphone.bat` + laptop hotspot + manuel URL yeterli; **Expo hesabı şart değil**.

İsterseniz ücretsiz hesap: https://expo.dev/signup → sonra `npx expo login`

---

## Asıl sorunlar (sizin durumunuzda)

1. **Yanlış IP** — Daha önce `192.168.1.6` (Ethernet) yazılmıştı. Laptop sadece WiFi kullanıyorsa doğru adres: **`192.168.1.5`**
2. **Tunnel hiç başlamamış** — Port 8081 meşgul olduğu için `npx expo start --tunnel` sunucuyu **atladı** (Skipping dev server)
3. **`@expo/ngrok` eksikti** — Tunnel modu için gerekli paket yüklendi

---

## YÖNTEM A — En güvenilir: Laptop hotspot (önerilen)

Router cihazları birbirinden izole ediyorsa LAN/Tunnel çalışmaz. Hotspot bunu çözer.

### Adımlar

1. **Windows:** Ayarlar → Ağ ve İnternet → **Mobil hotspot** → Aç
2. **iPhone:** Ayarlar → Wi‑Fi → Laptop hotspot ağına bağlan
3. Laptop’ta **`baslat-iphone.bat`** dosyasına çift tıkla (veya sağ tık → Yönetici değil, normal çalıştır)
4. Siyah pencerede yazan adresi kullan:
   ```
   exp://192.168.1.5:8081
   ```
   (Hotspot’ta IP farklıysa penceredeki adresi kullanın)
5. **iPhone Expo Go** → **Enter URL manually** → yapıştır → Connect

> QR kod hotspot ile de çalışır; timeout alırsanız mutlaka manuel URL deneyin.

---

## YÖNTEM B — Tunnel (düzgün başlatma)

1. Tüm Expo/terminal pencerelerini kapat
2. **`baslat-tunnel.bat`** dosyasına çift tıkla
3. Terminalde **`Tunnel ready`** veya **`Tunnel connected`** yazısını **görmeden** QR okutma (1–2 dk sürebilir)
4. Yeni QR kodu Expo Go ile okut

Tunnel başlamazsa terminalde hata mesajını not alın.

---

## YÖNTEM C — Aynı WiFi (mevcut ağ)

1. **`firewall-izin-ver.bat`** → Yönetici olarak çalıştır (bir kez)
2. **`baslat-iphone.bat`** çalıştır
3. Expo Go → **Enter URL manually**:
   ```
   exp://192.168.1.5:8081
   ```

### iPhone ayarları
- **Ayarlar → Gizlilik → Yerel Ağ** → **Expo Go** açık olsun
- VPN kapalı
- Mobil veri kapalı (sadece WiFi)

### Router
Modem arayüzünde **AP Isolation / Client Isolation** varsa **kapatın**.

---

## Hâlâ olmuyorsa: Web önizleme (geçici)

Telefonda Safari’de test için (tüm özellikler çalışmaz):

```powershell
cd C:\Users\PC\Desktop\Islamic
npx expo install react-native-web react-dom @expo/metro-runtime
npx expo start --web
```

---

## Özet

| Deneme | Ne yapın |
|--------|----------|
| 1 | Laptop **mobil hotspot** + `baslat-iphone.bat` + manuel `exp://...` |
| 2 | `baslat-tunnel.bat` → "Tunnel ready" bekle → QR |
| 3 | Manuel URL: `exp://192.168.1.5:8081` |

Sorun sürücü veya SDK değil; **telefon bilgisayara ağ üzerinden ulaşamıyor**.
