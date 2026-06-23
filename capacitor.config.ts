import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'cz.shinigami.cizimobil',
  appName: 'VERA',
  webDir: 'dist',
  android: {
    // Keep the WebView opaque and dark so the lock screen reveal isn't spoiled
    // by a white flash on launch.
    backgroundColor: '#000000',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      backgroundColor: '#000000',
    },
  },
}

export default config
