import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import TransparencyScreen from './src/screens/TransparencyScreen';
import SafetyScoreScreen from './src/screens/SafetyScoreScreen';
import ResourcesScreen from './src/screens/ResourcesScreen';
import SetupScreen from './src/screens/SetupScreen';

// Store
import { useAuthStore } from './src/store/auth';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Transparency') {
            iconName = focused ? 'eye' : 'eye-outline';
          } else if (route.name === 'Safety') {
            iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline';
          } else if (route.name === 'Help') {
            iconName = focused ? 'heart' : 'heart-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'SafeGuard' }}
      />
      <Tab.Screen 
        name="Transparency" 
        component={TransparencyScreen}
        options={{ title: 'What\'s Monitored' }}
      />
      <Tab.Screen 
        name="Safety" 
        component={SafetyScoreScreen}
        options={{ title: 'My Safety Score' }}
      />
      <Tab.Screen 
        name="Help" 
        component={ResourcesScreen}
        options={{ title: 'Help & Resources' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const { isSetupComplete } = useAuthStore();

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isSetupComplete ? (
            <Stack.Screen name="Setup" component={SetupScreen} />
          ) : (
            <Stack.Screen name="Main" component={MainTabs} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
