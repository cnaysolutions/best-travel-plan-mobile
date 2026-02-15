# Pre-Launch Checklist for App Store Submission

## 📋 Before Building

### Code & Configuration
- [ ] Updated `src/config/env.ts` with production Supabase credentials
- [ ] Changed app name in `app.json` if desired
- [ ] Set correct version numbers in `app.json`
- [ ] Verified bundle identifiers are unique:
  - iOS: `com.cnaysolutions.besttravelplan`
  - Android: `com.cnaysolutions.besttravelplan`
- [ ] Tested all screens on both iOS and Android
- [ ] Checked all API calls work correctly
- [ ] Implemented error handling for network failures

### Assets
- [ ] Created app icon (1024x1024 PNG)
- [ ] Created splash screen (1284x2778 PNG)
- [ ] Created adaptive icon for Android (1024x1024 PNG)
- [ ] Created favicon (48x48 PNG)
- [ ] All icons have transparent backgrounds where appropriate
- [ ] Tested icons on different background colors

### Testing
- [ ] Tested on real iOS device
- [ ] Tested on real Android device
- [ ] Tested app performance (no lag/crashes)
- [ ] Tested with poor internet connection
- [ ] Tested offline behavior
- [ ] Verified user authentication flow
- [ ] Tested all navigation flows
- [ ] Checked keyboard behavior on all forms

## 📱 App Store Requirements

### Google Play Store

#### Account Setup
- [ ] Created Google Play Console account ($25)
- [ ] Verified email and payment method
- [ ] Read Google Play policies

#### App Information
- [ ] App name: "Best Travel Plan"
- [ ] Short description (80 chars max)
- [ ] Full description (4000 chars max)
- [ ] Category: Travel & Local
- [ ] Content rating questionnaire completed
- [ ] Target audience selected

#### Graphics
- [ ] App icon (512x512 PNG)
- [ ] Feature graphic (1024x500)
- [ ] Phone screenshots (min 2, max 8):
  - [ ] 16:9 or 9:16 aspect ratio
  - [ ] Min dimension: 320px
  - [ ] Max dimension: 3840px
- [ ] 7-inch tablet screenshots (optional but recommended)
- [ ] 10-inch tablet screenshots (optional but recommended)

#### Store Listing
- [ ] Privacy policy URL added
- [ ] Website URL added
- [ ] Support email set up
- [ ] Terms of service URL added

#### APK/AAB
- [ ] Built production AAB using `eas build --platform android --profile production`
- [ ] Downloaded and tested APK build
- [ ] Signed with upload key

### Apple App Store

#### Account Setup
- [ ] Enrolled in Apple Developer Program ($99/year)
- [ ] Created App Store Connect account
- [ ] Agreed to all agreements
- [ ] Set up tax and banking information

#### App Information
- [ ] Created app record in App Store Connect
- [ ] App name: "Best Travel Plan"
- [ ] Subtitle (30 chars max)
- [ ] Primary category: Travel
- [ ] Secondary category (optional)
- [ ] Privacy policy URL
- [ ] Support URL

#### Graphics
- [ ] App icon (1024x1024 PNG)
- [ ] iPhone screenshots:
  - [ ] 6.7" (iPhone 14 Pro Max) - REQUIRED
  - [ ] 6.5" (iPhone 11 Pro Max) - REQUIRED
  - [ ] 5.5" (iPhone 8 Plus) - Optional
- [ ] iPad screenshots (if supporting iPad):
  - [ ] 12.9" (iPad Pro 12.9")
  - [ ] 11" (iPad Pro 11")

#### App Review Information
- [ ] Contact information for app review
- [ ] Demo account credentials (if login required)
- [ ] Notes for reviewer
- [ ] App Review attachments (if needed)

#### Build
- [ ] Built production IPA using `eas build --platform ios --profile production`
- [ ] Uploaded build to App Store Connect
- [ ] Selected build for submission

## 🌐 Website Preparation

### Required Pages
- [ ] Privacy Policy page created (`/privacy`)
- [ ] Terms of Service page created (`/terms`)
- [ ] App Support page created (`/app-support`)
- [ ] FAQ section updated with app-specific questions
- [ ] Contact/Support email is responsive

### Marketing
- [ ] Homepage has app download section
- [ ] Downloaded official store badges:
  - [ ] Apple App Store badge
  - [ ] Google Play Store badge
- [ ] Added meta tags for app banners
- [ ] Created social media graphics
- [ ] Prepared launch announcement

## 🎯 Marketing Assets

### Screenshots to Take
- [ ] Welcome/Home screen
- [ ] Trip planning in action
- [ ] Search/Browse destinations
- [ ] Trip cost breakdown
- [ ] Saved trips view
- [ ] User profile
- [ ] Unique features showcase
- [ ] Success/Results screen

### App Store Copy
- [ ] Compelling app description written
- [ ] Keywords researched and selected
- [ ] "What's New" section prepared for updates
- [ ] Promotional text prepared (170 chars for iOS)

## 🔐 Security & Compliance

### Privacy
- [ ] GDPR compliance reviewed (if targeting EU)
- [ ] COPPA compliance reviewed (if allowing users under 13)
- [ ] Data collection documented
- [ ] Third-party SDKs documented
- [ ] Data deletion process documented

### Legal
- [ ] Terms of Service reviewed by legal (if possible)
- [ ] Privacy Policy reviewed by legal (if possible)
- [ ] Intellectual property cleared (no copyright issues)
- [ ] Trademark search completed for app name

## 📊 Analytics & Monitoring

### Setup
- [ ] Analytics tool configured (Firebase, Mixpanel, etc.)
- [ ] Crash reporting enabled
- [ ] Error tracking configured
- [ ] Performance monitoring enabled

### Metrics to Track
- [ ] Daily active users (DAU)
- [ ] Monthly active users (MAU)
- [ ] Session length
- [ ] Crash-free rate
- [ ] App store ratings
- [ ] User retention

## 🚀 Launch Day Checklist

### Final Checks
- [ ] App is live in stores
- [ ] Store links work correctly
- [ ] Website download buttons point to correct stores
- [ ] Social media posts scheduled
- [ ] Email announcement ready
- [ ] Customer support team briefed
- [ ] Monitoring dashboards ready

### Post-Launch
- [ ] Monitor crash reports
- [ ] Respond to user reviews (first 24 hours critical)
- [ ] Track download numbers
- [ ] Monitor server load
- [ ] Check for common user issues
- [ ] Prepare for first update

## 📈 Week 1 Post-Launch

- [ ] Reviewed all user feedback
- [ ] Responded to critical reviews
- [ ] Fixed any critical bugs
- [ ] Analyzed usage patterns
- [ ] Planned first update based on feedback
- [ ] Collected feature requests
- [ ] Updated app description based on feedback

## ⚠️ Common Rejection Reasons

### iOS App Store
- [ ] Crashes on launch - TESTED ✓
- [ ] Broken links - VERIFIED ✓
- [ ] Privacy policy missing/inadequate - ADDED ✓
- [ ] Incomplete app information - FILLED ✓
- [ ] Poor performance - OPTIMIZED ✓
- [ ] Misleading screenshots - AUTHENTIC ✓

### Google Play Store
- [ ] APK issues - TESTED ✓
- [ ] Content policy violations - REVIEWED ✓
- [ ] Broken functionality - TESTED ✓
- [ ] Privacy policy issues - VERIFIED ✓
- [ ] Metadata quality - POLISHED ✓

---

## 📞 Emergency Contacts

**Expo Support**: https://expo.dev/support
**Apple Developer Support**: https://developer.apple.com/support/
**Google Play Support**: https://support.google.com/googleplay/android-developer/

---

**Once everything is checked off, you're ready to submit! 🎉**

Remember:
- First submission may take longer for review
- Be patient - reviews can take 1-7 days
- Respond promptly to any reviewer questions
- Don't panic if rejected - just fix and resubmit

Good luck with your launch!
