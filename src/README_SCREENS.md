This src package contains:
- screens: SplashScreen, OnboardingScreen, WelcomeScreen, LoginScreen, HomeScreen
- components: PrimaryButton, InputField, FeatureSlide
- api: apiClient (axios), authService
- redux store using @reduxjs/toolkit (store.js, userSlice.js)
- styles: theme.js
- assets: images (from provided design files)

To use:
1. Copy this 'src' folder into your React Native project's root.
2. Install dependencies:
   npm install axios @reduxjs/toolkit react-redux @react-navigation/native @react-navigation/native-stack react-native-safe-area-context
3. Wrap App with Provider and NavigationContainer (App.js included).
4. Run project via React Native CLI or Expo (make necessary config).
