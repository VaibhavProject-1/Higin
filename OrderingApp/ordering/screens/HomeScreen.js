// import React from 'react';
// import { View, Text, StyleSheet, Button } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

// const HomeScreen = ({ navigation }) => {

//   // Logout function to clear token and navigate to login
//   const handleLogout = async () => {
//     try {
//       // Clear the stored token
//       await AsyncStorage.removeItem('token');
//       // Navigate back to the Login screen
//       navigation.navigate('Login'); // Assuming 'Login' is the name of your Login screen
//     } catch (error) {
//       console.error('Error during logout:', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text>Welcome to the Home Screen!</Text>
//       {/* Logout Button */}
//       <Button title="Logout" onPress={handleLogout} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default HomeScreen;
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; // For background gradient

const HomeScreen = ({ navigation }) => {
  const [role, setRole] = useState('');

  useEffect(() => {
    // Fetch the role from AsyncStorage when component mounts
    const fetchRole = async () => {
      try {
        const storedRole = await AsyncStorage.getItem('role');
        const storedUserId = await AsyncStorage.getItem('userId');
        
        console.log(`Fetched role: ${storedRole}, userId: ${storedUserId}`); // Debugging the role

        // Set the role state regardless of what it is for testing
        setRole(storedRole);
      } catch (error) {
        console.error('Error fetching user role from AsyncStorage:', error);
      }
    };
    fetchRole();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('role'); // Clear role as well
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <LinearGradient colors={['#E3FDFD', '#FFE6FA']} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome!</Text>

        {/* Navigation buttons - Display all for both roles for testing */}
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('CustomerList')}>
          <FontAwesome5 name="list" size={24} color="#333" />
          <Text style={styles.cardText}>Customer List</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('CustomerManagementScreen')}>
          <FontAwesome5 name="users" size={24} color="#333" />
          <Text style={styles.cardText}>Manage Customers</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProductSelection')}>
          <MaterialIcons name="shopping-cart" size={24} color="#333" />
          <Text style={styles.cardText}>Product Selection</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('OrderManagementScreen')}>
          <MaterialIcons name="shop" size={24} color="#333" />
          <Text style={styles.cardText}>Order Management</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProductManagementScreen')}>
          <MaterialIcons name="store" size={24} color="#333" />
          <Text style={styles.cardText}>Manage Products</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('UserManagementScreen')}>
          <MaterialIcons name="store" size={24} color="#333" />
          <Text style={styles.cardText}>Manage Users</Text>
        </TouchableOpacity>

        {/* Logout button */}
        <TouchableOpacity style={[styles.card, styles.logoutCard]} onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color="#E53935" />
          <Text style={styles.cardText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingTop: 60, // More spacing at the top
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15, // Less padding for tighter design
    borderRadius: 15, // More rounded corners
    width: '100%',
    marginBottom: 12, // Slightly smaller margin
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 6, // Slightly higher elevation
  },
  cardText: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: '500', // Slightly lighter weight
    color: '#333', // Change the text color to contrast better
  },
  logoutCard: {
    backgroundColor: '#FFCDD2',
    marginTop: 20, // Logout button still separated
  },
});

export default HomeScreen;