import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import { useApp } from '../context/AppContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import MyPlantsScreen from '../screens/MyPlantsScreen';
import AddPlantScreen from '../screens/AddPlantScreen';
import ScanScreen from '../screens/ScanScreen';
import ScanDetailScreen from '../screens/ScanDetailScreen';
import PlantDetailScreen from '../screens/PlantDetailScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Home: '🏠',
  'My Plants': '🪴',
  History: '📋',
  Profile: '👤',
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: focused ? 24 : 20, opacity: focused ? 1 : 0.5 }}>
            {TAB_ICONS[route.name]}
          </Text>
        ),
        tabBarActiveTintColor: '#2d6a4f',
        tabBarInactiveTintColor: '#aaa',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 10,
          paddingBottom: 6,
          height: 62,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        headerStyle: { backgroundColor: '#f0f7ee' },
        headerTitleStyle: { fontWeight: '800', color: '#1b4332', fontSize: 18 },
        headerShadowVisible: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'PlantDoc' }} />
      <Tab.Screen name="My Plants" component={MyPlantsScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#f0f7ee' },
        headerTitleStyle: { fontWeight: '800', color: '#1b4332' },
        headerShadowVisible: false,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen name="Tabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="AddPlant" component={AddPlantScreen} options={{ title: 'Add Plant' }} />
      <Stack.Screen
        name="Scan"
        component={ScanScreen}
        options={({ route }) => ({ title: `Scan ${route.params.plant.name}` })}
      />
      <Stack.Screen
        name="ScanDetail"
        component={ScanDetailScreen}
        options={{ title: 'Scan Details' }}
      />
      <Stack.Screen
        name="PlantDetail"
        component={PlantDetailScreen}
        options={({ route }) => ({ title: route.params.plant.name })}
      />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { isLoggedIn, authLoading } = useApp();

  if (authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f7ee' }}>
        <ActivityIndicator size="large" color="#2d6a4f" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
