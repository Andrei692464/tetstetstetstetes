# MateNova APK Edition — Ghid de compilare .apk

Acest pachet conține proiectul Android complet pentru aplicația **MateNova — matematică pentru clasa a V-a**, cu toate cele 18 fișiere ale site-ului incluse în `app/src/main/assets/www/`.

## Metoda 1 — Fără Android Studio (prin GitHub Actions, 2 minute)
1. Creează un repository nou pe GitHub (gratuit).
2. Încarcă toate fișierele din această arhivă în repository.
3. Deschide tab-ul **Actions** din GitHub și rulează workflow-ul **Build MateNova APK** (sau se pornește automat la push).
4. La final, descarcă **MateNova-APK-Edition-v1.0** din secțiunea **Artifacts** — înăuntru ai fișierul `app-debug.apk` gata de instalat pe telefonul Android.

## Metoda 2 — Cu Android Studio (pe PC)
1. Deschide acest folder în **Android Studio**.
2. Așteaptă sincronizarea Gradle.
3. Din meniu apasă **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
4. Vei găsi fișierul compilat în `app/build/outputs/apk/debug/app-debug.apk`.
