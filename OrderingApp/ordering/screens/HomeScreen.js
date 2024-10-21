// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient'; // For background gradient


// const HomeScreen = ({ navigation }) => {
//   const [role, setRole] = useState('');

//   useEffect(() => {
//     // Fetch the role from AsyncStorage when component mounts
//     const fetchRole = async () => {
//       try {
//         const storedRole = await AsyncStorage.getItem('role');
//         const storedUserId = await AsyncStorage.getItem('userId');
        
//         console.log(`Fetched role: ${storedRole}, userId: ${storedUserId}`); // Debugging the role

//         // Set the role state for conditional rendering
//         setRole(storedRole);
//       } catch (error) {
//         console.error('Error fetching user role from AsyncStorage:', error);
//       }
//     };
//     fetchRole();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await AsyncStorage.removeItem('token');
//       await AsyncStorage.removeItem('userId');
//       await AsyncStorage.removeItem('role'); // Clear role as well
//       navigation.navigate('Login');
//     } catch (error) {
//       console.error('Error during logout:', error);
//     }
//   };

//   return (
//     <LinearGradient colors={['#E3FDFD', '#FFE6FA']} style={styles.background}>
//       <View style={styles.container}>
//         <Text style={styles.welcomeText}>Welcome to Dashboard!</Text>

//         <View style={styles.grid}>
//           <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate('CustomerList')}>
//             <FontAwesome5 name="list" size={24} color="#333" />
//             <Text style={styles.tileText}>Customer List</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate('CustomerManagementScreen')}>
//             <FontAwesome5 name="users" size={24} color="#333" />
//             <Text style={styles.tileText}>Manage Customers</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate('ProductSelection')}>
//             <MaterialIcons name="shopping-cart" size={24} color="#333" />
//             <Text style={styles.tileText}>Product Selection</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate('OrderManagementScreen')}>
//             <MaterialIcons name="shop" size={24} color="#333" />
//             <Text style={styles.tileText}>Order Management</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate('ProductManagementScreen')}>
//             <MaterialIcons name="store" size={24} color="#333" />
//             <Text style={styles.tileText}>Manage Products</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate('UserManagementScreen')}>
//             <MaterialIcons name="store" size={24} color="#333" />
//             <Text style={styles.tileText}>Manage Users</Text>
//           </TouchableOpacity>

//           {/* Conditionally render OrderListForSalesOfficerScreen for sales officers */}
//           {role === 'sales' && (
//             <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate('OrderListForSalesOfficerScreen')}>
//               <MaterialIcons name="assignment" size={24} color="#333" />
//               <Text style={styles.tileText}>My Orders</Text>
//             </TouchableOpacity>
//           )}

//           {/* Logout button as a tile */}
//           <TouchableOpacity style={[styles.tile, styles.logoutTile]} onPress={handleLogout}>
//             <MaterialIcons name="logout" size={24} color="#E53935" />
//             <Text style={styles.tileText}>Logout</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     paddingTop: 60, // More spacing at the top
//   },
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 20,
//   },
//   welcomeText: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 30,
//     textAlign: 'center',
//   },
//   grid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   tile: {
//     width: '45%', // Adjust to fit two columns
//     aspectRatio: 1, // Ensures the tile is square
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FFF',
//     marginBottom: 20, // Add spacing between rows
//     borderRadius: 15, // Rounded corners for tiles
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 6, // Elevation for shadow effect
//   },
//   tileText: {
//     marginTop: 12,
//     fontSize: 16,
//     fontWeight: '500', // Slightly lighter weight
//     color: '#333', // Change the text color to contrast better
//     textAlign: 'center',
//   },
//   logoutTile: {
//     backgroundColor: '#FFCDD2',
//   },
// });

// export default HomeScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
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

        // Set the role state for conditional rendering
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

  // Render the different UI based on the role
  const renderContentBasedOnRole = () => {
    if (role === 'admin') {
      // Admin UI with full access
      return (
        <>
          <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate('CustomerList')}>
            <FontAwesome5 name="list" size={24} color="#333" />
            <Text style={styles.tileText}>Customer List</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate('CustomerManagementScreen')}>
            <FontAwesome5 name="users" size={24} color="#333" />
            <Text style={styles.tileText}>Manage Customers</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate('ProductSelection')}>
            <MaterialIcons name="shopping-cart" size={24} color="#333" />
            <Text style={styles.tileText}>Product Selection</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate('OrderManagementScreen')}>
            <MaterialIcons name="shop" size={24} color="#333" />
            <Text style={styles.tileText}>Order Management</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate('ProductManagementScreen')}>
            <MaterialIcons name="store" size={24} color="#333" />
            <Text style={styles.tileText}>Manage Products</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate('UserManagementScreen')}>
            <MaterialIcons name="people" size={24} color="#333" />
            <Text style={styles.tileText}>Manage Users</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.tile, styles.logoutTile]} onPress={handleLogout}>
            <MaterialIcons name="logout" size={24} color="#E53935" />
            <Text style={styles.tileText}>Logout</Text>
          </TouchableOpacity>
        </>
      );
    } else if (role === 'sales') {
      // Sales UI with limited access
      return (
        <>
          <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate('CustomerList')}>
            <FontAwesome5 name="list" size={24} color="#333" />
            <Text style={styles.tileText}>Customer List</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate('ProductSelection')}>
            <MaterialIcons name="shopping-cart" size={24} color="#333" />
            <Text style={styles.tileText}>Product Selection</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate('OrderListForSalesOfficerScreen')}>
            <MaterialIcons name="assignment" size={24} color="#333" />
            <Text style={styles.tileText}>My Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.tile, styles.logoutTile]} onPress={handleLogout}>
            <MaterialIcons name="logout" size={24} color="#E53935" />
            <Text style={styles.tileText}>Logout</Text>
          </TouchableOpacity>
        </>
      );
    } else if (role === 'user') {
      // Regular user with only a welcome message
      return (
        <Text style={styles.welcomeText}>Welcome to the App!</Text>
      );
    }
  };

  return (
    <LinearGradient colors={['#E3FDFD', '#FFE6FA']} style={styles.background}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {renderContentBasedOnRole()}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingTop: 60, // More spacing at the top
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    flexDirection: 'row', // Row direction for two tiles per row
    flexWrap: 'wrap', // Allow wrapping to the next line
    justifyContent: 'space-between', // Evenly space the tiles
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  tile: {
    width: '48%', // Adjust to fit two tiles per row
    aspectRatio: 1, // Ensures the tile is square
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginBottom: 20, // Add spacing between rows
    borderRadius: 15, // Rounded corners for tiles
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 6, // Elevation for shadow effect
  },
  tileText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500', // Slightly lighter weight
    color: '#333', // Change the text color to contrast better
    textAlign: 'center',
  },
  logoutTile: {
    backgroundColor: '#FFCDD2',
  },
});

export default HomeScreen;