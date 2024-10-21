import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet, Modal, Pressable, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { API_BASE_URL } from '../api/api';
import { MaterialIcons } from '@expo/vector-icons'; // For the FAB icon
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const CustomerListScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false); // State for Add Customer modal visibility
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
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

  // Handle showing the modal on a single click
  const handleSingleClick = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true); // Show the modal with customer details
  };

  // Handle selecting a customer and closing the modal
  const handleSelectCustomer = () => {
    setShowModal(false); // Close the modal
    Alert.alert("Customer Selected", `Selected ${selectedCustomer.name}`); // Display selected customer
  };

  // Handle adding a new customer
  const handleAddCustomer = async () => {
    if (!name || !email || !phone || !address) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const customerData = { name, email, phoneNumber: phone, address };
    // Retrieve token from AsyncStorage
    const token = await AsyncStorage.getItem('token');

    try {
      const response = await fetch(`${API_BASE_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include token in the Authorization header
         },
        body: JSON.stringify(customerData),
      });

      if (response.ok) {
        Alert.alert('Success', 'Customer added successfully');
        fetchCustomers(); // Refresh customer list
        resetForm();
        setShowAddCustomerModal(false); // Close Add Customer modal
      } else {
        Alert.alert('Error', 'Failed to add customer');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  // Reset the form inputs
  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
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
          <TouchableOpacity onPress={() => handleSingleClick(item)}>
            <View style={styles.customerItem}>
              <Text style={styles.customerName}>{item.name}</Text>
              <Text style={styles.customerEmail}>{item.email}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.customerList}
      />

      {/* Modal for customer details */}
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Customer Details</Text>
            {selectedCustomer && (
              <>
                <Text style={styles.modalText}>Name: {selectedCustomer.name}</Text>
                <Text style={styles.modalText}>Email: {selectedCustomer.email}</Text>
                <Text style={styles.modalText}>Phone: {selectedCustomer.phoneNumber}</Text>
                <Text style={styles.modalText}>Address: {selectedCustomer.address}</Text>
              </>
            )}

            {/* Button to select the customer */}
            <Pressable style={styles.selectButton} onPress={handleSelectCustomer}>
              <Text style={styles.selectButtonText}>Select Customer</Text>
            </Pressable>

            {/* Button to close the modal */}
            <Pressable style={styles.closeButton} onPress={() => setShowModal(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal for adding a customer */}
      <Modal visible={showAddCustomerModal} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Customer</Text>

            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={address}
              onChangeText={setAddress}
            />

            <Pressable style={styles.addButton} onPress={handleAddCustomer}>
              <Text style={styles.addButtonText}>Add Customer</Text>
            </Pressable>

            <Pressable style={styles.closeButton} onPress={() => setShowAddCustomerModal(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* FAB to open Add Customer modal */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowAddCustomerModal(true)}>
        <MaterialIcons name="person-add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F5F5' },
  searchInput: { marginBottom: 20, padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, backgroundColor: '#fff' },
  customerList: { paddingBottom: 20 },
  customerItem: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 10, elevation: 3 }, // Shadow effect for cards
  customerName: { fontSize: 16, fontWeight: '600', color: '#333' },
  customerEmail: { fontSize: 14, color: '#888', marginTop: 5 },

  // Modal Styles
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 15,
  },
  selectButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#E53935',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // FAB Styles
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#6200EE',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Shadow effect for FAB
  },
});

export default CustomerListScreen;