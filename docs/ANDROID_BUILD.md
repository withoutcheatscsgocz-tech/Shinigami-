# Building the Android APK

The Capacitor Android project lives in `android/` and is already wired up with
the three native plugins the game uses (`@capacitor/device` for the real
battery, `@capacitor/preferences` for the save, `@capacitor/haptics` for
vibration).

> The APK was **not** assembled in the CI/dev container used to build this repo,
> because that environment has **no Android SDK** and no network access to the
> Gradle/Maven repositories. Everything below has been verified up to the point
> where the SDK is required. On any machine with Android Studio (or a command
> line SDK) it builds normally.

## Prerequisites

- Node 18+ and `npm install` already run.
- **JDK 17+** (the container has JDK 21 — fine).
- **Android SDK** with platform `android-34` and build-tools, plus
  `ANDROID_HOME` (or `ANDROID_SDK_ROOT`) pointing at it. Easiest via Android
  Studio → SDK Manager. For headless setups, create
  `android/local.properties` with:

  ```properties
  sdk.dir=/path/to/Android/sdk
  ```

## Build steps

```bash
# 1. Build the web app and copy it into the native project
npm run build
npx cap sync android      # (npm run cap:sync)

# 2a. Debug APK (no signing needed)
cd android
./gradlew assembleDebug
# -> android/app/build/outputs/apk/debug/app-debug.apk

# 2b. Or open in Android Studio to run on a device/emulator
npx cap open android      # (npm run cap:open)
```

## Verifying the real clock & battery

The status bar clock ticks from the device clock (`Date`, updated every second),
and the battery reads from `Device.getBatteryInfo()` on device, falling back to
the web Battery Status API in a browser. To verify on an emulator:

- Change the emulator's time → the status-bar/lock-screen clock follows.
- Use the emulator's Extended Controls → Battery to change level / toggle
  charging → the status-bar battery icon and Settings → Battery update (native
  polls every 30s; force a re-read by reopening the app).

If neither source is available (e.g. a desktop browser without the Battery API)
the battery falls back to a believable static value and never crashes.
