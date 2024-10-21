import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './navigation/AuthStack'; // Navigation between Login and SignUp

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <AuthStack />
      </NavigationContainer>
    </PaperProvider>
  );
}