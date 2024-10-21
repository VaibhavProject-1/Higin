import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { signup } from '../api/api'; // Import the signup function
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const storeToken = async (token) => {
    try {
      await AsyncStorage.setItem('token', token); // Store the token in AsyncStorage
    } catch (e) {
      console.error('Failed to save the token.', e);
    }
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Passwords do not match');
      return;
    }
    
    try {
      const userData = await signup(name, email, password);
      await storeToken(userData.token); // Store the token after a successful signup
      Alert.alert('Signup Successful', `Welcome ${userData.name}`);
      // You can now navigate to the next screen
      navigation.navigate('Home'); // Replace 'Home' with the screen you want to navigate to
    } catch (error) {
      // Check if error is an object and has a message field
      let errorMessage = 'Signup Failed'; // Default message
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message; // Extract the specific error message
      } else if (error.message) {
        errorMessage = error.message; // Extract the message from the error object
      }
      Alert.alert('Signup Failed', errorMessage);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={{ marginBottom: 20 }}>Sign Up</Text>

      <TextInput
        label="Username"
        value={name}
        onChangeText={setName}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
      />

      <Button mode="contained" onPress={handleSignUp} style={styles.button}>
        Sign Up
      </Button>

      <Text style={{ marginTop: 10 }}>
        Already have an account?{' '}
        <Text onPress={() => navigation.navigate('Login')} style={{ color: 'blue' }}>
          Login
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
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
});

export default SignUpScreen;