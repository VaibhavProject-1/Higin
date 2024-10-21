import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, TouchableOpacity, Alert, Modal, Pressable } from 'react-native';
import { API_BASE_URL } from '../api/api'; // Import the API URL
import { Ionicons } from '@expo/vector-icons'; // For better UI icons
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { FAB } from 'react-native-paper'; // Import the FAB component

const CustomerManagementScreen = ({ navigation }) => {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  let clickTimer = null; // To manage single vs. double click

  // Fetch customers when the screen loads
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers`);
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch customers');
    }
  };

  // Validate fields before creating or updating
  const handleCreateOrUpdateCustomer = async () => {
    if (!name || !email || !phone || !address) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    const customerData = { name, email, phoneNumber: phone, address };
    // Retrieve token from AsyncStorage
    const token = await AsyncStorage.getItem('token');

    try {
      const response = editingCustomerId
        ? await fetch(`${API_BASE_URL}/customers/${editingCustomerId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, // Include token in the Authorization header
             },
            body: JSON.stringify(customerData),
          })
        : await fetch(`${API_BASE_URL}/customers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, // Include token in the Authorization header
             },
            body: JSON.stringify(customerData),
          });

      if (response.ok) {
        Alert.alert('Success', `Customer ${editingCustomerId ? 'updated' : 'created'} successfully`);
        fetchCustomers(); // Refresh customer list
        resetForm();
        setShowEditModal(false); // Close edit modal
      } else {
        Alert.alert('Error', `Failed to ${editingCustomerId ? 'update' : 'create'} customer`);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const handleEditCustomer = (customer) => {
    setName(customer.name);
    setEmail(customer.email);
    setPhone(customer.phoneNumber);
    setAddress(customer.address);
    setEditingCustomerId(customer._id);
    setShowEditModal(true); // Open edit modal
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      const token = await AsyncStorage.getItem('token'); // Retrieve token from AsyncStorage
      const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the Authorization header
        },
      });

      if (response.ok) {
        Alert.alert('Success', 'Customer deleted successfully');
        fetchCustomers(); // Refresh customer list
        setShowModal(false); // Close modal after deletion
      } else {
        Alert.alert('Error', 'Failed to delete customer');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const handleDoubleClick = (customer) => {
    clearTimeout(clickTimer); // Prevent single click action
    setSelectedCustomer(customer);
    navigation.navigate('ProductSelection', { customer }); // Pass selected customer dynamically
  };

  const handleSingleClick = (customer) => {
    clickTimer = setTimeout(() => {
      setSelectedCustomer(customer);
      setShowModal(true); // Show modal with customer details
    }, 250); // Delay to differentiate between single and double click
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setEditingCustomerId(null);
  };

  const renderCustomerItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleSingleClick(item)}
      onDoublePress={() => handleDoubleClick(item)}
      activeOpacity={0.7}
    >
      <View style={styles.customerItem}>
        <Text style={styles.customerName}>{item.name}</Text>
        <Text style={styles.customerEmail}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Customer List */}
      <FlatList
        data={customers}
        keyExtractor={(item) => item._id}
        renderItem={renderCustomerItem}
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

                {/* Edit and Delete buttons */}
                <View style={styles.buttonGroup}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.editButton]}
                    onPress={() => handleEditCustomer(selectedCustomer)}
                  >
                    <Text style={styles.modalButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.deleteButton]}
                    onPress={() => handleDeleteCustomer(selectedCustomer._id)}
                  >
                    <Text style={styles.modalButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
            <Pressable style={styles.closeButton} onPress={handleCloseModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal for editing/creating customer */}
      <Modal visible={showEditModal} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{editingCustomerId ? 'Edit Customer' : 'Create Customer'}</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Name"
              style={styles.input}
            />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              style={styles.input}
              keyboardType="email-address"
            />
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone"
              style={styles.input}
              keyboardType="phone-pad"
            />
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Address"
              style={styles.input}
            />

            <Button
              title={editingCustomerId ? 'Update Customer' : 'Create Customer'}
              onPress={handleCreateOrUpdateCustomer}
            />
            <Pressable style={styles.closeButton} onPress={() => setShowEditModal(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Floating Action Button */}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => {
          resetForm(); // Reset form before creating a new customer
          setShowEditModal(true); // Open modal for creating a new customer
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  customerItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3, // Shadow effect
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  customerEmail: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  customerList: {
    paddingBottom: 20,
  },
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
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#E53935',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  editButton: {
    backgroundColor: '#007bff',
  },
  deleteButton: {
    backgroundColor: '#E53935',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#007bff', // Adjust color if needed
  },
});

export default CustomerManagementScreen;