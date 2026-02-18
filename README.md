# Best Travel Plan — Mobile App
### The official iOS & Android app for www.best-travel-plan.cloud

---

## 🔗 What This App Does

This is the **exact mobile version** of the website. It shares:
- ✅ The **same Supabase backend** (accounts, saved trips, data)
- ✅ The **same API** (`best-travel-plan.cloud/api`)
- ✅ **User accounts sync** between web and mobile automatically
- ✅ Same trip cost calculations, same destinations, same saved trips

A user who saves a trip on the website sees it in the app, and vice versa.

---

## 📱 Screens

| Screen | What it does |
|--------|-------------|
| **Plan Trip** (Home) | Enter destination + dates + travellers → get cost breakdown via the same API the website uses |
| **Search** | Search destinations, trending places, search history stored in Supabase |
| **Saved Trips** | All trips saved by the user — synced with the website in real-time |
| **Profile** | Real Supabase auth — sign in / sign up / sign out. Shows stats from saved trips |
| **Login / Signup** | Supabase email+password auth — same accounts as the website |

---

## 🚀 Setup (Step by Step)

### 1. Prerequisites
```bash
node --version   # Must be v18+
npm install -g eas-cli
```

### 2. Clone & Install
```bash
git clone https://github.com/cnaysolutions/best-travel-plan-mobile
cd best-travel-plan-mobile
npm install
```

### 3. No config changes needed!
The Supabase credentials and API URL are already set in `src/config/env.ts`
pointing to your live production backend.

### 4. Test on your phone (Expo Go)
```bash
npm start
```
- Install **Expo Go** on your phone
- Scan the QR code
- The app runs live on your phone!

---

## 🏗️ Build for App Stores

### Step 1 — Create Expo account & link project
```bash
eas login
eas build:configure    # This sets your projectId in app.json
```

### Step 2 — Build Android (APK for testing)
```bash
eas build --platform android --profile preview
```
This gives you a downloadable APK in ~15 minutes. Install it directly on any Android phone.

### Step 3 — Build for Google Play Store
```bash
eas build --platform android --profile production
```
Produces an `.aab` file for Play Store.

### Step 4 — Build for Apple App Store (requires Apple Developer account $99/yr)
```bash
eas build --platform ios --profile production
```

### Step 5 — Submit to stores
```bash
eas submit --platform android   # Uploads to Google Play Console
eas submit --platform ios       # Uploads to App Store Connect
```

---

## 🔄 API Connection

The app calls your website's API in `app/tabs/index.tsx`:

```typescript
const response = await fetch(`${ENV.API_URL}/plan`, {
  method: 'POST',
  body: JSON.stringify({ destination, startDate, endDate, travelers }),
});
```

**If your website's API endpoint path is different**, update `ENV.API_URL` in `src/config/env.ts`.

The app also has a **Supabase Edge Function fallback** in case the REST API is unavailable.

---

## 📦 Dependencies Added vs Original

| Package | Why |
|---------|-----|
| `@react-native-community/datetimepicker` | Native date picker (iOS & Android) |
| `@react-navigation/native` | `useFocusEffect` for refresh on tab switch |

---

## ⚠️ One Thing to Check

The file `app/tabs/index.tsx` calls:
```
POST https://www.best-travel-plan.cloud/api/plan
```
with body: `{ destination, startDate, endDate, travelers }`

**Verify this matches your actual API route and expected parameters.** If the website calls a different endpoint or sends different field names, update `handlePlanTrip()` in `app/tabs/index.tsx` accordingly.

---

## 📁 File Structure

```
best-travel-plan-mobile/
├── app/
│   ├── _layout.tsx          ← Root layout + auth init
│   ├── (tabs)/
│   │   ├── _layout.tsx      ← Tab bar config
│   │   ├── index.tsx        ← Plan Trip screen ⭐
│   │   ├── search.tsx       ← Search screen
│   │   ├── saved.tsx        ← Saved trips (Supabase)
│   │   └── profile.tsx      ← Profile + Auth
│   └── auth/
│       ├── login.tsx        ← Sign in
│       └── signup.tsx       ← Create account
├── src/config/
│   ├── env.ts               ← Supabase keys + API URL
│   └── supabase.ts          ← Supabase client
├── assets/                  ← ⚠️ Add your icons here!
├── app.json                 ← Expo config
├── eas.json                 ← Build config
└── package.json
```

---

## 🎨 Assets You Need to Create

Before building for stores, add these to `assets/`:

| File | Size | Tool |
|------|------|------|
| `icon.png` | 1024×1024 | Canva / Figma |
| `splash.png` | 1284×2778 | Canva / Figma |
| `adaptive-icon.png` | 1024×1024 | Same as icon |
| `favicon.png` | 48×48 | Shrink icon |

Use your website's logo and blue color `#3b82f6`.

---

## 🐛 Troubleshooting

**"Network request failed" when calculating trip cost**
→ Check that `https://www.best-travel-plan.cloud/api/plan` is reachable from mobile (not blocked by CORS for React Native requests).

**Trips not saving**
→ Make sure the `saved_trips` table exists in Supabase with columns: `id, user_id, destination, start_date, end_date, travelers, total_cost, cost_breakdown, created_at`

**Date picker not showing (Android)**
→ Make sure `@react-native-community/datetimepicker` is installed: `npm install @react-native-community/datetimepicker`

---

## 💰 Costs to Publish

| Item | Cost |
|------|------|
| Google Play Console | $25 one-time |
| Apple Developer Program | $99/year |
| Expo EAS (builds) | Free tier: 30 builds/month |
| Supabase | Already paid (same as website) |

---

Good luck with the launch! 🚀
