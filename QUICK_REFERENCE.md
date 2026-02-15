# Quick Reference Guide

## 🚀 Common Commands

### Development
```bash
# Start development server
npm start

# Start on iOS simulator (Mac only)
npm run ios

# Start on Android emulator
npm run android

# Start web version
npm run web

# Clear cache and restart
npm start -- --clear
```

### Building
```bash
# Build for Android (APK for testing)
eas build --platform android --profile preview

# Build for Android (AAB for Play Store)
eas build --platform android --profile production

# Build for iOS (IPA for App Store)
eas build --platform ios --profile production

# Build for both platforms
eas build --platform all --profile production
```

### Submitting to Stores
```bash
# Submit to Google Play Store
eas submit --platform android

# Submit to Apple App Store
eas submit --platform ios

# Submit to both stores
eas submit --platform all
```

### Updates
```bash
# Push over-the-air update (no app store submission needed)
eas update --branch production --message "Bug fixes"

# View update status
eas update:list

# Rollback to previous version
eas update:republish --update-id PREVIOUS_UPDATE_ID
```

### Project Management
```bash
# Login to Expo account
eas login

# Check project configuration
eas build:configure

# View build status
eas build:list

# View project info
eas project:info
```

---

## 📁 Important Files

### Configuration Files
| File | Purpose | When to Edit |
|------|---------|--------------|
| `app.json` | App configuration | Change app name, version, bundle IDs |
| `package.json` | Dependencies | Add new packages |
| `eas.json` | Build configuration | Customize build profiles |
| `src/config/env.ts` | Environment variables | Set API keys, URLs |

### App Files
| File | Purpose | When to Edit |
|------|---------|--------------|
| `app/_layout.tsx` | Root navigation | Change navigation structure |
| `app/(tabs)/_layout.tsx` | Tab navigation | Add/remove tabs |
| `app/(tabs)/index.tsx` | Home screen | Modify main screen |
| `src/config/supabase.ts` | Database client | Change backend config |

### Assets
| File | Purpose | Size |
|------|---------|------|
| `assets/icon.png` | App icon | 1024x1024 |
| `assets/splash.png` | Splash screen | 1284x2778 |
| `assets/adaptive-icon.png` | Android icon | 1024x1024 |
| `assets/favicon.png` | Web icon | 48x48 |

---

## 🔧 Common Tasks

### Change App Name
1. Edit `app.json`:
   ```json
   {
     "expo": {
       "name": "Your New App Name"
     }
   }
   ```
2. Rebuild app

### Change App Version
1. Edit `app.json`:
   ```json
   {
     "version": "1.0.1",
     "ios": {
       "buildNumber": "2"
     },
     "android": {
       "versionCode": 2
     }
   }
   ```
2. Build new version

### Add New Screen
1. Create file: `app/new-screen.tsx`
2. Add basic component:
   ```tsx
   import { View, Text } from 'react-native';
   
   export default function NewScreen() {
     return (
       <View>
         <Text>New Screen</Text>
       </View>
     );
   }
   ```
3. Link from other screens using Expo Router

### Add New Tab
1. Edit `app/(tabs)/_layout.tsx`
2. Add new `<Tabs.Screen>`:
   ```tsx
   <Tabs.Screen
     name="new-tab"
     options={{
       title: 'New Tab',
       tabBarIcon: ({ color, size }) => <Icon color={color} size={size} />,
     }}
   />
   ```
3. Create `app/(tabs)/new-tab.tsx`

### Connect to Supabase
```tsx
import { supabase } from '@/config/supabase';

// Fetch data
const { data, error } = await supabase
  .from('table_name')
  .select('*');

// Insert data
const { data, error } = await supabase
  .from('table_name')
  .insert({ column: 'value' });
```

### Add Loading State
```tsx
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const { data } = await supabase.from('trips').select('*');
    // Handle data
  } finally {
    setLoading(false);
  }
};
```

---

## 🐛 Troubleshooting

### App Won't Start
```bash
# Clear cache
npm start -- --clear

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Build Fails
```bash
# Check EAS status
eas build:list

# View detailed logs
eas build:view BUILD_ID

# Re-run configuration
eas build:configure
```

### Supabase Not Working
1. Check `src/config/env.ts` has correct URL and key
2. Verify Supabase project is active
3. Check network permissions in `app.json`

### Icons Not Showing
```bash
# Clear cache
npm start -- --clear

# Verify files exist:
ls assets/
```

### Hot Reload Not Working
```bash
# Restart with cache clear
npm start -- --clear

# Or restart your device
```

---

## 📊 Version Numbers Guide

### iOS
- **CFBundleShortVersionString** (`version`): User-facing version (e.g., "1.0.0")
- **CFBundleVersion** (`buildNumber`): Build number (e.g., "1", "2", "3")

### Android
- **versionName** (`version`): User-facing version (e.g., "1.0.0")
- **versionCode**: Integer build number (e.g., 1, 2, 3)

### Incrementing Rules
When submitting updates:
1. **Bug fixes**: Increment patch (1.0.0 → 1.0.1)
2. **New features**: Increment minor (1.0.0 → 1.1.0)
3. **Major changes**: Increment major (1.0.0 → 2.0.0)
4. **Always increment** build numbers (iOS) and version codes (Android)

---

## 🔐 Environment Variables

### During Development
Edit `src/config/env.ts` directly

### For Production
Create `.env` file:
```
SUPABASE_URL=your-url
SUPABASE_ANON_KEY=your-key
```

Then use in `env.ts`:
```typescript
import Constants from 'expo-constants';

export const ENV = {
  SUPABASE_URL: Constants.expoConfig?.extra?.supabaseUrl || 'fallback-url',
  SUPABASE_ANON_KEY: Constants.expoConfig?.extra?.supabaseKey || 'fallback-key',
};
```

---

## 📱 Testing Checklist

Before each release:
- [ ] Test on iOS device
- [ ] Test on Android device
- [ ] Test all navigation flows
- [ ] Test with poor network
- [ ] Test offline mode
- [ ] Test authentication
- [ ] Check for console errors
- [ ] Verify all images load
- [ ] Test on different screen sizes
- [ ] Clear app data and test fresh install

---

## 🎯 Quick Links

- **Expo Dashboard**: https://expo.dev/accounts/[username]/projects/[project-name]
- **Google Play Console**: https://play.google.com/console
- **App Store Connect**: https://appstoreconnect.apple.com
- **Supabase Dashboard**: https://app.supabase.com
- **Expo Docs**: https://docs.expo.dev

---

## 🆘 Getting Help

1. **Check error messages** - They're usually helpful!
2. **Search Expo forums** - Someone likely had same issue
3. **Check documentation** - Expo docs are excellent
4. **Ask in Discord** - Expo community is helpful
5. **Stack Overflow** - Use tags `expo` and `react-native`

---

## 💡 Pro Tips

1. **Use EAS Update** for quick fixes without app store review
2. **Keep versions consistent** across platforms
3. **Test on real devices** before submitting to stores
4. **Respond to reviews** quickly (especially negative ones)
5. **Monitor crash reports** in first 24 hours after release
6. **Keep documentation updated** when you make changes
7. **Commit often** to Git
8. **Tag releases** in Git for easy rollback

---

**Bookmark this page for quick reference! 📌**
