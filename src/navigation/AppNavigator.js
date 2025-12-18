import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import SignupScreen from '../screens/Signupscreen';
import BottomTabs from './BottomTabs';
import EditProfileScreen from '../screens/EditprofileScreen';
import ChangePasswordScreen from '../screens/ChangepasswordScreen';
import HelpCenterScreen from '../screens/HelpcenterScreen';
import SecuritySettingsScreen from '../screens/SecuritysettingScreen';
import AboutusScreen from '../screens/Aboutusscreen';
import TermsScreen from '../screens/Terms';
import PrivacyScreen from '../screens/Privacy';
import ManageSubscriptionScreen from '../screens/ManageSubscriptionScreen';
import IssuesScreen from '../screens/IssuesScreen';
import TaxRegulation from '../screens/TaxRegulationVideos';
import LearningHubScreen from '../screens/LearningHubScreen';
import { NewAppScreen } from '@react-native/new-app-screen';
import NewsScreen from '../screens/NewsScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import DetailsScreen from '../screens/VideodetailScreen';
import TaxDetailsScreen from '../screens/TaxLawdetailScreen';
import ArticleDetailsScreen from '../screens/ArticleDetailScreen';
import NewDetailsScreen from '../screens/NewsDetail';
import QuickActionsScreen from '../screens/QuickActionScreens';
import SearchResultScreen from '../screens/SearchResultScreen';
import RatingListScreen from '../screens/RattingListScreen';
import CommentScreen from '../screens/CommentScreen';
import SubscriptionScreen from '../screens/SubcribtionList';


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="MainTabs" component={BottomTabs} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <Stack.Screen
        name="SecuritySettings"
        component={SecuritySettingsScreen}
      />
      <Stack.Screen name="AboutusScreen" component={AboutusScreen} />

      <Stack.Screen name="Terms" component={TermsScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
      <Stack.Screen
        name="ManageSubscription"
        component={ManageSubscriptionScreen}
      />

      <Stack.Screen name="IssuesScreen" component={IssuesScreen} />
      <Stack.Screen name="TaxRegulation" component={TaxRegulation} />
      <Stack.Screen name="LearningHubScreen" component={LearningHubScreen} />
      <Stack.Screen name="NewsScreen" component={NewsScreen} />
      <Stack.Screen name="CategoriesScreen" component={CategoriesScreen} />

      <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
      <Stack.Screen name="TaxDetailsScreen" component={TaxDetailsScreen} />
            <Stack.Screen name="ArticleDetailsScreen" component={ArticleDetailsScreen} />
            <Stack.Screen name="NewDetailsScreen" component={NewDetailsScreen} />
                        <Stack.Screen name="QuickActionsScreen" component={QuickActionsScreen} />
      <Stack.Screen name="SearchResultScreen" component={SearchResultScreen} />
      <Stack.Screen name="RatingListScreen" component={RatingListScreen} />
      <Stack.Screen name="CommentScreen" component={CommentScreen} />
      <Stack.Screen name="SubscriptionScreen" component={SubscriptionScreen} />


    </Stack.Navigator>
  );
}
