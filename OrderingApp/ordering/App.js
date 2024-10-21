import React, { useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './navigation/AuthStack'; // Navigation between Login and SignUp
import * as Location from 'expo-location';
import * as Network from 'expo-network';
import { Alert, BackHandler } from 'react-native';

export default function App() {

  // Check for permissions when the app starts
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        // Request location permissions
        const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
        if (locationStatus !== 'granted') {
          Alert.alert(
            'Location Permission Required',
            'This app requires location access to track orders and provide better service.',
            [{ text: 'OK', onPress: () => BackHandler.exitApp() }]
          );
          return;
        }

        // Check for network/internet connection
        const networkState = await Network.getNetworkStateAsync();
        if (!networkState.isConnected) {
          Alert.alert(
            'Internet Connection Required',
            'This app requires an active internet connection.',
            [{ text: 'OK', onPress: () => BackHandler.exitApp() }]
          );
          return;
        }

        // All permissions granted, continue with the app logic
      } catch (error) {
        console.error('Error checking permissions:', error);
        BackHandler.exitApp();
      }
    };

    // Call the permission check function when the component mounts
    checkPermissions();
  }, []);

  return (
    <PaperProvider>
      <NavigationContainer>
        <AuthStack />
      </NavigationContainer>
    </PaperProvider>
  );
}