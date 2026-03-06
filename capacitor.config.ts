import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourstore.io',
  appName: 'yourstore',
  webDir: 'dist',
  bundledWebRuntime: false,
  "plugins": {
    "PushNotifications": {
      "presentationOptions": ["badge", "sound", "alert"]
    },
    "LocalNotifications": {
      "smallIcon": "ic_stat_ys_icon",
      "iconColor": "#ec848b",
      "sound": "beep.wav"
    }
  }
};

export default config;
