# SHA-1 Key Report for Android Project

## 📋 Summary

### ✅ Debug Build - SHA-1 Key Found

**Status:** ✅ SHA-1 key successfully extracted from debug keystore

**SHA-1 Fingerprint:**
```
5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
```

**Keystore Details:**
- **Location:** `android/app/debug.keystore`
- **Type:** Debug Keystore
- **Alias:** `androiddebugkey`
- **Store Password:** `android`
- **Key Password:** `android`
- **Created:** January 1, 2014
- **Valid Until:** May 1, 2052

**Additional Information:**
- **SHA-256:** `FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C`
- **Certificate Owner:** CN=Android Debug, OU=Android, O=Unknown, L=Unknown, ST=Unknown, C=US

---

### ⚠️ Release Build - No Release Keystore Found

**Status:** ⚠️ Release build is currently using debug keystore (NOT RECOMMENDED FOR PRODUCTION)

**Current Configuration:**
- Release build type is configured to use `signingConfigs.debug`
- No dedicated release keystore exists
- **This is a security risk for production apps**

**Recommendation:** Generate a production release keystore before publishing to Google Play Store.

---

## 🔧 Commands Used to Extract SHA-1

### Debug Keystore SHA-1 Extraction:
```bash
cd android/app
keytool -list -v -keystore debug.keystore -alias androiddebugkey -storepass android -keypass android
```

**Output:** Successfully extracted SHA-1 fingerprint from debug keystore.

---

## 📝 How to Generate Release Keystore (If Needed)

If you need to generate a release keystore for production builds, use the following command:

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore release.keystore -alias mimpot-release -keyalg RSA -keysize 2048 -validity 10000 -storepass YOUR_STORE_PASSWORD -keypass YOUR_KEY_PASSWORD
```

**Important Notes:**
- Replace `YOUR_STORE_PASSWORD` and `YOUR_KEY_PASSWORD` with secure passwords
- Keep the keystore file and passwords secure - you'll need them for all future app updates
- Store passwords in a secure location (password manager)
- Update `android/app/build.gradle` to use the release keystore

---

## 🔐 Updating build.gradle for Release Keystore

After generating a release keystore, update `android/app/build.gradle`:

```gradle
signingConfigs {
    debug {
        storeFile file('debug.keystore')
        storePassword 'android'
        keyAlias 'androiddebugkey'
        keyPassword 'android'
    }
    release {
        storeFile file('release.keystore')
        storePassword System.getenv("KEYSTORE_PASSWORD") // Use environment variable
        keyAlias 'mimpot-release'
        keyPassword System.getenv("KEY_PASSWORD") // Use environment variable
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release // Use release config
        minifyEnabled enableProguardInReleaseBuilds
        proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
    }
}
```

---

## 📱 Using SHA-1 for Google Services

### For Firebase / Google Sign-In:
1. Copy the SHA-1 fingerprint: `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`
2. Add it to Firebase Console → Project Settings → Your Android App → SHA certificate fingerprints
3. Download updated `google-services.json` and replace the existing file

### For Google Maps API:
1. Add SHA-1 to Google Cloud Console → APIs & Services → Credentials
2. Add to your API key restrictions

---

## ✅ Verification

- ✅ Debug keystore exists: `android/app/debug.keystore`
- ✅ Debug SHA-1 extracted successfully
- ⚠️ Release keystore: Not found (using debug keystore)
- ⚠️ **Action Required:** Generate release keystore before production release

---

**Generated:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**Project:** mimpot
**Package Name:** com.mimpot





