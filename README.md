# Tomo Pet Offline (Flutter)

A fully offline Talking Tom–style virtual pet MVP that runs entirely on-device (Android-first).

## Features
- 2D animated pet (idle breathing + blinking) and touch interactions.
- Offline voice repeat: records from mic and replays with a funny high-pitch-like effect (higher playback rate).
- Needs loop: hunger, energy, happiness decay over time with local timers.
- Feed/sleep interactions and touch reaction boosts.
- Mini game: tap-to-earn coins.
- Coin economy for feeding/customizations.
- Customization: pet color + crown accessory.
- Local persistence via SQLite (stats, coins, customizations, sleep state).
- Single main UI with bottom navigation: Home / Food / Game / Shop.

## Tech Stack
- Flutter + Dart
- State management: `provider`
- Local DB: `sqflite`
- Local audio: `record` + `audioplayers`
- No APIs, no backend, no internet dependency for runtime features.

## Project Structure
```
lib/
  main.dart
  src/
    app/
      app.dart                  # App shell + main screen + nav tabs
    core/
      database.dart             # SQLite setup
    features/
      audio/logic/
        voice_controller.dart   # Record + funny playback
      pet/
        data/pet_repository.dart
        domain/pet_state.dart
        logic/pet_controller.dart
        presentation/widgets/pet_character.dart
assets/
  placeholders/
```

## Run Locally
1. Install Flutter SDK (stable channel) and Android Studio tooling.
2. From project root:
   ```bash
   flutter pub get
   flutter run -d android
   ```
3. Grant microphone permission when prompted.

## Notes
- iOS support can be added later by wiring iOS microphone permission in `Info.plist`.
- You can replace the custom-painted character with sprite sheets in `assets/` while keeping the same architecture.
