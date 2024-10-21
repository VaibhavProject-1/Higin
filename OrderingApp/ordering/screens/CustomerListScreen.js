// import React, { useState, useEffect } from 'react';
// import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
// import { useIsFocused } from '@react-navigation/native'; // To refresh the screen on return
// import { API_BASE_URL } from '../api/api'; // Assuming this contains your API base URL

// const CustomerListScreen = ({ navigation }) => {
//   const [searchText, setSearchText] = useState('');
//   const [customers, setCustomers] = useState([]);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const isFocused = useIsFocused(); // Hook to detect if the screen is focused

//   // Fetch customers from API
//   useEffect(() => {
//     if (isFocused) {
//       fetchCustomers();
//     }
//   }, [isFocused]);

//   const fetchCustomers = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/customers`);
//       const data = await response.json();
//       setCustomers(data);
//     } catch (error) {
//       console.error('Failed to fetch customers:', error);
//     }
//   };

//   const filteredCustomers = customers.filter((customer) =>
//     customer.name.toLowerCase().includes(searchText.toLowerCase())
//   );

//   const handleSelectCustomer = (customer) => {
//     setSelectedCustomer(customer);
//   };

//   const handleProceedToProductSelection = () => {
//     navigation.navigate('ProductSelection', { customer: selectedCustomer });
//   };

//   return (
//     <View style={styles.container}>
//       {/* Search Bar */}
//       <TextInput
//         style={styles.searchInput}
//         placeholder="Search Customers"
//         value={searchText}
//         onChangeText={setSearchText}
//       />

//       {/* Customer List */}
//       <FlatList
//         data={filteredCustomers}
//         keyExtractor={(item) => item._id}
//         renderItem={({ item }) => (
//           <TouchableOpacity onPress={() => handleSelectCustomer(item)}>
//             <View style={styles.customerItem}>
//               <Text style={styles.customerName}>{item.name}</Text>
//               <Text style={styles.customerEmail}>{item.email}</Text>
//             </View>
//           </TouchableOpacity>
//         )}
//         contentContainerStyle={styles.customerList}
//       />

//       {/* Customer Details Card */}
//       {selectedCustomer && (
//         <View style={styles.customerDetailsCard}>
//           <Text style={styles.customerDetailsText}>Name: {selectedCustomer.name}</Text>
//           <Text style={styles.customerDetailsText}>Email: {selectedCustomer.email}</Text>
//           <Text style={styles.customerDetailsText}>Phone: {selectedCustomer.phoneNumber}</Text>
//           <Text style={styles.customerDetailsText}>Address: {selectedCustomer.address}</Text>

//           <TouchableOpacity
//             style={styles.proceedButton}
//             onPress={handleProceedToProductSelection}
//           >
//             <Text style={styles.proceedButtonText}>Proceed to Product Selection</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* Button to navigate to Customer Management Screen */}
//       <TouchableOpacity
//         style={styles.manageButton}
//         onPress={() => navigation.navigate('CustomerManagementScreen')}
//       >
//         <Text style={styles.manageButtonText}>Manage Customers</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#F5F5F5',
//   },
//   searchInput: {
//     marginBottom: 20,
//     padding: 10,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 10,
//     backgroundColor: '#fff',
//     elevation: 2,
//   },
//   customerList: {
//     paddingBottom: 20,
//   },
//   customerItem: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 3,
//   },
//   customerName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//   },
//   customerEmail: {
//     fontSize: 14,
//     color: '#888',
//     marginTop: 5,
//   },
//   customerDetailsCard: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 20,
//     marginTop: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 5,
//   },
//   customerDetailsText: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 10,
//   },
//   proceedButton: {
//     backgroundColor: '#6200EE',
//     paddingVertical: 15,
//     borderRadius: 10,
//     marginTop: 10,
//     alignItems: 'center',
//   },
//   proceedButtonText: {
//     color: '#FFF',
//     fontSize: 16,
//     fontWeight: '700',
//   },
//   manageButton: {
//     backgroundColor: '#007bff',
//     paddingVertical: 15,
//     borderRadius: 10,
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   manageButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '700',
//   },
// });

// export default CustomerListScreen;

import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { API_BASE_URL } from '../api/api'; 

const CustomerListScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const isFocused = useIsFocused(); 

  // Fetch customers when the screen is focused
  useEffect(() => {
    if (isFocused) {
      fetchCustomers();
    }
  }, [isFocused]);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers`);
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Handle selecting a customer and navigating to ProductSelection
  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    navigation.navigate('ProductSelection', { customer }); // Pass selected customer dynamically
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Customers"
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Customer List */}
      <FlatList
        data={filteredCustomers}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectCustomer(item)}>
            <View style={styles.customerItem}>
              <Text style={styles.customerName}>{item.name}</Text>
              <Text style={styles.customerEmail}>{item.email}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.customerList}
      />

      {/* Customer Details (Optional) */}
      {selectedCustomer && (
        <View style={styles.customerDetailsCard}>
          <Text style={styles.customerDetailsText}>Name: {selectedCustomer.name}</Text>
          <Text style={styles.customerDetailsText}>Email: {selectedCustomer.email}</Text>
          <Text style={styles.customerDetailsText}>Phone: {selectedCustomer.phoneNumber}</Text>
          <Text style={styles.customerDetailsText}>Address: {selectedCustomer.address}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F5F5' },
  searchInput: { marginBottom: 20, padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, backgroundColor: '#fff' },
  customerList: { paddingBottom: 20 },
  customerItem: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 10 },
  customerName: { fontSize: 16, fontWeight: '600', color: '#333' },
  customerEmail: { fontSize: 14, color: '#888', marginTop: 5 },
  customerDetailsCard: { backgroundColor: '#fff', borderRadius: 10, padding: 20, marginTop: 20 },
  customerDetailsText: { fontSize: 16, color: '#333', marginBottom: 10 }
});

export default CustomerListScreen;