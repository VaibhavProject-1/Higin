// import React, { useState } from 'react';
// import { View, StyleSheet, Alert } from 'react-native';
// import { TextInput, Button, Text } from 'react-native-paper';
// import { login } from '../api/api'; // Import the login function
// import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

// const LoginScreen = ({ navigation }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const storeToken = async (token) => {
//     try {
//       await AsyncStorage.setItem('token', token); // Store the token in AsyncStorage
//     } catch (e) {
//       console.error('Failed to save the token.', e);
//     }
//   };

//   const handleLogin = async () => {
//     try {
//       const userData = await login(email, password);
//       await storeToken(userData.token); // Store the token after a successful login
//       Alert.alert('Login Successful', `Welcome back ${userData.name}`);
//       // You can now navigate to the next screen
//       navigation.navigate('Home'); // Replace 'Home' with the screen you want to navigate to
//     } catch (error) {
//       Alert.alert('Login Failed', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text variant="titleLarge" style={{ marginBottom: 20 }}>Login</Text>

//       <TextInput
//         label="Email"
//         value={email}
//         onChangeText={setEmail}
//         style={styles.input}
//         mode="outlined"
//       />

//       <TextInput
//         label="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//         style={styles.input}
//         mode="outlined"
//       />

//       <Button mode="contained" onPress={handleLogin} style={styles.button}>
//         Login
//       </Button>

//       <Text style={{ marginTop: 10 }}>
//         Don’t have an account?{' '}
//         <Text onPress={() => navigation.navigate('SignUp')} style={{ color: 'blue' }}>
//           Sign Up
//         </Text>
//       </Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   input: {
//     marginBottom: 20,
//   },
//   button: {
//     marginTop: 10,
//   },
// });

// export default LoginScreen;

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import * as Location from 'expo-location'; // Import Expo's Location API
import io from 'socket.io-client'; // Import Socket.io client
import { API_BASED_URL, login, setAuthToken } from '../api/api'; // Import API constants and functions
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null); // Socket state for emitting events
  const [locationIntervalId, setLocationIntervalId] = useState(null); // To track the location update interval

  // Function to store token, userId, and role in AsyncStorage
  const storeUserData = async (token, userId, role) => {
    try {
      await AsyncStorage.setItem('token', token); // Store token
      await AsyncStorage.setItem('userId', userId); // Store userId
      await AsyncStorage.setItem('role', role); // Store role (sales or admin)
      setAuthToken(token); // Set token in Axios for subsequent requests
    } catch (e) {
      console.error('Failed to save user data in AsyncStorage.', e);
    }
  };

  // Handle login process
  const handleLogin = async () => {
    setLoading(true);

    try {
      const userData = await login(email, password);
      if (userData && userData.token && userData._id && userData.role) {
        await storeUserData(userData.token, userData._id, userData.role);

        // Initialize Socket.io connection
        const socketConnection = io(API_BASED_URL);
        setSocket(socketConnection);

        // Emit location once logged in and start location updates
        startLocationUpdates(userData._id, socketConnection);
        Alert.alert('Login Successful', `Welcome back ${userData.name}`);

        navigation.navigate('Home');
      } else {
        Alert.alert('Login Failed', 'Invalid user data received from server.');
      }
    } catch (error) {
      const errorMessage = error.message || 'Login error';
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Request location permission and start updating location at intervals
  const startLocationUpdates = async (userId, socket) => {
    console.log('Requesting location permissions...');
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      console.log('Location permission granted');

      // Emit location immediately once
      emitLocation(userId, socket);

      // Start emitting location every 5 seconds
      const intervalId = setInterval(() => {
        emitLocation(userId, socket);
      }, 5000); // Emit location every 5000 milliseconds (5 seconds)
      setLocationIntervalId(intervalId);
    } else {
      console.error('Location permission denied');
    }
  };

  // Emit location to the backend
  const emitLocation = async (userId, socket) => {
    const location = await Location.getCurrentPositionAsync({});
    console.log('Emitting location:', {
      userId,
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    });

    // Emit location to backend via socket
    socket.emit('locationUpdate', {
      userId,
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    });
  };

  // Clean up interval on component unmount
  useEffect(() => {
    return () => {
      if (locationIntervalId) {
        clearInterval(locationIntervalId);
      }
    };
  }, [locationIntervalId]);

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>Login</Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        mode="outlined"
        autoCapitalize="none"
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
      />

      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button}
        loading={loading}
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </Button>

      <Text style={styles.signupText}>
        Don’t have an account?{' '}
        <Text onPress={() => navigation.navigate('SignUp')} style={styles.signupLink}>
          Sign Up
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 20,
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
  signupText: {
    marginTop: 10,
    textAlign: 'center',
  },
  signupLink: {
    color: 'blue',
  },
});

export default LoginScreen;