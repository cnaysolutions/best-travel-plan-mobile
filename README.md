# Best Travel Plan Mobile App

Transform your Best Travel Plan website into native iOS and Android apps!

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Scan QR code with Expo Go app on your phone
```

## 📱 Download Expo Go

- **iOS**: [App Store](https://apps.apple.com/app/expo-go/id982107779)
- **Android**: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

## 🔧 Setup

1. **Configure Supabase**
   
   Edit `src/config/env.ts`:
   ```typescript
   export const ENV = {
     SUPABASE_URL: 'your-project-url',
     SUPABASE_ANON_KEY: 'your-anon-key',
     API_URL: 'https://www.best-travel-plan.cloud/api',
   };
   ```

2. **Run on your device**
   ```bash
   npm start
   ```
   Then scan the QR code with Expo Go app

## 🚀 Building for Production

### Android
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build APK
eas build --platform android --profile production
```

### iOS
```bash
eas build --platform ios --profile production
```

## 📤 Publishing to Stores

```bash
# Submit to Google Play
eas submit --platform android

# Submit to App Store
eas submit --platform ios
```

## 📚 Full Documentation

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for:
- Complete setup instructions
- Store submission process
- Troubleshooting guide
- Cost breakdown
- Customization tips

## 🛠️ Tech Stack

- **React Native** + **Expo** - Cross-platform mobile framework
- **TypeScript** - Type safety
- **Expo Router** - File-based routing
- **Supabase** - Backend (same as your website)
- **Lucide Icons** - Beautiful icons

## 📁 Project Structure

```
BestTravelPlan/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # Home/Plan Trip
│   │   ├── search.tsx     # Search screen
│   │   ├── saved.tsx      # Saved trips
│   │   └── profile.tsx    # User profile
│   └── _layout.tsx        # Root layout
├── src/
│   └── config/
│       ├── env.ts         # Environment config
│       └── supabase.ts    # Supabase client
├── assets/                # App icons & images
├── app.json              # App configuration
└── package.json          # Dependencies
```

## 🎨 Customization

### Change Colors
Find and replace colors in screen files:
- Primary: `#3b82f6` → your brand color
- Secondary: `#1d4ed8` → your accent color

### Add Features
Your app uses the same Supabase backend as your website, so you can:
- Share user accounts
- Sync data automatically
- Use same API endpoints

## 💡 Key Features

- ✅ Cross-platform (iOS & Android from one codebase)
- ✅ Native performance
- ✅ Offline support
- ✅ Push notifications ready
- ✅ Over-the-air updates
- ✅ Shares backend with website

## 🆘 Need Help?

1. Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
2. Visit [Expo Documentation](https://docs.expo.dev)
3. Ask on [Expo Forums](https://forums.expo.dev)

## 📝 License

Same as your website project

---

**Ready to launch your app? Follow the [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)!**
